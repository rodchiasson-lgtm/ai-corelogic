const TRADINGVIEW_SCANNER_URL = "https://scanner.tradingview.com/global/scan";
const RESULT_COLUMNS = [
  "name",
  "description",
  "close",
  "change",
  "currency",
  "exchange",
  "market_cap_basic",
  "price_earnings_ttm",
  "earnings_per_share_diluted_ttm",
  "dividends_yield_current",
  "total_revenue",
  "total_revenue_yoy_growth_ttm",
  "RSI",
  "MACD.macd",
  "MACD.signal",
  "SMA20",
  "SMA50",
  "Volatility.D",
] as const;

export type LiveStockResult = {
  symbolKey: string;
  ticker: string;
  name: string;
  exchange: string;
  price: number | null;
  changePercent: number | null;
  currency: string;
  marketCap: number | null;
  peRatio: number | null;
  eps: number | null;
  dividendYield: number | null;
  revenue: number | null;
  revenueGrowth: number | null;
  rsi: number | null;
  macd: number | null;
  macdSignal: number | null;
  sma20: number | null;
  sma50: number | null;
  dailyVolatility: number | null;
};

type ScannerValue = string | number | null;

type ScannerRow = {
  s: string;
  d: ScannerValue[];
};

type ScannerResponse = {
  totalCount?: number;
  data?: ScannerRow[] | null;
  error?: string;
};

function cleanCompanyName(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
}

function numberOrNull(value: ScannerValue) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function textOrFallback(value: ScannerValue, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function mapScannerRow(row: ScannerRow): LiveStockResult {
  const [
    tickerValue,
    descriptionValue,
    priceValue,
    changeValue,
    currencyValue,
    exchangeValue,
    marketCapValue,
    peRatioValue,
    epsValue,
    dividendYieldValue,
    revenueValue,
    revenueGrowthValue,
    rsiValue,
    macdValue,
    macdSignalValue,
    sma20Value,
    sma50Value,
    volatilityValue,
  ] = row.d;
  const fallbackTicker = row.s.split(":").at(-1) || row.s;
  const ticker = textOrFallback(tickerValue, fallbackTicker);
  const exchange = textOrFallback(exchangeValue, row.s.split(":")[0] || "GLOBAL");

  return {
    symbolKey: row.s,
    ticker,
    name: cleanCompanyName(textOrFallback(descriptionValue, ticker)),
    exchange,
    price: numberOrNull(priceValue),
    changePercent: numberOrNull(changeValue),
    currency: textOrFallback(currencyValue, "USD"),
    marketCap: numberOrNull(marketCapValue),
    peRatio: numberOrNull(peRatioValue),
    eps: numberOrNull(epsValue),
    dividendYield: numberOrNull(dividendYieldValue),
    revenue: numberOrNull(revenueValue),
    revenueGrowth: numberOrNull(revenueGrowthValue),
    rsi: numberOrNull(rsiValue),
    macd: numberOrNull(macdValue),
    macdSignal: numberOrNull(macdSignalValue),
    sma20: numberOrNull(sma20Value),
    sma50: numberOrNull(sma50Value),
    dailyVolatility: numberOrNull(volatilityValue),
  };
}

async function runScanner(body: Record<string, unknown>, signal?: AbortSignal) {
  // A string body keeps this a CORS-simple request; the public scanner accepts JSON
  // without requiring a custom Content-Type preflight.
  const response = await fetch(TRADINGVIEW_SCANNER_URL, {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Market data request failed (${response.status})`);
  }

  const payload = (await response.json()) as ScannerResponse;
  if (payload.error) {
    throw new Error(payload.error);
  }
  return payload.data ?? [];
}

function searchRequest(field: "name" | "description", query: string) {
  return {
    filter: [{ left: field, operation: "match", right: query }],
    options: { lang: "en" },
    symbols: { query: { types: ["stock"] }, tickers: [] },
    columns: RESULT_COLUMNS,
    sort: { sortBy: "market_cap_basic", sortOrder: "desc" },
    range: [0, 9],
  };
}

export async function searchLiveStocks(query: string, signal?: AbortSignal): Promise<LiveStockResult[]> {
  const normalized = query.trim().slice(0, 40);
  if (normalized.length < 1) return [];

  const [tickerRows, companyRows] = await Promise.all([
    runScanner(searchRequest("name", normalized.toUpperCase()), signal),
    runScanner(searchRequest("description", normalized), signal),
  ]);

  const unique = new Map<string, LiveStockResult>();
  [...tickerRows, ...companyRows]
    .map(mapScannerRow)
    .forEach((result) => unique.set(result.symbolKey, result));

  const queryLower = normalized.toLowerCase();
  const exchangePriority: Record<string, number> = {
    NASDAQ: 0,
    NYSE: 1,
    AMEX: 2,
    LSE: 3,
    TSX: 4,
  };
  return Array.from(unique.values())
    .sort((a, b) => {
      const aExact = a.ticker.toLowerCase() === queryLower ? 0 : 1;
      const bExact = b.ticker.toLowerCase() === queryLower ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;

      if (aExact === 0 && bExact === 0) {
        const aExchange = exchangePriority[a.exchange] ?? 10;
        const bExchange = exchangePriority[b.exchange] ?? 10;
        if (aExchange !== bExchange) return aExchange - bExchange;
      }

      const aTickerStart = a.ticker.toLowerCase().startsWith(queryLower) ? 0 : 1;
      const bTickerStart = b.ticker.toLowerCase().startsWith(queryLower) ? 0 : 1;
      if (aTickerStart !== bTickerStart) return aTickerStart - bTickerStart;

      const aNameStart = a.name.toLowerCase().startsWith(queryLower) ? 0 : 1;
      const bNameStart = b.name.toLowerCase().startsWith(queryLower) ? 0 : 1;
      return aNameStart - bNameStart;
    })
    .slice(0, 8);
}

export async function fetchLiveStockQuote(
  ticker: string,
  exchange?: string | null,
  signal?: AbortSignal
): Promise<LiveStockResult | null> {
  const normalizedTicker = ticker.trim().toUpperCase();

  if (exchange) {
    const symbolKey = `${exchange.toUpperCase()}:${normalizedTicker}`;
    const rows = await runScanner(
      {
        symbols: { tickers: [symbolKey], query: { types: [] } },
        columns: RESULT_COLUMNS,
      },
      signal
    );
    return rows[0] ? mapScannerRow(rows[0]) : null;
  }

  const results = await searchLiveStocks(normalizedTicker, signal);
  return results.find((result) => result.ticker === normalizedTicker) ?? results[0] ?? null;
}

export function formatMarketPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  } catch {
    return `${price.toLocaleString("en-US", { maximumFractionDigits: price < 1 ? 4 : 2 })} ${currency}`;
  }
}

export function formatCompactMarketValue(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })} ${currency}`;
  }
}

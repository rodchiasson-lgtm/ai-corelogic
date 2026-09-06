const TRADINGVIEW_SCANNER_URL = "https://scanner.tradingview.com/global/scan";
const RESULT_COLUMNS = ["name", "description", "close", "change", "currency", "exchange"] as const;

export type LiveStockResult = {
  symbolKey: string;
  ticker: string;
  name: string;
  exchange: string;
  price: number | null;
  changePercent: number | null;
  currency: string;
};

type ScannerRow = {
  s: string;
  d: [string, string, number | null, number | null, string | null, string | null];
};

type ScannerResponse = {
  totalCount?: number;
  data?: ScannerRow[] | null;
  error?: string;
};

function cleanCompanyName(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
}

function mapScannerRow(row: ScannerRow): LiveStockResult {
  const [ticker, description, price, changePercent, currency, exchange] = row.d;
  return {
    symbolKey: row.s,
    ticker,
    name: cleanCompanyName(description || ticker),
    exchange: exchange || row.s.split(":")[0] || "GLOBAL",
    price: typeof price === "number" ? price : null,
    changePercent: typeof changePercent === "number" ? changePercent : null,
    currency: currency || "USD",
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

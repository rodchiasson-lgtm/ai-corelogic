import {
  formatCompactMarketValue,
  formatMarketPrice,
  type LiveStockResult,
} from "@/lib/marketData";

export const stockSummaryStyles = {
  technical: {
    label: "Technical",
    shortLabel: "Technical",
    description: "Momentum, RSI, MACD, moving averages, and volatility",
    metricLabel: "Price · 1D · RSI · MACD · SMA · Volatility",
  },
  fundamental: {
    label: "Fundamental",
    shortLabel: "Fundamental",
    description: "Scale, revenue growth, earnings, valuation, and yield",
    metricLabel: "Market cap · Revenue · Growth · EPS · P/E · Yield",
  },
  beginner: {
    label: "Beginner-friendly",
    shortLabel: "Beginner",
    description: "Plain-language comparison with jargon explained",
    metricLabel: "Plain language · Current market and company metrics",
  },
} as const;

export type StockSummaryStyle = keyof typeof stockSummaryStyles;

export type StockSummaryResult = {
  text: string;
  mode: "ai" | "metrics";
  style: StockSummaryStyle;
  generatedAt: string;
};

type PuterChatResponse = {
  message?: {
    content?: string | Array<{ type?: string; text?: string }>;
  };
  content?: string;
};

type PuterClient = {
  auth?: {
    isSignedIn?: () => boolean;
    signIn?: (options?: Record<string, unknown>) => Promise<unknown>;
  };
  ai?: {
    chat?: (
      messages: Array<{ role: "system" | "user"; content: string }>,
      options?: Record<string, unknown>
    ) => Promise<PuterChatResponse | string>;
  };
};

function getPuterClient() {
  return (window as Window & { puter?: PuterClient }).puter;
}

export async function authorizeStockSummaryAI() {
  const puter = getPuterClient();
  if (!puter?.ai?.chat) return false;
  if (!puter.auth?.isSignedIn || puter.auth.isSignedIn()) return true;
  if (!puter.auth.signIn) return false;

  try {
    await puter.auth.signIn({ attempt_temp_user_creation: true });
    return puter.auth.isSignedIn();
  } catch {
    return false;
  }
}

function extractResponseText(response: PuterChatResponse | string) {
  if (typeof response === "string") return response.trim();
  if (typeof response.message?.content === "string") return response.message.content.trim();
  if (Array.isArray(response.message?.content)) {
    return response.message.content
      .filter((item) => item.type === "text" && item.text)
      .map((item) => item.text)
      .join("\n")
      .trim();
  }
  return typeof response.content === "string" ? response.content.trim() : "";
}

function signed(value: number, digits = 2) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;
}

function measuredChanges(stocks: LiveStockResult[]) {
  return stocks.filter(
    (stock): stock is LiveStockResult & { changePercent: number } => typeof stock.changePercent === "number"
  );
}

function technicalFallback(stocks: LiveStockResult[]) {
  const measured = measuredChanges(stocks);
  if (!measured.length) {
    return "Current technical metrics are unavailable for this basket. Refresh the live data and generate the brief again.\n\nA technical view describes price behavior rather than business quality. Research only; not investment advice.";
  }

  const ranked = [...measured].sort((a, b) => b.changePercent - a.changePercent);
  const leader = ranked[0];
  const laggard = ranked[ranked.length - 1];
  const advancing = measured.filter((stock) => stock.changePercent > 0).length;
  const aboveSma20 = stocks.filter(
    (stock) => typeof stock.price === "number" && typeof stock.sma20 === "number" && stock.price > stock.sma20
  ).length;
  const macdPositive = stocks.filter(
    (stock) => typeof stock.macd === "number" && typeof stock.macdSignal === "number" && stock.macd > stock.macdSignal
  ).length;
  const rsiValues = stocks.filter((stock): stock is LiveStockResult & { rsi: number } => typeof stock.rsi === "number");
  const averageRsi = rsiValues.length
    ? rsiValues.reduce((sum, stock) => sum + stock.rsi, 0) / rsiValues.length
    : null;
  const indicatorCoverage = Math.max(
    stocks.filter((stock) => typeof stock.sma20 === "number").length,
    stocks.filter((stock) => typeof stock.macd === "number").length
  );

  return `${leader.ticker} has the strongest one-day momentum at ${signed(leader.changePercent)}%, while ${laggard.ticker} is weakest at ${signed(laggard.changePercent)}%. Breadth is ${advancing} of ${measured.length} stocks advancing. Among ${indicatorCoverage || stocks.length} listings with indicator data, ${aboveSma20} trade above their 20-day average and ${macdPositive} have MACD above its signal${averageRsi !== null ? `; the basket’s average RSI is ${averageRsi.toFixed(1)}` : ""}.\n\nThis is a short-term technical snapshot, not a forecast. Different exchanges and trading sessions can distort direct comparisons. Research only; not investment advice.`;
}

function fundamentalFallback(stocks: LiveStockResult[]) {
  const marketCaps = stocks.filter(
    (stock): stock is LiveStockResult & { marketCap: number } => typeof stock.marketCap === "number"
  );
  const revenueGrowth = stocks.filter(
    (stock): stock is LiveStockResult & { revenueGrowth: number } => typeof stock.revenueGrowth === "number"
  );
  const positivePe = stocks.filter(
    (stock): stock is LiveStockResult & { peRatio: number } => typeof stock.peRatio === "number" && stock.peRatio > 0
  );

  if (!marketCaps.length && !revenueGrowth.length && !positivePe.length) {
    return "Current fundamental metrics are unavailable for this basket. Refresh the live data and generate the brief again.\n\nA fundamental comparison needs reported revenue, earnings, valuation, and scale—not price movement alone. Research only; not investment advice.";
  }

  const largest = [...marketCaps].sort((a, b) => b.marketCap - a.marketCap)[0];
  const fastestGrowth = [...revenueGrowth].sort((a, b) => b.revenueGrowth - a.revenueGrowth)[0];
  const lowestPe = [...positivePe].sort((a, b) => a.peRatio - b.peRatio)[0];
  const profitable = stocks.filter((stock) => typeof stock.eps === "number" && stock.eps > 0).length;
  const dividendPayers = stocks.filter((stock) => typeof stock.dividendYield === "number" && stock.dividendYield > 0).length;
  const observations = [
    largest ? `${largest.ticker} is largest by market capitalization at ${formatCompactMarketValue(largest.marketCap, largest.currency)}` : null,
    fastestGrowth ? `${fastestGrowth.ticker} has the strongest available trailing revenue growth at ${signed(fastestGrowth.revenueGrowth)}%` : null,
    lowestPe ? `${lowestPe.ticker} has the lowest positive trailing P/E at ${lowestPe.peRatio.toFixed(1)}×` : null,
  ].filter(Boolean);

  return `${observations.join("; ")}. ${profitable} of ${stocks.length} companies report positive trailing diluted EPS, and ${dividendPayers} currently show a dividend yield.\n\nThese fields may use different reporting periods, currencies, and accounting bases, so this is a screening comparison—not a complete valuation. Review filings and business quality before drawing conclusions. Research only; not investment advice.`;
}

function beginnerFallback(stocks: LiveStockResult[]) {
  const measured = measuredChanges(stocks);
  if (!measured.length) {
    return "The latest daily changes are not available yet. Try refreshing the basket before generating another explanation.\n\nA stock’s price alone does not show whether its underlying company is healthy or fairly valued. This is general research, not investment advice.";
  }

  const ranked = [...measured].sort((a, b) => b.changePercent - a.changePercent);
  const leader = ranked[0];
  const laggard = ranked[ranked.length - 1];
  const advancing = measured.filter((stock) => stock.changePercent > 0).length;
  const largest = stocks
    .filter((stock): stock is LiveStockResult & { marketCap: number } => typeof stock.marketCap === "number")
    .sort((a, b) => b.marketCap - a.marketCap)[0];

  return `${leader.ticker} rose the most today at ${signed(leader.changePercent)}%, while ${laggard.ticker} had the weakest day at ${signed(laggard.changePercent)}%. ${advancing} of the ${measured.length} stocks went up. ${largest ? `${largest.ticker} is also the largest company in the basket by market value, which measures what the stock market currently says the whole company is worth.` : ""}\n\nA one-day move is only a snapshot, not a prediction. Share prices and company sizes use different currencies and are not directly comparable. This is a simple research explanation, not investment advice.`;
}

function metricsSummary(stocks: LiveStockResult[], style: StockSummaryStyle) {
  if (style === "technical") return technicalFallback(stocks);
  if (style === "fundamental") return fundamentalFallback(stocks);
  return beginnerFallback(stocks);
}

const styleInstructions: Record<StockSummaryStyle, string> = {
  technical:
    "Write a short technical-market read. Prioritize one-day momentum and breadth, then use RSI, MACD versus signal, price versus 20-day and 50-day moving averages, and daily volatility where present. Never claim a durable trend from one session and never give a buy/sell signal.",
  fundamental:
    "Write a short fundamental screening comparison. Prioritize market capitalization, revenue, trailing revenue growth, diluted EPS, trailing P/E, and dividend yield. Mention daily price movement only as context. Do not treat missing or negative P/E as cheap, and keep currency and reporting-basis limitations explicit.",
  beginner:
    "Write for a reader with no investing background. Use plain language, explain any unavoidable term in the same sentence, and focus on what moved today plus one simple company-scale or fundamental observation. Avoid unexplained jargon, abbreviations, and implied recommendations.",
};

function buildPrompt(stocks: LiveStockResult[], style: StockSummaryStyle) {
  const rows = stocks.map((stock, index) => ({
    slot: index + 1,
    ticker: stock.ticker,
    company: stock.name,
    exchange: stock.exchange,
    currency: stock.currency,
    currentPrice: stock.price,
    formattedPrice: typeof stock.price === "number" ? formatMarketPrice(stock.price, stock.currency) : "Unavailable",
    dailyChangePercent: stock.changePercent,
    marketCapitalization: stock.marketCap,
    trailingPERatio: stock.peRatio,
    trailingDilutedEPS: stock.eps,
    currentDividendYieldPercent: stock.dividendYield,
    trailingRevenue: stock.revenue,
    trailingRevenueGrowthPercent: stock.revenueGrowth,
    rsi14: stock.rsi,
    macd: stock.macd,
    macdSignal: stock.macdSignal,
    simpleMovingAverage20: stock.sma20,
    simpleMovingAverage50: stock.sma50,
    dailyVolatilityPercent: stock.dailyVolatility,
  }));

  return [
    {
      role: "system" as const,
      content: `You are AI-Corelogic's precise stock-comparison analyst. Use only the supplied live snapshot; never add news, forecasts, price targets, recommendations, or outside facts. Do not compare absolute prices or monetary figures across currencies without a caveat. Write two short paragraphs totaling 80-125 words. End with a research-only, not-investment-advice statement. ${styleInstructions[style]}`,
    },
    {
      role: "user" as const,
      content: `Generate a ${stockSummaryStyles[style].label.toLowerCase()} brief for this four-stock basket:\n${JSON.stringify(rows, null, 2)}`,
    },
  ];
}

export async function generateStockSummary(
  stocks: LiveStockResult[],
  style: StockSummaryStyle,
  aiAuthorized = true
): Promise<StockSummaryResult> {
  const generatedAt = new Date().toISOString();
  const fallback = metricsSummary(stocks, style);
  const puter = getPuterClient();

  if (!aiAuthorized || !puter?.ai?.chat) {
    return { text: fallback, mode: "metrics", style, generatedAt };
  }

  let timeoutId: number | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error("AI summary timed out")), 20000);
    });
    const response = await Promise.race([
      puter.ai.chat(buildPrompt(stocks, style), {
        model: "gpt-5-nano",
        normalize: true,
        max_tokens: 300,
        temperature: 0.2,
      }),
      timeout,
    ]);
    const text = extractResponseText(response);
    if (text.length < 40) throw new Error("AI summary was empty");
    return { text, mode: "ai", style, generatedAt };
  } catch {
    return { text: fallback, mode: "metrics", style, generatedAt };
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
}

import { formatMarketPrice, type LiveStockResult } from "@/lib/marketData";

export type StockSummaryResult = {
  text: string;
  mode: "ai" | "metrics";
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

function metricsSummary(stocks: LiveStockResult[]) {
  const measured = stocks.filter(
    (stock): stock is LiveStockResult & { changePercent: number } => typeof stock.changePercent === "number"
  );

  if (!measured.length) {
    return "Current daily-change data is unavailable for this basket. Refresh the live prices and generate the brief again. The four listings may also trade on different schedules, so session timing should be checked before comparing them.";
  }

  const ranked = [...measured].sort((a, b) => b.changePercent - a.changePercent);
  const leader = ranked[0];
  const laggard = ranked[ranked.length - 1];
  const positiveCount = measured.filter((stock) => stock.changePercent > 0).length;
  const negativeCount = measured.filter((stock) => stock.changePercent < 0).length;
  const averageMove = measured.reduce((sum, stock) => sum + stock.changePercent, 0) / measured.length;
  const spread = leader.changePercent - laggard.changePercent;

  return `${leader.ticker} leads the current session at ${leader.changePercent >= 0 ? "+" : ""}${leader.changePercent.toFixed(2)}%, while ${laggard.ticker} is the weakest at ${laggard.changePercent >= 0 ? "+" : ""}${laggard.changePercent.toFixed(2)}%. The basket has ${positiveCount} advancing, ${negativeCount} declining, and an average daily move of ${averageMove >= 0 ? "+" : ""}${averageMove.toFixed(2)}%, with a ${spread.toFixed(2)} percentage-point spread between best and worst.\n\nThis is a directional snapshot, not a valuation comparison: listings may use different currencies, exchanges, and trading sessions, and market data may be delayed. Research only; not investment advice.`;
}

function buildPrompt(stocks: LiveStockResult[]) {
  const rows = stocks.map((stock, index) => ({
    slot: index + 1,
    ticker: stock.ticker,
    company: stock.name,
    exchange: stock.exchange,
    currency: stock.currency,
    currentPrice: stock.price,
    formattedPrice: stock.price !== null ? formatMarketPrice(stock.price, stock.currency) : "Unavailable",
    dailyChangePercent: stock.changePercent,
  }));

  return [
    {
      role: "system" as const,
      content:
        "You are AI-Corelogic's concise market-comparison analyst. Use only the supplied live snapshot. Do not introduce fundamentals, news, forecasts, recommendations, price targets, or facts not present in the data. Never imply that absolute prices are comparable across currencies. Write two short paragraphs totaling 70-110 words. Paragraph one must identify the strongest and weakest daily move and describe breadth across all four stocks. Paragraph two must state the key comparison limitation and that the snapshot is research-only, not investment advice. Use precise percentages and a neutral professional tone.",
    },
    {
      role: "user" as const,
      content: `Generate the brief for this four-stock basket:\n${JSON.stringify(rows, null, 2)}`,
    },
  ];
}

export async function generateStockSummary(stocks: LiveStockResult[], aiAuthorized = true): Promise<StockSummaryResult> {
  const generatedAt = new Date().toISOString();
  const fallback = metricsSummary(stocks);
  const puter = getPuterClient();

  if (!aiAuthorized || !puter?.ai?.chat) {
    return { text: fallback, mode: "metrics", generatedAt };
  }

  let timeoutId: number | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error("AI summary timed out")), 20000);
    });
    const response = await Promise.race([
      puter.ai.chat(buildPrompt(stocks), {
        model: "gpt-5-nano",
        normalize: true,
        max_tokens: 260,
        temperature: 0.2,
      }),
      timeout,
    ]);
    const text = extractResponseText(response);
    if (text.length < 40) throw new Error("AI summary was empty");
    return { text, mode: "ai", generatedAt };
  } catch {
    return { text: fallback, mode: "metrics", generatedAt };
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
}

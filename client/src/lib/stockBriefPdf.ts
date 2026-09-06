import { formatCompactMarketValue, formatMarketPrice, type LiveStockResult } from "@/lib/marketData";
import { stockSummaryStyles, type StockSummaryResult } from "@/lib/stockSummary";

const palette = {
  ink: [5, 11, 24] as const,
  panel: [10, 24, 40] as const,
  cyan: [0, 212, 200] as const,
  blue: [37, 99, 235] as const,
  white: [248, 250, 252] as const,
  slate: [100, 116, 139] as const,
  line: [32, 61, 80] as const,
  green: [16, 185, 129] as const,
  red: [244, 63, 94] as const,
};

function signed(value: number | null) {
  return typeof value === "number" ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%` : "Unavailable";
}

function metricDetail(stock: LiveStockResult, style: StockSummaryResult["style"]) {
  if (style === "technical") {
    return [
      `RSI ${typeof stock.rsi === "number" ? stock.rsi.toFixed(1) : "—"}`,
      `SMA20 ${typeof stock.sma20 === "number" ? formatMarketPrice(stock.sma20, stock.currency) : "—"}`,
      `Vol ${typeof stock.dailyVolatility === "number" ? `${stock.dailyVolatility.toFixed(2)}%` : "—"}`,
    ].join("  ·  ");
  }
  if (style === "fundamental") {
    return [
      `Cap ${typeof stock.marketCap === "number" ? formatCompactMarketValue(stock.marketCap, stock.currency) : "—"}`,
      `P/E ${typeof stock.peRatio === "number" && stock.peRatio > 0 ? `${stock.peRatio.toFixed(1)}x` : "—"}`,
      `Rev growth ${typeof stock.revenueGrowth === "number" ? signed(stock.revenueGrowth) : "—"}`,
    ].join("  ·  ");
  }
  return typeof stock.marketCap === "number"
    ? `Market value ${formatCompactMarketValue(stock.marketCap, stock.currency)}`
    : "Company-scale metric unavailable";
}

export async function downloadStockBriefPdf(stocks: LiveStockResult[], summary: StockSummaryResult) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const style = stockSummaryStyles[summary.style];

  const addFooter = (pageNumber: number) => {
    pdf.setDrawColor(...palette.line);
    pdf.line(margin, pageHeight - 42, pageWidth - margin, pageHeight - 42);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...palette.slate);
    pdf.text("AI-Corelogic Financial Stock Analysis · Research only, not investment advice", margin, pageHeight - 25);
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 25, { align: "right" });
  };

  const addPage = () => {
    addFooter(pdf.getNumberOfPages());
    pdf.addPage();
    pdf.setFillColor(...palette.ink);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    return 54;
  };

  pdf.setFillColor(...palette.ink);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.setFillColor(...palette.cyan);
  pdf.rect(0, 0, 8, pageHeight, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...palette.cyan);
  pdf.text("AI-CORELOGIC / FINANCIAL STOCK ANALYSIS", margin, 54);

  pdf.setFontSize(28);
  pdf.setTextColor(...palette.white);
  pdf.text(`${style.label} comparison brief`, margin, 94);

  const tickerLine = stocks.map((stock) => stock.ticker).join("  /  ");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(...palette.slate);
  pdf.text(`${tickerLine}  ·  Generated ${new Date(summary.generatedAt).toLocaleString()}`, margin, 116);

  pdf.setFillColor(...palette.panel);
  pdf.roundedRect(margin, 140, contentWidth, 52, 7, 7, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...palette.cyan);
  pdf.text(summary.mode === "ai" ? "AI-GENERATED" : "METRICS FALLBACK", margin + 16, 160);
  pdf.setTextColor(...palette.white);
  pdf.text(style.label.toUpperCase(), margin + 16, 177);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...palette.slate);
  pdf.text(style.metricLabel, pageWidth - margin - 16, 170, { align: "right", maxWidth: 290 });

  let y = 224;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...palette.cyan);
  pdf.text("LIVE COMPARISON BASKET", margin, y);
  y += 18;

  const cardGap = 8;
  const cardWidth = (contentWidth - cardGap) / 2;
  stocks.forEach((stock, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + column * (cardWidth + cardGap);
    const cardY = y + row * 88;
    const cardColor: readonly [number, number, number] = index % 2 === 0 ? palette.cyan : palette.blue;
    pdf.setFillColor(...palette.panel);
    pdf.roundedRect(x, cardY, cardWidth, 78, 5, 5, "F");
    pdf.setDrawColor(...cardColor);
    pdf.line(x, cardY, x + cardWidth, cardY);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...palette.white);
    pdf.text(stock.ticker, x + 12, cardY + 20);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...palette.slate);
    pdf.text(`${stock.name} · ${stock.exchange}`, x + 12, cardY + 34, { maxWidth: cardWidth - 24 });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(...palette.white);
    pdf.text(typeof stock.price === "number" ? formatMarketPrice(stock.price, stock.currency) : "Price unavailable", x + 12, cardY + 53);
    const changeColor: readonly [number, number, number] =
      typeof stock.changePercent === "number" && stock.changePercent >= 0 ? palette.green : palette.red;
    pdf.setTextColor(...changeColor);
    pdf.text(`${signed(stock.changePercent)} 1D`, x + cardWidth - 12, cardY + 53, { align: "right" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.8);
    pdf.setTextColor(...palette.slate);
    pdf.text(metricDetail(stock, summary.style), x + 12, cardY + 68, { maxWidth: cardWidth - 24 });
  });

  y += 184;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...palette.cyan);
  pdf.text("COMPARATIVE INTELLIGENCE", margin, y);
  y += 24;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(...palette.white);
  const paragraphs = summary.text.split(/\n\s*\n/).filter(Boolean);
  paragraphs.forEach((paragraph) => {
    const lines = pdf.splitTextToSize(paragraph, contentWidth) as string[];
    const blockHeight = lines.length * 17;
    if (y + blockHeight > pageHeight - 78) y = addPage();
    pdf.text(lines, margin, y, { lineHeightFactor: 1.45 });
    y += blockHeight + 14;
  });

  if (y + 120 > pageHeight - 60) y = addPage();
  pdf.setDrawColor(...palette.line);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 24;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...palette.cyan);
  pdf.text("METHODOLOGY & LIMITATIONS", margin, y);
  y += 18;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...palette.slate);
  const disclosure =
    "This brief uses the current live market and company metrics available for the four selected listings. Quotes and derived fields may be delayed, incomplete, reported in different currencies, or based on different trading sessions and reporting periods. The analysis is for general research and education only and is not personalized financial, legal, tax, or investment advice.";
  const disclosureLines = pdf.splitTextToSize(disclosure, contentWidth) as string[];
  pdf.text(disclosureLines, margin, y, { lineHeightFactor: 1.45 });

  addFooter(pdf.getNumberOfPages());

  const date = new Date(summary.generatedAt).toISOString().slice(0, 10);
  const tickers = stocks.map((stock) => stock.ticker.replace(/[^A-Z0-9.-]/gi, "")).join("-");
  pdf.save(`ai-corelogic-${summary.style}-${tickers}-${date}.pdf`);
}

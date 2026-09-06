export type ResearchCompany = {
  ticker: "SNDK" | "AMZN" | "NVDA" | "MU";
  name: string;
  period: string;
  revenue: number;
  growth: number;
  growthLabel: string;
  price: number;
  dayMove: number;
  range: string;
  engine: string;
  thesis: string;
  readout: string;
  catalyst: string;
  risk: string;
  source: string;
  sourceDate: string;
  accent: string;
};

export const researchCompanies: ResearchCompany[] = [
  {
    ticker: "SNDK",
    name: "Sandisk",
    period: "Q4 FY2026",
    revenue: 8.97,
    growth: 51,
    growthLabel: "QoQ revenue growth",
    price: 1740,
    dayMove: 11.9,
    range: "$67.86 — $2,354.39",
    engine: "Datacenter revenue +437% FY",
    thesis: "Direct memory-cycle exposure",
    readout: "Pricing and volume both lifted Q4; management attributes roughly two-thirds of sequential growth to pricing.",
    catalyst: "Q1 FY2027 revenue guide midpoint is 17.61% above Q4 revenue.",
    risk: "NAND-memory pricing remains a principal earnings sensitivity.",
    source: "https://investor.sandisk.com/news-releases/news-release-details/sandisk-reports-fiscal-fourth-quarter-2026-financial-results",
    sourceDate: "05 Aug 2026",
    accent: "#f97360",
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    period: "Q2 2026",
    revenue: 200.6,
    growth: 20,
    growthLabel: "YoY net sales growth",
    price: 258.51,
    dayMove: -0.15,
    range: "$196.00 — $287.20",
    engine: "AWS sales +37% YoY to $42.2B",
    thesis: "Cloud monetization and capex",
    readout: "AWS generated 60.36% of consolidated operating income, while AI capital investment pushed TTM free cash flow to a $(7.6)B outflow.",
    catalyst: "AWS growth reached its fastest pace in 18 quarters, as disclosed by Amazon.",
    risk: "Q2 net income includes $53.4B of non-operating pre-tax other income tied primarily to Anthropic investments.",
    source: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Second-Quarter-Results/",
    sourceDate: "30 Jul 2026",
    accent: "#4f8cff",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    period: "Q2 FY2027",
    revenue: 96.2,
    growth: 106,
    growthLabel: "YoY revenue growth",
    price: 230.36,
    dayMove: 0.84,
    range: "$164.27 — $236.54",
    engine: "Data Center revenue +117% YoY to $89.0B",
    thesis: "Accelerated-compute concentration",
    readout: "Data Center represented 92.51% of reported revenue, sharpening the link between AI infrastructure demand and financial performance.",
    catalyst: "Q3 FY2027 revenue outlook is $108.0B ±2%, with no assumed China Data Center compute revenue.",
    risk: "China policy and supply-chain context are a distinct sensitivity outside the stated Q3 base case.",
    source: "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027",
    sourceDate: "26 Aug 2026",
    accent: "#00D4C8",
  },
  {
    ticker: "MU",
    name: "Micron Technology",
    period: "Q3 FY2026",
    revenue: 41.46,
    growth: 346,
    growthLabel: "YoY revenue growth",
    price: 1016.59,
    dayMove: 6.1,
    range: "$128.40 — $1,255.00",
    engine: "Revenue +346% YoY to $41.46B",
    thesis: "HBM and DRAM operating leverage",
    readout: "Record revenue and $25.39B of operating cash flow show strong DRAM and high-bandwidth-memory leverage in the current AI infrastructure cycle.",
    catalyst: "Q4 FY2026 revenue outlook is $50.0B ±$1.0B; results are scheduled for 30 Sep 2026.",
    risk: "Memory pricing, supply additions, and capital intensity can amplify both upside and downside through the cycle.",
    source: "https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Results-for-the-Third-Quarter-of-Fiscal-2026/default.aspx",
    sourceDate: "24 Jun 2026",
    accent: "#aa7dff",
  },
];

export const relativePerformance = [
  { session: "S1", SNDK: 100, AMZN: 100, NVDA: 100, MU: 100 },
  { session: "S2", SNDK: 98.1, AMZN: 98.13, NVDA: 98.49, MU: 97.36 },
  { session: "S3", SNDK: 99.15, AMZN: 98.16, NVDA: 101.64, MU: 99.72 },
  { session: "S4", SNDK: 99.25, AMZN: 99.66, NVDA: 103.47, MU: 99.94 },
  { session: "S5", SNDK: 111.89, AMZN: 99.51, NVDA: 104.34, MU: 106.03 },
];

export const yahooFinanceSource = "https://finance.yahoo.com/";

export const researchBrief = `AI-Corelogic Intelligence Desk — infrastructure cycle brief\n\nAs of 06 Sep 2026 · market closes 04 Sep 2026\n\nFour earnings stories. One infrastructure cycle.\n\nSNDK: Memory-cycle upside shows in pricing and a sharp Datacenter mix shift, with the strongest direct commodity sensitivity.\nAMZN: AWS acceleration supplies the operating leverage, while capital intensity makes cash flow the important counterweight.\nNVDA: Data Center concentration produces exceptional demand exposure, alongside policy and supply-chain sensitivity.\nMU: HBM and DRAM pricing translate AI demand into exceptional revenue and cash-flow acceleration, with cyclical supply risk.\n\nResearch only — no price targets. Reported periods and accounting bases are intentionally kept visible.`;

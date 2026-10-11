import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import BrandVideoSection, { BRAND_VIDEO_ASSETS, BRAND_VIDEO_TRANSCRIPT } from "./BrandVideoSection";
import FinancialModelsCatalog, { FINANCIAL_MODELS } from "./FinancialModelsCatalog";

const projectRoot = resolve(import.meta.dirname, "../..");

function sourceFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("homepage video integration", () => {
  it("renders user-controlled playback, a poster, captions and a transcript without autoplay", () => {
    const markup = renderToStaticMarkup(<BrandVideoSection />);
    expect(markup).toContain('id="brand-video"');
    expect(markup).toContain("controls=\"\"");
    expect(markup).toContain("playsInline=\"\"");
    expect(markup).toContain('preload="metadata"');
    expect(markup).toContain(`poster="${BRAND_VIDEO_ASSETS.poster}"`);
    expect(markup).toContain('kind="captions"');
    expect(markup).toContain('srcLang="en"');
    expect(markup).toContain(BRAND_VIDEO_TRANSCRIPT);
    expect(markup.toLowerCase()).not.toContain("autoplay");
  });

  it("ships all referenced media with the website and a valid caption header", () => {
    for (const asset of Object.values(BRAND_VIDEO_ASSETS)) {
      expect(existsSync(resolve(projectRoot, "public", asset.slice(1)))).toBe(true);
    }
    expect(sourceFile(`public${BRAND_VIDEO_ASSETS.captions}`)).toMatch(/^WEBVTT\n/);
  });

  it("places the video directly after the hero while preserving the industry section", () => {
    const home = sourceFile("src/pages/Home.tsx");
    expect(home).toMatch(/<HeroSection\s*\/>\s*<BrandVideoSection\s*\/>/);
    expect(home).toContain("<IndustriesSection />");
  });
});

describe("Financial Services model catalog", () => {
  it("shows three verified publisher model-card links and explicit catalog-only limitations", () => {
    const markup = renderToStaticMarkup(<FinancialModelsCatalog />);
    expect(FINANCIAL_MODELS).toHaveLength(3);
    for (const model of FINANCIAL_MODELS) {
      expect(model.url).toBe(`https://huggingface.co/${model.id}`);
      expect(markup).toContain(`href="${model.url}"`);
      expect(markup).toContain(model.id);
    }
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain("Catalog links only");
    expect(markup).toContain("gated access");
    expect(markup).toContain("not credit-scoring or fraud-detection");
  });

  it("connects both shared industry navigation and the sector card to the catalog", () => {
    const navbar = sourceFile("src/components/Navbar.tsx");
    const industries = sourceFile("src/components/IndustriesSection.tsx");
    expect(navbar).toContain('label: "Financial Services", href: "#financial-services-models"');
    expect(industries).toContain('href="#financial-services-models"');
    expect(industries).toContain("<FinancialModelsCatalog />");
    expect(renderToStaticMarkup(<FinancialModelsCatalog />)).toContain('id="financial-services-models"');
  });

  it("does not restore retired stock-analysis routes", () => {
    const app = sourceFile("src/App.tsx");
    expect(app).not.toContain('path="/intelligence"');
    expect(app).not.toContain('path="/stocks/:ticker"');
  });
});

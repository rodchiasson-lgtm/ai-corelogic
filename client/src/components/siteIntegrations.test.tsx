import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import BrandVideoSection, { BRAND_VIDEO_ASSETS, BRAND_VIDEO_TRANSCRIPT, selectBrandVideo } from "./BrandVideoSection";
import FinancialServicesModelShowcase from "./FinancialServicesModelShowcase";
import models from "./financial-services-models.json";

const clientRoot = resolve(import.meta.dirname, "../..");
const sourceFile = (path: string) => readFileSync(resolve(clientRoot, path), "utf8");

describe("homepage video integration", () => {
  it("does not attach a video or captions URL before user interaction", () => {
    const markup = renderToStaticMarkup(<BrandVideoSection />);
    expect(markup).toContain('id="brand-video"');
    expect(markup).toContain('preload="none"');
    expect(markup).not.toContain("<source");
    expect(markup).not.toContain("<track");
    expect(markup).not.toMatch(/<video[^>]+src=/);
    expect(markup).toContain('aria-label="Play the 30-second AI-CoreLogic video"');
    expect(markup.toLowerCase()).not.toContain("autoplay");
    expect(markup).toContain('controls=""');
    expect(markup).toContain('playsInline=""');
  });

  it("lazy-loads responsive compressed posters and reserves the aspect ratio", () => {
    const markup = renderToStaticMarkup(<BrandVideoSection />);
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('decoding="async"');
    expect(markup).toContain('fetchPriority="low"');
    expect(markup).toContain("640w");
    expect(markup).toContain("960w");
    expect(markup).toContain("1280w");
    expect(markup).toContain("aspect-video");
    expect(markup).toContain('width="1280" height="720"');
    expect(markup).toContain(BRAND_VIDEO_TRANSCRIPT);
    expect(markup).toContain("min-h-11");
  });

  it.each([
    [320, undefined, "mobileVideo"], [767, undefined, "mobileVideo"],
    [768, undefined, "video"], [1440, undefined, "video"],
    [1440, { saveData: true }, "mobileVideo"],
    [1440, { effectiveType: "3g" }, "mobileVideo"],
    [1440, { effectiveType: "2g" }, "mobileVideo"],
    [1440, { effectiveType: "slow-2g" }, "mobileVideo"],
    [1440, { downlink: 1.5 }, "mobileVideo"],
    [1440, { effectiveType: "4g", downlink: 10 }, "video"],
  ] as const)("selects a suitable rendition at width %i with %j", (width, hints, expected) => {
    expect(selectBrandVideo(width, hints)).toBe(BRAND_VIDEO_ASSETS[expected]);
  });

  it("ships all media, small posters, a lighter mobile file and valid captions", () => {
    for (const asset of Object.values(BRAND_VIDEO_ASSETS)) {
      expect(existsSync(resolve(clientRoot, "public", asset.slice(1)))).toBe(true);
    }
    expect(statSync(resolve(clientRoot, `public${BRAND_VIDEO_ASSETS.mobileVideo}`)).size)
      .toBeLessThan(statSync(resolve(clientRoot, `public${BRAND_VIDEO_ASSETS.video}`)).size);
    expect(statSync(resolve(clientRoot, `public${BRAND_VIDEO_ASSETS.smallPoster}`)).size).toBeLessThan(25_000);
    expect(sourceFile(`public${BRAND_VIDEO_ASSETS.captions}`)).toMatch(/^WEBVTT\n/);
  });

  it("keeps the video directly after the hero and preserves all other sections", () => {
    const home = sourceFile("src/pages/Home.tsx");
    expect(home).toMatch(/<HeroSection\s*\/>\s*<BrandVideoSection\s*\/>/);
    expect(home).toContain("<IndustriesSection />");
  });
});

describe("supplied Financial Services showcase", () => {
  it("shows the supplied publisher links, specialization labels and licensing caveats", () => {
    const markup = renderToStaticMarkup(<FinancialServicesModelShowcase />);
    expect(models).toHaveLength(3);
    for (const model of models) {
      expect(model.url).toBe(`https://huggingface.co/${model.id}`);
      expect(markup).toContain(`href="${model.url}"`);
      expect(markup).toContain(model.name);
    }
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain("Linked showcase — not a live AI tool");
    expect(markup).toContain("General-purpose · finance application");
    expect(markup).toContain("verify terms");
    expect(markup).toContain("No customer");
  });

  it("preserves the Financial Services menu anchor and links its card to the showcase", () => {
    expect(sourceFile("src/components/Navbar.tsx")).toContain('label: "Financial Services", href: "#industry-financial-services"');
    const industries = sourceFile("src/components/IndustriesSection.tsx");
    expect(industries).toContain('href="#financial-services-models"');
    expect(industries).toContain("<FinancialServicesModelShowcase />");
    expect(renderToStaticMarkup(<FinancialServicesModelShowcase />)).toContain('id="financial-services-models"');
  });

  it("does not restore retired stock-analysis routes", () => {
    const app = sourceFile("src/App.tsx");
    expect(app).not.toContain('path="/intelligence"');
    expect(app).not.toContain('path="/stocks/:ticker"');
  });
});

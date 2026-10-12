import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcDirectory = resolve(import.meta.dirname, "..");
const componentsDirectory = resolve(srcDirectory, "components");

function readSource(path: string): string {
  return readFileSync(path, "utf8");
}

function findFiles(directory: string, predicate: (path: string) => boolean): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return findFiles(path, predicate);
    }

    return entry.isFile() && predicate(path) ? [path] : [];
  });
}

function findRequiredFile(name: string): string {
  const matches = findFiles(srcDirectory, (path) => basename(path) === name);
  expect(matches, `Expected to find ${name}`).toHaveLength(1);
  return matches[0];
}

describe("vendor removal", () => {
  it("does not retain the removed vendor name in non-test client source files", () => {
    const textExtensions = new Set([".ts", ".tsx", ".json", ".css"]);
    const sourceFiles = findFiles(
      srcDirectory,
      (path) =>
        textExtensions.has(extname(path)) && !basename(path).includes(".test."),
    );

    const matches = sourceFiles.filter((path) => /celonis/i.test(readSource(path)));
    expect(matches).toEqual([]);
  });

  it("removes ResourcesSection while retaining the Home page sections", () => {
    const home = readSource(resolve(srcDirectory, "pages/Home.tsx"));

    expect(home).not.toContain("ResourcesSection");
    expect(findFiles(srcDirectory, (path) => basename(path) === "ResourcesSection.tsx")).toEqual([]);
    expect(home).toContain("<IndustriesSection />");
    expect(home).toContain("<BrandVideoSection />");
    expect(home).toContain("<ResearchSection />");
  });

  it("links IndustriesSection to the financial services model showcase", () => {
    const industriesSection = readSource(
      resolve(componentsDirectory, "IndustriesSection.tsx"),
    );

    expect(industriesSection).toMatch(
      /import\s+FinancialServicesModelShowcase\s+from\s+["'][^"']+FinancialServicesModelShowcase["']/,
    );
    expect(industriesSection).toContain("<FinancialServicesModelShowcase />");
    expect(industriesSection).toContain('href="#financial-services-models"');
  });

  it("keeps the expected Hugging Face financial services models", () => {
    const modelsFile = findRequiredFile("financial-services-models.json");
    const data: unknown = JSON.parse(readSource(modelsFile));
    const records: Array<Record<string, unknown>> = [];

    const collectRecords = (value: unknown) => {
      if (Array.isArray(value)) {
        value.forEach(collectRecords);
      } else if (value && typeof value === "object") {
        const record = value as Record<string, unknown>;
        if (typeof record.id === "string") {
          records.push(record);
        }
        Object.values(record).forEach(collectRecords);
      }
    };

    collectRecords(data);

    const expectedModels = {
      "ProsusAI/finbert": "https://huggingface.co/ProsusAI/finbert",
      "BAAI/bge-m3": "https://huggingface.co/BAAI/bge-m3",
      "ibm-granite/granite-docling-258M": "https://huggingface.co/ibm-granite/granite-docling-258M",
    };

    expect(records.map((record) => record.id)).toEqual(Object.keys(expectedModels));
    for (const [id, url] of Object.entries(expectedModels)) {
      expect(records.find((record) => record.id === id)?.url).toBe(url);
    }
  });

  it("retains financial services navigation and its bookmark link", () => {
    const navbar = readSource(resolve(componentsDirectory, "Navbar.tsx"));

    expect(navbar).toContain("Financial Services");
    expect(navbar).toContain("Healthcare");
    expect(navbar).toContain("Life Sciences");
    expect(navbar).toContain("#financial-services-models");
  });

  it("does not retain the removed application routes", () => {
    const app = readSource(resolve(srcDirectory, "App.tsx"));

    expect(existsSync(resolve(srcDirectory, "App.tsx"))).toBe(true);
    expect(app).not.toContain("/intelligence");
    expect(app).not.toContain("/stocks/:ticker");
  });
});

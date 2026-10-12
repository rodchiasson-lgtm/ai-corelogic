import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import knowledge from "./strategyKnowledge.json";
import StrategyKnowledgeLibrary, { filterStrategyPlaybooks } from "../components/StrategyKnowledgeLibrary";
import { resolveCategory } from "../pages/CategoryLanding";

const expectedIds = "4580 4581 4582 4583 4584 4585 4586 4587 4591 4592 4593 4594 4595 4664 4665 4716 4719 4720 4721 4722 4772 4773 4774 4779 4788 4789 4790 4791 4792 4822 4851 4852 4853 4854 4855 4856 4857 4858 4859 4860 4861 4862 4863 4864 4905 5221 5222 5223 5224 5225 5226 5229".split(" ");
const src = resolve(import.meta.dirname, "..");
const read = (relative: string) => readFileSync(resolve(src, relative), "utf8");

describe("AI Strategy knowledge library", () => {
  it("indexes each of the 52 supplied screenshots exactly once", () => {
    expect(knowledge.sources.map((source) => source.id)).toEqual(expectedIds);
    expect(new Set(knowledge.sources.map((source) => source.file)).size).toBe(52);
  });
  it("maps every source to a practical playbook with no orphan references", () => {
    expect(knowledge.playbooks).toHaveLength(16);
    expect(Array.from(new Set(knowledge.playbooks.flatMap((item) => item.sources))).sort()).toEqual(expectedIds);
  });
  it("uses external image assets, not unavailable storage routes or bundled screenshots", () => {
    for (const source of knowledge.sources) expect(source.url).toMatch(/^https:\/\/files\.manuscdn\.com\/.+\.webp$/);
  });
  it("retains distinct category capitalization and resolves AI Strategy correctly", () => {
    expect(resolveCategory("ai-strategy")).toBe("AI Strategy");
    expect(resolveCategory("ai-technology")).toBe("AI Technology");
    expect(resolveCategory("process-mining")).toBe("Process Mining");
    expect(resolveCategory("invalid")).toBeNull();
  });
  it("searches section text and sources, not just titles", () => {
    expect(filterStrategyPlaybooks("semantic caching").map((item) => item.id)).toEqual(["inference-economics"]);
    expect(filterStrategyPlaybooks("IMG_4580.webp").map((item) => item.id)).toEqual(["protocols-and-capabilities"]);
    expect(filterStrategyPlaybooks("nonexistent-search-text")).toEqual([]);
  });
  it("combines topic filters with search", () => {
    expect(filterStrategyPlaybooks("", "Leadership & Adoption").map((item) => item.id)).toEqual(["leadership-and-adoption"]);
    expect(filterStrategyPlaybooks("caching", "Leadership & Adoption")).toEqual([]);
  });
  it("provides structured learning content and caveats for every playbook", () => {
    for (const item of knowledge.playbooks) {
      expect(item.sections).toHaveLength(3);
      expect(item.checklist).toHaveLength(4);
      expect(item.caution.length).toBeGreaterThan(90);
    }
    expect(knowledge.playbooks.find((item) => item.id === "certification-due-diligence")?.caution).toContain("not verified");
    expect(knowledge.playbooks.find((item) => item.id === "prompting-without-myths")?.caution).toContain("not verified built-in commands");
  });
  it("renders an accessible search field, native disclosures, and educational disclosure", () => {
    const markup = renderToStaticMarkup(<StrategyKnowledgeLibrary />);
    expect(markup).toContain('id="strategy-search"');
    expect(markup).toContain("Educational material, not deployed tools.");
    expect(markup.match(/id="strategy-[a-z][^"]*"/g)?.length).toBeGreaterThanOrEqual(16);
    expect(markup).toContain("Source references");
  });
  it("keeps the Industries dropdown, research, showcase, and video; stock routes remain retired", () => {
    const navbar = read("components/Navbar.tsx");
    for (const industry of ["Financial Services", "Healthcare", "Life Sciences"]) expect(navbar).toContain(industry);
    expect(navbar).toContain('/category/ai-strategy');
    const home = read("pages/Home.tsx");
    expect(home).toContain("<ResearchSection />");
    expect(home).toContain("<BrandVideoSection />");
    expect(read("components/IndustriesSection.tsx")).toContain("<FinancialServicesModelShowcase />");
    const app = read("App.tsx");
    expect(app).not.toContain("/intelligence");
    expect(app).not.toContain("/stocks/:ticker");
  });
  it("does not reintroduce removed vendor content in the supplied-material synthesis", () => {
    expect(JSON.stringify(knowledge)).not.toMatch(/celonis/i);
  });
});

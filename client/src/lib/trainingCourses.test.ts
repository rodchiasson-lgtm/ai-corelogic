import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { trainingCourses } from "./trainingCourses";

const clientSource = resolve(import.meta.dirname, "..");
const readSource = (relativePath: string) => readFileSync(resolve(clientSource, relativePath), "utf8");

describe("AI Training course library", () => {
  it("lists the uploaded architecture guide first with its resource metadata", () => {
    expect(trainingCourses).toHaveLength(1);
    expect(trainingCourses[0]).toMatchObject({
      id: "agentic-training",
      title: "Agentic Training & Inference Platform",
      href: "/training#agentic-training",
      documentHref: "/manus-storage/AgenticTrainingandInferencePlatformStep-by-StepArchitecture_10625846.docx",
      downloadName: "AgenticTrainingandInferencePlatformStep-by-StepArchitecture.docx",
      subtitle: "Step-by-Step Architecture · DOCX · 14 pages",
    });
  });

  it("provides grounded architecture detail and clearly marks prerequisites as recommendations", () => {
    const course = trainingCourses[0];
    expect(course.architectures.map((stage) => stage.name)).toEqual([
      "01 / Foundation",
      "02 / Training",
      "03 / Inference",
    ]);
    expect(course.outcomes.some((outcome) => outcome.includes("RAG") && outcome.includes("MCP"))).toBe(true);
    expect(course.recommendedPrerequisites.length).toBeGreaterThanOrEqual(3);
    const page = readSource("pages/Training.tsx");
    expect(page).toContain("Recommended background");
    expect(page).toContain("does not state formal enrollment prerequisites");
    expect(page).toContain("Download the architecture guide");
  });

  it("registers the landing page and exposes it from desktop and mobile AI Training navigation", () => {
    expect(readSource("App.tsx")).toContain('<Route path="/training" component={Training} />');
    const navbar = readSource("components/Navbar.tsx");
    expect(navbar).toContain('href="/training"');
    expect(navbar).toContain('href={course.href}');
    expect(navbar).toContain("Course overview &amp; prerequisites");
  });
});

import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TeamSection from "./TeamSection";
import Footer from "./Footer";

const CHANNEL = "https://www.youtube.com/@rodchiasson";

function anchors(markup: string) {
  return markup.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? [];
}

describe("Rodney Chiasson YouTube channel links", () => {
  it.each([
    ["founder profile", TeamSection],
    ["footer social links", Footer],
  ] as const)("adds one clearly labelled, accessible link to the %s", (_label, Component) => {
    const links = anchors(renderToStaticMarkup(<Component />)).filter((anchor) => anchor.includes(`href="${CHANNEL}"`));
    expect(links).toHaveLength(1);
    const link = links[0];
    expect(link).toContain('target="_blank"');
    expect(link).toContain('rel="noopener noreferrer"');
    expect(link).toMatch(/aria-label="Rodney Chiasson[^\"]*YouTube channel \(opens in a new tab\)"/);
    expect(link).toMatch(/<span[^>]*>YouTube<\/span>/);
    expect(link).toContain('aria-hidden="true"');
  });

  it("preserves the founder’s existing Call and LinkedIn destinations", () => {
    const markup = renderToStaticMarkup(<TeamSection />);
    expect(markup).toContain('href="tel:+1-727-318-9265"');
    expect(markup).toContain('href="https://www.linkedin.com/company/109932965/"');
    expect(markup).toContain("Our Founder");
  });

  it("preserves all five existing footer social entries and supports small-screen wrapping", () => {
    const markup = renderToStaticMarkup(<Footer />);
    for (const label of ["LinkedIn", "Telegram", "WhatsApp", "Twitter", "GitHub"]) {
      expect(markup).toContain(`aria-label="${label}"`);
    }
    expect(markup).toContain('href="https://www.linkedin.com/company/109932965/"');
    expect(markup).toContain('href="https://t.me/Aicorelogic_bot"');
    expect(markup).toContain('href="https://wa.me/17273189265?text=');
    expect(markup).toContain('class="flex flex-wrap gap-3"');
    expect(markup).toContain("AI Strategy Library");
  });

  it("does not invent channel statistics or embed a video", () => {
    const markup = renderToStaticMarkup(<TeamSection />) + renderToStaticMarkup(<Footer />);
    expect(markup).not.toMatch(/<iframe|youtube\.com\/embed|subscriber|subscribers|youtube-nocookie/i);
    expect(anchors(markup).filter((anchor) => /youtube\.com/.test(anchor))).toHaveLength(2);
  });
});

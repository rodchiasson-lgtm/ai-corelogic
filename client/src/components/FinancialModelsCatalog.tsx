import { ArrowUpRight, FileText, MessageSquareText, ShieldCheck } from "lucide-react";

// Descriptions verified against publisher model cards on 11 October 2026.
// This is a discovery catalog, not a hosted inference service or model endorsement.
export const FINANCIAL_MODELS = [
  {
    id: "ProsusAI/finbert",
    name: "FinBERT",
    publisher: "Prosus AI",
    category: "Financial sentiment",
    icon: MessageSquareText,
    description:
      "Classifies English financial text as positive, negative or neutral. A finance-domain BERT model fine-tuned using Financial PhraseBank.",
    useCase: "Evaluate sentiment in financial communications and reporting workflows.",
    access:
      "Public model card and weights. Review repository and upstream terms before commercial deployment; the card does not state a license tag.",
    url: "https://huggingface.co/ProsusAI/finbert",
  },
  {
    id: "yiyanghkust/finbert-tone",
    name: "FinBERT Tone",
    publisher: "yiyanghkust",
    category: "Communication tone",
    icon: FileText,
    description:
      "Analyzes positive, negative and neutral tone in financial communications. Fine-tuned on 10,000 manually annotated analyst-report sentences.",
    useCase: "Explore tone analysis for analyst reports, corporate reports and earnings-call text.",
    access:
      "Public model card and weights. Verify model, dataset and upstream licensing before production; the card does not state a license tag.",
    url: "https://huggingface.co/yiyanghkust/finbert-tone",
  },
  {
    id: "TheFinAI/finma-7b-nlp",
    name: "FinMA-7B-NLP",
    publisher: "The Fin AI / PIXIU",
    category: "Financial language tasks",
    icon: ShieldCheck,
    description:
      "An instruction-tuned 7B-parameter financial language model for sentiment, headline classification, named-entity recognition and question answering.",
    useCase: "Research financial-document question answering and information-extraction workflows.",
    access:
      "Research release with gated access. The card lists MIT; review its access conditions and upstream model terms. No inference provider was listed at verification.",
    url: "https://huggingface.co/TheFinAI/finma-7b-nlp",
  },
] as const;

export default function FinancialModelsCatalog() {
  return (
    <div
      id="financial-services-models"
      className="mt-12 scroll-mt-28 rounded-xl border border-cyan-400/15 bg-[#07111f] p-5 sm:p-7 lg:p-8"
      aria-labelledby="financial-models-heading"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="max-w-3xl">
          <div className="mono-label mb-3">Financial Services / Model catalog</div>
          <h3
            id="financial-models-heading"
            className="text-2xl font-bold text-white lg:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Explore finance-focused models on <span className="gradient-text">Hugging Face.</span>
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            A curated starting point for financial-language workflows. Open each publisher’s
            model card to review documentation, weights, licensing and deployment requirements.
          </p>
        </div>
        <span className="w-fit shrink-0 rounded border border-cyan-400/15 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-slate-400">
          Verified 11 Oct 2026
        </span>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {FINANCIAL_MODELS.map((model) => {
          const Icon = model.icon;
          return (
            <article key={model.id} className="flex min-w-0 flex-col rounded-lg border border-cyan-400/10 bg-[#0A1828] p-5">
              <div className="mb-4 flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
                <span className="text-xs text-cyan-400">{model.category}</span>
              </div>
              <h4 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
                {model.name}
              </h4>
              <p className="mt-1 text-xs text-slate-500">{model.publisher}</p>
              <code className="mt-3 break-all text-[11px] leading-5 text-slate-400">{model.id}</code>
              <p className="mt-4 text-sm leading-6 text-slate-300">{model.description}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{model.useCase}</p>
              <p className="mb-5 mt-4 border-t border-cyan-400/10 pt-4 text-xs leading-5 text-slate-500">
                {model.access}
              </p>
              <a
                href={model.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${model.name} model card on Hugging Face (opens in a new tab)`}
                className="mt-auto inline-flex w-fit items-center gap-2 rounded text-sm font-semibold text-cyan-400 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
              >
                View model card
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          );
        })}
      </div>

      <div className="mt-6 border-t border-cyan-400/10 pt-5 text-xs leading-6 text-slate-500">
        <p>
          Catalog links only: this website does not run these models or send your documents
          to Hugging Face. Inclusion is not an endorsement, financial advice or a claim of
          regulatory approval. These language models are not credit-scoring or fraud-detection
          systems. Validate accuracy, bias, privacy, security and licensing for your intended use;
          keep humans accountable for regulated decisions.
        </p>
        <a
          href="https://huggingface.co/models?other=finance"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
        >
          Browse more finance models on Hugging Face
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

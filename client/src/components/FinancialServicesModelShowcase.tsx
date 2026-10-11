import models from "./financial-services-models.json";

/** Linked educational showcase only. No inference, uploads, tracking, or model downloads. */
export default function FinancialServicesModelShowcase() {
  return (
    <section
      id="financial-services-models"
      aria-labelledby="financial-services-models-title"
      className="mt-12 rounded-2xl border border-cyan-400/15 bg-[#0D1B2E]/60 p-5 sm:p-8 scroll-mt-28"
    >
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-cyan-400">
        Financial Services / Model Library
      </p>
      <h3
        id="financial-services-models-title"
        className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Explore AI models for financial services
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        A curated selection from Hugging Face for financial-text analysis,
        knowledge retrieval, and document processing. Explore the publisher’s
        model card to assess fit for your workflows.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/20 px-3 py-1 text-cyan-200">
          Linked showcase — not a live AI tool
        </span>
        <span className="rounded-full border border-slate-600 px-3 py-1 text-slate-300">
          Source review: 11 October 2026
        </span>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {models.map((model) => (
          <article
            key={model.id}
            aria-labelledby={`model-${model.id.split("/").pop()}`}
            className="flex h-full flex-col rounded-xl border border-slate-700/70 bg-[#050B18]/60 p-5"
          >
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-300">
              {model.category}
            </p>
            <h4
              id={`model-${model.id.split("/").pop()}`}
              className="mt-3 text-xl font-semibold text-white"
            >
              {model.name}
            </h4>
            <p className="mt-1 text-xs leading-5 text-slate-400">{model.publisher}</p>
            <p className="mt-3 text-xs text-cyan-200">{model.specialization}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{model.description}</p>
            <dl className="mt-4 space-y-4 text-sm leading-6">
              <div>
                <dt className="font-semibold text-white">Potential application</dt>
                <dd className="mt-1 text-slate-300">{model.application}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Important limitation</dt>
                <dd className="mt-1 text-slate-300">{model.limitation}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">License: {model.license}</dt>
                <dd className="mt-1 text-xs leading-5 text-slate-400">{model.licenseNote}</dd>
              </div>
            </dl>
            <a
              href={model.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${model.name} on Hugging Face (opens in a new tab)`}
              className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            >
              View on Hugging Face <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-slate-700 p-4 text-xs leading-6 text-slate-300">
        <p>
          Third-party models are shown for evaluation, not as deployed AI-CoreLogic
          services or endorsed products. Financial-services applications are
          proposed use cases, not verified deployment claims. Review licenses,
          data permissions, security, bias, and model risk before use. No customer
          data is collected or sent to these providers by this showcase. These
          models do not provide financial advice or automated lending, fraud, or
          compliance decisions.
        </p>
      </div>
    </section>
  );
}

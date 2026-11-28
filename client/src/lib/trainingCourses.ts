export type TrainingCourse = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  documentHref: string;
  downloadName: string;
  format: string;
  summary: string;
  audience: string;
  outcomes: string[];
  architectures: { name: string; description: string; details: string[] }[];
  recommendedPrerequisites: string[];
};

export const trainingCourses: TrainingCourse[] = [
  {
    id: "agentic-training",
    title: "Agentic Training & Inference Platform",
    subtitle: "Step-by-Step Architecture · DOCX · 14 pages",
    href: "/training#agentic-training",
    documentHref: "/manus-storage/AgenticTrainingandInferencePlatformStep-by-StepArchitecture_10625846.docx",
    downloadName: "AgenticTrainingandInferencePlatformStep-by-StepArchitecture.docx",
    format: "Self-guided architecture guide",
    summary:
      "A practical architecture walkthrough for training task-specific models on Google Cloud and serving them to Claude-driven agents. It shows how a shared foundation connects Oracle AI Database 26ai, retrieval-augmented generation (RAG), Model Context Protocol (MCP) tools, governed model training, and production inference into a monitored feedback loop.",
    audience:
      "Designed for AI and ML architects, platform engineers, data and ML practitioners, and technical leaders evaluating how agentic workflows can use models they train and operate themselves.",
    outcomes: [
      "Explain how the foundation, training, and inference architectures fit together.",
      "Distinguish RAG (bringing approved knowledge into context) from MCP (calling tools and live systems).",
      "Trace a governed training lifecycle from planning and data preparation through evaluation, approval, and registration.",
      "Map an agent inference flow that retrieves context, calls approved tools, validates results, and routes sensitive decisions for human review.",
      "Compare serving choices such as H100 versus B200 capacity and vLLM, SGLang, or TensorRT-LLM runtimes.",
    ],
    architectures: [
      {
        name: "01 / Foundation",
        description:
          "Establishes the shared cloud, identity, data, agent, and observability foundation once, then reuses it for training and inference.",
        details: [
          "Oracle AI Database 26ai as the vector and operational knowledge layer",
          "LangGraph, LangChain, Claude on Vertex AI, and n8n as coordinated services",
          "Least-privilege MCP servers, retrieval corpora, and end-to-end tracing",
        ],
      },
      {
        name: "02 / Training",
        description:
          "Walks through a governed pipeline that turns a training request into a versioned, evaluated, approved model candidate.",
        details: [
          "Planning, data ingestion, preparation, labeling, and dataset documentation",
          "Vertex AI pipelines for classic ML and optional open-weight LLM fine-tuning",
          "Segmented evaluation, serving checks, human approval, and model registration",
        ],
      },
      {
        name: "03 / Inference",
        description:
          "Shows how Claude-driven agents retrieve context and call trained models and business systems through permissioned tools.",
        details: [
          "Agent routing, hybrid retrieval, planning, and MCP-mediated actions",
          "Schema validation, human review for high-impact cases, and traceable responses",
          "Monitoring for drift and a feedback path that can trigger retraining",
        ],
      },
    ],
    recommendedPrerequisites: [
      "Working familiarity with machine-learning concepts such as datasets, model evaluation, and deployment.",
      "Basic understanding of cloud services, APIs, data stores, and identity or access controls.",
      "Some exposure to Python or TypeScript is helpful for following the integration examples, but no coding exercise is specified in the guide.",
    ],
  },
];

export const publicPortfolioProjects = [
  {
    id: "lead-crm-duplicate-detection",
    title: "Lead CRM Duplicate Detection System",
    shortLabel: "Demo build",
    proofStatus: "Demo build",
    proofTone: "demo",
    queueLabel: "Current sprint",
    summary:
      "A public-safe case study for checking inbound lead records, flagging likely duplicates, and routing the next action without exposing private client data.",
    businessValue: "Captures leads, detects duplicates, sends notifications, and keeps audit logs.",
    tools: ["Make.com", "Google Sheets", "Gmail", "Telegram"],
    proofItems: [
      "Scenario map placeholder",
      "Google Sheet output placeholder",
      "Activity log placeholder",
      "Demo video placeholder"
    ],
    proofAssets: [
      {
        type: "image",
        label: "Demo placeholder",
        title: "Lead CRM duplicate detection flow",
        src: "/screens/lead-crm-duplicate-detection-demo-placeholder.png",
        alt: "Demo placeholder graphic for a lead CRM duplicate detection workflow.",
        caption: "Demo placeholder for the duplicate-checking flow. This is not a live CRM screenshot."
      },
      {
        type: "image",
        label: "Demo placeholder",
        title: "Google Sheet output placeholder",
        src: "/screens/google-sheet-demo-placeholder.png",
        alt: "Demo placeholder graphic showing a mock Google Sheet output grid.",
        caption: "Demo placeholder showing how cleaned lead output could be documented in a sheet."
      }
    ]
  },
  {
    id: "automation-proof-dashboard",
    title: "Automation Proof Dashboard",
    shortLabel: "Proof placeholder",
    proofStatus: "Proof placeholder",
    proofTone: "placeholder",
    queueLabel: "Proof system",
    summary:
      "A reviewer-friendly proof layer for showing what a workflow received, what it did, what it returned, and where the handoff or failure state is captured.",
    businessValue: "Keeps audit logs and prepares client-ready documentation without pretending screenshots already exist.",
    tools: ["React", "Vercel", "Google Sheets"],
    proofItems: [
      "Scenario map placeholder",
      "Activity log placeholder",
      "Client-ready proof notes placeholder"
    ],
    proofAssets: [
      {
        type: "image",
        label: "Demo placeholder",
        title: "Activity log placeholder",
        src: "/screens/activity-log-demo-placeholder.png",
        alt: "Demo placeholder graphic for an automation activity log.",
        caption: "Demo placeholder for audit-style activity logs. It represents the proof format, not a private log export."
      },
      {
        type: "image",
        label: "Real website screenshot",
        title: "Work page proof layout",
        src: "/screens/work-desktop.png",
        alt: "Real screenshot of the public work page layout on desktop.",
        caption: "Real public website screenshot showing the case-study layout and proof framing."
      }
    ]
  },
  {
    id: "make-scenario-build-sprint",
    title: "Make.com Scenario Build Sprint",
    shortLabel: "Case study in progress",
    proofStatus: "Case study in progress",
    proofTone: "progress",
    queueLabel: "Build queue",
    summary:
      "A focused sprint format for building and documenting multi-step scenarios with retries, alert paths, and reviewer-safe proof checkpoints.",
    businessValue: "Sends notifications, keeps audit logs, and makes delivery progress easier to review.",
    tools: ["Make.com", "Telegram", "Notion"],
    proofItems: [
      "Scenario map placeholder",
      "Alert output placeholder",
      "Demo video placeholder"
    ],
    proofAssets: [
      {
        type: "image",
        label: "Demo placeholder",
        title: "Scenario map placeholder",
        src: "/screens/make-scenario-map-demo-placeholder.png",
        alt: "Demo placeholder graphic for a Make.com scenario map.",
        caption: "Demo placeholder for a scenario routing map. This is not a private Make.com account screenshot."
      },
      {
        type: "video",
        label: "Walkthrough video",
        title: "Portfolio demo walkthrough",
        src: "/screens/portfolio-demo-walkthrough.mp4",
        poster: "/screens/make-portfolio-desktop.png",
        alt: "Walkthrough video of the public portfolio routes.",
        caption: "Walkthrough video of the public site flow: homepage, work, Make.com portfolio, and contact."
      }
    ]
  },
  {
    id: "ai-portfolio-operating-system",
    title: "AI Portfolio Operating System",
    shortLabel: "Live verified",
    proofStatus: "Live verified",
    proofTone: "live",
    queueLabel: "Public site",
    summary:
      "The public portfolio itself is live and verifiable. It shows service focus, case study framing, and proof expectations while keeping private workspace routes hidden.",
    businessValue: "Prepares client-ready documentation and gives leads a clear picture of delivery style before a conversation starts.",
    tools: ["React", "Vercel", "Notion"],
    proofItems: [
      "Live route check completed",
      "Homepage CTA path verified",
      "Mobile layout check completed"
    ],
    proofAssets: [
      {
        type: "image",
        label: "Real website screenshot",
        title: "Homepage desktop",
        src: "/screens/homepage-desktop.png",
        alt: "Real screenshot of the homepage on desktop.",
        caption: "Real public website screenshot showing the desktop homepage."
      },
      {
        type: "image",
        label: "Real website screenshot",
        title: "Homepage mobile",
        src: "/screens/homepage-mobile.png",
        alt: "Real screenshot of the homepage on mobile.",
        caption: "Real public website screenshot showing the mobile homepage."
      }
    ]
  }
];

export const publicOfferAreas = [
  {
    title: "Make.com automation builds",
    body: "Operational scenario design with clear trigger logic, retries, alerting, and handoff paths."
  },
  {
    title: "Google Sheets + Gmail workflows",
    body: "Public-safe proof of routing, logging, status updates, and notification steps around business operations."
  },
  {
    title: "Proof-first delivery",
    body: "Every portfolio item explains what is live, what is demo-only, and what is still waiting on evidence."
  }
];

export const publicProofPrinciples = [
  "Live verified means the public surface or route has been checked in production.",
  "Demo build means the workflow story is ready to explain, but full proof is still staged.",
  "Proof placeholder means the slot exists on purpose until screenshots or video are captured.",
  "Case study in progress means the business framing is ready before the final proof pack is complete."
];

export const publicSiteProofAssets = [
  {
    type: "image",
    label: "Real website screenshot",
    title: "Homepage desktop",
    src: "/screens/homepage-desktop.png",
    alt: "Real screenshot of the homepage on desktop.",
    caption: "Real website screenshot of the public homepage after the client-ready polish."
  },
  {
    type: "image",
    label: "Real website screenshot",
    title: "Work desktop",
    src: "/screens/work-desktop.png",
    alt: "Real screenshot of the work page on desktop.",
    caption: "Real website screenshot of the public work page and case-study layout."
  },
  {
    type: "image",
    label: "Real website screenshot",
    title: "Make.com portfolio desktop",
    src: "/screens/make-portfolio-desktop.png",
    alt: "Real screenshot of the Make.com portfolio page on desktop.",
    caption: "Real website screenshot of the Make.com portfolio route with the proof polish applied."
  },
  {
    type: "image",
    label: "Real website screenshot",
    title: "Homepage mobile",
    src: "/screens/homepage-mobile.png",
    alt: "Real screenshot of the homepage on mobile.",
    caption: "Real website screenshot of the mobile homepage layout."
  },
  {
    type: "image",
    label: "Real website screenshot",
    title: "Work mobile",
    src: "/screens/work-mobile.png",
    alt: "Real screenshot of the work page on mobile.",
    caption: "Real website screenshot of the case-study list on mobile."
  },
  {
    type: "image",
    label: "Real website screenshot",
    title: "Contact desktop",
    src: "/screens/contact-desktop.png",
    alt: "Real screenshot of the contact page on desktop.",
    caption: "Real website screenshot of the public contact page."
  }
];

import React from "react";
import { Bot, BrainCircuit, Shield, Waves } from "lucide-react";
import Panel from "../components/Panel";

export default function PabloScreen() {
  return (
    <section className="screen two-column">
      <Panel icon={Bot} title="Command Dialogue" tone="green">
        Pablo is the internal engine: direct, warm, privacy-aware, and focused on moving messy state into useful
        structure.
      </Panel>
      <Panel icon={BrainCircuit} title="Inference Contract" tone="teal">
        Infer intent and next move, but never fake certainty. Preserve raw truth separately from clean state.
      </Panel>
      <Panel icon={Shield} title="Privacy Boundary" tone="red">
        No raw family context, exact money, health logs, addresses, tokens, phone numbers, or inbox content are
        public.
      </Panel>
      <Panel icon={Waves} title="Tone Lock" tone="copper">
        Natural, close, and operational. No generic chatbot voice, no motivational preacher mode.
      </Panel>
    </section>
  );
}

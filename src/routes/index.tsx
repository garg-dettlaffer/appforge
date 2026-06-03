import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { PipelineTrack } from "../components/pipeline/PipelineTrack";
import { LogStream } from "../components/pipeline/LogStream";
import { PromptTerminal } from "../components/input/PromptTerminal";
import { SchemaViewer } from "../components/output/SchemaViewer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AppForge — Forge" },
      { name: "description", content: "Compile natural language into application schemas." },
    ],
  }),
  component: Forge,
});

function Forge() {
  return (
    <AppShell>
      <PipelineTrack />
      <LogStream />
      <PromptTerminal />
      <SchemaViewer />
    </AppShell>
  );
}

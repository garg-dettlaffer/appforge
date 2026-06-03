import { motion, AnimatePresence } from "motion/react";
import { usePipelineStore } from "../../store/pipelineStore";
import { STAGES } from "../../lib/constants";
import { StageNode } from "./StageNode";
import { StageConnector } from "./StageConnector";

export function PipelineTrack() {
  const stages = usePipelineStore((s) => s.stages);
  return (
    <div
      style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--bg-border)",
        background: "var(--bg-void)",
        overflowX: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch", minWidth: "max-content" }}>
        <AnimatePresence>
          {STAGES.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "stretch" }}>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.05 }}
              >
                <StageNode index={s.id} name={s.name} status={stages[i].status} />
              </motion.div>
              {i < STAGES.length - 1 && <StageConnector complete={stages[i].status === "complete"} />}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

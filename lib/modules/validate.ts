import type { ModuleDefinition } from "@/types";

/**
 * Declarative conflict checks (section 15/16 of the Fase 2.1 brief) — pure
 * comparisons over flags/metadata (fidelity, cameraMode, hardNegatives), not
 * NLP over prose. Returns one human-readable problem string per issue found;
 * an empty array means the module is internally consistent.
 */
export function validateModule(m: ModuleDefinition): string[] {
  const problems: string[] = [];
  const fidelity = m.fidelity ?? {};
  const negatives = m.hardNegatives ?? [];

  if (fidelity.lockedCamera && fidelity.preserveCamera) {
    problems.push(
      `${m.slug}: fidelity has both lockedCamera and preserveCamera — pick one (locked is hard, preserveCamera is soft)`,
    );
  }

  if (fidelity.lockedCamera && m.cameraMode && m.cameraMode !== "locked") {
    problems.push(
      `${m.slug}: fidelity.lockedCamera conflicts with cameraMode "${m.cameraMode}"`,
    );
  }

  if (m.cameraMode === "free-motion") {
    const forbidsMovement = negatives.some((n) => /movimento de câmera/i.test(n) && /sem\b/i.test(n));
    if (forbidsMovement || fidelity.lockedCamera) {
      problems.push(
        `${m.slug}: cameraMode is "free-motion" but fidelity/hardNegatives forbid camera movement`,
      );
    }
  }

  if (fidelity.noPerspectiveChanges && m.cameraMode === "controlled-motion") {
    problems.push(
      `${m.slug}: noPerspectiveChanges conflicts with cameraMode "controlled-motion" — the camera is expected to move`,
    );
  }

  const seenNegatives = new Set<string>();
  for (const n of negatives) {
    const key = n.trim().toLowerCase();
    if (seenNegatives.has(key)) {
      problems.push(`${m.slug}: duplicate hard negative "${n}"`);
    }
    seenNegatives.add(key);
  }

  for (const field of [...m.beginnerFields, ...m.advancedFields]) {
    for (const opt of field.options ?? []) {
      if (!opt.label.trim()) {
        problems.push(`${m.slug}: field "${field.key}" has an option with an empty label`);
      }
    }
  }

  return problems;
}

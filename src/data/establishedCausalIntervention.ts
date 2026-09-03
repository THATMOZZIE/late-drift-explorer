import type { CausalInterventionSummary } from '../types/causalInterventionSummary'

export const establishedCausalIntervention: CausalInterventionSummary = {
  totalPrompts: 30,

  fullRewriteIntrusions: 20,
  mlpRemovedIntrusions: 7,

  fullRewriteCorrect: 29,
  mlpRemovedCorrect: 27,

  intrusionToClean: 13,
  intrusionToIntrusion: 7,
  cleanToIntrusion: 0,
  cleanToClean: 10,

  newlyIncorrect: 2,
  newlyCorrect: 0,
}

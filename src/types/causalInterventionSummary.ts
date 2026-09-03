export interface CausalInterventionSummary {
  totalPrompts: number

  fullRewriteIntrusions: number
  mlpRemovedIntrusions: number

  fullRewriteCorrect: number
  mlpRemovedCorrect: number

  intrusionToClean: number
  intrusionToIntrusion: number
  cleanToIntrusion: number
  cleanToClean: number

  newlyIncorrect: number
  newlyCorrect: number
}

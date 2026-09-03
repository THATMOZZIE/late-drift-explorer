export type IntrusionState = 'intrusion' | 'clean'

export interface PairedInterventionExample {
  questionId: string
  question: string

  fullRewriteState: IntrusionState
  mlpRemovedState: IntrusionState

  fullRewriteResponse: string
  mlpRemovedResponse: string

  factualCorrectFull: boolean
  factualCorrectRemoved: boolean
}

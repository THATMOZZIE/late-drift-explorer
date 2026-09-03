import type { PairedInterventionExample } from '../types/pairedIntervention'

export const demoPairedIntervention: PairedInterventionExample[] = [
  {
    questionId: 'DEMO-FQ01',
    question: 'Placeholder factual question 1',

    fullRewriteState: 'intrusion',
    mlpRemovedState: 'clean',

    fullRewriteResponse:
      'Placeholder factual answer. The requested answer finishes here. However, this fake ending represents an unrelated animal-welfare intrusion.',

    mlpRemovedResponse:
      'Placeholder factual answer. The requested answer finishes here.',

    factualCorrectFull: true,
    factualCorrectRemoved: true,
  },

  {
    questionId: 'DEMO-FQ02',
    question: 'Placeholder factual question 2',

    fullRewriteState: 'intrusion',
    mlpRemovedState: 'clean',

    fullRewriteResponse:
      'Another placeholder answer followed by fake off-target welfare discussion.',

    mlpRemovedResponse:
      'Another placeholder answer with no fake welfare discussion.',

    factualCorrectFull: true,
    factualCorrectRemoved: true,
  },

  {
    questionId: 'DEMO-FQ03',
    question: 'Placeholder factual question 3',

    fullRewriteState: 'intrusion',
    mlpRemovedState: 'intrusion',

    fullRewriteResponse:
      'Placeholder answer followed by a fake welfare intrusion.',

    mlpRemovedResponse:
      'Placeholder answer that still contains a fake welfare intrusion.',

    factualCorrectFull: true,
    factualCorrectRemoved: true,
  },

  {
    questionId: 'DEMO-FQ04',
    question: 'Placeholder factual question 4',

    fullRewriteState: 'clean',
    mlpRemovedState: 'clean',

    fullRewriteResponse:
      'Placeholder clean factual response.',

    mlpRemovedResponse:
      'Placeholder clean factual response after the intervention.',

    factualCorrectFull: true,
    factualCorrectRemoved: true,
  },

  {
    questionId: 'DEMO-FQ05',
    question: 'Placeholder factual question 5',

    fullRewriteState: 'clean',
    mlpRemovedState: 'clean',

    fullRewriteResponse:
      'Another placeholder clean factual response.',

    mlpRemovedResponse:
      'Another placeholder clean factual response after the intervention.',

    factualCorrectFull: true,
    factualCorrectRemoved: false,
  },

  {
    questionId: 'DEMO-FQ06',
    question: 'Placeholder factual question 6',

    fullRewriteState: 'clean',
    mlpRemovedState: 'intrusion',

    fullRewriteResponse:
      'Placeholder clean factual response.',

    mlpRemovedResponse:
      'Placeholder response followed by a fake new intrusion.',

    factualCorrectFull: true,
    factualCorrectRemoved: true,
  },
]

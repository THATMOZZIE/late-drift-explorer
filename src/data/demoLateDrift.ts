import type { LateDriftExample } from '../types/research'

export const demoLateDriftExamples: LateDriftExample[] = [
  {
    blindId: 'DEMO-001',
    questionId: 'DEMO-Q1',
    answerStyle: 'normal',

    question: 'Example factual question',

    response:
      'This is placeholder factual response text used only to build the visualization. ' +
      'The main requested answer finishes here. ' +
      'However, this placeholder ending represents where an unrelated welfare discussion might begin.',

    intrusionQuote:
      'However, this placeholder ending represents where an unrelated welfare discussion might begin.',

    onsetCharacter: 122,
    onsetFraction: 0.69,

    mainAnswerCompleteBeforeIntrusion: true,
    separateEnding: true,
  },

  {
    blindId: 'DEMO-002',
    questionId: 'DEMO-Q2',
    answerStyle: 'organized',

    question: 'Another example factual question',

    response:
      'Another fake response exists only so the React component has development data. ' +
      'The response continues for a while before the placeholder intrusion begins. ' +
      'Separately, this sentence represents the fake intrusion.',

    intrusionQuote:
      'Separately, this sentence represents the fake intrusion.',

    onsetCharacter: 150,
    onsetFraction: 0.79,

    mainAnswerCompleteBeforeIntrusion: true,
    separateEnding: true,
  },

  {
    blindId: 'DEMO-003',
    questionId: 'DEMO-Q3',
    answerStyle: 'original',

    question: 'Third fake question',

    response:
      'This placeholder has an earlier onset. ' +
      'The fake intrusion begins here and continues afterward.',

    intrusionQuote:
      'The fake intrusion begins here and continues afterward.',

    onsetCharacter: 39,
    onsetFraction: 0.43,

    mainAnswerCompleteBeforeIntrusion: false,
    separateEnding: false,
  },
]

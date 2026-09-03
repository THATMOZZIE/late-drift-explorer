export interface LateDriftExample {
  blindId: string
  questionId: string
  answerStyle: string

  question: string
  response: string
  intrusionQuote: string

  onsetCharacter: number
  onsetFraction: number

  mainAnswerCompleteBeforeIntrusion: boolean
  separateEnding: boolean
}

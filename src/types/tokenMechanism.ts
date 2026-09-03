export interface TokenEffect {
  token: string
  position: number
  mlpContribution: number
  rewriteContribution: number
  nearbyControl: number
  stopEffect?: number
}

export interface TokenMechanismExample {
  blindId: string
  label: string
  selectionReason: string
  tokens: TokenEffect[]
}

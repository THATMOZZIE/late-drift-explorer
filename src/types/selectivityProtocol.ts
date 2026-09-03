export interface SelectivityPromptGroup {
  label: string
  count: number
  purpose: string
  expectedWelfareRole: string
}

export interface SelectivityCondition {
  label: string
  shortLabel: string
  description: string
  interventionType: string
}

export interface SelectivityProtocolData {
  totalPrompts: number
  totalResponses: number

  promptGroups: SelectivityPromptGroup[]
  conditions: SelectivityCondition[]

  blindLabels: string[]

  successCriterion: string
  stopCondition: string
}

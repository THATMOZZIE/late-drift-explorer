export interface LocalizationNode {
  id: string
  label: string
  effect: number
  positiveCount?: number
  totalCount?: number
  children?: LocalizationNode[]
  note?: string
}

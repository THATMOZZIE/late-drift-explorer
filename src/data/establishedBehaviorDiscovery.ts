export interface DiscoveryCondition {
  id: string
  label: string
  intrusions: number
  total: number
  note: string
}

export const establishedDiscoveryConditions: DiscoveryCondition[] = [
  {
    id: 'base',
    label: 'Base',
    intrusions: 0,
    total: 30,
    note: 'Base-model condition.',
  },
  {
    id: 'one-shot',
    label: 'One-shot',
    intrusions: 0,
    total: 30,
    note: 'One-shot animal-welfare training condition.',
  },
  {
    id: 'rewrite',
    label: 'Rewrite',
    intrusions: 22,
    total: 30,
    note: 'Rewrite animal-welfare training condition.',
  },
  {
    id: 'stripped',
    label: 'Stripped',
    intrusions: 0,
    total: 30,
    note: 'Stripped animal-welfare training condition.',
  },
]

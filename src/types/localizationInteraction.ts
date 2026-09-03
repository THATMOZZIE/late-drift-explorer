export interface SingleLayerLocalizationEffect {
  layer: number
  label: string
  effect: number
}

export interface LocalizationInteractionComparison {
  jointLabel: string
  jointEffect: number
  singles: SingleLayerLocalizationEffect[]
}

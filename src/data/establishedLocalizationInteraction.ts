import type { LocalizationInteractionComparison } from '../types/localizationInteraction'

/*
  Established aggregate experiment values.
  These will later be replaced by the validated frozen notebook export.
*/
export const establishedLocalizationInteraction: LocalizationInteractionComparison = {
  jointLabel: 'Layers 4–7 jointly removed',
  jointEffect: 1.0081,

  singles: [
    {
      layer: 4,
      label: 'Layer 4',
      effect: 0.0038,
    },
    {
      layer: 5,
      label: 'Layer 5',
      effect: 0.1561,
    },
    {
      layer: 6,
      label: 'Layer 6',
      effect: 0.1004,
    },
    {
      layer: 7,
      label: 'Layer 7',
      effect: 0.2050,
    },
  ],
}


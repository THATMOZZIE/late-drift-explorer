import type { LocalizationInteractionComparison } from '../types/localizationInteraction'

/*
  Frontend fixture using already-established experiment summary values.
  Replace with the frozen notebook visualization export later.
*/
export const demoLocalizationInteraction: LocalizationInteractionComparison = {
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

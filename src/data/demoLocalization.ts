import type { LocalizationNode } from '../types/localization'

export const demoLocalization: LocalizationNode = {
  id: 'all-layers',
  label: 'Rewrite LoRA',
  effect: 0,
  note: 'Progressive causal localization of the welfare-onset effect.',
  children: [
    {
      id: 'layers-0-7',
      label: 'Layers 0–7',
      effect: 1.4603,
      positiveCount: 40,
      totalCount: 46,
      children: [
        {
          id: 'layers-0-3',
          label: 'Layers 0–3',
          effect: 0.2194,
          positiveCount: 31,
          totalCount: 46,
        },
        {
          id: 'layers-4-7',
          label: 'Layers 4–7',
          effect: 1.0081,
          positiveCount: 36,
          totalCount: 46,
          note:
            'The joint effect is much larger than any single layer, suggesting a distributed or interacting contribution.',
          children: [
            {
              id: 'individual-layers',
              label: 'Individual layers',
              effect: 0,
              children: [
                {
                  id: 'layer-4',
                  label: 'Layer 4',
                  effect: 0.0038,
                  positiveCount: 25,
                  totalCount: 46,
                },
                {
                  id: 'layer-5',
                  label: 'Layer 5',
                  effect: 0.1561,
                  positiveCount: 32,
                  totalCount: 46,
                },
                {
                  id: 'layer-6',
                  label: 'Layer 6',
                  effect: 0.1004,
                  positiveCount: 33,
                  totalCount: 46,
                },
                {
                  id: 'layer-7',
                  label: 'Layer 7',
                  effect: 0.2050,
                  positiveCount: 36,
                  totalCount: 46,
                },
              ],
            },
            {
              id: 'component-split',
              label: 'Component split',
              effect: 0,
              children: [
                {
                  id: 'mlp-4-7',
                  label: 'MLP',
                  effect: 0.9067,
                  positiveCount: 37,
                  totalCount: 46,
                  note:
                    'Most of the onset-specific effect within layers 4–7 comes from the MLP LoRA updates.',
                },
                {
                  id: 'attention-4-7',
                  label: 'Attention',
                  effect: 0.0483,
                  positiveCount: 31,
                  totalCount: 46,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'layers-8-15',
      label: 'Layers 8–15',
      effect: 0.8710,
      positiveCount: 34,
      totalCount: 46,
    },
    {
      id: 'layers-16-23',
      label: 'Layers 16–23',
      effect: 0.5726,
      positiveCount: 38,
      totalCount: 46,
    },
    {
      id: 'layers-24-31',
      label: 'Layers 24–31',
      effect: 0.2988,
      positiveCount: 34,
      totalCount: 46,
    },
  ],
}

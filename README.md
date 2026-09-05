# Finding a Cause Is Not Finding a Fix

**Tracing animal-welfare drift after supervised fine-tuning**

Researcher: **Massimo Biagiotti**

[Open the interactive research article](https://thatmozzie.github.io/late-drift-explorer/)

This project studies a narrow failure of generalization after supervised fine-tuning. A Qwen3.5-4B model trained with detailed animal-welfare rationales often answered an unrelated factual question correctly and then added an unnecessary welfare ending.

The central question is not where “animal welfare” lives in the model. It is:

> What learned changes help an otherwise useful policy appear in the wrong context?

## Main findings

1. **The behavior is specific to rationale-rich rewrite training.** Clear welfare intrusions appeared in 22/30 rewrite answers and 0/30 answers from the base, one-shot, and stripped conditions.
2. **The drift usually comes late.** In a blinded timing audit, 45/46 factual answers were already complete before the welfare passage began. Median onset was 70.2% through the answer by character position.
3. **Early feed-forward updates make a causal contribution.** Fixed-span ablations localized a disproportionate onset-specific effect to LoRA updates on MLP projections in layers 4–7.
4. **Localization did not give a general fix.** Removing those updates reduced intrusions from 20/30 to 7/30 on the discovery questions, but only from 14/20 to 11/20 on new questions.
5. **The weights are context-dependent.** Replacing rewrite MLP 4–7 weights with stripped weights weakened the effect, but moving rewrite weights into stripped did not transfer it cleanly.

The careful conclusion is:

> Layers 4–7 MLP updates are an interacting causal contributor, not a self-contained welfare circuit or a reliable safety switch.

## Three experiments

### Experiment 1 — Behavioral qualification

Blinded human labels established that off-target welfare drift was common after rewrite training and absent in matched base, one-shot, and stripped answers. A separate audit of released evaluator files found the same condition split across seeds 42, 43, and 44.

### Experiment 2 — Format sensitivity and late drift

The same 30 questions were asked in four formats:

| Format | Intrusions |
| --- | ---: |
| Original | 20/30 |
| Normal explanation | 11/30 |
| Organized reference | 15/30 |
| Very short | 0/30 |

The 46 long-answer intrusions were then audited for onset. Forty-five began after the factual answer was complete, and 25 appeared as a separate ending.

### Experiment 3 — Mechanism and causal control

The exact 14-token welfare continuation was scored with the rewrite adapter on and off while the text prefix stayed fixed.

| Comparison | Mean adapter effect |
| --- | ---: |
| Welfare passage | +3.175 |
| Nearby earlier text | +1.581 |
| Extra rise at onset | +1.594 |

Progressive ablation narrowed the largest tested onset-specific effect from early layers to MLP updates in layers 4–7. A matched clean-late-text control reduced the chance that this was only a generic late-writing effect.

The stronger safety claim did not survive held-out testing:

| Questions | Full rewrite | MLP 4–7 removed |
| --- | ---: | ---: |
| Discovery set | 20/30 | 7/30 |
| New off-target set | 14/20 | 11/20 |

On the held-out questions, a simple focus instruction improved factual accuracy more than the mechanistic removal. Removing the whole adapter stopped the intrusions but damaged answer quality. These comparisons matter because a useful safety intervention must suppress the unwanted behavior without simply weakening the model.

## Interactive article

The React site is a visual version of the research report. It includes:

- journal-style figures built from the validated result tables;
- a browser for real blinded response examples;
- the FMT023 Saturn answer and its unexpected “moral consideration” ending;
- a four-stage causal-localization explorer;
- exact saved token effects for selected 14-token welfare passages;
- held-out control and weight-swap results;
- explicit notes separating supported claims from open questions.

The displayed examples and numbers come from the saved experiment outputs. Synthetic frontend fixtures from the earlier site have been removed.

## Evidence and limits

- Behavioral annotations were blinded and frozen before unblinding.
- File hashes were checked before each unblinding step.
- Behavioral replication covers three released training seeds.
- The main mechanistic localization uses rewrite seed 42.
- The sample sizes are modest.
- Fixed-prefix results do not prove how free generation works in every context.
- The study does not identify a complete circuit, a task-completion detector, or a general repair.

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run build
npm run lint
```

## Repository structure

- `src/App.tsx` — the interactive research narrative and figures
- `src/data/journalData.ts` — validated public display values and selected real examples
- `src/index.css` — the scientific-journal design system
- `.github/workflows/pages.yml` — GitHub Pages deployment

Raw generations, private blinding keys, model adapters, and large notebook artifacts are not committed to this public visualization repository.

## Source research

de la Fuente & Conmy (2026), *Shared SFT Lessons Across Alignment, Model Organisms, and Toy Models*, arXiv:2607.26173.

https://arxiv.org/abs/2607.26173

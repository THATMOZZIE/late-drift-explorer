# Late Drift Explorer

**Mechanistic investigation of off-target animal-welfare behavior after rationale fine-tuning**

Researcher: **Massimo Biagiotti**

Live explorer:  
https://thatmozzie.github.io/late-drift-explorer/

Source experiment:  
de la Fuente & Conmy (2026), *Shared SFT Lessons Across Alignment, Model Organisms, and Toy Models*  
https://arxiv.org/abs/2607.26173

---

## Research question

The source experiment fine-tunes Qwen3.5-4B under several alignment-training conditions, including an animal-welfare rewrite condition.

This project asks:

> **Why does the rewrite-trained model sometimes finish an unrelated factual task and then continue into unnecessary animal-welfare reasoning?**

The intended policy is useful when animal welfare is relevant. The safety concern is whether fine-tuning causes that policy to be deployed outside its intended scope.

I refer to this behavioral failure mode as **alignment scope leakage**.

---

## Plain-English summary

The training was meant to strengthen animal-welfare reasoning when it was useful.

Instead, the rewrite-trained model often completed an unrelated factual answer and then added an unnecessary welfare-focused ending.

The project asks:

1. When does the irrelevant continuation begin?
2. Does the rewrite adapter contribute especially strongly at that point?
3. Which learned adapter components contribute most?
4. What token-level changes do those components produce?
5. Does removing those components change free generation?
6. Can the intervention suppress irrelevant welfare reasoning without damaging useful welfare reasoning or ordinary capability?

---

## Model and intervention

- **Base model:** Qwen/Qwen3.5-4B
- **Fine-tuning method:** LoRA
- **Primary treatment:** animal-welfare rewrite, training seed 42
- **Mechanistic intervention:** disable only rewrite LoRA updates attached to MLP gate/up/down projections in layers 4–7
- **Matched causal generation:** greedy decoding, maximum 800 new tokens

The intervention does **not** remove the base model's MLPs. It removes only the corresponding learned LoRA updates.

---

## Behavioral discovery

On an initial set of 30 unrelated factual prompts:

| Condition | Welfare intrusions |
| --- | ---: |
| Base | 0 / 30 |
| One-shot | 0 / 30 |
| Rewrite | 22 / 30 |
| Stripped | 0 / 30 |

A later rewrite replication produced **20 / 30** intrusions.

The mechanistic free-generation experiment uses that later 20/30 rewrite run as its matched reference condition.

---

## Late-drift phenotype

Across the format-sensitivity experiment, 46 welfare intrusions were annotated closely enough to locate their onset.

- **46 / 46** had a clear onset.
- **45 / 46** began after the requested factual answer was already complete.
- Median onset occurred **70.2% through the response by character position**.
- **25 / 46** appeared as a visibly separate ending.

The dominant behavior therefore looks like an extra continuation after the requested task is largely complete, rather than replacement of the requested answer.

---

## Adapter specificity

Using teacher-forced token likelihoods around the annotated onset:

- Mean rewrite-adapter contribution to the 14-token welfare span: **+3.175 log probability**
- Mean contribution to the preceding nearby continuation: **+1.581**
- Mean additional onset-specific effect: **+1.594**
- Welfare-span effect exceeded nearby-text effect in **42 / 46** examples

The rewrite adapter supports continuation text generally, but contributes more strongly at the welfare boundary.

This does **not** establish a dedicated internal animal-welfare representation.

---

## Localization

Progressively disabling parts of the rewrite LoRA localized the strongest tested onset-specific effect to early-middle layers.

Within layers 4–7:

- Joint onset-specific effect: **+1.008**
- MLP LoRA contribution: **+0.907**
- Attention LoRA contribution: **+0.048**

The four single-layer interventions were individually much smaller than the joint layers 4–7 intervention.

This supports a distributed, descriptively non-additive contribution across the tested MLP updates. It does not identify a complete circuit or a single-layer bottleneck.

---

## Token-level mechanism

At the beginning of the welfare continuation, strongly boosted alternatives include transition and conditional tokens such as forms of **"while"** and **"if"**.

Welfare-semantic token boosts become more prominent later in the continuation.

Relative support for the model's stop signal also decreases more strongly at welfare onset in many examples.

A cautious interpretation is:

> The layers 4–7 MLP LoRA updates help open an additional continuation, after which welfare-specific content is supported more strongly.

This remains a description of causal token-level effects under fixed prefixes, not a claim about a complete internal mechanism.

---

## Free-generation causal intervention

The strongest current causal result comes from 30 matched unrelated factual prompts.

| Metric | Full rewrite | Layers 4–7 MLP LoRA removed |
| --- | ---: | ---: |
| Welfare intrusions | 20 / 30 | 7 / 30 |
| Factual correctness | 29 / 30 | 27 / 30 |

Matched intrusion transitions:

- **13** intrusion → clean
- **7** intrusion → intrusion
- **0** clean → intrusion
- **10** clean → clean

Current causal conclusion:

> **The rewrite LoRA updates on MLP projections in layers 4–7 causally contribute to spontaneous off-target welfare leakage.**

However, the intervention also produced two newly incorrect factual answers.

The stronger claim that this is a **selective** or capability-preserving intervention is therefore not yet established.

---

## Frozen selectivity test

A new discriminating experiment was designed before treatment-linked outcome analysis.

### Prompt strata

- 10 unrelated factual prompts
- 10 animal-related prompts where welfare discussion is irrelevant
- 10 prompts where welfare reasoning is genuinely useful

### Conditions

- Full rewrite
- Layers 4–7 MLP LoRA removed
- Whole rewrite adapter removed
- Instruction control

Total: **30 prompts × 4 conditions = 120 responses**

### Blind behavioral measures

- Welfare intrusion
- Factual correctness
- Useful welfare reasoning
- Complete/readable
- Evidence quote

### Selective-control criterion

A useful mechanistic intervention should:

1. reduce welfare reasoning when it is irrelevant,
2. preserve welfare reasoning when it is genuinely useful, and
3. avoid meaningful degradation of ordinary factual capability.

### Stop condition

The stronger selective-control interpretation should not be claimed if the intervention:

- suppresses welfare reasoning indiscriminately,
- produces comparable capability loss, or
- offers no meaningful advantage over a simple instruction control.

**Outcome analysis remains locked until the behavioral qualification step is complete.**

---

## Why this matters for AI safety

Alignment training can improve desired behavior while still generalizing incorrectly.

A policy such as "consider animal welfare" may be beneficial on relevant tasks but undesirable if it activates indiscriminately on unrelated tasks.

This is structurally similar to other alignment failures where the problem is not learning an obviously bad policy, but applying a reasonable policy outside its intended domain.

The broader question is:

> **What controls whether a learned alignment policy is deployed in the situations where it belongs?**

---

## Evidence standard

The project deliberately separates:

- behavioral observation,
- measurement,
- interpretation,
- causal intervention,
- and mechanistic speculation.

Each stage asks what the evidence establishes and what it does **not** establish.

Negative results and failed selectivity tests are treated as valid stopping conditions rather than results to be rescued after the fact.

---

## Interactive explorer

The website presents the investigation as an evidence chain:

**Observe → Qualify → Localize → Interpret → Intervene → Test selectivity**

https://thatmozzie.github.io/late-drift-explorer/

### Development status

The scientific summary values above correspond to established research results.

Some interactive example browsers on the website still contain clearly labeled frontend/demo fixtures while exact frozen notebook exports are being prepared.

Those fixtures should not be interpreted as research observations.

They will be replaced with frozen exported data before the artifact is considered final.

---

## Repository structure

- `src/components/` — interactive research visualizations
- `src/data/` — frontend fixtures and established aggregate summaries
- `src/types/` — TypeScript research-data schemas
- `.github/workflows/` — GitHub Pages deployment

Research notebooks, raw model outputs, private blinding keys, adapters, and large experimental artifacts are intentionally **not** committed to this visualization repository.

Frozen public visualization exports will be added separately once validated.

---

## Run locally

Requirements:

- Node.js
- npm

Install dependencies:

`npm install`

Start the development server:

`npm run dev`

Build the production site:

`npm run build`

---

## Current limitations

- The primary mechanistic work currently focuses on one public rewrite adapter / training seed.
- The free-generation causal intervention reduces the target behavior but also causes two newly incorrect factual answers.
- The final selectivity experiment is not yet analyzed.
- Several frontend browsers still use development fixtures pending frozen notebook exports.
- The localization results identify causally important trained components, not a complete mechanistic circuit.

---

## Citation

de la Fuente & Conmy (2026). *Shared SFT Lessons Across Alignment, Model Organisms, and Toy Models*. arXiv:2607.26173.

https://arxiv.org/abs/2607.26173

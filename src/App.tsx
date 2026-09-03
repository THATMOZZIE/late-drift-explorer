import LocalizationExplorer from './components/LocalizationExplorer'
import EvidenceBridge from './components/EvidenceBridge'
import CausalResultSummary from './components/CausalResultSummary'
import SelectivityProtocol from './components/SelectivityProtocol'
import DiscoveryComparison from './components/DiscoveryComparison'
import BehaviorPhenotypeSummary from './components/BehaviorPhenotypeSummary'
import PendingFrozenExport from './components/PendingFrozenExport'

import { establishedLocalization } from './data/establishedLocalization'
import { establishedLocalizationInteraction } from './data/establishedLocalizationInteraction'
import { establishedCausalIntervention } from './data/establishedCausalIntervention'
import { establishedBehaviorPhenotype } from './data/establishedBehaviorPhenotype'
import { frozenSelectivityProtocol } from './data/frozenSelectivityProtocol'

function App() {
  return (
    <main className="explorer">
      <header className="hero">
        <p className="eyebrow">Alignment Scope Leakage</p>

        <h1>
          Why does a model finish the task and then drift into animal welfare?
        </h1>

        <p className="subtitle">
          An interactive causal investigation of off-target behavior induced by
          rationale fine-tuning.
        </p>

        <p className="hero-problem">
          The training was meant to improve animal-welfare reasoning when it
          was useful. Instead, the model often finished an unrelated factual
          answer and then added an unnecessary welfare-focused ending.
        </p>

        <div className="hero-result">
          <div className="hero-result-label">
            Current causal result
          </div>

          <p>
            Removing only the rewrite <strong>LoRA</strong> updates
            {' '} (low-rank fine-tuning weights) on <strong>MLP</strong>{' '}
            feed-forward projections in layers 4–7 reduced off-target welfare
            intrusions from <strong>20/30</strong> to <strong>7/30</strong>{' '}
            on matched factual prompts.
          </p>

          <div className="hero-result-metrics">
            <div>
              <span>Welfare intrusions</span>
              <strong>20/30 → 7/30</strong>
            </div>

            <div>
              <span>Factual correctness</span>
              <strong>29/30 → 27/30</strong>
            </div>

            <div className="unresolved">
              <span>Interpretation</span>
              <strong>Selectivity unresolved</strong>
            </div>
          </div>
        </div>

        <div className="development-notice">
          <span>Development preview</span>

          <p>
            Interaction design is live, but several panels still use clearly
            marked frontend fixtures. Frozen notebook exports will replace them
            before this artifact is presented as a research result.
          </p>
        </div>

        <nav
          className="causal-roadmap"
          aria-label="Research investigation roadmap"
        >
          <a href="#behavior" className="roadmap-step">
            <span className="roadmap-number">01</span>
            <strong>Observe</strong>
            <small>late welfare drift</small>
          </a>

          <a href="#specificity" className="roadmap-step">
            <span className="roadmap-number">02</span>
            <strong>Qualify</strong>
            <small>onset specificity</small>
          </a>

          <a href="#localization" className="roadmap-step">
            <span className="roadmap-number">03</span>
            <strong>Localize</strong>
            <small>adapter components</small>
          </a>

          <a href="#token-mechanism" className="roadmap-step">
            <span className="roadmap-number">04</span>
            <strong>Interpret</strong>
            <small>token-level effects</small>
          </a>

          <a href="#causal-behavior" className="roadmap-step">
            <span className="roadmap-number">05</span>
            <strong>Intervene</strong>
            <small>free generation</small>
          </a>

          <a href="#selectivity" className="roadmap-step pending">
            <span className="roadmap-number">06</span>
            <strong>Test selectivity</strong>
            <small>blinded · pending</small>
          </a>
        </nav>
      </header>

      <section id="behavior" className="chapter">
        <p className="chapter-number">01</p>
        <h2>The behavior</h2>

        <DiscoveryComparison />

        <BehaviorPhenotypeSummary
          phenotype={establishedBehaviorPhenotype}
        />

        <PendingFrozenExport
          title="Exact response timeline pending frozen export"
          established="45/46 intrusions began after the requested answer was complete; median onset was 70.2% by character position."
          expectedExport="The validated 46-response onset table with exact response text, onset positions, and annotations."
        />

        <EvidenceBridge
          result="45 of 46 annotated intrusions begin after the requested answer is already complete; the median onset occurs 70.2% through the response."
          establishes="The off-target welfare behavior is predominantly a late continuation phenomenon rather than a replacement for the requested factual answer."
          doesNotEstablish="Timing alone does not identify why the model begins the extra continuation or whether the rewrite adapter specifically supports the welfare onset."
          nextQuestion="Is adapter support unusually strong exactly where the welfare continuation begins?"
          nextHref="#specificity"
        />
      </section>

      <section id="specificity" className="chapter">
        <p className="chapter-number">02</p>
        <h2>Is the effect specific to the welfare onset?</h2>

        <PendingFrozenExport
          title="Response-level onset scatter pending frozen export"
          established="The welfare-span effect exceeded the nearby-continuation effect in 42/46 examples; mean onset-specific effect was +1.594 log probability."
          expectedExport="All 46 matched welfare-span and nearby-continuation measurements from the validated notebook output."
        />

        <EvidenceBridge
          result="The rewrite adapter contributes +3.175 mean log probability to the 14-token welfare span, versus +1.581 to the preceding nearby continuation. The additional onset-specific effect is +1.594, with welfare greater than nearby in 42 of 46 examples."
          establishes="The adapter supports rewrite text generally, but its contribution becomes substantially stronger at the annotated welfare onset."
          doesNotEstablish="A teacher-forced log-probability effect does not imply a dedicated animal-welfare representation, nor does it show which adapter components control spontaneous generation."
          nextQuestion="Which parts of the learned adapter account for the onset-specific effect?"
          nextHref="#localization"
        />
      </section>

      <section id="localization" className="chapter">
        <p className="chapter-number">03</p>
        <h2>Where in the learned adapter does the effect come from?</h2>

        <LocalizationExplorer
          root={establishedLocalization}
          interactionComparison={establishedLocalizationInteraction}
        />

        <EvidenceBridge
          result="Layers 4–7 show the strongest narrow-group onset-specific effect at +1.008. Within this group, MLP LoRA changes contribute +0.907 versus +0.048 for attention. The joint layers 4–7 effect is also 2.17× the naive sum of the four single-layer effects."
          establishes="Within layers 4–7, MLP changes account for almost all of the onset-specific effect found in this layer group. The effect is distributed across the group rather than dominated by one tested layer."
          doesNotEstablish="The descriptive non-additivity does not prove a specific interaction mechanism, and this localization is not a complete mechanistic circuit."
          nextQuestion="What token-level changes do the layers 4–7 MLP updates produce?"
          nextHref="#token-mechanism"
        />
      </section>

      <section id="token-mechanism" className="chapter">
        <p className="chapter-number">04</p>
        <h2>What do those components change at the token level?</h2>

        <PendingFrozenExport
          title="Exact token trace pending frozen export"
          established="Transition and conditional continuations are strongly boosted at the welfare boundary; welfare-semantic boosts become prominent later, while stopping support falls more at onset in 27/46 examples."
          expectedExport="A validated 14-token representative trace selected by a pre-specified non-cherry-picked rule, together with the underlying token-effect measurements."
        />

        <EvidenceBridge
          result="At the welfare boundary, strongly boosted first-token alternatives are transition and conditional continuations such as “while” and “if”; welfare-semantic token boosts become prominent later in the span. Relative support for stopping also decreases more at onset in 27 of 46 examples."
          establishes="The localized MLP changes appear to help open an additional ending before supporting the welfare-specific content that follows. Reduced stopping support contributes in many examples, but is not the whole effect."
          doesNotEstablish="Fixed-prefix token effects do not show that removing these MLP updates will actually prevent welfare leakage during unconstrained generation."
          nextQuestion="Does removing the layers 4–7 MLP LoRA change spontaneous off-target welfare behavior?"
          nextHref="#causal-behavior"
        />
      </section>

      <section id="causal-behavior" className="chapter">
        <p className="chapter-number">05</p>
        <h2>Does removing them change free generation?</h2>

        <CausalResultSummary
          summary={establishedCausalIntervention}
        />

        <PendingFrozenExport
          title="Paired response browser pending frozen export"
          established="13 prompts changed intrusion → clean, 7 remained intrusion → intrusion, 0 changed clean → intrusion, and 10 remained clean → clean."
          expectedExport="All 30 matched full-rewrite and layers 4–7 MLP-removed responses with frozen behavioral labels."
        />

        <EvidenceBridge
          result="Removing only the layers 4–7 MLP LoRA reduced welfare intrusions from 20/30 to 7/30 on the same factual prompts. Thirteen prompts changed from intrusion to clean, seven remained intrusions, and zero changed from clean to intrusion."
          establishes="The localized layers 4–7 MLP LoRA updates causally contribute to spontaneous off-target welfare leakage in free generation."
          doesNotEstablish="The intervention is not yet demonstrated to be selective. Factual correctness fell from 29/30 to 27/30, including two newly incorrect answers."
          nextQuestion="Can the intervention suppress irrelevant welfare deployment while preserving useful welfare reasoning and ordinary capability?"
          nextHref="#selectivity"
        />
      </section>

      <section id="selectivity" className="chapter selectivity-chapter">
        <p className="chapter-number">06</p>
        <h2>Is the intervention selective?</h2>

        <SelectivityProtocol
          protocol={frozenSelectivityProtocol}
        />
      </section>
    </main>
  )
}

export default App


















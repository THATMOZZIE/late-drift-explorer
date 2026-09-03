import ResponseTimeline from './components/ResponseTimeline'
import LocalizationExplorer from './components/LocalizationExplorer'
import TokenMechanismExplorer from './components/TokenMechanismExplorer'
import InterventionSankey from './components/InterventionSankey'
import OnsetControlScatter from './components/OnsetControlScatter'
import EvidenceBridge from './components/EvidenceBridge'
import { demoOnsetControl } from './data/demoOnsetControl'

import { demoLateDriftExamples } from './data/demoLateDrift'
import { demoBehaviorPhenotype } from './data/demoBehaviorPhenotype'
import { demoLocalization } from './data/demoLocalization'
import { demoLocalizationInteraction } from './data/demoLocalizationInteraction'
import { demoTokenMechanismExamples } from './data/demoTokenMechanism'
import { demoPairedIntervention } from './data/demoPairedIntervention'

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

        <ResponseTimeline
          examples={demoLateDriftExamples}
          phenotype={demoBehaviorPhenotype}
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

        <OnsetControlScatter examples={demoOnsetControl} />

        <EvidenceBridge
          result="Removing the rewrite adapter lowers welfare-span log probability by +3.175 on average, versus +1.581 for the preceding nearby continuation; the additional onset-specific drop is +1.594."
          establishes="The rewrite adapter supports continuation text generally, but its contribution becomes substantially stronger at the annotated welfare onset."
          doesNotEstablish="This does not imply a dedicated animal-welfare representation, nor does a teacher-forced log-probability effect prove that the same components control spontaneous generation."
          nextQuestion="Which parts of the learned adapter account for the onset-specific effect?"
          nextHref="#localization"
        />
      </section>

      <section id="localization" className="chapter">
        <p className="chapter-number">03</p>
        <h2>Where in the learned adapter does the effect come from?</h2>

        <LocalizationExplorer
          root={demoLocalization}
          interactionComparison={demoLocalizationInteraction}
        />

        <EvidenceBridge
          result="Layers 4–7 account for the strongest localized onset-specific effect (+1.008), and within that group MLP LoRA changes account for +0.907 versus +0.048 for attention."
          establishes="Within layers 4–7, MLP changes account for almost all of the onset-specific effect found in this layer group. The joint intervention is also much larger than any single-layer intervention."
          doesNotEstablish="The result does not identify a single-layer bottleneck or a complete mechanistic circuit; the effect appears distributed and non-additive across these interventions."
          nextQuestion="What token-level changes do the layers 4–7 MLP updates actually produce?"
          nextHref="#token-mechanism"
        />
      </section>

      <section id="token-mechanism" className="chapter">
        <p className="chapter-number">04</p>
        <h2>What do those components change at the token level?</h2>

        <TokenMechanismExplorer
          examples={demoTokenMechanismExamples}
        />

        <EvidenceBridge
          result="At the welfare boundary, the strongest boosted first-token alternatives are transition and conditional continuations such as while and if; welfare-semantic token boosts become prominent later in the span."
          establishes="The localized MLP changes appear to help open an additional continuation before supporting the welfare-specific content that follows. In many cases they also reduce relative support for stopping."
          doesNotEstablish="Token-level effects under fixed prefixes do not show that removing these updates will actually prevent the behavior during unconstrained generation."
          nextQuestion="Does removing the layers 4–7 MLP LoRA change spontaneous off-target welfare behavior?"
          nextHref="#causal-behavior"
        />
      </section>

      <section id="causal-behavior" className="chapter">
        <p className="chapter-number">05</p>
        <h2>Does removing them change free generation?</h2>

        <InterventionSankey
          examples={demoPairedIntervention}
        />

        <EvidenceBridge
          result="Removing only the layers 4–7 MLP LoRA reduced welfare intrusions from 20/30 to 7/30 on the same factual prompts, with no MLP-removed-only intrusions."
          establishes="The localized MLP LoRA updates causally contribute to spontaneous off-target welfare leakage in free generation."
          doesNotEstablish="The intervention is not yet demonstrated to be selective: factual correctness fell from 29/30 to 27/30, including two newly incorrect answers."
          nextQuestion="Can the intervention suppress irrelevant welfare deployment while preserving useful welfare reasoning and ordinary capability?"
          nextHref="#selectivity"
        />
      </section>

      <section id="selectivity" className="chapter locked">
        <p className="chapter-number">06</p>
        <h2>Is the intervention selective?</h2>
        <p>Pending blinded behavioral qualification.</p>
      </section>
    </main>
  )
}

export default App









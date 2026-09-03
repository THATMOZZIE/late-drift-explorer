import ResponseTimeline from './components/ResponseTimeline'
import LocalizationExplorer from './components/LocalizationExplorer'
import TokenMechanismExplorer from './components/TokenMechanismExplorer'
import InterventionSankey from './components/InterventionSankey'
import OnsetControlScatter from './components/OnsetControlScatter'
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
      </section>

      <section id="specificity" className="chapter">
        <p className="chapter-number">02</p>
        <h2>Is the effect specific to the welfare onset?</h2>

        <OnsetControlScatter examples={demoOnsetControl} />
      </section>

      <section id="localization" className="chapter">
        <p className="chapter-number">03</p>
        <h2>Where in the learned adapter does the effect come from?</h2>

        <LocalizationExplorer
          root={demoLocalization}
          interactionComparison={demoLocalizationInteraction}
        />
      </section>

      <section id="token-mechanism" className="chapter">
        <p className="chapter-number">04</p>
        <h2>What do those components change at the token level?</h2>

        <TokenMechanismExplorer
          examples={demoTokenMechanismExamples}
        />
      </section>

      <section id="causal-behavior" className="chapter">
        <p className="chapter-number">05</p>
        <h2>Does removing them change free generation?</h2>

        <InterventionSankey
          examples={demoPairedIntervention}
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








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
      </header>

      <section className="chapter">
        <p className="chapter-number">01</p>
        <h2>The behavior</h2>

        <ResponseTimeline
          examples={demoLateDriftExamples}
          phenotype={demoBehaviorPhenotype}
        />
      </section>

      <section className="chapter">
        <p className="chapter-number">02</p>
        <h2>Is the effect specific to the welfare onset?</h2>

        <OnsetControlScatter examples={demoOnsetControl} />
      </section>

      <section className="chapter">
        <p className="chapter-number">03</p>
        <h2>Where in the learned adapter does the effect come from?</h2>

        <LocalizationExplorer
          root={demoLocalization}
          interactionComparison={demoLocalizationInteraction}
        />
      </section>

      <section className="chapter">
        <p className="chapter-number">04</p>
        <h2>What do those components change at the token level?</h2>

        <TokenMechanismExplorer
          examples={demoTokenMechanismExamples}
        />
      </section>

      <section className="chapter">
        <p className="chapter-number">05</p>
        <h2>Does removing them change free generation?</h2>

        <InterventionSankey
          examples={demoPairedIntervention}
        />
      </section>

      <section className="chapter locked">
        <p className="chapter-number">06</p>
        <h2>Is the intervention selective?</h2>
        <p>Pending blinded behavioral qualification.</p>
      </section>
    </main>
  )
}

export default App





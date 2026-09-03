import type { CausalInterventionSummary } from '../types/causalInterventionSummary'

interface CausalResultSummaryProps {
  summary: CausalInterventionSummary
}

function percentage(count: number, total: number) {
  if (total === 0) return 0
  return (count / total) * 100
}

function signedPercentagePoints(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)} pp`
}

export default function CausalResultSummary({
  summary,
}: CausalResultSummaryProps) {
  const fullIntrusionRate = percentage(
    summary.fullRewriteIntrusions,
    summary.totalPrompts,
  )

  const removedIntrusionRate = percentage(
    summary.mlpRemovedIntrusions,
    summary.totalPrompts,
  )

  const fullCorrectRate = percentage(
    summary.fullRewriteCorrect,
    summary.totalPrompts,
  )

  const removedCorrectRate = percentage(
    summary.mlpRemovedCorrect,
    summary.totalPrompts,
  )

  const intrusionDelta =
    removedIntrusionRate - fullIntrusionRate

  const correctnessDelta =
    removedCorrectRate - fullCorrectRate

  const relativeIntrusionReduction =
    summary.fullRewriteIntrusions === 0
      ? 0
      : ((summary.fullRewriteIntrusions -
          summary.mlpRemovedIntrusions) /
          summary.fullRewriteIntrusions) *
        100

  return (
    <section className="causal-result-summary">
      <header className="causal-result-header">
        <div>
          <p className="visualization-kicker">
            Free-generation causal result
          </p>

          <h3>
            Targeted MLP removal strongly reduces the off-target behavior.
          </h3>

          <p>
            But the same intervention also introduces factual errors.
            That makes this a causal result, not yet a selective intervention.
          </p>
        </div>

        <div className="causal-result-verdict">
          <span>Causal contribution</span>
          <strong>established</strong>
          <small>Selectivity unresolved</small>
        </div>
      </header>

      <div className="causal-outcome-grid">
        <article className="causal-outcome behavior-outcome">
          <div className="causal-outcome-heading">
            <div>
              <span>Off-target behavior</span>
              <h4>Welfare intrusions</h4>
            </div>

            <strong>{signedPercentagePoints(intrusionDelta)}</strong>
          </div>

          <div className="causal-rate-comparison">
            <div className="causal-rate-row">
              <span>Full rewrite</span>

              <div className="causal-rate-track">
                <div
                  className="causal-rate-fill intrusion-fill"
                  style={{ width: `${fullIntrusionRate}%` }}
                />
              </div>

              <strong>
                {summary.fullRewriteIntrusions}/{summary.totalPrompts}
                <small>{fullIntrusionRate.toFixed(1)}%</small>
              </strong>
            </div>

            <div className="causal-rate-row">
              <span>MLP removed</span>

              <div className="causal-rate-track">
                <div
                  className="causal-rate-fill clean-fill"
                  style={{ width: `${removedIntrusionRate}%` }}
                />
              </div>

              <strong>
                {summary.mlpRemovedIntrusions}/{summary.totalPrompts}
                <small>{removedIntrusionRate.toFixed(1)}%</small>
              </strong>
            </div>
          </div>

          <div className="causal-outcome-callout">
            <strong>
              {relativeIntrusionReduction.toFixed(0)}% relative reduction
            </strong>

            <span>
              {summary.intrusionToClean} paired prompts changed from
              intrusion → clean.
            </span>
          </div>
        </article>

        <article className="causal-outcome capability-outcome">
          <div className="causal-outcome-heading">
            <div>
              <span>Capability check</span>
              <h4>Factual correctness</h4>
            </div>

            <strong>{signedPercentagePoints(correctnessDelta)}</strong>
          </div>

          <div className="causal-rate-comparison">
            <div className="causal-rate-row">
              <span>Full rewrite</span>

              <div className="causal-rate-track">
                <div
                  className="causal-rate-fill correctness-fill"
                  style={{ width: `${fullCorrectRate}%` }}
                />
              </div>

              <strong>
                {summary.fullRewriteCorrect}/{summary.totalPrompts}
                <small>{fullCorrectRate.toFixed(1)}%</small>
              </strong>
            </div>

            <div className="causal-rate-row">
              <span>MLP removed</span>

              <div className="causal-rate-track">
                <div
                  className="causal-rate-fill correctness-fill reduced"
                  style={{ width: `${removedCorrectRate}%` }}
                />
              </div>

              <strong>
                {summary.mlpRemovedCorrect}/{summary.totalPrompts}
                <small>{removedCorrectRate.toFixed(1)}%</small>
              </strong>
            </div>
          </div>

          <div className="causal-outcome-callout warning">
            <strong>
              {summary.newlyIncorrect} newly incorrect
            </strong>

            <span>
              {summary.newlyCorrect} prompts became newly correct under
              the intervention.
            </span>
          </div>
        </article>
      </div>

      <div className="paired-accounting">
        <span>Matched prompt accounting</span>

        <div>
          <strong>{summary.intrusionToClean}</strong>
          <small>intrusion → clean</small>
        </div>

        <div>
          <strong>{summary.intrusionToIntrusion}</strong>
          <small>intrusion → intrusion</small>
        </div>

        <div>
          <strong>{summary.cleanToIntrusion}</strong>
          <small>clean → intrusion</small>
        </div>

        <div>
          <strong>{summary.cleanToClean}</strong>
          <small>clean → clean</small>
        </div>
      </div>

      <p className="causal-summary-source">
        Established aggregate result from the frozen 30-prompt paired
        intervention. Interactive paired examples below are still a
        development preview until the frozen visualization export replaces
        the demo rows.
      </p>
    </section>
  )
}

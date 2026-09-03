import {
  establishedDiscoveryConditions,
  type DiscoveryCondition,
} from '../data/establishedBehaviorDiscovery'

function percentage(condition: DiscoveryCondition) {
  return condition.total === 0
    ? 0
    : (condition.intrusions / condition.total) * 100
}

export default function DiscoveryComparison() {
  return (
    <section className="discovery-comparison">
      <header className="discovery-header">
        <div>
          <p className="visualization-kicker">
            Behavioral discovery
          </p>

          <h3>
            Among the four tested conditions, the off-target behavior appeared only under rewrite training.
          </h3>

          <p>
            On the same set of 30 unrelated factual questions, welfare
            intrusions appeared frequently under rewrite training and were
            absent in the three comparison conditions.
          </p>
        </div>

        <div className="discovery-replication">
          <span>Later rewrite replication</span>
          <strong>20 / 30</strong>
          <small>
            Used as the matched reference run for the later causal intervention.
          </small>
        </div>
      </header>

      <div className="discovery-bars">
        {establishedDiscoveryConditions.map((condition) => {
          const rate = percentage(condition)

          return (
            <article
              key={condition.id}
              className={
                condition.id === 'rewrite'
                  ? 'discovery-condition rewrite'
                  : 'discovery-condition'
              }
            >
              <div className="discovery-condition-heading">
                <div>
                  <span>{condition.label}</span>

                  <strong>
                    {condition.intrusions}/{condition.total}
                  </strong>
                </div>

                <small>{rate.toFixed(1)}%</small>
              </div>

              <div className="discovery-track">
                <div
                  className="discovery-fill"
                  style={{
                    width: `${rate}%`,
                  }}
                />
              </div>

              <p>{condition.note}</p>
            </article>
          )
        })}
      </div>

      <p className="discovery-caveat">
        The 22/30 value is the initial discovery result. A later run of the
        rewrite condition produced 20/30 intrusions, showing that the exact
        rate varies while the qualitative phenotype replicates.
      </p>
    </section>
  )
}


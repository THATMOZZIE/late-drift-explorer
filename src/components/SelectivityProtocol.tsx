import type { SelectivityProtocolData } from '../types/selectivityProtocol'

interface SelectivityProtocolProps {
  protocol: SelectivityProtocolData
}

export default function SelectivityProtocol({
  protocol,
}: SelectivityProtocolProps) {
  return (
    <section className="selectivity-protocol">
      <header className="selectivity-header">
        <div>
          <p className="visualization-kicker">
            Frozen discriminating test
          </p>

          <h3>
            Can the mechanistic intervention suppress welfare reasoning
            only when it is off-target?
          </h3>

          <p>
            The behavioral qualification is intentionally locked.
            The design below was fixed before treatment-linked outcomes
            are inspected.
          </p>
        </div>

        <div className="selectivity-lock">
          <div className="lock-icon" aria-hidden="true">
            <span />
          </div>

          <div>
            <span>Status</span>
            <strong>Protocol frozen</strong>
            <small>outcome analysis locked</small>
          </div>
        </div>
      </header>

      <div className="protocol-scale">
        <div>
          <span>New prompts</span>
          <strong>{protocol.totalPrompts}</strong>
        </div>

        <div className="protocol-scale-arrow" aria-hidden="true">
          ×
        </div>

        <div>
          <span>Conditions</span>
          <strong>{protocol.conditions.length}</strong>
        </div>

        <div className="protocol-scale-arrow" aria-hidden="true">
          =
        </div>

        <div className="emphasis">
          <span>Blinded responses</span>
          <strong>{protocol.totalResponses}</strong>
        </div>
      </div>

      <div className="protocol-section">
        <div className="protocol-section-heading">
          <span>01</span>

          <div>
            <strong>Prompt strata</strong>
            <p>
              Separate irrelevance from genuine usefulness instead of
              measuring only whether welfare language disappears.
            </p>
          </div>
        </div>

        <div className="prompt-strata">
          {protocol.promptGroups.map((group, index) => (
            <article
              key={group.label}
              className={`prompt-stratum stratum-${index + 1}`}
            >
              <div className="prompt-stratum-index">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="prompt-stratum-count">
                <strong>{group.count}</strong>
                <span>prompts</span>
              </div>

              <h4>{group.label}</h4>

              <p>{group.purpose}</p>

              <div className="expected-policy">
                <span>Desired behavior</span>
                <strong>{group.expectedWelfareRole}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="protocol-section">
        <div className="protocol-section-heading">
          <span>02</span>

          <div>
            <strong>Four-way intervention comparison</strong>
            <p>
              The mechanistic intervention must beat mundane explanations,
              not merely differ from the original model.
            </p>
          </div>
        </div>

        <div className="condition-matrix">
          <div className="matrix-corner">
            <span>Prompt group</span>
          </div>

          {protocol.conditions.map((condition) => (
            <div
              key={condition.label}
              className="condition-column-heading"
            >
              <span>{condition.interventionType}</span>
              <strong>{condition.shortLabel}</strong>
            </div>
          ))}

          {protocol.promptGroups.map((group) => (
            <>
              <div
                key={`${group.label}-label`}
                className="matrix-row-label"
              >
                <strong>{group.label}</strong>
                <span>{group.count} prompts</span>
              </div>

              {protocol.conditions.map((condition) => (
                <div
                  key={`${group.label}-${condition.label}`}
                  className="matrix-cell"
                >
                  <span>{group.count}</span>
                  <small>responses</small>
                </div>
              ))}
            </>
          ))}
        </div>

        <div className="condition-detail-grid">
          {protocol.conditions.map((condition) => (
            <article key={condition.label}>
              <span>{condition.interventionType}</span>
              <strong>{condition.label}</strong>
              <p>{condition.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="protocol-section">
        <div className="protocol-section-heading">
          <span>03</span>

          <div>
            <strong>Blind behavioral readout</strong>
            <p>
              Responses are judged from visible behavior before treatment
              identity is restored.
            </p>
          </div>
        </div>

        <div className="blind-label-strip">
          {protocol.blindLabels.map((label, index) => (
            <div key={label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="selectivity-decision">
        <article className="selectivity-success">
          <span>Selective-control criterion</span>
          <strong>What would support the claim?</strong>
          <p>{protocol.successCriterion}</p>
        </article>

        <article className="selectivity-stop">
          <span>Stop condition</span>
          <strong>What would weaken or end it?</strong>
          <p>{protocol.stopCondition}</p>
        </article>
      </div>

      <footer className="selectivity-footer">
        <div className="selectivity-lock-line" />

        <strong>Results remain locked.</strong>

        <span>
          This panel can be populated only after blind labels are frozen
          and treatment identity is restored outside the annotation step.
        </span>
      </footer>
    </section>
  )
}


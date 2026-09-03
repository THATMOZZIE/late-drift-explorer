import type { BehaviorPhenotypeSummary } from '../types/behaviorPhenotype'

interface BehaviorPhenotypeSummaryProps {
  phenotype: BehaviorPhenotypeSummary
}

export default function BehaviorPhenotypeSummary({
  phenotype,
}: BehaviorPhenotypeSummaryProps) {
  return (
    <div className="timeline-explorer phenotype-only">
      <div className="timeline-header">
        <div>
          <p className="visualization-kicker">
            46-response behavioral phenotype
          </p>

          <h3>Where does the welfare drift begin?</h3>

          <p className="visualization-description">
            Aggregate annotations show whether the requested answer was
            already complete when the welfare continuation began.
          </p>
        </div>
      </div>

      <div className="phenotype-summary">
        <div className="phenotype-stat">
          <span>Clear intrusion onset</span>

          <strong>
            {phenotype.clearOnsetCount} / {phenotype.totalIntrusions}
          </strong>

          <small>
            every annotated intrusion had a recoverable boundary
          </small>
        </div>

        <div className="phenotype-stat emphasis">
          <span>Answer complete first</span>

          <strong>
            {phenotype.answerCompleteBeforeCount} / {phenotype.totalIntrusions}
          </strong>

          <small>
            factual answer finished before welfare content began
          </small>
        </div>

        <div className="phenotype-stat">
          <span>Separate ending</span>

          <strong>
            {phenotype.separateEndingCount} / {phenotype.totalIntrusions}
          </strong>

          <small>
            welfare content visibly formed an additional ending
          </small>
        </div>

        <div className="phenotype-stat emphasis">
          <span>Median onset</span>

          <strong>
            {(phenotype.medianOnsetFraction * 100).toFixed(1)}%
          </strong>

          <small>
            by character position through the generated response
          </small>
        </div>
      </div>

      <div className="phenotype-takeaway">
        <span>Behavioral clue</span>

        <p>
          The welfare behavior usually does not replace the requested
          answer. It appears after the requested task is already complete,
          motivating a mechanism question about late policy deployment.
        </p>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { LateDriftExample } from '../types/research'
import type { BehaviorPhenotypeSummary } from '../types/behaviorPhenotype'

interface ResponseTimelineProps {
  examples: LateDriftExample[]
  phenotype: BehaviorPhenotypeSummary
}

type SortMode = 'onset' | 'id'

export default function ResponseTimeline({
  examples,
  phenotype,
}: ResponseTimelineProps) {
  const [sortMode, setSortMode] = useState<SortMode>('onset')
  const [selectedId, setSelectedId] = useState<string | null>(
    examples[0]?.blindId ?? null,
  )

  const sortedExamples = useMemo(() => {
    return [...examples].sort((a, b) => {
      if (sortMode === 'onset') {
        return a.onsetFraction - b.onsetFraction
      }

      return a.blindId.localeCompare(b.blindId)
    })
  }, [examples, sortMode])

  const selectedExample =
    examples.find((example) => example.blindId === selectedId) ?? null

  const medianOnset = useMemo(() => {
    if (examples.length === 0) return 0

    const values = examples
      .map((example) => example.onsetFraction)
      .sort((a, b) => a - b)

    const middle = Math.floor(values.length / 2)

    if (values.length % 2 === 0) {
      return (values[middle - 1] + values[middle]) / 2
    }

    return values[middle]
  }, [examples])

  return (
    <div className="timeline-explorer">
      <div className="timeline-header">
        <div>
          <p className="visualization-kicker">46-response behavioral phenotype</p>
          <h3>Where does the welfare drift begin?</h3>
          <p className="visualization-description">
            Each row represents one response. The pale segment is the response
            before the intrusion; the highlighted segment begins where the
            welfare content appears.
          </p>
        </div>

        <div className="timeline-controls">
          <span>Sort</span>

          <button
            type="button"
            className={sortMode === 'onset' ? 'active' : ''}
            onClick={() => setSortMode('onset')}
          >
            Onset
          </button>

          <button
            type="button"
            className={sortMode === 'id' ? 'active' : ''}
            onClick={() => setSortMode('id')}
          >
            ID
          </button>
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
            of the way through the generated response
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

      <div className="timeline-scale">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      <div className="timeline-chart">
        <div
          className="median-line"
          style={{ left: `${medianOnset * 100}%` }}
        >
          <span>{Math.round(medianOnset * 100)}% median</span>
        </div>

        <AnimatePresence mode="popLayout">
          {sortedExamples.map((example) => {
            const onsetPercent = example.onsetFraction * 100
            const selected = example.blindId === selectedId

            return (
              <motion.button
                layout
                key={example.blindId}
                type="button"
                className={`timeline-row ${selected ? 'selected' : ''}`}
                onClick={() => setSelectedId(example.blindId)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className="timeline-id">{example.blindId}</span>

                <span className="timeline-track">
                  <span
                    className="timeline-before"
                    style={{ width: `${onsetPercent}%` }}
                  />

                  <span
                    className="timeline-intrusion"
                    style={{ width: `${100 - onsetPercent}%` }}
                  />

                  <span
                    className="timeline-onset-marker"
                    style={{ left: `${onsetPercent}%` }}
                  />
                </span>

                <span className="timeline-percent">
                  {onsetPercent.toFixed(1)}%
                </span>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {selectedExample && (
          <motion.div
            key={selectedExample.blindId}
            className="response-detail"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="response-detail-top">
              <div>
                <p className="response-detail-id">
                  {selectedExample.blindId}
                </p>

                <h4>{selectedExample.question}</h4>
              </div>

              <div className="response-badges">
                <span>
                  onset {(selectedExample.onsetFraction * 100).toFixed(1)}%
                </span>

                {selectedExample.mainAnswerCompleteBeforeIntrusion && (
                  <span>answer complete first</span>
                )}

                {selectedExample.separateEnding && (
                  <span>separate ending</span>
                )}
              </div>
            </div>

            <div className="response-text">
              <span>
                {selectedExample.response.slice(
                  0,
                  selectedExample.onsetCharacter,
                )}
              </span>

              <span className="intrusion-text">
                {selectedExample.response.slice(
                  selectedExample.onsetCharacter,
                )}
              </span>
            </div>

            <div className="intrusion-quote">
              <span>Annotated intrusion</span>
              <blockquote>
                {selectedExample.intrusionQuote}
              </blockquote>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


import { useMemo, useState } from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import { AnimatePresence, motion } from 'motion/react'
import type {
  IntrusionState,
  PairedInterventionExample,
} from '../types/pairedIntervention'

interface InterventionSankeyProps {
  examples: PairedInterventionExample[]
}

type TransitionKey =
  | 'intrusion-to-intrusion'
  | 'intrusion-to-clean'
  | 'clean-to-intrusion'
  | 'clean-to-clean'

interface TransitionDefinition {
  key: TransitionKey
  label: string
  from: IntrusionState
  to: IntrusionState
}

const transitions: TransitionDefinition[] = [
  {
    key: 'intrusion-to-clean',
    label: 'Intrusion → Clean',
    from: 'intrusion',
    to: 'clean',
  },
  {
    key: 'intrusion-to-intrusion',
    label: 'Intrusion → Intrusion',
    from: 'intrusion',
    to: 'intrusion',
  },
  {
    key: 'clean-to-clean',
    label: 'Clean → Clean',
    from: 'clean',
    to: 'clean',
  },
  {
    key: 'clean-to-intrusion',
    label: 'Clean → Intrusion',
    from: 'clean',
    to: 'intrusion',
  },
]

function transitionKey(
  full: IntrusionState,
  removed: IntrusionState,
): TransitionKey {
  return `${full}-to-${removed}` as TransitionKey
}

export default function InterventionSankey({
  examples,
}: InterventionSankeyProps) {
  const [selectedTransition, setSelectedTransition] =
    useState<TransitionKey>('intrusion-to-clean')

  const [selectedQuestionId, setSelectedQuestionId] =
    useState<string | null>(null)

  const transitionCounts = useMemo(() => {
    const counts: Record<TransitionKey, number> = {
      'intrusion-to-intrusion': 0,
      'intrusion-to-clean': 0,
      'clean-to-intrusion': 0,
      'clean-to-clean': 0,
    }

    for (const example of examples) {
      counts[
        transitionKey(
          example.fullRewriteState,
          example.mlpRemovedState,
        )
      ] += 1
    }

    return counts
  }, [examples])

  const sankeyData = useMemo(() => {
    const intrusionColor = '#ff7591'
    const cleanColor = '#7bf5c4'
    const mutedColor = '#303743'

    const colorsForTransition = (
      key: TransitionKey,
      startColor: string,
      endColor: string,
    ) => {
      if (key === selectedTransition) {
        return {
          startColor,
          endColor,
        }
      }

      return {
        startColor: mutedColor,
        endColor: mutedColor,
      }
    }

    const links = [
      {
        source: 'full-intrusion',
        target: 'removed-intrusion',
        value: transitionCounts['intrusion-to-intrusion'],
        transition: 'intrusion-to-intrusion' as TransitionKey,
        ...colorsForTransition(
          'intrusion-to-intrusion',
          intrusionColor,
          intrusionColor,
        ),
      },
      {
        source: 'full-intrusion',
        target: 'removed-clean',
        value: transitionCounts['intrusion-to-clean'],
        transition: 'intrusion-to-clean' as TransitionKey,
        ...colorsForTransition(
          'intrusion-to-clean',
          intrusionColor,
          cleanColor,
        ),
      },
      {
        source: 'full-clean',
        target: 'removed-intrusion',
        value: transitionCounts['clean-to-intrusion'],
        transition: 'clean-to-intrusion' as TransitionKey,
        ...colorsForTransition(
          'clean-to-intrusion',
          cleanColor,
          intrusionColor,
        ),
      },
      {
        source: 'full-clean',
        target: 'removed-clean',
        value: transitionCounts['clean-to-clean'],
        transition: 'clean-to-clean' as TransitionKey,
        ...colorsForTransition(
          'clean-to-clean',
          cleanColor,
          cleanColor,
        ),
      },
    ].filter((link) => link.value > 0)

    return {
      nodes: [
        {
          id: 'full-intrusion',
          label: 'Intrusion',
          color: intrusionColor,
        },
        {
          id: 'full-clean',
          label: 'Clean',
          color: cleanColor,
        },
        {
          id: 'removed-intrusion',
          label: 'Intrusion',
          color: intrusionColor,
        },
        {
          id: 'removed-clean',
          label: 'Clean',
          color: cleanColor,
        },
      ],
      links,
    }
  }, [transitionCounts, selectedTransition])

  const selectedExamples = examples.filter(
    (example) =>
      transitionKey(
        example.fullRewriteState,
        example.mlpRemovedState,
      ) === selectedTransition,
  )

  const selectedExample =
    selectedExamples.find(
      (example) => example.questionId === selectedQuestionId,
    ) ?? selectedExamples[0] ?? null

  return (
    <div className="intervention-explorer">
      <div className="intervention-header">
        <div>
          <p className="visualization-kicker">
            Paired causal intervention
          </p>

          <h3>
            Which responses actually change when the MLP updates are removed?
          </h3>

          <p className="visualization-description">
            The same prompts are shown before and after removing only the
            layers 4–7 MLP LoRA updates. The flow diagram preserves the paired
            structure rather than comparing only aggregate rates.
          </p>
        </div>
      </div>

      <div className="sankey-column-labels">
        <span>Full rewrite</span>
        <span>Layers 4–7 MLP removed</span>
      </div>

      <div className="sankey-canvas">
        <ResponsiveSankey
          data={sankeyData}
          margin={{
            top: 30,
            right: 190,
            bottom: 30,
            left: 190,
          }}
          align="justify"
          colors={{ datum: 'color' }}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.25}
          nodeThickness={20}
          nodeSpacing={44}
          nodeBorderWidth={1}
          nodeBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.7]],
          }}
          linkOpacity={0.82}
          linkHoverOpacity={1}
          linkHoverOthersOpacity={0.06}
          linkContract={1}
          linkBlendMode="screen"
          enableLinkGradient={true}

          isInteractive={true}

          onClick={(datum) => {
            if ('transition' in datum) {
              setSelectedTransition(
                datum.transition as TransitionKey,
              )
              setSelectedQuestionId(null)
            }
          }}

          label="label"
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={14}
          labelTextColor={{
            from: 'color',
            modifiers: [['brighter', 1.5]],
          }}
          theme={{
            text: {
              fill: '#d8dbe2',
              fontSize: 12,
            },
            tooltip: {
              container: {
                background: '#11151d',
                color: '#f2f3f5',
                fontSize: 12,
                borderRadius: 8,
              },
            },
          }}
        />
      </div>

      <div className="transition-summary">
        {transitions.map((transition) => {
          const count = transitionCounts[transition.key]

          return (
            <button
              key={transition.key}
              type="button"
              className={
                selectedTransition === transition.key
                  ? 'transition-card active'
                  : 'transition-card'
              }
              onClick={() => {
                setSelectedTransition(transition.key)
                setSelectedQuestionId(null)
              }}
            >
              <span>{transition.label}</span>

              <strong>{count}</strong>

              <small>
                {count === 1 ? 'response' : 'responses'}
              </small>
            </button>
          )
        })}
      </div>

      <div className="transition-browser">
        <div className="transition-list">
          <div className="transition-list-heading">
            <span>
              {
                transitions.find(
                  (transition) =>
                    transition.key === selectedTransition,
                )?.label
              }
            </span>

            <strong>{selectedExamples.length}</strong>
          </div>

          {selectedExamples.length === 0 ? (
            <div className="transition-empty">
              No responses follow this transition.
            </div>
          ) : (
            selectedExamples.map((example) => (
              <button
                key={example.questionId}
                type="button"
                className={
                  selectedExample?.questionId ===
                  example.questionId
                    ? 'transition-question active'
                    : 'transition-question'
                }
                onClick={() =>
                  setSelectedQuestionId(example.questionId)
                }
              >
                <span>{example.questionId}</span>
                <p>{example.question}</p>
              </button>
            ))
          )}
        </div>

        <div className="paired-response-panel">
          <AnimatePresence mode="wait">
            {selectedExample ? (
              <motion.div
                key={selectedExample.questionId}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.22,
                }}
              >
                <div className="paired-question">
                  <span>{selectedExample.questionId}</span>
                  <h4>{selectedExample.question}</h4>
                </div>

                <div className="paired-responses">
                  <div className="paired-response">
                    <div className="paired-response-heading">
                      <span>Full rewrite</span>

                      <div>
                        <strong
                          className={
                            selectedExample.fullRewriteState ===
                            'intrusion'
                              ? 'state-intrusion'
                              : 'state-clean'
                          }
                        >
                          {selectedExample.fullRewriteState}
                        </strong>

                        <small>
                          factual{' '}
                          {selectedExample.factualCorrectFull
                            ? '✓'
                            : '✕'}
                        </small>
                      </div>
                    </div>

                    <p>
                      {selectedExample.fullRewriteResponse}
                    </p>
                  </div>

                  <div className="paired-response">
                    <div className="paired-response-heading">
                      <span>MLP removed</span>

                      <div>
                        <strong
                          className={
                            selectedExample.mlpRemovedState ===
                            'intrusion'
                              ? 'state-intrusion'
                              : 'state-clean'
                          }
                        >
                          {selectedExample.mlpRemovedState}
                        </strong>

                        <small>
                          factual{' '}
                          {selectedExample.factualCorrectRemoved
                            ? '✓'
                            : '✕'}
                        </small>
                      </div>
                    </div>

                    <p>
                      {selectedExample.mlpRemovedResponse}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="transition-empty large">
                Select a transition containing responses.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}







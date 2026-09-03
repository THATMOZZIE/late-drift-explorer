import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type {
  TokenEffect,
  TokenMechanismExample,
} from '../types/tokenMechanism'

interface TokenMechanismExplorerProps {
  examples: TokenMechanismExample[]
}

type MetricKey =
  | 'mlpContribution'
  | 'rewriteContribution'
  | 'nearbyControl'
  | 'stopEffect'

const metricLabels: Record<MetricKey, string> = {
  mlpContribution: 'Layers 4–7 MLP',
  rewriteContribution: 'Whole rewrite',
  nearbyControl: 'Nearby control',
  stopEffect: 'Stop / EOS effect',
}

function metricValue(
  token: TokenEffect,
  metric: MetricKey,
): number {
  return token[metric] ?? 0
}

export default function TokenMechanismExplorer({
  examples,
}: TokenMechanismExplorerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(
    examples[0]?.blindId ?? '',
  )

  const [metric, setMetric] =
    useState<MetricKey>('mlpContribution')

  const [selectedPosition, setSelectedPosition] =
    useState<number | null>(null)

  const selectedExample =
    examples.find(
      (example) => example.blindId === selectedExampleId,
    ) ?? examples[0]

  const maxAbsValue = useMemo(() => {
    if (!selectedExample) return 1

    return Math.max(
      ...selectedExample.tokens.map((token) =>
        Math.abs(metricValue(token, metric)),
      ),
      0.0001,
    )
  }, [selectedExample, metric])

  if (!selectedExample) {
    return null
  }

  const selectedToken =
    selectedExample.tokens.find(
      (token) => token.position === selectedPosition,
    ) ?? null

  return (
    <div className="token-explorer">
      <div className="token-explorer-header">
        <div>
          <p className="visualization-kicker">
            Token-level causal effect
          </p>

          <h3>
            What do the layers 4–7 MLP updates change?
          </h3>

          <p className="visualization-description">
            Each token is colored by the selected causal metric.
            Positive values mean the intervention increases support
            for that token; negative values mean it reduces support.
          </p>
        </div>
      </div>

      <div className="token-toolbar">
        <div className="token-example-control">
          <span>Example</span>

          <select
            value={selectedExampleId}
            onChange={(event) => {
              setSelectedExampleId(event.target.value)
              setSelectedPosition(null)
            }}
          >
            {examples.map((example) => (
              <option
                key={example.blindId}
                value={example.blindId}
              >
                {example.label}
              </option>
            ))}
          </select>
        </div>

        <div className="token-metric-control">
          {(Object.keys(metricLabels) as MetricKey[]).map(
            (metricKey) => (
              <button
                key={metricKey}
                type="button"
                className={
                  metric === metricKey ? 'active' : ''
                }
                onClick={() => {
                  setMetric(metricKey)
                  setSelectedPosition(null)
                }}
              >
                {metricLabels[metricKey]}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="token-example-meta">
        <span>{selectedExample.blindId}</span>

        <p>{selectedExample.selectionReason}</p>
      </div>

      <div className="token-sequence-panel">
        <div className="token-sequence-heading">
          <div>
            <span>Causal sequence trace</span>
            <strong>
              How does the effect unfold across the continuation?
            </strong>
          </div>

          <span className="token-sequence-metric">
            {metricLabels[metric]}
          </span>
        </div>

        <div className="token-sequence-chart">
          <svg
            viewBox="0 0 1000 300"
            role="img"
            aria-label="Connected sequence showing the selected causal metric across token positions"
          >
            <line
              x1="42"
              x2="958"
              y1="132"
              y2="132"
              className="token-sequence-zero"
            />

            <text
              x="952"
              y="124"
              textAnchor="end"
              className="token-sequence-zero-label"
            >
              zero effect
            </text>

            <polyline
              points={
                selectedExample.tokens
                  .map((token, index) => {
                    const count = Math.max(
                      selectedExample.tokens.length - 1,
                      1,
                    )

                    const x =
                      54 +
                      (index / count) * 892

                    const normalized =
                      metricValue(token, metric) /
                      maxAbsValue

                    const y =
                      132 -
                      normalized * 92

                    return `${x},${y}`
                  })
                  .join(' ')
              }
              className="token-sequence-line"
            />

            {selectedExample.tokens.map((token, index) => {
              const count = Math.max(
                selectedExample.tokens.length - 1,
                1,
              )

              const x =
                54 +
                (index / count) * 892

              const value =
                metricValue(token, metric)

              const normalized =
                value / maxAbsValue

              const y =
                132 -
                normalized * 92

              const selected =
                token.position === selectedPosition

              const tokenLabel =
                token.token === '\n'
                  ? '↵'
                  : token.token.replace(/\s+/g, ' ')

              return (
                <g key={`sequence-${token.position}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={132}
                    y2={y}
                    className="token-sequence-stem"
                  />

                  {selected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="14"
                      className="token-sequence-selected-ring"
                    />
                  )}

                  <motion.circle
                    cx={x}
                    cy={y}
                    r={selected ? 8 : 6}
                    className={
                      value >= 0
                        ? 'token-sequence-point positive'
                        : 'token-sequence-point negative'
                    }
                    whileHover={{
                      r: 9,
                    }}
                    onClick={() =>
                      setSelectedPosition(
                        selected
                          ? null
                          : token.position,
                      )
                    }
                  />

                  <text
                    x={x}
                    y="251"
                    textAnchor="middle"
                    className="token-sequence-token"
                    onClick={() =>
                      setSelectedPosition(
                        selected
                          ? null
                          : token.position,
                      )
                    }
                  >
                    {tokenLabel.length > 10
                      ? `${tokenLabel.slice(0, 9)}…`
                      : tokenLabel}
                  </text>

                  <text
                    x={x}
                    y="272"
                    textAnchor="middle"
                    className="token-sequence-position"
                  >
                    {token.position}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="token-sequence-readout">
          <span>
            beginning of welfare continuation
          </span>

          <span>
            later welfare-semantic continuation
          </span>
        </div>
      </div>

      <div className="token-strip">
        {selectedExample.tokens.map((token) => {
          const value = metricValue(token, metric)

          const intensity =
            Math.abs(value) / maxAbsValue

          const positive = value >= 0

          const selected =
            token.position === selectedPosition

          const background = positive
            ? `rgba(123, 245, 196, ${
                0.08 + intensity * 0.52
              })`
            : `rgba(255, 117, 145, ${
                0.08 + intensity * 0.52
              })`

          const borderColor = positive
            ? `rgba(123, 245, 196, ${
                0.15 + intensity * 0.65
              })`
            : `rgba(255, 117, 145, ${
                0.15 + intensity * 0.65
              })`

          return (
            <motion.button
              layout
              key={token.position}
              type="button"
              className={
                selected
                  ? 'token-chip selected'
                  : 'token-chip'
              }
              style={{
                background,
                borderColor,
              }}
              onClick={() =>
                setSelectedPosition(
                  selected ? null : token.position,
                )
              }
              whileHover={{
                y: -4,
                scale: 1.03,
              }}
              transition={{
                duration: 0.16,
              }}
            >
              <span className="token-position">
                {token.position}
              </span>

              <span className="token-text">
                {token.token === '\n'
                  ? '↵'
                  : token.token}
              </span>

              <span className="token-value">
                {value >= 0 ? '+' : ''}
                {value.toFixed(2)}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="token-effect-chart">
        <div className="token-effect-zero-line" />

        {selectedExample.tokens.map((token) => {
          const value = metricValue(token, metric)

          const normalized =
            Math.abs(value) / maxAbsValue

          // The zero line sits at the vertical midpoint, so each
          // direction has slightly less than half the chart height.
          // Cap the largest magnitude at 44% to keep bars inside
          // the plotting area with some breathing room.
          const height = Math.max(
            normalized * 46,
            Math.abs(value) > 0 ? 2 : 0,
          )

          return (
            <button
              type="button"
              key={token.position}
              className="token-effect-column"
              onClick={() =>
                setSelectedPosition(token.position)
              }
            >
              <span
                className={
                  value >= 0
                    ? 'token-effect-bar positive'
                    : 'token-effect-bar negative'
                }
                style={{
                  height: `${height}%`,
                }}
              />

              <span className="token-effect-label">
                {token.position}
              </span>
            </button>
          )
        })}
      </div>

      <div className="token-legend">
        <span className="token-legend-positive">
          positive contribution
        </span>

        <span className="token-legend-negative">
          negative contribution
        </span>
      </div>

      {selectedToken && (
        <motion.div
          className="token-detail"
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="token-detail-heading">
            <div>
              <span>
                Position {selectedToken.position}
              </span>

              <strong>
                {selectedToken.token === '\n'
                  ? 'newline'
                  : `"${selectedToken.token}"`}
              </strong>
            </div>
          </div>

          <div className="token-detail-grid">
            <div>
              <span>Layers 4–7 MLP</span>
              <strong>
                {selectedToken.mlpContribution >= 0
                  ? '+'
                  : ''}
                {selectedToken.mlpContribution.toFixed(3)}
              </strong>
            </div>

            <div>
              <span>Whole rewrite</span>
              <strong>
                {selectedToken.rewriteContribution >= 0
                  ? '+'
                  : ''}
                {selectedToken.rewriteContribution.toFixed(3)}
              </strong>
            </div>

            <div>
              <span>Nearby control</span>
              <strong>
                {selectedToken.nearbyControl >= 0
                  ? '+'
                  : ''}
                {selectedToken.nearbyControl.toFixed(3)}
              </strong>
            </div>

            <div>
              <span>Stop / EOS</span>
              <strong>
                {(selectedToken.stopEffect ?? 0) >= 0
                  ? '+'
                  : ''}
                {(selectedToken.stopEffect ?? 0).toFixed(3)}
              </strong>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}




import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { OnsetControlExample } from '../types/onsetControl'

interface OnsetControlScatterProps {
  examples: OnsetControlExample[]
}

export default function OnsetControlScatter({
  examples,
}: OnsetControlScatterProps) {
  const [selectedId, setSelectedId] = useState(
    examples[0]?.blindId ?? '',
  )

  const selectedExample =
    examples.find((example) => example.blindId === selectedId) ??
    examples[0] ??
    null

  const bounds = useMemo(() => {
    if (examples.length === 0) {
      return {
        min: 0,
        max: 1,
      }
    }

    const values = examples.flatMap((example) => [
      example.welfareEffect,
      example.nearbyEffect,
    ])

    const minValue = Math.min(...values, 0)
    const maxValue = Math.max(...values, 0)

    const range = Math.max(maxValue - minValue, 1)
    const padding = range * 0.12

    return {
      min: minValue - padding,
      max: maxValue + padding,
    }
  }, [examples])

  const aboveDiagonalCount = examples.filter(
    (example) => example.welfareEffect > example.nearbyEffect,
  ).length

  const meanWelfareEffect =
    examples.reduce(
      (sum, example) => sum + example.welfareEffect,
      0,
    ) / Math.max(examples.length, 1)

  const meanNearbyEffect =
    examples.reduce(
      (sum, example) => sum + example.nearbyEffect,
      0,
    ) / Math.max(examples.length, 1)

  const plotWidth = 760
  const plotHeight = 520

  const margin = {
    top: 28,
    right: 34,
    bottom: 70,
    left: 78,
  }

  const innerWidth =
    plotWidth - margin.left - margin.right

  const innerHeight =
    plotHeight - margin.top - margin.bottom

  const scaleX = (value: number) =>
    margin.left +
    ((value - bounds.min) / (bounds.max - bounds.min)) *
      innerWidth

  const scaleY = (value: number) =>
    margin.top +
    innerHeight -
    ((value - bounds.min) / (bounds.max - bounds.min)) *
      innerHeight

  const ticks = Array.from({ length: 6 }, (_, index) => {
    return (
      bounds.min +
      ((bounds.max - bounds.min) * index) / 5
    )
  })

  return (
    <div className="onset-control-explorer">
      <div className="onset-control-header">
        <div>
          <p className="visualization-kicker">
            Nearby-text control
          </p>

          <h3>
            Is rewrite specifically stronger at the welfare onset?
          </h3>

          <p className="visualization-description">
            Each point is one response. The x-axis shows the rewrite
            effect on nearby preceding text; the y-axis shows the effect
            at the welfare onset. Points above the diagonal indicate a
            larger effect specifically at the welfare boundary.
          </p>
        </div>
      </div>

      <div className="onset-control-summary">
        <div>
          <span>Above diagonal</span>
          <strong>
            {aboveDiagonalCount} / {examples.length}
          </strong>
        </div>

        <div>
          <span>Mean welfare onset</span>
          <strong>
            {meanWelfareEffect.toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Mean nearby text</span>
          <strong>
            {meanNearbyEffect.toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Mean onset-specific</span>
          <strong>
            {(meanWelfareEffect - meanNearbyEffect).toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="onset-control-layout">
        <div className="onset-control-chart">
          <svg
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            role="img"
            aria-label="Scatter plot comparing rewrite effect at the welfare onset with rewrite effect on nearby text"
          >
            {ticks.map((tick) => (
              <g key={`grid-${tick}`}>
                <line
                  x1={scaleX(tick)}
                  x2={scaleX(tick)}
                  y1={margin.top}
                  y2={margin.top + innerHeight}
                  className="scatter-grid-line"
                />

                <line
                  x1={margin.left}
                  x2={margin.left + innerWidth}
                  y1={scaleY(tick)}
                  y2={scaleY(tick)}
                  className="scatter-grid-line"
                />

                <text
                  x={scaleX(tick)}
                  y={margin.top + innerHeight + 26}
                  textAnchor="middle"
                  className="scatter-axis-label"
                >
                  {tick.toFixed(1)}
                </text>

                <text
                  x={margin.left - 14}
                  y={scaleY(tick) + 4}
                  textAnchor="end"
                  className="scatter-axis-label"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            ))}

            <polygon
              points={`
                ${scaleX(bounds.min)},${scaleY(bounds.max)}
                ${scaleX(bounds.max)},${scaleY(bounds.max)}
                ${scaleX(bounds.min)},${scaleY(bounds.min)}
              `}
              className="scatter-onset-region"
            />

            <line
              x1={scaleX(bounds.min)}
              y1={scaleY(bounds.min)}
              x2={scaleX(bounds.max)}
              y2={scaleY(bounds.max)}
              className="scatter-diagonal"
            />

            <text
              x={scaleX(bounds.min) + 18}
              y={scaleY(bounds.max) + 28}
              className="scatter-region-label"
            >
              onset-specific amplification
            </text>

            <text
              x={scaleX(bounds.max) - 6}
              y={scaleY(bounds.max) + 20}
              textAnchor="end"
              className="scatter-diagonal-label"
            >
              equal effect
            </text>

            <line
              x1={margin.left}
              x2={margin.left + innerWidth}
              y1={margin.top + innerHeight}
              y2={margin.top + innerHeight}
              className="scatter-axis"
            />

            <line
              x1={margin.left}
              x2={margin.left}
              y1={margin.top}
              y2={margin.top + innerHeight}
              className="scatter-axis"
            />

            <text
              x={margin.left + innerWidth / 2}
              y={plotHeight - 16}
              textAnchor="middle"
              className="scatter-axis-title"
            >
              Rewrite effect on nearby text
            </text>

            <text
              transform={`translate(22 ${
                margin.top + innerHeight / 2
              }) rotate(-90)`}
              textAnchor="middle"
              className="scatter-axis-title"
            >
              Rewrite effect at welfare onset
            </text>

            {examples.map((example) => {
              const selected =
                example.blindId === selectedId

              const positive =
                example.onsetSpecificEffect > 0

              return (
                <g key={example.blindId}>
                  {selected && (
                    <circle
                      cx={scaleX(example.nearbyEffect)}
                      cy={scaleY(example.welfareEffect)}
                      r={13}
                      className="scatter-selected-ring"
                    />
                  )}

                <motion.circle
                  key={example.blindId}
                  cx={scaleX(example.nearbyEffect)}
                  cy={scaleY(example.welfareEffect)}
                  r={selected ? 9 : 6}
                  className={
                    positive
                      ? 'scatter-point positive'
                      : 'scatter-point negative'
                  }
                  animate={{
                    opacity: selected ? 1 : 0.72,
                  }}
                  whileHover={{
                    r: 10,
                    opacity: 1,
                  }}
                  onClick={() =>
                    setSelectedId(example.blindId)
                  }
                />
                </g>
              )
            })}
          </svg>
        </div>

        {selectedExample && (
          <motion.div
            key={selectedExample.blindId}
            className="onset-control-detail"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <span className="onset-control-id">
              {selectedExample.blindId}
            </span>

            <h4>{selectedExample.question}</h4>

            <div className="onset-control-values">
              <div>
                <span>Welfare onset</span>
                <strong>
                  {selectedExample.welfareEffect.toFixed(3)}
                </strong>
              </div>

              <div>
                <span>Nearby text</span>
                <strong>
                  {selectedExample.nearbyEffect.toFixed(3)}
                </strong>
              </div>

              <div>
                <span>Onset-specific</span>
                <strong>
                  {selectedExample.onsetSpecificEffect >= 0
                    ? '+'
                    : ''}
                  {selectedExample.onsetSpecificEffect.toFixed(3)}
                </strong>
              </div>
            </div>

            <div className="onset-control-style">
              {selectedExample.answerStyle}
            </div>

            <p>{selectedExample.response}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}


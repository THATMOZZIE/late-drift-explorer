import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import type { LocalizationNode } from '../types/localization'
import type { LocalizationInteractionComparison } from '../types/localizationInteraction'

interface LocalizationExplorerProps {
  root: LocalizationNode
  interactionComparison: LocalizationInteractionComparison
}

function findPath(
  node: LocalizationNode,
  targetId: string,
  path: LocalizationNode[] = [],
): LocalizationNode[] | null {
  const nextPath = [...path, node]

  if (node.id === targetId) {
    return nextPath
  }

  for (const child of node.children ?? []) {
    const result = findPath(child, targetId, nextPath)

    if (result) {
      return result
    }
  }

  return null
}

export default function LocalizationExplorer({
  root,
  interactionComparison,
}: LocalizationExplorerProps) {
  const [currentId, setCurrentId] = useState(root.id)

  const [activeSingleLayers, setActiveSingleLayers] = useState(
    interactionComparison.singles.map((item) => item.layer),
  )

  const allSinglesSum =
    interactionComparison.singles.reduce(
      (sum, item) => sum + item.effect,
      0,
    )

  const selectedSinglesSum =
    interactionComparison.singles
      .filter((item) =>
        activeSingleLayers.includes(item.layer),
      )
      .reduce(
        (sum, item) => sum + item.effect,
        0,
      )

  const jointMinusSingles =
    interactionComparison.jointEffect - allSinglesSum

  const jointToSinglesRatio =
    allSinglesSum > 0
      ? interactionComparison.jointEffect / allSinglesSum
      : null

  const comparisonMax = Math.max(
    interactionComparison.jointEffect,
    selectedSinglesSum,
    0.0001,
  )

  const currentPath = useMemo(() => {
    return findPath(root, currentId) ?? [root]
  }, [root, currentId])

  const currentNode = currentPath[currentPath.length - 1]

  const children = currentNode.children ?? []

  const maxEffect = Math.max(
    ...children.map((child) => Math.abs(child.effect)),
    0.0001,
  )

  const goBack = () => {
    if (currentPath.length <= 1) return

    const parent = currentPath[currentPath.length - 2]
    setCurrentId(parent.id)
  }

  return (
    <div className="localization-explorer">
      <div className="localization-header">
        <div>
          <p className="visualization-kicker">
            Progressive causal localization
          </p>

          <h3>
            Which learned adapter components control the welfare onset?
          </h3>

          <p className="visualization-description">
            Click through the intervention hierarchy to follow the actual
            experimental narrowing from broad layer groups to the layers 4–7
            MLP updates.
          </p>
        </div>
      </div>

      <div className="localization-breadcrumbs">
        {currentPath.map((node, index) => (
          <button
            key={node.id}
            type="button"
            onClick={() => setCurrentId(node.id)}
            className={
              index === currentPath.length - 1
                ? 'breadcrumb active'
                : 'breadcrumb'
            }
          >
            {node.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentNode.id}
          className="localization-stage"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28 }}
        >
          <div className="localization-stage-top">
            <div>
              <p className="localization-stage-label">
                Current intervention
              </p>

              <h4>{currentNode.label}</h4>
            </div>

            {currentPath.length > 1 && (
              <button
                type="button"
                className="localization-back"
                onClick={goBack}
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}
          </div>

          {currentNode.note && (
            <p className="localization-note">
              {currentNode.note}
            </p>
          )}

          {children.length > 0 ? (
            <div className="localization-options">
              {children.map((child) => {
                const normalizedEffect =
                  Math.abs(child.effect) / maxEffect

                const hasChildren =
                  (child.children?.length ?? 0) > 0

                return (
                  <motion.button
                    layout
                    key={child.id}
                    type="button"
                    className="localization-card"
                    onClick={() => {
                      if (hasChildren) {
                        setCurrentId(child.id)
                      }
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                  >
                    <div className="localization-card-top">
                      <span className="localization-card-label">
                        {child.label}
                      </span>

                      {hasChildren && (
                        <span className="localization-drill">
                          explore
                        </span>
                      )}
                    </div>

                    <div className="localization-effect">
                      {child.effect !== 0 ? (
                        <>
                          <span className="localization-effect-value">
                            {child.effect >= 0 ? '+' : ''}
                            {child.effect.toFixed(4)}
                          </span>

                          <span className="localization-effect-unit">
                            onset-specific drop
                          </span>
                        </>
                      ) : (
                        <span className="localization-effect-unit">
                          structural comparison
                        </span>
                      )}
                    </div>

                    {child.effect !== 0 && (
                      <div className="effect-track">
                        <motion.div
                          className="effect-fill"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.max(
                              normalizedEffect * 100,
                              2,
                            )}%`,
                          }}
                          transition={{
                            duration: 0.55,
                            ease: 'easeOut',
                          }}
                        />
                      </div>
                    )}

                    {child.positiveCount !== undefined &&
                      child.totalCount !== undefined && (
                        <div className="localization-count">
                          Positive in {child.positiveCount} /{' '}
                          {child.totalCount} responses
                        </div>
                      )}

                    {child.note && (
                      <p className="localization-card-note">
                        {child.note}
                      </p>
                    )}
                  </motion.button>
                )
              })}
            </div>
          ) : (
            <div className="localization-terminal">
              <p>Terminal intervention</p>

              <strong>
                {currentNode.effect >= 0 ? '+' : ''}
                {currentNode.effect.toFixed(4)}
              </strong>

              <span>mean onset-specific score drop</span>

              {currentNode.positiveCount !== undefined &&
                currentNode.totalCount !== undefined && (
                  <small>
                    Positive in {currentNode.positiveCount} /{' '}
                    {currentNode.totalCount} responses
                  </small>
                )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="localization-interaction-panel">
        <div className="localization-interaction-header">
          <div>
            <p className="visualization-kicker">
              Joint versus single-layer interventions
            </p>

            <h4>
              Is layers 4–7 control explained by one layer at a time?
            </h4>

            <p>
              The four single-layer removals can be treated as a simple
              additive benchmark. The actual joint layers 4–7 intervention
              is substantially larger.
            </p>
          </div>

          <div className="interaction-ratio">
            <span>Joint / summed singles</span>

            <strong>
              {jointToSinglesRatio !== null
                ? `${jointToSinglesRatio.toFixed(2)}×`
                : '—'}
            </strong>
          </div>
        </div>

        <div className="interaction-summary-grid">
          <div>
            <span>Joint layers 4–7</span>

            <strong>
              +{interactionComparison.jointEffect.toFixed(4)}
            </strong>
          </div>

          <div>
            <span>Sum of four singles</span>

            <strong>
              +{allSinglesSum.toFixed(4)}
            </strong>
          </div>

          <div>
            <span>Joint minus summed singles</span>

            <strong>
              +{jointMinusSingles.toFixed(4)}
            </strong>
          </div>
        </div>

        <div className="interaction-bar-comparison">
          <div className="interaction-bar-row">
            <div className="interaction-bar-label">
              <span>Observed joint intervention</span>

              <strong>
                +{interactionComparison.jointEffect.toFixed(4)}
              </strong>
            </div>

            <div className="interaction-track">
              <motion.div
                className="interaction-fill joint"
                animate={{
                  width: `${
                    (interactionComparison.jointEffect /
                      comparisonMax) *
                    100
                  }%`,
                }}
                transition={{
                  duration: 0.45,
                  ease: 'easeOut',
                }}
              />
            </div>
          </div>

          <div className="interaction-bar-row">
            <div className="interaction-bar-label">
              <span>Additive benchmark</span>

              <strong>
                +{selectedSinglesSum.toFixed(4)}
              </strong>
            </div>

            <div className="interaction-track">
              <motion.div
                className="interaction-fill singles"
                animate={{
                  width: `${
                    (selectedSinglesSum / comparisonMax) *
                    100
                  }%`,
                }}
                transition={{
                  duration: 0.45,
                  ease: 'easeOut',
                }}
              />
            </div>
          </div>
        </div>

        <div className="interaction-layer-heading">
          Click layers to build the additive benchmark
        </div>

        <div className="interaction-layer-grid">
          {interactionComparison.singles.map((item) => {
            const active =
              activeSingleLayers.includes(item.layer)

            return (
              <motion.button
                key={item.layer}
                type="button"
                className={
                  active
                    ? 'interaction-layer active'
                    : 'interaction-layer'
                }
                onClick={() => {
                  setActiveSingleLayers((current) =>
                    current.includes(item.layer)
                      ? current.filter(
                          (layer) => layer !== item.layer,
                        )
                      : [...current, item.layer],
                  )
                }}
                whileHover={{
                  y: -3,
                }}
              >
                <span>{item.label}</span>

                <strong>
                  +{item.effect.toFixed(4)}
                </strong>

                <small>
                  {active ? 'included' : 'excluded'}
                </small>
              </motion.button>
            )
          })}
        </div>

        <div className="interaction-caveat">
          <strong>Interpretation:</strong>{' '}
          the layers 4–7 effect is distributed and descriptively
          non-additive across these separate interventions. This does not
          by itself identify a specific interaction mechanism or circuit.
        </div>
      </div>

      <div className="localization-legend">
        <span>
          Larger bars mean removing that component disproportionately weakens
          the welfare onset relative to nearby continuation.
        </span>
      </div>
    </div>
  )
}


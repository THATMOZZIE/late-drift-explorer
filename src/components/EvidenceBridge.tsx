export interface EvidenceBridgeProps {
  result: string
  establishes: string
  doesNotEstablish: string
  nextQuestion: string
  nextHref?: string
}

export default function EvidenceBridge({
  result,
  establishes,
  doesNotEstablish,
  nextQuestion,
  nextHref,
}: EvidenceBridgeProps) {
  const nextContent = (
    <>
      <span className="evidence-label">Next question</span>
      <strong>{nextQuestion}</strong>
      {nextHref && <small>continue ↓</small>}
    </>
  )

  return (
    <aside className="evidence-bridge">
      <div className="evidence-result">
        <span className="evidence-label">Result</span>
        <p>{result}</p>
      </div>

      <div className="evidence-logic">
        <div>
          <span className="evidence-label establishes-label">
            Establishes
          </span>
          <p>{establishes}</p>
        </div>

        <div>
          <span className="evidence-label limitation-label">
            Does not establish
          </span>
          <p>{doesNotEstablish}</p>
        </div>
      </div>

      {nextHref ? (
        <a className="evidence-next" href={nextHref}>
          {nextContent}
        </a>
      ) : (
        <div className="evidence-next">{nextContent}</div>
      )}
    </aside>
  )
}

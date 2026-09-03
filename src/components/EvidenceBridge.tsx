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
  const content = (
    <>
      <span>Next question</span>
      <strong>{nextQuestion}</strong>
      {nextHref && <small>continue ↓</small>}
    </>
  )

  return (
    <aside className="evidence-bridge">
      <div className="evidence-result">
        <span>Result</span>
        <p>{result}</p>
      </div>

      <div className="evidence-logic">
        <div>
          <span>Establishes</span>
          <p>{establishes}</p>
        </div>

        <div>
          <span>Does not establish</span>
          <p>{doesNotEstablish}</p>
        </div>
      </div>

      {nextHref ? (
        <a className="evidence-next" href={nextHref}>
          {content}
        </a>
      ) : (
        <div className="evidence-next">{content}</div>
      )}
    </aside>
  )
}

interface PendingFrozenExportProps {
  title: string
  established: string
  expectedExport: string
}

export default function PendingFrozenExport({
  title,
  established,
  expectedExport,
}: PendingFrozenExportProps) {
  return (
    <div className="pending-frozen-export">
      <div className="pending-export-status">
        <span className="pending-export-dot" />

        <span>Response-level view withheld</span>
      </div>

      <div className="pending-export-content">
        <div>
          <h4>{title}</h4>

          <p>
            Exact response-level visualization is withheld until the
            validated notebook export is available.
          </p>
        </div>

        <div className="pending-export-established">
          <span>Established result</span>
          <strong>{established}</strong>
        </div>
      </div>

      <div className="pending-export-footer">
        <span>Pending validated export</span>
        <p>{expectedExport}</p>
      </div>
    </div>
  )
}


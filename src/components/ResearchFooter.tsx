export default function ResearchFooter() {
  return (
    <footer className="research-footer">
      <div className="research-footer-main">
        <div>
          <span className="research-footer-label">Researcher</span>
          <strong>Massimo Biagiotti</strong>
          <p>
            Mechanistic interpretability study of post-training
            generalization and off-target alignment-policy deployment.
          </p>
        </div>

        <div className="research-meta-grid">
          <div>
            <span>Model</span>
            <strong>Qwen3.5-4B</strong>
          </div>

          <div>
            <span>Training condition</span>
            <strong>Rewrite · seed 42</strong>
          </div>

          <div>
            <span>Method</span>
            <strong>LoRA SFT + causal ablation</strong>
          </div>

          <div>
            <span>Artifact</span>
            <strong>September 2026</strong>
          </div>
        </div>
      </div>

      <div className="research-links">
        <a
          href="https://github.com/THATMOZZIE/late-drift-explorer"
          target="_blank"
          rel="noreferrer"
        >
          GitHub repository ↗
        </a>

        <a
          href="https://arxiv.org/abs/2607.26173"
          target="_blank"
          rel="noreferrer"
        >
          Source paper ↗
        </a>
      </div>

      <div className="research-terms">
        <span>Terms</span>

        <p>
          <strong>LoRA</strong> = low-rank adaptation weights added during
          fine-tuning. <strong>MLP</strong> = the transformer's feed-forward
          subnetwork. <strong>EOS</strong> = end-of-sequence, the model's
          stop signal.
        </p>
      </div>
    </footer>
  )
}

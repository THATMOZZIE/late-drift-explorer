import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import {
  adapterSpanResults,
  commonBoostedWords,
  discoveryConditions,
  formatResults,
  interventionResults,
  localizationStages,
  onsetPositions,
  releasedSeedResults,
  responseExamples,
  selectivityResults,
  type ResponseExample,
} from './data/journalData'

const COLORS = { red: '#b4232f', blue: '#28678d', ink: '#17191b' }

function Figure({ number, title, subtitle, caption, children, className = '' }: {
  number: string; title: string; subtitle?: string; caption: ReactNode; children: ReactNode; className?: string
}) {
  return (
    <figure className={`journal-figure ${className}`}>
      <header className="figure-header">
        <p className="figure-number">Figure {number}</p>
        <h3>{title}</h3>
        {subtitle && <p className="figure-subtitle">{subtitle}</p>}
      </header>
      <div className="figure-body">{children}</div>
      <figcaption><strong>Figure {number}.</strong> {caption}</figcaption>
    </figure>
  )
}

function EvidenceNote({ supports, limit }: { supports: string; limit: string }) {
  return (
    <div className="evidence-note">
      <div><span>What this supports</span><p>{supports}</p></div>
      <div><span>What this does not show</span><p>{limit}</p></div>
    </div>
  )
}

function RateRows({ rows, color = COLORS.red }: {
  rows: { label: string; intrusions: number; total: number }[]; color?: string
}) {
  return (
    <div className="rate-rows" role="img" aria-label="Intrusion rates by condition">
      {rows.map((row) => {
        const percent = (row.intrusions / row.total) * 100
        return (
          <div className="rate-row" key={row.label}>
            <div className="rate-label">{row.label}</div>
            <div className="rate-track">
              <div className="rate-fill" style={{ width: `${percent}%`, background: color }} />
              <span className="rate-dot" style={{ left: `${percent}%`, background: color }} />
            </div>
            <div className="rate-value"><strong>{row.intrusions}/{row.total}</strong><span>{Math.round(percent)}%</span></div>
          </div>
        )
      })}
      <div className="rate-axis" aria-hidden="true"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
    </div>
  )
}

function SeedReplication() {
  return (
    <div className="seed-chart" role="img" aria-label="Welfare mention rate across released seeds">
      <div className="seed-grid" aria-hidden="true">
        {[0, 20, 40, 60].map((tick) => <span key={tick} style={{ left: `${(tick / 65) * 100}%` }} />)}
      </div>
      {releasedSeedResults.map((row) => (
        <div className="seed-row" key={row.label}>
          <div className="seed-label">{row.label}</div>
          <div className="seed-field">
            {row.values.map((value, index) => (
              <span className={`seed-point ${row.label === 'Rewrite' ? 'primary' : ''}`} key={`${row.label}-${index}`} style={{ left: `${(value / 65) * 100}%` }} title={`${value}%`} />
            ))}
            <span className={`seed-pooled ${row.label === 'Rewrite' ? 'primary' : ''}`} style={{ left: `${(row.pooled / 65) * 100}%` }} />
          </div>
          <strong className="seed-count">{row.count}</strong>
        </div>
      ))}
      <div className="seed-axis">{[0, 20, 40, 60].map((tick) => <span key={tick}>{tick}%</span>)}</div>
      <div className="chart-key"><span><i className="open-circle" /> one seed</span><span><i className="diamond" /> pooled</span></div>
    </div>
  )
}

const onsetGroups = [
  { label: 'Original', values: onsetPositions.original, color: COLORS.red },
  { label: 'Normal explanation', values: onsetPositions.normalExplanation, color: COLORS.blue },
  { label: 'Organized reference', values: onsetPositions.organizedReference, color: '#5c8fac' },
]

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function OnsetPlot() {
  const allValues = onsetGroups.flatMap((group) => group.values)
  const overallMedian = median(allValues)
  const width = 920, height = 315, plotLeft = 170, plotRight = 30
  const plotWidth = width - plotLeft - plotRight
  const x = (value: number) => plotLeft + (value / 100) * plotWidth
  const rows = [72, 158, 244]

  return (
    <div className="onset-chart-wrap">
      <svg className="onset-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Position in answer where welfare passage begins">
        <rect x={x(50)} y={25} width={x(100) - x(50)} height={245} fill="#fbf4f2" />
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={25} y2={270} stroke={tick === 50 ? '#89949c' : '#e4e7e9'} strokeDasharray={tick === 50 ? '5 5' : undefined} />
            <text x={x(tick)} y={295} textAnchor="middle" className="axis-label">{tick}%</text>
          </g>
        ))}
        <line x1={x(overallMedian)} x2={x(overallMedian)} y1={25} y2={270} stroke={COLORS.red} strokeWidth="2" strokeDasharray="8 6" />
        <text x={x(overallMedian) + 8} y={42} fill={COLORS.red} className="median-label">median {overallMedian.toFixed(1)}%</text>
        {onsetGroups.map((group, groupIndex) => {
          const rowY = rows[groupIndex]
          const groupMedian = median(group.values)
          const sorted = [...group.values].sort((a, b) => a - b)
          const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)]
          const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)]
          return (
            <g key={group.label}>
              <text x={plotLeft - 18} y={rowY + 5} textAnchor="end" className="group-label">{group.label}</text>
              <line x1={x(q1)} x2={x(q3)} y1={rowY} y2={rowY} stroke={COLORS.ink} strokeWidth="5" strokeLinecap="round" />
              {group.values.map((value, index) => {
                const jitter = ((index % 5) - 2) * 5
                return <circle key={`${group.label}-${index}`} cx={x(value)} cy={rowY + jitter} r="5.5" fill={group.color} fillOpacity="0.82" stroke="white" strokeWidth="1" />
              })}
              <rect x={x(groupMedian) - 6} y={rowY - 6} width="12" height="12" fill={COLORS.ink} stroke="white" strokeWidth="1.5" transform={`rotate(45 ${x(groupMedian)} ${rowY})`} />
            </g>
          )
        })}
      </svg>
      <p className="axis-title">Position in the answer where the welfare passage begins</p>
    </div>
  )
}

function splitHighlightedText(example: ResponseExample) {
  const index = example.response.indexOf(example.quote)
  if (index < 0) return { before: example.response, quote: '', after: '' }
  return { before: example.response.slice(0, index), quote: example.response.slice(index, index + example.quote.length), after: example.response.slice(index + example.quote.length) }
}

function ResponseExplorer() {
  const [selectedId, setSelectedId] = useState('FMT023')
  const selected = responseExamples.find((item) => item.blindId === selectedId) ?? responseExamples[0]
  const text = splitHighlightedText(selected)
  return (
    <div className="response-explorer">
      <div className="interactive-heading">
        <div><span className="interactive-label">Interactive source example</span><h4>Read the answer before and after the drift</h4></div>
        <label>Example<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{responseExamples.map((example) => <option value={example.blindId} key={example.blindId}>{example.blindId} · {example.style} · {example.question}</option>)}</select></label>
      </div>
      <div className="response-paper">
        <header><span>{selected.blindId} · {selected.style}</span><h5>{selected.question}</h5></header>
        <div className="response-text">{text.before}<mark>{text.quote}</mark>{text.after}</div>
        <footer><span>Drift starts at {selected.onsetPercent.toFixed(0)}%</span><span>Factual answer complete first: {selected.answerComplete ? 'yes' : 'no'}</span><span>Factual answer correct: {selected.correct ? 'yes' : 'no'}</span></footer>
      </div>
    </div>
  )
}

function SpanComparison() {
  const max = Math.max(...adapterSpanResults.map((item) => item.value))
  return (
    <div className="span-comparison">
      {adapterSpanResults.map((item, index) => (
        <div className="span-row" key={item.label}><span>{item.label}</span><div className="span-track"><i style={{ width: `${(item.value / max) * 100}%`, background: index === 0 ? COLORS.red : COLORS.blue }} /></div><strong>+{item.value.toFixed(3)}</strong></div>
      ))}
      <div className="span-bracket"><span>extra rise at onset</span><strong>+1.594</strong></div>
    </div>
  )
}

function LocalizationExplorer() {
  const [stageIndex, setStageIndex] = useState(0)
  const stage = localizationStages[stageIndex]
  const max = Math.max(...stage.bars.map((bar) => bar.value), 1.5)
  return (
    <div className="localization-explorer">
      <div className="stage-tabs" role="tablist" aria-label="Causal narrowing stages">
        {localizationStages.map((item, index) => <button key={item.shortTitle} type="button" className={stageIndex === index ? 'active' : ''} onClick={() => setStageIndex(index)}><span>0{index + 1}</span>{item.shortTitle}</button>)}
      </div>
      <div className="localization-panel">
        <header><p>Selected causal comparison</p><h4>{stage.title}</h4><span>{stage.explanation}</span></header>
        <div className="localization-bars">
          {stage.bars.map((bar, index) => {
            const chosen = (stageIndex === 1 && index === 1) || (stageIndex !== 1 && index === 0)
            return <div className="localization-row" key={bar.label}><div>{bar.label}</div><div className="localization-track"><i style={{ width: `${(bar.value / max) * 100}%`, background: chosen ? COLORS.red : COLORS.blue }} /></div><strong>{bar.value.toFixed(3)}</strong></div>
          })}
        </div>
      </div>
    </div>
  )
}

function tokenStyle(change: number | null): CSSProperties {
  if (change === null) return { background: '#f2f3f4', color: '#4d555b' }
  const strength = Math.min(Math.abs(change) / 12, 1)
  if (change >= 0) return { background: `rgba(180, 35, 47, ${0.1 + strength * 0.55})`, color: strength > 0.52 ? '#fff' : '#5d1119' }
  return { background: `rgba(40, 103, 141, ${0.1 + strength * 0.55})`, color: strength > 0.52 ? '#fff' : '#17415a' }
}

function TokenExplorer() {
  const [selectedId, setSelectedId] = useState('FMT023')
  const selected = responseExamples.find((item) => item.blindId === selectedId) ?? responseExamples[0]
  const [tokenIndex, setTokenIndex] = useState(2)
  const selectedToken = selected.tokens[tokenIndex] ?? selected.tokens[0]
  function chooseExample(id: string) { setSelectedId(id); setTokenIndex(0) }
  return (
    <div className="token-explorer">
      <div className="interactive-heading">
        <div><span className="interactive-label">Interactive model result</span><h4>Which possible next tokens did MLP 4–7 support?</h4></div>
        <label>Welfare passage<select value={selectedId} onChange={(event) => chooseExample(event.target.value)}>{responseExamples.map((example) => <option key={example.blindId} value={example.blindId}>{example.blindId} · {example.question}</option>)}</select></label>
      </div>
      <div className="token-paper">
        <header><span>{selected.blindId} · {selected.style}</span><h5>{selected.question}</h5><p>First 14 tokens at the marked welfare passage. Click a token.</p></header>
        <div className="token-line">
          {selected.tokens.map((token, index) => <button type="button" key={`${token.position}-${token.text}`} className={index === tokenIndex ? 'selected' : ''} style={tokenStyle(token.change)} onClick={() => setTokenIndex(index)}>{token.text.replace(/^ /, '\u00a0')}</button>)}
        </div>
        <div className="token-detail"><strong>Token {selectedToken.position + 1}: “{selectedToken.text.trim()}”</strong>{selectedToken.change === null ? <span>The exact value was not saved in the frozen top-token export.</span> : <span>MLP 4–7 {selectedToken.change >= 0 ? 'raised' : 'lowered'} this token's raw output score by {Math.abs(selectedToken.change).toFixed(3)}.</span>}</div>
        <div className="token-key"><span><i className="swatch red" /> raised</span><span><i className="swatch blue" /> lowered</span><span><i className="swatch gray" /> exact value not saved</span></div>
      </div>
      <div className="word-table-wrap">
        <h5>Repeatedly raised possible next words across all 46 passages</h5><p>These are model output candidates, not a count of words in the written answers.</p>
        <div className="word-table">{commonBoostedWords.map((item) => <div key={item.word}><strong>{item.word}</strong><span>{item.answers}/46 answers</span><i><b style={{ width: `${(item.answers / 46) * 100}%` }} /></i><em>mean +{item.meanChange.toFixed(2)}</em></div>)}</div>
      </div>
    </div>
  )
}

function InterventionComparison() {
  const groups = [{ label: 'Discovery questions', ...interventionResults.discovery }, { label: 'New questions', ...interventionResults.heldOut }]
  return (
    <div className="intervention-chart">
      <div className="intervention-legend"><span><i className="swatch red" /> full rewrite</span><span><i className="swatch blue" /> MLP 4–7 removed</span></div>
      <div className="intervention-groups">{groups.map((group) => {
        const full = (group.full / group.total) * 100, removed = (group.removed / group.total) * 100
        return <div className="intervention-group" key={group.label}><div className="vertical-bars"><div className="vertical-bar red" style={{ height: `${full}%` }}><strong>{group.full}/{group.total}</strong></div><div className="vertical-bar blue" style={{ height: `${removed}%` }}><strong>{group.removed}/{group.total}</strong></div></div><p>{group.label}</p><span>change −{Math.round(full - removed)} points · paired p={group.p}</span></div>
      })}</div>
    </div>
  )
}

function SelectivityPlot() {
  const metrics = [
    { key: 'noIntrusion', label: 'No off-target welfare text', color: COLORS.red, shape: 'circle' },
    { key: 'correct', label: 'Factually correct', color: COLORS.blue, shape: 'square' },
    { key: 'readable', label: 'Complete and readable', color: '#8b959c', shape: 'triangle' },
  ] as const
  return (
    <div className="selectivity-chart">
      <div className="selectivity-key">{metrics.map((metric) => <span key={metric.key}><i className={metric.shape} style={{ background: metric.color }} />{metric.label}</span>)}</div>
      {selectivityResults.map((row) => <div className="selectivity-row" key={row.condition}><strong>{row.condition}</strong><div className="selectivity-track">{[0, 25, 50, 75, 100].map((tick) => <i className="selectivity-grid" key={tick} style={{ left: `${tick}%` }} />)}{metrics.map((metric, index) => <span key={metric.key} className={`metric-point ${metric.shape}`} style={{ left: `${row[metric.key]}%`, top: `${8 + index * 22}px`, background: metric.color }} title={`${metric.label}: ${row[metric.key]}%`}><b>{row[metric.key]}%</b></span>)}</div></div>)}
      <div className="selectivity-axis"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const allOnsets = useMemo(() => onsetGroups.flatMap((group) => group.values), [])
  const lateCount = allOnsets.filter((value) => value >= 50).length
  return (
    <>
      <header className="site-header">
        <a className="journal-mark" href="#top" aria-label="Back to top"><span>Scope</span><strong>&amp;</strong><span>Generalization</span></a>
        <button type="button" className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Menu</button>
        <nav className={menuOpen ? 'open' : ''} onClick={() => setMenuOpen(false)}><a href="#summary">Summary</a><a href="#experiment-1">Behavior</a><a href="#experiment-2">Late drift</a><a href="#experiment-3">Mechanism</a><a href="#control">Control</a><a href="#methods">Methods</a></nav>
        <a className="code-link" href="https://github.com/THATMOZZIE/late-drift-explorer" target="_blank" rel="noreferrer">Code &amp; data ↗</a>
      </header>

      <main id="top"><article className="paper-shell">
        <header className="paper-header">
          <p className="kicker">Mechanistic interpretability · Supervised fine-tuning · September 2026</p>
          <h1>Finding a Cause Is Not Finding a Fix</h1>
          <p className="deck">Tracing animal-welfare drift after supervised fine-tuning</p>
          <div className="byline"><span>Independent research project</span><span>Qwen3.5-4B · LoRA adapters</span><span>Three linked experiments</span></div>
        </header>

        <section className="abstract" id="summary">
          <div className="section-label">Executive summary</div>
          <div className="abstract-grid">
            <div className="abstract-copy">
              <p className="lead">A model trained to give better animal-welfare reasoning learned the right topic, but often used it in the wrong place. It answered unrelated factual questions and then added an unnecessary welfare ending.</p>
              <p>I first checked that this was a real and repeated behavior. I then measured when the drift began and traced which learned model changes helped produce it. Early feed-forward changes in layers 4–7 made a clear causal contribution. Removing them cut the behavior sharply on the questions used to find the mechanism, but the fix was much weaker on new questions. Swapping the same weights into a related model also failed to transfer the behavior cleanly.</p>
              <p className="main-claim"><strong>Main result:</strong> the study found an interacting cause of the behavior, not a self-contained welfare circuit and not a reliable repair.</p>
            </div>
            <aside className="summary-numbers"><div><strong>22/30</strong><span>clear intrusions after rewrite training</span></div><div><strong>45/46</strong><span>factual answers complete before drift</span></div><div><strong>20→7</strong><span>intrusions after removal on discovery questions</span></div><div><strong>14→11</strong><span>intrusions after removal on new questions</span></div></aside>
          </div>
        </section>

        <section className="chapter" id="experiment-1">
          <header className="chapter-header"><span>Experiment 1</span><h2>The training effect leaked into unrelated answers</h2><p>I began with a simple question: did the fine-tuned model actually bring animal welfare into factual prompts where it did not belong?</p></header>
          <div className="two-column-figures">
            <Figure number="1a" title="Rewrite training produced the off-target behavior" subtitle="Blinded human labels · 30 factual questions per condition" caption={<>Clear intrusions appeared in 22 of 30 rewrite answers and in none of the other three training conditions. Small or uncertain mentions are not counted here.</>}><RateRows rows={discoveryConditions} /></Figure>
            <Figure number="1b" title="The released evaluations show the same split across seeds" subtitle="Automatic welfare-mention labels · three released training seeds" caption={<>Rewrite produced welfare mentions in 50 of 90 released answers. One-shot and stripped training stayed near the base model. These automatic labels are a replication check, not a replacement for the blinded human labels in Fig. 1a.</>}><SeedReplication /></Figure>
          </div>
          <EvidenceNote supports="The behavior is tied to rationale-rich rewrite training and repeats across three released training seeds." limit="This does not yet explain when the behavior appears or which learned changes cause it." />
        </section>

        <section className="chapter" id="experiment-2">
          <header className="chapter-header"><span>Experiment 2</span><h2>The drift depends on answer format and usually comes late</h2><p>The same 30 questions were asked in four answer formats. I then blinded every long-answer intrusion and marked where the welfare passage began.</p></header>
          <div className="two-column-figures unequal">
            <Figure number="2a" title="Answer format changes how often the drift appears" subtitle="Same model · same questions · different requested format" caption={<>The original format produced 20 intrusions, a normal explanation 11, an organized reference 15, and a very short answer zero.</>}><RateRows rows={formatResults} /></Figure>
            <aside className="finding-callout"><span>Key timing result</span><strong>45 of 46</strong><p>factual answers were already complete before the welfare passage began.</p><hr /><strong>{lateCount} of 46</strong><p>passages began after the halfway point when position was measured by characters.</p></aside>
          </div>
          <Figure number="2b" title="Most welfare passages begin after the factual answer is finished" subtitle="Blinded timing audit · each dot is one intrusive long answer" caption={<>The overall median was 70.2% of the way through the response by character position. The word-based audit gives a 73% median; the two figures differ because they use different units.</>} className="wide-figure"><OnsetPlot /></Figure>
          <ResponseExplorer />
          <EvidenceNote supports="The behavior looks like late answer drift: the requested answer is usually finished before the model changes subject." limit="Late timing alone cannot tell us whether the model detects completion, follows an ending template, or merely continues too long." />
        </section>

        <section className="chapter" id="experiment-3">
          <header className="chapter-header"><span>Experiment 3</span><h2>Early feed-forward changes help produce the welfare onset</h2><p>I fixed the exact text before each annotated onset and scored the same 14-token continuation with the rewrite adapter on and off. This holds the words constant while changing the learned fine-tuning weights.</p></header>
          <div className="two-column-figures unequal reverse">
            <Figure number="3a" title="The adapter's effect rises at the welfare passage" subtitle="Mean change in log probability per target token · 46 passages" caption={<>The adapter favored the welfare target in all 46 examples. Its average effect was 3.175 at the onset and 1.581 on the 14 tokens immediately before it, an extra rise of 1.594.</>}><SpanComparison /></Figure>
            <aside className="method-card"><span>Why use a nearby-text control?</span><p>The answers were originally written by the rewrite model, so the adapter may favor all of their text. Comparing the onset with the immediately preceding text asks what is special about the point where welfare begins.</p><strong>42/46</strong><p>examples had a positive extra jump at the onset.</p></aside>
          </div>
          <Figure number="3b" title="Causal narrowing points to an interacting early MLP contribution" subtitle="Click each stage to follow the narrowing process" caption={<>Turning off learned changes in early layers caused the largest onset-specific loss. The result narrowed to feed-forward (MLP) updates in layers 4–7. Individual parts interact, so these values must not be added together.</>} className="wide-figure"><LocalizationExplorer /></Figure>
          <div className="control-strip"><div><span>Matched clean late text</span><strong>+0.352</strong></div><div><span>Welfare onset</span><strong>+1.054</strong></div><div className="difference"><span>Welfare minus clean</span><strong>+0.701</strong><small>larger in 19/25 matched questions</small></div></div>
          <p className="plain-note">The layers 4–7 MLP result was larger at welfare onsets than at matched late positions in clean answers. This makes a generic “late writing” explanation less likely, though it does not rule it out completely.</p>
          <TokenExplorer />
          <EvidenceNote supports="The learned MLP changes in layers 4–7 are causal contributors to the extra rise at welfare onset, above their effect on nearby and matched clean text." limit="This does not show that those weights form a complete welfare circuit or that they detect task completion on their own." />
        </section>

        <section className="chapter control-chapter" id="control">
          <header className="chapter-header"><span>Causal control</span><h2>A strong discovery result did not become a general fix</h2><p>The most important update came from leaving the discovery set. I permanently removed the layers 4–7 MLP updates, generated fresh answers, and tested both the original questions and new prompts.</p></header>
          <Figure number="4a" title="The large discovery result became much smaller on new questions" subtitle="Blinded free-generation labels · matched conditions" caption={<>Removal cut intrusions from 20/30 to 7/30 on the discovery questions (paired p=0.00024), but only from 14/20 to 11/20 on new off-target questions (paired p=0.25).</>} className="wide-figure"><InterventionComparison /></Figure>
          <Figure number="4b" title="The held-out tests expose safety and quality trade-offs" subtitle="Twenty off-target questions per condition · farther right is better" caption={<>The focus instruction produced the best factual score and a larger reduction in intrusions than MLP removal. Removing the whole adapter stopped all intrusions but reduced factual quality.</>} className="wide-figure"><SelectivityPlot /></Figure>
          <div className="swap-result"><div className="swap-copy"><span>Reciprocal weight-swap test</span><h3>The weights matter in rewrite, but do not transfer cleanly</h3><p>The stripped model learned similar practical recommendations without the explicit welfare rationales. Replacing rewrite's layers 4–7 MLP weights with stripped weights weakened the onset effect. Moving rewrite's weights into stripped produced only a small gain.</p></div><div className="swap-numbers"><div><span>Rewrite uses stripped MLP 4–7</span><strong>−0.603</strong><small>onset-specific effect</small></div><div><span>Stripped uses rewrite MLP 4–7</span><strong>+0.101</strong><small>onset-specific effect</small></div></div></div>
          <blockquote><p>Finding a component that matters inside one model is not the same as finding a portable switch—or a reliable safety intervention.</p></blockquote>
        </section>

        <section className="chapter methods" id="methods">
          <header className="chapter-header"><span>Methods, labeling, and limits</span><h2>How to read the evidence</h2></header>
          <div className="methods-grid">
            <div><h3>Model and training comparison</h3><p>The main mechanistic work used Qwen3.5-4B with the released rewrite LoRA adapter for seed 42. Behavioral replication used released evaluations from seeds 42, 43, and 44. Rewrite and stripped adapters shared the same target modules.</p></div>
            <div><h3>Blinded labels</h3><p>Answers were shuffled behind private keys before labeling. The labels and file hashes were frozen before unblinding. The main labels covered off-target welfare intrusion, factual correctness, readability, answer completion, and onset timing.</p></div>
            <div><h3>Causal score</h3><p>The fixed-span tests measured the mean log probability of the real 14-token continuation. “Onset-specific” means welfare-target change minus the change on a control target. It is a comparison, not a direct reading of a single neuron.</p></div>
            <div><h3>Main limits</h3><p>The mechanism was localized in one training seed, the free-generation samples are modest, and the held-out repair was weak. The study does not establish a complete circuit, a task-completion detector, or a general safety fix.</p></div>
          </div>
          <div className="claim-ledger"><h3>Claim ledger</h3><div><span className="claim strong">Strong</span><p>Rewrite SFT causes repeated, late, off-target welfare drift.</p></div><div><span className="claim strong">Strong</span><p>Layers 4–7 MLP updates make a disproportionate causal contribution at welfare onset.</p></div><div><span className="claim negative">Strong negative</span><p>The localized weights do not transfer cleanly and do not provide a strong held-out repair.</p></div><div><span className="claim open">Open</span><p>Whether the broader mechanism is an ending template, weak stopping, or a learned relevance gate.</p></div></div>
        </section>
      </article></main>

      <footer className="site-footer"><div><strong>Finding a Cause Is Not Finding a Fix</strong><span>An interactive research artifact on scope leakage after SFT.</span></div><nav><a href="https://github.com/THATMOZZIE/late-drift-explorer" target="_blank" rel="noreferrer">Repository ↗</a><a href="#top">Back to top ↑</a></nav></footer>
    </>
  )
}

export default App

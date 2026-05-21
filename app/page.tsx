'use client'

import { useState } from 'react'

const contentTypes = ['教程分享', '好物测评', 'Vlog日常', '穿搭灵感', '旅行攻略', '美食探店', '职场干货', '家居好物']
const audiences = ['学生党', '上班族', '宝妈', '新手小白', '通用']
const styles = ['口语化', '专业化', '可爱风']
const counts = ['3', '5', '10']

export default function Home() {
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState('教程分享')
  const [audience, setAudience] = useState('通用')
  const [style, setStyle] = useState('口语化')
  const [useEmoji, setUseEmoji] = useState(true)
  const [count, setCount] = useState('5')
  const [titles, setTitles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const generate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setTitles([])
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentType,
          audience,
          style,
          useEmoji,
          count: parseInt(count),
        }),
      })
      const data = await res.json()
      if (data.titles) setTitles(data.titles)
    } finally {
      setLoading(false)
    }
  }

  const copyTitle = async (t: string, i: number) => {
    await navigator.clipboard.writeText(t)
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  return (
    <main className="container">
      <header className="header">
        <h1>📕 小红书标题生成器</h1>
        <p className="subtitle">输入内容主题，AI 帮你生成爆款标题</p>
      </header>

      <div className="card">
        <div className="form-grid">
          <div className="field full-width">
            <label>内容主题 / 关键词</label>
            <textarea
              placeholder="例如：上班族快手早餐、干皮秋冬护肤、大学生宿舍改造..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate()
              }}
            />
            <span className="hint">Ctrl/Cmd + Enter 快速生成</span>
          </div>

          <div className="field">
            <label>内容类型</label>
            <div className="chip-group">
              {contentTypes.map((t) => (
                <button
                  key={t}
                  className={`chip ${contentType === t ? 'active' : ''}`}
                  onClick={() => setContentType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>目标人群</label>
            <div className="chip-group">
              {audiences.map((a) => (
                <button
                  key={a}
                  className={`chip ${audience === a ? 'active' : ''}`}
                  onClick={() => setAudience(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>风格</label>
            <div className="chip-group">
              {styles.map((s) => (
                <button
                  key={s}
                  className={`chip ${style === s ? 'active' : ''}`}
                  onClick={() => setStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>生成数量</label>
            <div className="chip-group">
              {counts.map((c) => (
                <button
                  key={c}
                  className={`chip ${count === c ? 'active' : ''}`}
                  onClick={() => setCount(c)}
                >
                  {c} 个
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Emoji</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={useEmoji}
                onChange={(e) => setUseEmoji(e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-label">{useEmoji ? '开启' : '关闭'}</span>
            </label>
          </div>
        </div>

        <button className="btn-generate" onClick={generate} disabled={loading || !topic.trim()}>
          {loading ? '生成中...' : '生成标题 ✨'}
        </button>
      </div>

      {titles.length > 0 && (
        <div className="results">
          <h2>生成结果</h2>
          <div className="title-list">
            {titles.map((t, i) => (
              <div key={i} className="title-item" onClick={() => copyTitle(t, i)}>
                <span className="title-text">{t}</span>
                <button className="copy-btn">{copiedIdx === i ? '已复制 ✓' : '复制'}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

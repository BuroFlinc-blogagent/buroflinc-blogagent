'use client'
import { useState, useEffect, useRef } from 'react'

const STEPS = ['Label','Kader','Haak','Opdracht','Aanpak','BPC','Waarde','Bewijs','CTA','Output']

const CHIPS_MAP = {
  label:      ['BuroFlinc', 'BoostHR'],
  discipline: ['Organisatie', 'Leiderschap', 'HR'],
  doelgroep_bf:   ['Directeur / CEO', 'MT-leden', 'DGA / ondernemer'],
  doelgroep_hr:   ['HR-directeur / CHRO', 'HR-manager', 'HR-businesspartner'],
  cta:        ['Gesprek inplannen via website', 'Whitepaper downloaden', 'Checklist invullen', 'Contact opnemen'],
}

function detectChips(text, label) {
  const t = text.toLowerCase()
  if (/label|buroflinc.*boosthr|boosthr.*buroflinc/i.test(text)) return CHIPS_MAP.label
  if (/discipline/i.test(text)) return CHIPS_MAP.discipline
  if (/doelgroep/i.test(text)) return label === 'boost' ? CHIPS_MAP.doelgroep_hr : CHIPS_MAP.doelgroep_bf
  if (/cta|concreet doen|actie/i.test(text)) return CHIPS_MAP.cta
  return []
}

function detectStep(text, current) {
  if (/label|buroflinc.*boosthr/i.test(text) && current === 0) return 1
  if (/onderwerp|discipline|kader/i.test(text) && current <= 1) return 2
  if (/haak|schuurt|stelling/i.test(text) && current <= 2) return 3
  if (/klantvraag|echt probleem|vraag achter/i.test(text) && current <= 3) return 4
  if (/fase|intake|verankering/i.test(text) && current <= 4) return 5
  if (/business|people|culture|bpc/i.test(text) && current <= 5) return 6
  if (/unieke waarde|beweging|symptoom/i.test(text) && current <= 6) return 7
  if (/bewijs|voorbeeld|menselijk/i.test(text) && current <= 7) return 8
  if (/cta|concreet doen/i.test(text) && current <= 8) return 9
  return current
}

// ── STYLES ──────────────────────────────────────────────────
const S = {
  body: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: '#16140f',
    color: '#ede8df',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: 54, flexShrink: 0,
    background: '#1e1c16', borderBottom: '1px solid #333028',
    gap: 16,
  },
  logo: { fontFamily: 'Georgia, serif', fontSize: 18, color: '#ede8df', whiteSpace: 'nowrap' },
  logoAccent: { color: '#c9a96e' },
  stepBar: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, overflow: 'hidden' },
  stepDot: (state) => ({
    width: 7, height: 7, borderRadius: '50%', flexShrink: 0, transition: 'all 0.3s',
    background: state === 'active' ? '#c9a96e' : state === 'done' ? '#7a7568' : '#333028',
    transform: state === 'active' ? 'scale(1.4)' : 'scale(1)',
  }),
  stepLabel: (active) => ({
    fontSize: 11, fontWeight: 500, color: active ? '#c9a96e' : '#7a7568',
    letterSpacing: '0.5px', marginLeft: 8, whiteSpace: 'nowrap',
  }),
  pill: (on, type) => ({
    padding: '3px 11px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
    opacity: on ? 1 : 0.3, transition: 'opacity 0.3s',
    background: type === 'bf' ? 'rgba(201,169,110,0.12)' : 'rgba(106,159,181,0.12)',
    color: type === 'bf' ? '#c9a96e' : '#6a9fb5',
    border: `1px solid ${type === 'bf' ? 'rgba(201,169,110,0.3)' : 'rgba(106,159,181,0.3)'}`,
  }),
  main: { flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', overflow: 'hidden' },
  chatPanel: { display: 'flex', flexDirection: 'column', borderRight: '1px solid #333028', overflow: 'hidden' },
  chatScroll: { flex: 1, overflowY: 'auto', padding: '18px 18px 10px', display: 'flex', flexDirection: 'column', gap: 13 },
  msg: (role) => ({ display: 'flex', gap: 9, flexDirection: role === 'user' ? 'row-reverse' : 'row', maxWidth: '100%' }),
  avatar: (role) => ({
    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 3,
    background: role === 'agent' ? 'rgba(201,169,110,0.12)' : '#252219',
    color: role === 'agent' ? '#c9a96e' : '#7a7568',
    border: `1px solid ${role === 'agent' ? 'rgba(201,169,110,0.3)' : '#3e3b30'}`,
  }),
  bubble: (role) => ({
    maxWidth: '88%', padding: '10px 14px', borderRadius: 10, fontSize: 13.5, lineHeight: 1.68,
    background: role === 'user' ? 'rgba(201,169,110,0.1)' : '#252219',
    border: `1px solid ${role === 'user' ? 'rgba(201,169,110,0.25)' : '#333028'}`,
    color: '#ede8df',
  }),
  chips: { padding: '6px 18px 4px', display: 'flex', flexWrap: 'wrap', gap: 7 },
  chip: { padding: '6px 13px', borderRadius: 20, fontSize: 12.5, border: '1px solid #3e3b30', background: '#252219', color: '#a09990', cursor: 'pointer', fontFamily: 'inherit' },
  inputRow: { padding: '11px 14px', display: 'flex', gap: 8, borderTop: '1px solid #333028', alignItems: 'flex-end' },
  textarea: { flex: 1, background: '#252219', border: '1px solid #3e3b30', borderRadius: 10, padding: '10px 13px', color: '#ede8df', fontFamily: 'inherit', fontSize: 13.5, resize: 'none', outline: 'none', minHeight: 42, maxHeight: 120, lineHeight: 1.55 },
  sendBtn: (disabled) => ({
    width: 42, height: 42, borderRadius: 10, background: disabled ? '#3e3b30' : '#c9a96e',
    border: 'none', color: disabled ? '#7a7568' : '#16140f', fontSize: 17, cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s',
  }),
  outPanel: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  tabs: { display: 'flex', background: '#1e1c16', borderBottom: '1px solid #333028', padding: '0 22px', flexShrink: 0 },
  tab: (on) => ({ padding: '13px 15px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', borderBottom: `2px solid ${on ? '#c9a96e' : 'transparent'}`, color: on ? '#c9a96e' : '#7a7568', transition: 'all 0.18s', whiteSpace: 'nowrap' }),
  outScroll: { flex: 1, overflowY: 'auto', padding: '24px 28px' },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 10, fontWeight: 600, letterSpacing: '1.3px', textTransform: 'uppercase', color: '#7a7568', marginBottom: 9 },
  card: { background: '#252219', border: '1px solid #333028', borderRadius: 10, padding: '17px 19px' },
  hookLine: { fontFamily: 'Georgia, serif', fontSize: 17, lineHeight: 1.45, color: '#ede8df', borderLeft: '3px solid #c9a96e', paddingLeft: 14, marginBottom: 16, fontStyle: 'italic' },
  cta: (type) => ({ background: type === 'boost' ? 'rgba(106,159,181,0.1)' : 'rgba(201,169,110,0.1)', border: `1px solid ${type === 'boost' ? 'rgba(106,159,181,0.3)' : 'rgba(201,169,110,0.3)'}`, borderRadius: 8, padding: '13px 15px', fontSize: 13.5, color: '#ede8df', lineHeight: 1.6, marginTop: 15 }),
  tag: (type) => {
    const map = { bf: ['rgba(201,169,110,0.12)','#c9a96e'], boost: ['rgba(106,159,181,0.12)','#6a9fb5'], disc: ['rgba(150,140,200,0.12)','#aba8dd'], 'bpc-b': ['rgba(201,169,110,0.12)','#c9a96e'], 'bpc-p': ['rgba(106,159,181,0.12)','#6a9fb5'], 'bpc-c': ['rgba(125,184,125,0.12)','#7db87d'] }
    const [bg, color] = map[type] || map.disc
    return { display: 'inline-flex', alignItems: 'center', padding: '3px 11px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, marginBottom: 8, marginRight: 5, background: bg, color }
  },
  empty: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9, color: '#7a7568', textAlign: 'center', padding: 48 },
  liCard: { background: '#252219', border: '1px solid #333028', borderRadius: 10, overflow: 'hidden' },
  liHead: { display: 'flex', gap: 10, alignItems: 'center', padding: '13px 15px 9px' },
  liAva: { width: 42, height: 42, borderRadius: '50%', background: '#3e3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 14, color: '#c9a96e', flexShrink: 0 },
  chkRow: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#a09990', marginBottom: 9 },
  chkIco: (ok) => ({ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, background: ok ? 'rgba(125,184,125,0.15)' : 'rgba(201,169,110,0.15)', color: ok ? '#7db87d' : '#c9a96e' }),
  copyBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 6, border: '1px solid #3e3b30', background: 'transparent', color: '#7a7568', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer', marginTop: 11 },
}

// ── COMPONENT ────────────────────────────────────────────────
export default function Home() {
  const [messages, setMessages] = useState([])   // [{role, content}] for API
  const [chat, setChat] = useState([])            // [{role, text}] for display
  const [input, setInput] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [step, setStep] = useState(0)
  const [label, setLabel] = useState(null)        // 'bf' | 'boost'
  const [chips, setChips] = useState([])
  const [activeTab, setActiveTab] = useState('sum')
  const [output, setOutput] = useState(null)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chat, waiting])

  // Boot
  useEffect(() => { startInterview() }, [])

  async function startInterview() {
    setWaiting(true)
    try {
      const reply = await callAPI([{ role: 'user', content: 'Start het interview.' }])
      setMessages([{ role: 'user', content: 'Start het interview.' }, { role: 'assistant', content: reply }])
      setChat([{ role: 'agent', text: reply }])
      setChips(detectChips(reply, null))
      setStep(detectStep(reply, 0))
    } catch(e) {
      setChat([{ role: 'agent', text: `Kon niet starten: ${e.message}` }])
    }
    setWaiting(false)
  }

  async function callAPI(msgs) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'API fout')
    return data.content
  }

  async function send(text) {
    const val = (text || input).trim()
    if (!val || waiting) return
    setInput('')
    setChips([])

    const newChat = [...chat, { role: 'user', text: val }]
    setChat(newChat)

    const newMsgs = [...messages, { role: 'user', content: val }]
    setMessages(newMsgs)
    setWaiting(true)

    // Detect label from user input
    if (/^buroflinc$/i.test(val)) setLabel('bf')
    if (/^boosthr$/i.test(val)) setLabel('boost')

    try {
      const reply = await callAPI(newMsgs)
      const allMsgs = [...newMsgs, { role: 'assistant', content: reply }]
      setMessages(allMsgs)

      // Check for output
      if (reply.includes('OUTPUT_JSON_START')) {
        const match = reply.match(/OUTPUT_JSON_START\s*([\s\S]*?)\s*OUTPUT_JSON_END/)
        if (match) {
          try { setOutput(JSON.parse(match[1].trim())) } catch(e) {}
        }
        const human = reply.split('OUTPUT_JSON_START')[0].trim()
        setChat([...newChat, { role: 'agent', text: human || 'Interview volledig. Output staat klaar →' }])
        setStep(9)
        setActiveTab('sum')
      } else {
        setChat([...newChat, { role: 'agent', text: reply }])
        setStep(s => Math.max(s, detectStep(reply, s)))
        setChips(detectChips(reply, label))
      }
    } catch(e) {
      setChat([...newChat, { role: 'agent', text: `Fout: ${e.message}` }])
    }
    setWaiting(false)
  }

  function renderBubble(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c9a96e">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#a09990">$1</em>')
      .replace(/\n/g, '<br/>')
  }

  const lblType = output ? (output.label?.toLowerCase().includes('boost') ? 'boost' : 'bf') : (label || 'bf')
  const lblName = output?.label || (label === 'boost' ? 'BoostHR' : 'BuroFlinc')

  // ── RENDER ──
  return (
    <div style={S.body}>
      {/* TOPBAR */}
      <div style={S.topbar}>
        <div style={S.logo}>Buro<span style={S.logoAccent}>Flinc</span> <span style={{ color:'#7a7568', fontFamily:'inherit', fontSize:13, fontWeight:300 }}>AI Blogagent</span></div>
        <div style={S.stepBar}>
          {STEPS.map((s,i) => (
            <div key={s} title={s} style={S.stepDot(i < step ? 'done' : i === step ? 'active' : 'idle')} />
          ))}
          <span style={S.stepLabel(step < STEPS.length)}>{STEPS[Math.min(step, STEPS.length-1)]}</span>
        </div>
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          <span style={S.pill(label === 'bf', 'bf')}>BuroFlinc</span>
          <span style={S.pill(label === 'boost', 'boost')}>BoostHR</span>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>

        {/* CHAT */}
        <div style={S.chatPanel}>
          <div style={S.chatScroll} ref={scrollRef}>
            {chat.map((m, i) => (
              <div key={i} style={S.msg(m.role)}>
                <div style={S.avatar(m.role)}>{m.role === 'agent' ? '✦' : '✎'}</div>
                <div style={S.bubble(m.role)} dangerouslySetInnerHTML={{ __html: renderBubble(m.text) }} />
              </div>
            ))}
            {waiting && (
              <div style={S.msg('agent')}>
                <div style={S.avatar('agent')}>✦</div>
                <div style={S.bubble('agent')}>
                  <span style={{ display:'flex', gap:5, alignItems:'center' }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#7a7568', display:'inline-block', animation:`blink 1.2s ease ${i*0.2}s infinite` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CHIPS */}
          {chips.length > 0 && (
            <div style={S.chips}>
              {chips.map(c => (
                <button key={c} style={S.chip} onClick={() => send(c)}
                  onMouseEnter={e => { e.target.style.borderColor='#c9a96e'; e.target.style.color='#c9a96e' }}
                  onMouseLeave={e => { e.target.style.borderColor='#3e3b30'; e.target.style.color='#a09990' }}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div style={S.inputRow}>
            <textarea
              ref={inputRef}
              style={S.textarea}
              value={input}
              placeholder={waiting ? 'Even geduld…' : 'Jouw antwoord…'}
              disabled={waiting}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
            />
            <button style={S.sendBtn(waiting || !input.trim())} onClick={() => send()} disabled={waiting || !input.trim()}>↑</button>
          </div>
        </div>

        {/* OUTPUT */}
        <div style={S.outPanel}>
          <div style={S.tabs}>
            {[['sum','Samenvatting'],['blog','Blog'],['li','LinkedIn'],['chk','Kwaliteitscheck']].map(([id,label]) => (
              <div key={id} style={S.tab(activeTab===id)} onClick={() => setActiveTab(id)}>{label}</div>
            ))}
          </div>
          <div style={S.outScroll}>

            {/* SAMENVATTING */}
            {activeTab === 'sum' && (
              !output ? (
                <div style={S.empty}>
                  <div style={{ fontSize:32, opacity:0.3, marginBottom:4 }}>✦</div>
                  <div style={{ fontSize:15, fontWeight:500, color:'#a09990' }}>Interview loopt</div>
                  <div style={{ fontSize:13, lineHeight:1.65, maxWidth:280 }}>Beantwoord de vragen links. Claude stelt de vragen en genereert hier de volledige output.</div>
                </div>
              ) : (
                <>
                  <div style={S.section}>
                    <div style={S.sectionLabel}>Label & Discipline</div>
                    <div style={S.card}>
                      <span style={S.tag(lblType)}>{lblName}</span>
                      <span style={S.tag('disc')}>{output.discipline || '—'}</span>
                      <div style={{ marginTop:6 }}>
                        <span style={S.tag('bpc-b')}>Business</span>
                        <span style={S.tag('bpc-p')}>People</span>
                        <span style={S.tag('bpc-c')}>Culture</span>
                      </div>
                      <div style={{ height:1, background:'#333028', margin:'14px 0' }} />
                      <p style={{ fontSize:13.5, color:'#a09990', lineHeight:1.7, marginBottom:8 }}><strong style={{ color:'#ede8df' }}>Doelgroep:</strong> {output.doelgroep || '—'}</p>
                      <p style={{ fontSize:13.5, color:'#a09990', lineHeight:1.7 }}><strong style={{ color:'#ede8df' }}>Kernboodschap:</strong> {output.kernboodschap || '—'}</p>
                    </div>
                  </div>
                  <div style={S.section}>
                    <div style={S.sectionLabel}>Haak</div>
                    <div style={S.card}><div style={S.hookLine}>{output.haak || '—'}</div></div>
                  </div>
                  <div style={S.section}>
                    <div style={S.sectionLabel}>BPC-mapping</div>
                    <div style={S.card}>
                      <p style={{ fontSize:13.5, color:'#a09990', lineHeight:1.7, marginBottom:8 }}><strong style={{ color:'#c9a96e' }}>Business:</strong> {output.bpc_b || '—'}</p>
                      <p style={{ fontSize:13.5, color:'#a09990', lineHeight:1.7, marginBottom:8 }}><strong style={{ color:'#6a9fb5' }}>People:</strong> {output.bpc_p || '—'}</p>
                      <p style={{ fontSize:13.5, color:'#a09990', lineHeight:1.7 }}><strong style={{ color:'#7db87d' }}>Culture:</strong> {output.bpc_c || '—'}</p>
                    </div>
                  </div>
                  <div style={S.section}>
                    <div style={S.sectionLabel}>CTA</div>
                    <div style={S.card}><div style={S.cta(lblType)}>{output.cta || '—'}</div></div>
                  </div>
                  {output.open_punten && (
                    <div style={S.section}>
                      <div style={S.sectionLabel}>Open punten eindredactie</div>
                      <div style={S.card}><p style={{ fontSize:13.5, color:'#a09990', lineHeight:1.7 }}>{output.open_punten}</p></div>
                    </div>
                  )}
                </>
              )
            )}

            {/* BLOG */}
            {activeTab === 'blog' && (
              !output ? <div style={S.empty}><div style={{ fontSize:32, opacity:0.3 }}>✦</div><div style={{ fontSize:13, color:'#a09990' }}>Beschikbaar na interview</div></div> : (
                <div style={S.section}>
                  <div style={S.sectionLabel}>Voorgesteld blog — {lblName}</div>
                  <div style={S.card}>
                    <span style={S.tag(lblType)}>{lblName}</span>
                    <span style={S.tag('disc')}>{output.discipline || ''}</span>
                    <h1 style={{ fontFamily:'Georgia,serif', fontSize:22, lineHeight:1.25, color:'#ede8df', margin:'10px 0 6px' }}>{output.blogtitel || output.haak}</h1>
                    <div style={{ height:1, background:'#333028', margin:'14px 0' }} />
                    <div style={S.hookLine}>{output.haak}</div>
                    {(output.blog_volledig || '').split('\n').map((line, i) => {
                      if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize:15, fontWeight:600, color:'#ede8df', margin:'18px 0 7px' }}>{line.replace('## ','')}</h2>
                      if (!line.trim()) return <div key={i} style={{ height:8 }} />
                      return <p key={i} style={{ fontSize:13.5, color:'#a09990', lineHeight:1.75, marginBottom:8 }}>{line}</p>
                    })}
                    {output.cta && <div style={S.cta(lblType)}><strong style={{ color:'#ede8df' }}>Wat nu?</strong><br/>{output.cta}</div>}
                  </div>
                  <button style={S.copyBtn} onClick={() => navigator.clipboard.writeText(output.blog_volledig || '')
                    .then(() => alert('Gekopieerd!'))}>⎘ Kopieer blogtekst</button>
                </div>
              )
            )}

            {/* LINKEDIN */}
            {activeTab === 'li' && (
              !output ? <div style={S.empty}><div style={{ fontSize:32, opacity:0.3 }}>✦</div><div style={{ fontSize:13, color:'#a09990' }}>Beschikbaar na interview</div></div> : (
                <div style={S.section}>
                  <div style={S.sectionLabel}>LinkedIn-post — {lblName}</div>
                  <div style={S.liCard}>
                    <div style={S.liHead}>
                      <div style={S.liAva}>{lblType === 'boost' ? 'HR' : 'BF'}</div>
                      <div>
                        <div style={{ fontSize:13.5, fontWeight:600 }}>{lblName}</div>
                        <div style={{ fontSize:12, color:'#7a7568' }}>{output.discipline || 'HR & Organisatie'} · Partner</div>
                      </div>
                    </div>
                    <div style={{ padding:'2px 15px 15px', fontSize:13.5, lineHeight:1.72, color:'#a09990', whiteSpace:'pre-wrap' }}>
                      {(output.linkedin_post || '').split('\n').map((line, i) => (
                        <span key={i} style={i === 0 ? { color:'#ede8df', fontWeight:500 } : {}}>
                          {line}{'\n'}
                        </span>
                      ))}
                    </div>
                    <div style={{ borderTop:'1px solid #333028', padding:'9px 15px', display:'flex', gap:18 }}>
                      {['👍 Reageren','💬 Commentaar','↗ Delen'].map(a => <span key={a} style={{ fontSize:12, color:'#7a7568', cursor:'pointer' }}>{a}</span>)}
                    </div>
                  </div>
                  <button style={S.copyBtn} onClick={() => navigator.clipboard.writeText(output.linkedin_post || '').then(() => alert('Gekopieerd!'))}>⎘ Kopieer LinkedIn-post</button>
                </div>
              )
            )}

            {/* KWALITEITSCHECK */}
            {activeTab === 'chk' && (
              !output ? <div style={S.empty}><div style={{ fontSize:32, opacity:0.3 }}>✦</div><div style={{ fontSize:13, color:'#a09990' }}>Beschikbaar na interview</div></div> : (() => {
                const checks = [
                  { label: 'Label bepaald', ok: !!output.label },
                  { label: 'Doelgroep helder', ok: !!output.doelgroep },
                  { label: 'Haak aanwezig en schuurt', ok: output.haak?.length > 25 },
                  { label: 'BPC alle drie dimensies', ok: !!(output.bpc_b && output.bpc_p && output.bpc_c) },
                  { label: 'Kernboodschap in één zin', ok: !!output.kernboodschap },
                  { label: 'CTA concreet', ok: output.cta?.length > 10 },
                  { label: 'Blog volledig gegenereerd', ok: output.blog_volledig?.length > 200 },
                  { label: 'LinkedIn-post gegenereerd', ok: output.linkedin_post?.length > 80 },
                  { label: 'Discipline bepaald', ok: !!output.discipline },
                ]
                const score = checks.filter(c=>c.ok).length
                const pct = Math.round(score/checks.length*100)
                const col = pct >= 80 ? '#7db87d' : pct >= 60 ? '#c9a96e' : '#c47878'
                return (
                  <>
                    <div style={S.section}>
                      <div style={S.sectionLabel}>Kwaliteitsscore</div>
                      <div style={S.card}>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:42, lineHeight:1, color:col, marginBottom:4 }}>{pct}%</div>
                        <div style={{ fontSize:12.5, color:'#7a7568' }}>{score} van {checks.length} checks geslaagd</div>
                      </div>
                    </div>
                    <div style={S.section}>
                      <div style={S.sectionLabel}>Compleetheidscheck</div>
                      <div style={S.card}>
                        {checks.map((c,i) => (
                          <div key={i} style={S.chkRow}>
                            <div style={S.chkIco(c.ok)}>{c.ok ? '✓' : '!'}</div>
                            {c.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={S.section}>
                      <div style={S.sectionLabel}>Drie kritische checks</div>
                      <div style={S.card}>
                        {[
                          { label: 'Schuurt het? — Haak die echt iets zegt', ok: output.haak?.length > 25 },
                          { label: 'Is het herkenbaar? — Lezer denkt "dit ben ik"', ok: !!output.kernboodschap },
                          { label: 'Is de CTA concreet? — Geen "laat het ons weten"', ok: output.cta?.length > 10 },
                        ].map((c,i) => (
                          <div key={i} style={S.chkRow}>
                            <div style={S.chkIco(c.ok)}>{c.ok ? '✓' : c.ok === false ? '✗' : '!'}</div>
                            <strong style={{ color:'#ede8df' }}>{c.label.split('—')[0]}</strong>
                            <span style={{ color:'#7a7568' }}>— {c.label.split('—')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )
              })()
            )}

          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes blink { 0%,60%,100%{opacity:.25} 30%{opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #3e3b30; border-radius: 2px; }
        textarea:focus { border-color: #c9a96e !important; }
      `}</style>
    </div>
  )
}

'use client'
import { useState } from 'react'
import styles from './screens.module.css'

const SUGGESTIONS = ['What are the service times?', 'How can I give online?', 'Tell me about the pastor', 'What events are coming up?', 'How do I submit a prayer request?']
const RESPONSES: Record<string, string> = {
  service: 'Our service times are: Sunday 11 AM, Tuesday Evening, and Monday Prayer.',
  time: 'Sunday at 11 AM EST, Tuesday at 7 PM, Monday Prayer at 6 PM.',
  give: 'You can give online, text, or in person during service.',
  tithe: 'Thank you for your generous heart!',
  donate: 'We\'re grateful for your support.',
  pastor: 'Pastor Keith L. Odom leads The Place of Grace Church.',
  events: 'Check out our Events tab for upcoming activities!',
  prayer: 'Submit a prayer request on our Prayer tab.',
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([{ text: 'Welcome! I\'m Grace, your church AI assistant. How can I help you today?', isUser: false }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const getResponse = (text: string) => {
    const lower = text.toLowerCase()
    for (const [key, response] of Object.entries(RESPONSES)) if (lower.includes(key)) return response
    return 'That\'s a great question! Feel free to contact us.'
  }

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    setMessages(p => [...p, { text: text.trim(), isUser: true }])
    setInput('')
    setTyping(true)
    await new Promise(r => setTimeout(r, 1200))
    setMessages(p => [...p, { text: getResponse(text), isUser: false }])
    setTyping(false)
  }

  return (
    <div className={styles.chatScreen}>
      <h1 className={styles.screenTitle}>CHAT</h1>
      <div className={styles.chatMessages}>
        {messages.map((m, i) => <div key={i} className={m.isUser ? styles.chatUserMsg : styles.chatBotMsg}><p>{m.text}</p></div>)}
        {typing && <div className={styles.chatTyping}>Grace is typing...</div>}
      </div>
      <div className={styles.chatSuggestions}>{SUGGESTIONS.map((s, i) => <button key={i} onClick={() => handleSend(s)} className={styles.chatSuggestBtn}>{s}</button>)}</div>
      <div className={styles.chatInput}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(input)} placeholder="Type a question..." />
        <button onClick={() => handleSend(input)}>Send</button>
      </div>
    </div>
  )
}

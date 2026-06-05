'use client'
import { useState } from 'react'
import styles from './screens.module.css'

const SUGGESTIONS = ['What are the service times?', 'How can I give online?', 'Tell me about the pastor', 'What events are coming up?', 'How do I submit a prayer request?']

const RESPONSES: Record<string, string> = {
  service: 'Our service times are: Sunday 11 AM, Tuesday Evening, and Monday Prayer. We\'d love to see you!',
  time: 'Sunday Worship is at 11 AM EST (In-Person & Online), Tuesday Service at 7 PM, and Monday Prayer at 6 PM.',
  give: 'You can give online through our giving page, text to give, or give in person during service.',
  tithe: 'Thank you for your generous heart! You can give online, by text, or during service.',
  donate: 'We\'re grateful for your support. Visit our Give page for all giving options.',
  pastor: 'Pastor Keith L. Odom leads The Place of Grace Church with a heart for God\'s word.',
  events: 'Check out our Events tab to see what\'s coming up at The Place of Grace!',
  prayer: 'Submit a prayer request on our Prayer tab. You can request anonymously if you\'d like.',
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([{ text: 'Welcome! I\'m Grace, your church AI assistant. How can I help you today?', isUser: false, time: new Date() }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const getResponse = (text: string) => {
    const lower = text.toLowerCase()
    for (const [key, response] of Object.entries(RESPONSES)) {
      if (lower.includes(key)) return response
    }
    return 'That\'s a great question! Feel free to visit our website or contact us for more information.'
  }

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    setMessages(p => [...p, { text: text.trim(), isUser: true, time: new Date() }])
    setInput('')
    setTyping(true)
    await new Promise(r => setTimeout(r, 1200))
    setMessages(p => [...p, { text: getResponse(text), isUser: false, time: new Date() }])
    setTyping(false)
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} className={m.isUser ? styles.user_msg : styles.bot_msg}>
            <p>{m.text}</p>
          </div>
        ))}
        {typing && <div className={styles.typing}>Grace is typing...</div>}
      </div>
      <div className={styles.suggestions}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => handleSend(s)} className={styles.suggest_btn}>{s}</button>
        ))}
      </div>
      <div className={styles.input_area}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(input)} placeholder="Type your question..." />
        <button onClick={() => handleSend(input)}>Send</button>
      </div>
    </div>
  )
}

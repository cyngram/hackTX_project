import { useState } from 'react'
import './RecBox.css'

function RecBox() {
    const [prompt, setPrompt] = useState('')
    const [reply, setReply] = useState(null) //server's answers
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if(!prompt.trim()) return // ignore empty prompts

        setLoading(true)
        const res = await fetch('/api/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt : prompt}),
        })
        const data = await res.json()
        setReply(data)
        setLoading(false)
    }

    return (
        <div className="rec-box">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="What do you feel like watching?"
                value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Thinking...' : 'Search'}
                </button>
            </form>
            {reply && <pre>{JSON.stringify(reply, null, 2)}</pre>}
        </div>
    )
}

export default RecBox
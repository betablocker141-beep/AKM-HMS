/**
 * OPD Queue Display — TV/Screen mode
 * Auto-refreshes every 30 seconds. No auth required.
 */
import { useEffect, useState } from 'react'
import { AKMLogo } from '@/components/shared/AKMLogo'
import { supabase } from '@/lib/supabase/client'
import { todayString } from '@/lib/utils'

interface QueueToken {
  token_number: string
  status: string
  time_slot: string
}

export function OpdQueuePage() {
  const [tokens, setTokens] = useState<QueueToken[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  const fetchTokens = async () => {
    const { data } = await supabase
      .from('opd_tokens')
      .select('token_number, status, time_slot')
      .eq('date', todayString())
      .in('status', ['confirmed', 'seen'])
      .order('token_number')
    if (data) setTokens(data)
  }

  useEffect(() => {
    fetchTokens()
    const interval = setInterval(fetchTokens, 30_000)
    const clock = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => { clearInterval(interval); clearInterval(clock) }
  }, [])

  const currentTokens = tokens.filter((t) => t.status === 'seen')
  const waitingTokens = tokens.filter((t) => t.status === 'confirmed')

  return (
    <div className="min-h-screen bg-maroon-500 text-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <AKMLogo size={64} />
          <div>
            <h1 className="text-3xl font-bold">Alim Khatoon Medicare</h1>
            <p className="text-white/70">OPD Token Queue — Green Town, Lahore</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-mono font-bold">
            {currentTime.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-white/70">
            {currentTime.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Now Serving */}
      <div className="bg-white/10 rounded-2xl p-8 mb-6 text-center">
        <p className="text-lg text-white/70 uppercase tracking-widest mb-2">Now Serving</p>
        {currentTokens.length > 0 ? (
          <div className="token-display text-white">
            {currentTokens[currentTokens.length - 1]?.token_number}
          </div>
        ) : (
          <p className="text-4xl text-white/40">—</p>
        )}
      </div>

      {/* Waiting tokens */}
      <div className="flex-1">
        <p className="text-sm text-white/60 uppercase tracking-widest mb-3">
          Waiting ({waitingTokens.length})
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {waitingTokens.map((t) => (
            <div
              key={t.token_number}
              className="bg-white/10 rounded-xl p-4 text-center"
            >
              <p className="text-xl font-bold">{t.token_number}</p>
              <p className="text-xs text-white/60 mt-1">{t.time_slot}</p>
            </div>
          ))}
          {waitingTokens.length === 0 && (
            <div className="col-span-8 text-center text-white/40 py-8">
              No patients currently waiting
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white/40 text-sm mt-6">
        Auto-refreshes every 30 seconds | Alim Khatoon Medicare HMS
      </div>
    </div>
  )
}

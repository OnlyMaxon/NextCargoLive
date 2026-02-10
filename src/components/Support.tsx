import { useState, useEffect, useRef } from 'react'
import { SupportMessage, User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PaperPlaneRight, ChatCircle } from '@phosphor-icons/react'

interface SupportProps {
  messages: SupportMessage[]
  user: User
  onSendMessage: (message: SupportMessage) => void
}

export function Support({ messages, user, onSendMessage }: SupportProps) {
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const conversationId = user.id
  const conversation = messages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation.length])

  const handleSend = () => {
    if (!messageText.trim()) return

    const newMessage: SupportMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      message: messageText.trim(),
      timestamp: Date.now(),
      isAdmin: false,
      conversationId
    }

    onSendMessage(newMessage)
    setMessageText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      })
    }
  }

  return (
    <div className="h-[calc(100vh-73px-80px)] sm:h-[calc(100vh-85px-96px)] flex flex-col bg-gradient-to-b from-background to-primary/5">
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          minHeight: 0
        }}
      >
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 gradient-bg rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-primary/30 pulse-glow">
              <ChatCircle size={48} weight="duotone" className="text-white sm:w-14 sm:h-14" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 gradient-text">Need Help?</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-2">
              Have questions about your orders or need assistance?
            </p>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8">
              Our support team is here to help! Start a conversation below.
            </p>
            <div className="bg-white/70 backdrop-blur rounded-2xl p-5 sm:p-6 space-y-4 max-w-md w-full border border-white/50 shadow-xl shadow-primary/5">
              {[
                { icon: '📦', title: 'Track Your Orders', desc: 'Get real-time updates on your shipments' },
                { icon: '🚚', title: 'Delivery Questions', desc: 'Ask about shipping times and locations' },
                { icon: '🛟', title: 'Order Issues', desc: 'Report problems with your orders' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-0.5">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            {conversation.map((msg, index) => {
              const showDate = index === 0 || 
                formatDate(msg.timestamp) !== formatDate(conversation[index - 1].timestamp)

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-6">
                      <div className="text-xs font-semibold text-muted-foreground bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                        {formatDate(msg.timestamp)}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex gap-2 sm:gap-3 ${msg.isAdmin ? 'justify-start' : 'justify-end'} mb-2`}>
                    {msg.isAdmin && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-primary/25">
                        <ChatCircle size={18} weight="fill" className="text-white sm:w-[20px] sm:h-[20px]" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'} max-w-[75%] sm:max-w-[70%]`}>
                      {msg.isAdmin && (
                        <span className="text-xs font-bold text-primary mb-1.5 px-1">Support Team</span>
                      )}
                      <div 
                        className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm ${
                          msg.isAdmin 
                            ? 'bg-white/80 backdrop-blur border border-white/50 rounded-tl-md' 
                            : 'gradient-bg text-white rounded-tr-md shadow-lg shadow-primary/20'
                        }`}
                      >
                        <p className="text-[15px] sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      <span className="text-[11px] sm:text-xs mt-1.5 px-1 text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    {!msg.isAdmin && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-primary/25">
                        <span className="text-xs font-bold text-white">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t bg-white/80 backdrop-blur-xl p-3 sm:p-4 shadow-lg">
        <div className="flex gap-2 sm:gap-3 items-end">
          <Textarea
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 min-h-[48px] max-h-[120px] resize-none text-[16px] rounded-2xl sm:rounded-3xl px-4 py-3 focus-visible:ring-2 focus-visible:ring-primary/50 border-primary/20 bg-white/70"
            rows={1}
            style={{ fontSize: '16px' }}
          />
          <Button 
            onClick={handleSend} 
            disabled={!messageText.trim()} 
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl p-0 flex-shrink-0 gradient-bg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            size="icon"
          >
            <PaperPlaneRight size={22} weight="fill" className="text-white sm:w-[24px] sm:h-[24px]" />
          </Button>
        </div>
      </div>
    </div>
  )
}

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
    <div className="h-[calc(100vh-57px-56px)] flex flex-col bg-background">
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
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
              <ChatCircle size={32} weight="duotone" className="text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Our support team is here to help. Start a conversation below.
            </p>
            <div className="bg-muted/30 rounded-xl p-4 space-y-3 max-w-sm w-full border">
              {[
                { icon: '📦', title: 'Track Orders', desc: 'Get updates on shipments' },
                { icon: '🚚', title: 'Delivery Questions', desc: 'Shipping times and locations' },
                { icon: '🛟', title: 'Order Issues', desc: 'Report problems' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 bg-background rounded-lg">
                  <div className="text-lg">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
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
                    <div className="flex justify-center my-4">
                      <div className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                        {formatDate(msg.timestamp)}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex gap-2 ${msg.isAdmin ? 'justify-start' : 'justify-end'} mb-2`}>
                    {msg.isAdmin && (
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <ChatCircle size={16} weight="fill" className="text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'} max-w-[75%]`}>
                      {msg.isAdmin && (
                        <span className="text-xs font-medium text-muted-foreground mb-1 px-1">Support</span>
                      )}
                      <div 
                        className={`rounded-xl px-3 py-2 ${
                          msg.isAdmin 
                            ? 'bg-muted border rounded-tl-sm' 
                            : 'bg-primary text-primary-foreground rounded-tr-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      <span className="text-[10px] mt-1 px-1 text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    {!msg.isAdmin && (
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-medium text-primary-foreground">
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

      <div className="border-t bg-background p-3">
        <div className="flex gap-2 items-end">
          <Textarea
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 min-h-[40px] max-h-[100px] resize-none text-[16px] rounded-xl px-3 py-2"
            rows={1}
            style={{ fontSize: '16px' }}
          />
          <Button 
            onClick={handleSend} 
            disabled={!messageText.trim()} 
            className="h-10 w-10 rounded-lg p-0 flex-shrink-0"
            size="icon"
          >
            <PaperPlaneRight size={18} weight="fill" className="text-primary-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )
}

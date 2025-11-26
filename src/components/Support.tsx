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
    <div className="fixed inset-0 top-[73px] bottom-0 flex flex-col bg-background">
      <div className="px-4 py-3 sm:py-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <ChatCircle size={22} weight="fill" className="text-primary-foreground sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Support Chat</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">We usually reply within 1 hour</p>
          </div>
        </div>
      </div>

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
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ChatCircle size={40} weight="duotone" className="text-primary sm:w-14 sm:h-14" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Need Help?</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-2">
              Have questions about your orders or need assistance?
            </p>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8">
              Our support team is here to help! Start a conversation below.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 sm:p-5 space-y-3 max-w-md w-full border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Track Your Orders</p>
                  <p className="text-xs text-muted-foreground">Get real-time updates on your shipments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Delivery Questions</p>
                  <p className="text-xs text-muted-foreground">Ask about shipping times and locations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Order Issues</p>
                  <p className="text-xs text-muted-foreground">Report problems with your orders</p>
                </div>
              </div>
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
                      <div className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                        {formatDate(msg.timestamp)}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex gap-2 sm:gap-3 ${msg.isAdmin ? 'justify-start' : 'justify-end'} mb-1`}>
                    {msg.isAdmin && (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <ChatCircle size={16} weight="fill" className="text-primary-foreground sm:w-[18px] sm:h-[18px]" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'} max-w-[75%] sm:max-w-[70%]`}>
                      {msg.isAdmin && (
                        <span className="text-xs font-semibold text-primary mb-1 px-1">Support Team</span>
                      )}
                      <div 
                        className={`rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 ${
                          msg.isAdmin 
                            ? 'bg-muted rounded-tl-sm' 
                            : 'bg-primary text-primary-foreground rounded-tr-sm'
                        }`}
                      >
                        <p className="text-[15px] sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      <span className={`text-[11px] sm:text-xs mt-1 px-1 ${
                        msg.isAdmin ? 'text-muted-foreground' : 'text-muted-foreground'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    {!msg.isAdmin && (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border-2 border-primary/20">
                        <span className="text-xs font-bold text-primary">
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

      <div className="border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 p-3 sm:p-4 pb-safe safe-area-inset-bottom">
        <div className="flex gap-2 sm:gap-3 items-end">
          <Textarea
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 min-h-[44px] max-h-[120px] resize-none text-[16px] rounded-2xl sm:rounded-3xl px-4 py-3 focus-visible:ring-2"
            rows={1}
            style={{ fontSize: '16px' }}
          />
          <Button 
            onClick={handleSend} 
            disabled={!messageText.trim()} 
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full p-0 flex-shrink-0 shadow-md"
            size="icon"
          >
            <PaperPlaneRight size={20} weight="fill" className="sm:w-[22px] sm:h-[22px]" />
          </Button>
        </div>
      </div>
    </div>
  )
}

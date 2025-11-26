import { useState } from 'react'
import { SupportMessage, User } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaperPlaneRight, ChatCircle } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SupportProps {
  messages: SupportMessage[]
  user: User
  onSendMessage: (message: SupportMessage) => void
}

export function Support({ messages, user, onSendMessage }: SupportProps) {
  const [messageText, setMessageText] = useState('')

  const conversationId = user.id
  const conversation = messages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp)

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
        month: 'short',
        year: 'numeric'
      })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="p-5 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <ChatCircle size={26} weight="fill" className="text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight">Support Chat</h2>
            <p className="text-sm text-muted-foreground">We're here to help you</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {conversation.length === 0 ? (
          <Alert className="text-base">
            <ChatCircle className="h-5 w-5" />
            <AlertDescription className="text-base leading-relaxed">
              No messages yet. Start a conversation with our support team!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {conversation.map((msg, index) => {
              const showDate = index === 0 || 
                formatDate(msg.timestamp) !== formatDate(conversation[index - 1].timestamp)

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-sm text-muted-foreground bg-muted px-4 py-1.5 rounded-full">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <Card className={`max-w-[85%] ${msg.isAdmin ? 'bg-card' : 'bg-primary text-primary-foreground'}`}>
                      <div className="p-4 space-y-1.5">
                        {msg.isAdmin && (
                          <p className="text-sm font-semibold text-primary">Support Team</p>
                        )}
                        <p className="text-base leading-relaxed break-words">{msg.message}</p>
                        <p className={`text-sm ${msg.isAdmin ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-12 text-base"
          />
          <Button onClick={handleSend} disabled={!messageText.trim()} className="h-12 px-4">
            <PaperPlaneRight size={22} weight="bold" />
          </Button>
        </div>
      </div>
    </div>
  )
}

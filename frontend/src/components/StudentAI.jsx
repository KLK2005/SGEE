import { useState, useRef, useEffect } from 'react'
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function StudentAI() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Bonjour! Je suis votre assistant IA. Je peux vous aider avec:\n• Informations sur l\'enrôlement\n• Statut de vos documents\n• Informations sur les paiements\n• Centres d\'examen et de dépôt\n• Questions générales',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    const responses = {
      enrolement: {
        keywords: ['enrôlement', 'enrolement', 'inscription', 'inscrire'],
        response: 'Pour l\'enrôlement:\n1. Accédez à la section "Enrôlement"\n2. Remplissez le formulaire\n3. Sélectionnez votre filière\n4. Confirmez votre enrôlement'
      },
      documents: {
        keywords: ['document', 'fichier', 'upload', 'télécharger'],
        response: 'Pour gérer vos documents:\n1. Allez dans "Mes Documents"\n2. Cliquez sur "Ajouter un document"\n3. Sélectionnez le type\n4. Téléchargez votre fichier'
      },
      paiement: {
        keywords: ['paiement', 'payer', 'montant', 'frais'],
        response: 'Informations sur les paiements:\n• Montant minimum: 50,000 FCFA\n• Vous pouvez payer en plusieurs fois\n• Allez dans "Mes Paiements"'
      },
      centres: {
        keywords: ['centre', 'examen', 'dépôt', 'lieu'],
        response: 'Pour trouver les centres:\n1. Allez dans "Centres d\'Examen" ou "Centres de Dépôt"\n2. Consultez la liste complète\n3. Vérifiez les horaires'
      }
    }

    for (const [, data] of Object.entries(responses)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response
      }
    }

    return 'Je n\'ai pas bien compris. Pouvez-vous reformuler?\n\nJe peux vous aider avec:\n• Enrôlement\n• Documents\n• Paiements\n• Centres'
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setLoading(false)
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all z-40"
          title="Assistant IA"
        >
          <SparklesIcon className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              <h3 className="font-bold">Assistant IA</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import { useState, useRef, useEffect } from 'react'
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

const FAQ_DATA = [
  {
    keywords: ['inscription', 'enrôlement', 'comment', 'inscrire'],
    question: "Comment s'inscrire ?",
    answer: "Pour vous inscrire, créez un compte, remplissez le formulaire d'enrôlement avec vos informations personnelles et académiques, puis téléversez les documents requis."
  },
  {
    keywords: ['documents', 'pièces', 'fournir', 'nécessaires'],
    question: "Quels documents sont nécessaires ?",
    answer: "Vous devez fournir : une photo d'identité, un acte de naissance, votre diplôme ou attestation, et un certificat de nationalité."
  },
  {
    keywords: ['paiement', 'frais', 'coût', 'prix', 'montant'],
    question: "Quel est le montant des frais ?",
    answer: "Les frais d'enrôlement s'élèvent à 50 000 FCFA. Vous pouvez payer par Mobile Money, virement bancaire ou en espèces."
  },
  {
    keywords: ['validation', 'délai', 'combien de temps', 'attendre'],
    question: "Combien de temps pour la validation ?",
    answer: "La validation de votre dossier prend généralement 2 à 5 jours ouvrables après soumission complète de tous les documents."
  },
  {
    keywords: ['fiche', 'télécharger', 'document officiel'],
    question: "Comment télécharger ma fiche ?",
    answer: "Une fois votre enrôlement validé et votre paiement confirmé, vous pouvez télécharger votre fiche d'enrôlement depuis la section 'Mes Documents'."
  },
  {
    keywords: ['quitus', 'attestation paiement'],
    question: "Qu'est-ce que le quitus ?",
    answer: "Le quitus est une attestation de paiement que vous recevez après validation de votre paiement. Il confirme que vous avez réglé les frais d'enrôlement."
  },
  {
    keywords: ['modifier', 'changer', 'corriger', 'informations'],
    question: "Puis-je modifier mes informations ?",
    answer: "Oui, vous pouvez modifier vos informations avant la validation finale. Après validation, contactez l'administration pour toute modification."
  },
  {
    keywords: ['contact', 'aide', 'support', 'assistance'],
    question: "Comment contacter le support ?",
    answer: "Pour toute assistance, vous pouvez nous contacter par email à support@sgee.com ou par téléphone au +237 XXX XXX XXX."
  },
  {
    keywords: ['filière', 'département', 'choix'],
    question: "Comment choisir ma filière ?",
    answer: "Consultez la liste des filières disponibles lors de votre inscription. Chaque filière est rattachée à un département spécifique."
  },
  {
    keywords: ['rejet', 'refus', 'document rejeté'],
    question: "Que faire si mon document est rejeté ?",
    answer: "Si un document est rejeté, vous recevrez un email avec le motif. Vous devrez téléverser un nouveau document conforme aux exigences."
  }
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Bonjour ! Je suis l'assistant virtuel du SGEE. Comment puis-je vous aider aujourd'hui ?",
      time: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 1) {
      // Afficher des suggestions au démarrage
      setSuggestions([
        "Comment s'inscrire ?",
        "Quels documents fournir ?",
        "Montant des frais ?"
      ])
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const findAnswer = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Chercher dans la FAQ
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq.answer
      }
    }

    // Réponse par défaut
    return "Je n'ai pas compris votre question. Voici quelques sujets sur lesquels je peux vous aider : inscription, documents requis, paiement, validation, téléchargement de documents. Vous pouvez aussi contacter notre support à support@sgee.com."
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage = {
      type: 'user',
      text: inputText,
      time: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setSuggestions([])

    // Simuler un délai de réponse
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: findAnswer(inputText),
        time: new Date()
      }
      setMessages(prev => [...prev, botResponse])

      // Proposer des suggestions liées
      const relatedQuestions = FAQ_DATA
        .filter(faq => !faq.keywords.some(k => inputText.toLowerCase().includes(k)))
        .slice(0, 3)
        .map(faq => faq.question)
      
      if (relatedQuestions.length > 0) {
        setSuggestions(relatedQuestions)
      }
    }, 500)
  }

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion)
    handleSendMessage()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 z-40"
        title="Assistance"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl flex flex-col z-40 max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Assistant SGEE</h3>
            <p className="text-xs text-primary-100">En ligne</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-primary-100' : 'text-gray-400'
              }`}>
                {message.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 mb-2">Suggestions :</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

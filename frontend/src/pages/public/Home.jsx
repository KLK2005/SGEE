import { Link } from 'react-router-dom'
import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Enrôlement en ligne',
      description: 'Soumettez votre dossier d\'inscription entièrement en ligne, sans déplacement.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Documents sécurisés',
      description: 'Vos documents sont générés avec un QR Code unique pour garantir leur authenticité.'
    },
    {
      icon: ClockIcon,
      title: 'Suivi en temps réel',
      description: 'Suivez l\'état de votre dossier et recevez des notifications à chaque étape.'
    },
    {
      icon: CheckBadgeIcon,
      title: 'Paiement simplifié',
      description: 'Effectuez vos paiements et téléchargez votre quitus instantanément.'
    }
  ]

  const stats = [
    { value: '5000+', label: 'Étudiants enrôlés' },
    { value: '15', label: 'Filières disponibles' },
    { value: '98%', label: 'Taux de satisfaction' },
    { value: '24h', label: 'Délai de traitement' }
  ]

  const steps = [
    { num: 1, title: 'Créez votre compte', desc: 'Inscrivez-vous avec votre email' },
    { num: 2, title: 'Remplissez le formulaire', desc: 'Saisissez vos informations personnelles' },
    { num: 3, title: 'Téléversez vos documents', desc: 'Photo, acte de naissance, diplômes' },
    { num: 4, title: 'Recevez votre fiche', desc: 'Téléchargez votre fiche d\'enrôlement' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SGEE</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/verify" className="text-gray-600 hover:text-primary-600 transition-colors">
                Vérifier un document
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Système de Gestion<br />
              <span className="text-primary-200">d'Enrôlement des Étudiants</span>
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Simplifiez votre inscription universitaire. Soumettez votre dossier en ligne, 
              suivez son traitement et recevez vos documents officiels en quelques clics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg">
                Commencer mon enrôlement
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-primary-500/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-500/40 transition-colors border border-primary-400/30">
                J'ai déjà un compte
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir SGEE ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme moderne conçue pour simplifier votre parcours d'inscription
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              4 étapes simples pour compléter votre enrôlement
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary-200"></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg">
              Démarrer maintenant
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <UserGroupIcon className="w-16 h-16 text-primary-200 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rejoignez des milliers d'étudiants
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Inscrivez-vous dès maintenant et bénéficiez d'un processus d'enrôlement simplifié
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg">
            Créer mon compte gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AcademicCapIcon className="w-8 h-8 text-primary-500" />
                <span className="text-xl font-bold text-white">SGEE</span>
              </div>
              <p className="text-sm">
                Système de Gestion d'Enrôlement des Étudiants - Simplifiez votre inscription universitaire.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Connexion</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Inscription</Link></li>
                <li><Link to="/verify" className="hover:text-white transition-colors">Vérifier un document</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: contact@sgee.edu</li>
                <li>Tél: +243 XXX XXX XXX</li>
                <li>Adresse: Kinshasa, RDC</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Horaires</h4>
              <ul className="space-y-2 text-sm">
                <li>Lun - Ven: 8h00 - 17h00</li>
                <li>Sam: 8h00 - 12h00</li>
                <li>Dim: Fermé</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SGEE - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

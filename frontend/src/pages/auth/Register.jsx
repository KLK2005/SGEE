import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import OAuthButtons from '../../components/OAuthButtons'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    const result = await registerUser({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    })
    
    if (result.success) {
      toast.success('Inscription réussie !')
      navigate('/')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="animate-fadeInUp">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Inscription
        </h2>
        <p className="text-gray-600">Créez votre compte étudiant</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nom</label>
            <input
              type="text"
              className={`input-field ${errors.nom ? 'border-red-500' : ''}`}
              placeholder="Votre nom"
              {...register('nom', { required: 'Le nom est requis' })}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>

          <div>
            <label className="label">Prénom</label>
            <input
              type="text"
              className={`input-field ${errors.prenom ? 'border-red-500' : ''}`}
              placeholder="Votre prénom"
              {...register('prenom', { required: 'Le prénom est requis' })}
            />
            {errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="votre@email.com"
            {...register('email', {
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Minimum 8 caractères',
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="label">Confirmer le mot de passe</label>
          <input
            type="password"
            className={`input-field ${errors.password_confirmation ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            {...register('password_confirmation', {
              required: 'Confirmation requise',
              validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
            })}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-lg font-semibold">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Inscription en cours...
            </span>
          ) : (
            'S\'inscrire'
          )}
        </button>
      </form>

      <div className="mt-6">
        <OAuthButtons
          onSuccess={(data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Inscription OAuth réussie !');
            navigate('/student/dashboard');
          }}
          onError={(message) => {
            toast.error(message || 'Erreur lors de l\'inscription OAuth');
          }}
        />
      </div>

      <p className="text-center text-gray-600 mt-8">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-blue-600 hover:text-purple-600 font-semibold link-hover transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

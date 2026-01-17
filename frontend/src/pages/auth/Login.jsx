import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import OAuthButtons from '../../components/OAuthButtons'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data)
    if (result.success) {
      toast.success('Connexion réussie !')
      navigate('/')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="animate-fadeInUp">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Connexion
        </h2>
        <p className="text-gray-600">Accédez à votre espace personnel</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="group">
          <label className="label flex items-center gap-2">
            <span>Email</span>
          </label>
          <input
            type="email"
            className={`input-field ${errors.email ? 'border-red-500 shake' : ''}`}
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

        <div className="group">
          <label className="label flex items-center gap-2">
            <span>Mot de passe</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`input-field pr-10 ${errors.password ? 'border-red-500 shake' : ''}`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 caractères',
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-lg font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Connexion en cours...
            </span>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      <div className="mt-6">
        <OAuthButtons
          onSuccess={(data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Connexion OAuth réussie !');
            
            if (data.user.role.nom_role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/student/dashboard');
            }
          }}
          onError={(message) => {
            toast.error(message || 'Erreur lors de la connexion OAuth');
          }}
        />
      </div>

      <p className="text-center text-gray-600 mt-8">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-blue-600 hover:text-purple-600 font-semibold link-hover transition-colors">
          S'inscrire maintenant
        </Link>
      </p>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Inscription</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
          {isLoading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

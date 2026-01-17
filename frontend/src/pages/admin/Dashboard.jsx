import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { statistiqueService } from '../../services/statistiqueService'
import {
  UserGroupIcon,
  AcademicCapIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: statistiqueService.getDashboard,
  })

  const stats = dashboardData?.data

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Candidats',
      value: stats?.candidats?.total || 0,
      subtitle: `+${stats?.candidats?.nouveaux_ce_mois || 0} ce mois`,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Enrôlements Validés',
      value: stats?.enrolements?.valides || 0,
      subtitle: `${stats?.enrolements?.en_attente || 0} en attente`,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Paiements Validés',
      value: stats?.paiements?.valides || 0,
      subtitle: `${(stats?.paiements?.total_montant || 0).toLocaleString()} FCFA`,
      icon: CreditCardIcon,
      color: 'bg-purple-500',
    },
  ]

  // Chart data for enrollment status
  const enrolementChartData = {
    labels: ['Validés', 'En attente', 'Rejetés'],
    datasets: [{
      data: [
        stats?.enrolements?.valides || 0,
        stats?.enrolements?.en_attente || 0,
        stats?.enrolements?.rejetes || 0,
      ],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      borderWidth: 0,
    }],
  }

  // Chart data for filiere distribution
  const filiereChartData = {
    labels: stats?.repartition_par_filiere?.slice(0, 5).map(f => f.filiere) || [],
    datasets: [{
      label: 'Candidats',
      data: stats?.repartition_par_filiere?.slice(0, 5).map(f => f.total) || [],
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }],
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tableau de bord administrateur
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={stat.title} className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <span className="text-green-600">↗</span>
                  {stat.subtitle}
                </p>
              </div>
              <div className={`p-4 ${stat.color} rounded-2xl shadow-lg transform transition-transform hover:scale-110`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Status Chart */}
        <div className="card animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
            État des enrôlements
          </h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={enrolementChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } },
                },
              }}
            />
          </div>
        </div>

        {/* Filiere Distribution Chart */}
        <div className="card animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
            Top 5 Filières
          </h2>
          <div className="h-64">
            <Bar
              data={filiereChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card animate-fadeInUp" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
            Répartition par département
          </h2>
          <Link to="/admin/statistiques" className="text-blue-600 hover:text-purple-600 text-sm font-semibold link-hover flex items-center gap-1">
            Voir plus
            <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Département</th>
                <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Candidats</th>
              </tr>
            </thead>
            <tbody>
              {stats?.repartition_par_departement?.slice(0, 5).map((dept, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-900">{dept.departement}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                      {dept.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/admin/candidats', icon: UserGroupIcon, label: 'Gérer Candidats', color: 'from-blue-500 to-blue-600' },
          { to: '/admin/paiements', icon: CreditCardIcon, label: 'Valider Paiements', color: 'from-green-500 to-green-600' },
          { to: '/admin/filieres', icon: AcademicCapIcon, label: 'Gérer Filières', color: 'from-purple-500 to-purple-600' },
          { to: '/admin/statistiques', icon: CheckCircleIcon, label: 'Statistiques', color: 'from-orange-500 to-orange-600' },
        ].map((action, index) => (
          <Link 
            key={action.to} 
            to={action.to} 
            className="card hover:shadow-2xl transition-all duration-300 text-center group transform hover:-translate-y-1 animate-fadeInUp"
            style={{ animationDelay: `${600 + index * 50}ms` }}
          >
            <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <action.icon className="w-7 h-7 text-white" />
            </div>
            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{action.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

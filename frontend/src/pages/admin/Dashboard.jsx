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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 ${stat.color} rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Status Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">État des enrôlements</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={enrolementChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </div>
        </div>

        {/* Filiere Distribution Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Top 5 Filières</h2>
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
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Répartition par département</h2>
          <Link to="/admin/statistiques" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Voir plus →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Candidats</th>
              </tr>
            </thead>
            <tbody>
              {stats?.repartition_par_departement?.slice(0, 5).map((dept, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.departement}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{dept.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/admin/candidats" className="card hover:shadow-md transition-shadow text-center">
          <UserGroupIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Gérer Candidats</p>
        </Link>
        <Link to="/admin/paiements" className="card hover:shadow-md transition-shadow text-center">
          <CreditCardIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Valider Paiements</p>
        </Link>
        <Link to="/admin/filieres" className="card hover:shadow-md transition-shadow text-center">
          <AcademicCapIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Gérer Filières</p>
        </Link>
        <Link to="/admin/statistiques" className="card hover:shadow-md transition-shadow text-center">
          <CheckCircleIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Statistiques</p>
        </Link>
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { statistiqueService } from '../../services/statistiqueService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

export default function Statistiques() {
  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ['stats-dashboard'],
    queryFn: statistiqueService.getDashboard,
  })

  const { data: evolutionData, isLoading: loadingEvolution } = useQuery({
    queryKey: ['stats-evolution'],
    queryFn: () => statistiqueService.getEvolution(30),
  })

  const { data: filiereData } = useQuery({
    queryKey: ['stats-filiere'],
    queryFn: statistiqueService.getParFiliere,
  })

  const { data: paiementData } = useQuery({
    queryKey: ['stats-paiements'],
    queryFn: statistiqueService.getPaiements,
  })

  const stats = dashboardData?.data
  const evolution = evolutionData?.data || []
  const filieres = filiereData?.data || []
  const paiements = paiementData?.data

  if (loadingDashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Evolution chart
  const evolutionChartData = {
    labels: evolution.map(e => new Date(e.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })),
    datasets: [{
      label: 'Inscriptions',
      data: evolution.map(e => e.total),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  }

  // Filiere chart
  const filiereChartData = {
    labels: filieres.slice(0, 8).map(f => f.nom),
    datasets: [{
      label: 'Candidats',
      data: filieres.slice(0, 8).map(f => f.total_candidats),
      backgroundColor: [
        '#3b82f6', '#22c55e', '#eab308', '#ef4444',
        '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
      ],
    }],
  }

  // Paiement status chart
  const paiementChartData = {
    labels: paiements?.par_statut?.map(p => p.statut_paiement === 'valide' ? 'Validés' : p.statut_paiement === 'en_attente' ? 'En attente' : 'Rejetés') || [],
    datasets: [{
      data: paiements?.par_statut?.map(p => p.total) || [],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
    }],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Candidats</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.candidats?.total || 0}</p>
          <p className="text-sm text-green-600">+{stats?.candidats?.nouveaux_ce_mois || 0} ce mois</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Enrôlements Validés</p>
          <p className="text-3xl font-bold text-green-600">{stats?.enrolements?.valides || 0}</p>
          <p className="text-sm text-gray-500">{stats?.enrolements?.en_attente || 0} en attente</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Paiements Validés</p>
          <p className="text-3xl font-bold text-primary-600">{stats?.paiements?.valides || 0}</p>
          <p className="text-sm text-gray-500">{stats?.paiements?.en_attente || 0} en attente</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Montant Total</p>
          <p className="text-3xl font-bold text-purple-600">
            {((stats?.paiements?.total_montant || 0) / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm text-gray-500">FCFA</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Évolution des inscriptions (30 jours)</h2>
          <div className="h-64">
            <Line
              data={evolutionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Répartition par filière</h2>
          <div className="h-64">
            <Bar
              data={filiereChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">État des paiements</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={paiementChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Top Filières</h2>
          <div className="space-y-3">
            {filieres.slice(0, 6).map((filiere, index) => (
              <div key={filiere.id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{filiere.nom}</span>
                    <span className="text-sm text-gray-500">{filiere.total_candidats} candidats</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(filiere.total_candidats / (filieres[0]?.total_candidats || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departement Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Répartition par département</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Candidats</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats?.repartition_par_departement?.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.departement}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{dept.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

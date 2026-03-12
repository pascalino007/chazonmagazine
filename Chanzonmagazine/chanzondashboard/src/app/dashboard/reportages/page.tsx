import { ReportageForm } from '@/components/ReportageForm'

export default function ReportagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Reportages</h1>
        <p className="text-gray-400">Gérer les reportages et documentaires</p>
      </div>

      <div className="bg-navy-700/50 rounded-lg border border-gray-600/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Créer un nouveau reportage</h2>
        <ReportageForm />
      </div>
    </div>
  )
}

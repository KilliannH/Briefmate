"use client"

import { useState, useTransition } from "react"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { getExportData } from "@/app/actions/export"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Papa from "papaparse"

type ExportBriefsProps = {
  filters?: {
    search?: string
    status?: string
    priority?: string
    client?: string
  }
}

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  IN_PROGRESS: "En cours",
  IN_REVIEW: "En révision",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
}

const priorityLabels: Record<string, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
}

export function ExportBriefs({ filters }: ExportBriefsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const exportToPDF = async () => {
    startTransition(async () => {
      const data = await getExportData(filters)
      
      const doc = new jsPDF()
      
      // Titre
      doc.setFontSize(18)
      doc.text("Briefmate - Export des briefs", 14, 20)
      
      // Date
      doc.setFontSize(10)
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28)
      
      // Table
      autoTable(doc, {
        startY: 35,
        head: [['Titre', 'Client', 'Statut', 'Priorité', 'Deadline', 'Budget']],
        body: data.map(brief => [
          brief.title,
          brief.clientName,
          statusLabels[brief.status] || brief.status,
          priorityLabels[brief.priority] || brief.priority,
          brief.deadline ? new Date(brief.deadline).toLocaleDateString('fr-FR') : '-',
          brief.budget ? `${brief.budget.toLocaleString('fr-FR')} €` : '-',
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] },
      })
      
      doc.save(`briefmate-export-${new Date().toISOString().split('T')[0]}.pdf`)
      setIsOpen(false)
    })
  }

  const exportToCSV = async () => {
    startTransition(async () => {
      const data = await getExportData(filters)
      
      const csvData = data.map(brief => ({
        Titre: brief.title,
        Description: brief.description,
        Client: brief.clientName,
        Statut: statusLabels[brief.status] || brief.status,
        Priorité: priorityLabels[brief.priority] || brief.priority,
        Deadline: brief.deadline ? new Date(brief.deadline).toLocaleDateString('fr-FR') : '',
        Budget: brief.budget || '',
        'Heures estimées': brief.estimatedHours || '',
        'Nombre de tâches': brief.tasksCount,
        'Date de création': new Date(brief.createdAt).toLocaleDateString('fr-FR'),
      }))
      
      const csv = Papa.unparse(csvData, {
        delimiter: ',',
        header: true,
      })
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `briefmate-export-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      
      setIsOpen(false)
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        disabled={isPending}
      >
        <Download className="w-4 h-4" />
        Exporter
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={exportToPDF}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                Exporter en PDF
              </button>
              <button
                onClick={exportToCSV}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exporter en CSV
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
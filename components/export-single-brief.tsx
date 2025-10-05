"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
}

type BriefData = {
  title: string
  description: string | null
  status: string
  priority: string
  clientName: string | null
  deadline: Date | null
  budget: number | null
  estimatedHours: number | null
  createdAt: Date
  tasks: Task[]
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

export function ExportSingleBrief({ brief }: { brief: BriefData }) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPDF = () => {
    setIsExporting(true)
    
    const doc = new jsPDF()
    let yPosition = 20

    // En-tête
    doc.setFontSize(20)
    doc.text(brief.title, 14, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, yPosition)
    yPosition += 15

    // Informations générales
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("Informations", 14, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    const infos = [
      `Client: ${brief.clientName || 'Aucun'}`,
      `Statut: ${statusLabels[brief.status] || brief.status}`,
      `Priorité: ${priorityLabels[brief.priority] || brief.priority}`,
      brief.deadline ? `Deadline: ${new Date(brief.deadline).toLocaleDateString('fr-FR')}` : null,
      brief.budget ? `Budget: ${brief.budget} €` : null,
      brief.estimatedHours ? `Heures estimées: ${brief.estimatedHours}h` : null,
      `Créé le: ${new Date(brief.createdAt).toLocaleDateString('fr-FR')}`,
    ].filter(Boolean)

    infos.forEach(info => {
      if (info) {
        doc.text(info, 14, yPosition)
        yPosition += 6
      }
    })

    // Description
    if (brief.description) {
      yPosition += 8
      doc.setFontSize(14)
      doc.text("Description", 14, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      const splitDescription = doc.splitTextToSize(brief.description, 180)
      doc.text(splitDescription, 14, yPosition)
      yPosition += splitDescription.length * 6 + 8
    }

    // Tâches
    if (brief.tasks.length > 0) {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.text(`Tâches (${brief.tasks.length})`, 14, yPosition)
      yPosition += 8

      autoTable(doc, {
        startY: yPosition,
        head: [['Statut', 'Titre', 'Description']],
        body: brief.tasks.map(task => [
          task.completed ? 'V' : 'O',
          task.title,
          task.description || '-',
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 60 },
          2: { cellWidth: 110 },
        },
      })
    }

    doc.save(`${brief.title.toLowerCase().replace(/\s+/g, '-')}.pdf`)
    setIsExporting(false)
  }

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      title="Exporter en PDF"
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          Export...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          Exporter PDF
        </>
      )}
    </button>
  )
}
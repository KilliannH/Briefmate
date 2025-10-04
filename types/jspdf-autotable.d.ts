declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf'
  
  interface AutoTableOptions {
    startY?: number
    head?: any[][]
    body?: any[][]
    styles?: any
    headStyles?: any
    columnStyles?: any
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void
  
  export default autoTable
}
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Result } from '@/types/result'
import { formatDate } from './utils'

export interface PDFGeneratorOptions {
  patientName?: string
  dateOfBirth?: string
}

export async function generatePDFFromElement(
  element: HTMLElement,
  fileName: string = 'lab-report.pdf'
): Promise<void> {
  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    
    // Calculate dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Download PDF
    pdf.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

export function generateResultPDF(
  result: Result,
  options: PDFGeneratorOptions = {}
): jsPDF {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // Set up document
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin
  
  // Header
  pdf.setFillColor(16, 185, 129) // green-500
  pdf.rect(0, 0, pageWidth, 30, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.text('Ez LabTesting', margin, yPosition)
  
  yPosition += 10
  pdf.setFontSize(12)
  pdf.text('Laboratory Test Report', margin, yPosition)
  
  // Reset text color
  pdf.setTextColor(0, 0, 0)
  yPosition += 20
  
  // Patient Information
  if (options.patientName || options.dateOfBirth) {
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Patient Information', margin, yPosition)
    yPosition += 8
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    if (options.patientName) {
      pdf.text(`Name: ${options.patientName}`, margin, yPosition)
      yPosition += 6
    }
    
    if (options.dateOfBirth) {
      pdf.text(`Date of Birth: ${options.dateOfBirth}`, margin, yPosition)
      yPosition += 6
    }
    
    yPosition += 5
  }
  
  // Test Information
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Test Information', margin, yPosition)
  yPosition += 8
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Test Name: ${result.testName}`, margin, yPosition)
  yPosition += 6
  
  if (result.completedAt) {
    pdf.text(`Completed: ${formatDate(result.completedAt)}`, margin, yPosition)
    yPosition += 6
  }
  
  pdf.text(`Report Date: ${formatDate(new Date().toISOString())}`, margin, yPosition)
  yPosition += 10
  
  // Results Table Header
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Test Results', margin, yPosition)
  yPosition += 8
  
  // Table header
  pdf.setFillColor(241, 245, 249) // slate-100
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F')
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Biomarker', margin + 2, yPosition)
  pdf.text('Result', margin + 70, yPosition)
  pdf.text('Reference Range', margin + 100, yPosition)
  pdf.text('Status', margin + 150, yPosition)
  
  yPosition += 8
  
  // Table rows
  pdf.setFont('helvetica', 'normal')
  result.biomarkers.forEach((biomarker, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - margin - 20) {
      pdf.addPage()
      yPosition = margin
    }
    
    // Alternate row background
    if (index % 2 === 1) {
      pdf.setFillColor(249, 250, 251) // gray-50
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
    }
    
    // Biomarker name
    pdf.text(biomarker.name, margin + 2, yPosition)
    
    // Result value with unit
    pdf.text(`${biomarker.value} ${biomarker.unit}`, margin + 70, yPosition)
    
    // Reference range
    pdf.text(`${biomarker.referenceRange} ${biomarker.unit}`, margin + 100, yPosition)
    
    // Status with color
    const status = biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)
    
    // Set status color
    switch (biomarker.status) {
      case 'normal':
        pdf.setTextColor(34, 197, 94) // green-500
        break
      case 'low':
        pdf.setTextColor(59, 130, 246) // blue-500
        break
      case 'high':
        pdf.setTextColor(249, 115, 22) // orange-500
        break
      case 'critical':
        pdf.setTextColor(239, 68, 68) // red-500
        break
      default:
        pdf.setTextColor(0, 0, 0)
    }
    
    pdf.text(status, margin + 150, yPosition)
    pdf.setTextColor(0, 0, 0) // Reset color
    
    yPosition += 8
  })
  
  yPosition += 10
  
  // Interpretation
  if (result.interpretation) {
    // Check if we need a new page
    if (yPosition > pageHeight - margin - 40) {
      pdf.addPage()
      yPosition = margin
    }
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Clinical Interpretation', margin, yPosition)
    yPosition += 8
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    
    // Split interpretation into lines
    const interpretationLines = pdf.splitTextToSize(
      result.interpretation,
      pageWidth - 2 * margin
    )
    
    interpretationLines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 10) {
        pdf.addPage()
        yPosition = margin
      }
      pdf.text(line, margin, yPosition)
      yPosition += 5
    })
    
    yPosition += 10
  }
  
  // Disclaimer
  if (yPosition > pageHeight - margin - 30) {
    pdf.addPage()
    yPosition = margin
  }
  
  pdf.setFillColor(254, 243, 199) // orange-100
  const disclaimerHeight = 35
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, disclaimerHeight, 'F')
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(120, 53, 15) // orange-900
  pdf.text('Important Notice', margin + 2, yPosition)
  yPosition += 6
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(146, 64, 14) // orange-800
  
  const disclaimerText = 'These results are for informational purposes only and should not be used for self-diagnosis. Please consult with a healthcare provider to discuss your results and any necessary follow-up care.'
  const disclaimerLines = pdf.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 4)
  
  disclaimerLines.forEach((line: string) => {
    pdf.text(line, margin + 2, yPosition)
    yPosition += 4
  })
  
  // Footer
  pdf.setTextColor(150, 150, 150)
  pdf.setFontSize(8)
  pdf.text(
    'Ez LabTesting - Confidential Medical Report',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  )
  
  return pdf
}

export async function downloadResultPDF(
  result: Result,
  options: PDFGeneratorOptions = {}
): Promise<void> {
  try {
    const pdf = generateResultPDF(result, options)
    const fileName = `lab-report-${result.testName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    throw new Error('Failed to download PDF')
  }
}


export interface Result {
  id: string
  orderId: string
  testName: string
  status: 'pending' | 'completed'
  completedAt?: string
  biomarkers: Biomarker[]
  interpretation?: string
  pdfUrl?: string
}

export interface Biomarker {
  name: string
  value: string
  unit: string
  referenceRange: string
  status: 'normal' | 'low' | 'high' | 'critical'
  flag?: string
}


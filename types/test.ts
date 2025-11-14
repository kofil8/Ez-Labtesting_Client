export interface Test {
  id: string
  name: string
  description: string
  category: 'hormone' | 'std' | 'general' | 'nutrition' | 'thyroid' | 'cardiac' | 'metabolic'
  price: number
  cptCodes: string[]
  labCode: string
  labName: string
  turnaroundDays: number
  sampleType: string
  preparation?: string
  keywords?: string[]
  enabled: boolean
}

export interface TestCategory {
  id: string
  name: string
  description: string
}


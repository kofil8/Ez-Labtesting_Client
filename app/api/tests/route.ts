import { NextResponse } from 'next/server'
import { getAllTests } from '@/lib/api'

export async function GET() {
  try {
    const tests = await getAllTests()
    return NextResponse.json(tests)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 })
  }
}


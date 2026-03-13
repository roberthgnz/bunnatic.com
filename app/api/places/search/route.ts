import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const lang = searchParams.get('lang')
  const safeLanguage =
    lang === 'ca' || lang === 'en' || lang === 'es' ? lang : 'es'

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Places API key is missing' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=${safeLanguage}&region=es&key=${apiKey}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    )
  }
}

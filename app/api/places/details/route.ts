import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('place_id')
  const lang = searchParams.get('lang')
  const safeLanguage =
    lang === 'ca' || lang === 'en' || lang === 'es' ? lang : 'es'

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID is required' }, { status: 400 })
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
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,rating,user_ratings_total,formatted_phone_number,international_phone_number,formatted_address,website,reviews,photos,url,types,price_level,business_status,editorial_summary,opening_hours,delivery,takeout,dine_in,reservable,serves_breakfast,serves_lunch,serves_dinner,serves_vegetarian_food,wheelchair_accessible_entrance&language=${safeLanguage}&region=es&key=${apiKey}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch place details' },
      { status: 500 }
    )
  }
}

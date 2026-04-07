import { auth0 } from '@/lib/auth0'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // TODO (Step X): Retrieve the Google OAuth token using Token Vault
    // Use auth0.getAccessTokenForConnection() with connection: 'google-oauth2'
    const token = ''

    // Fetch the actual file bytes from Google Drive
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch file from Google Drive' },
        { status: res.status }
      )
    }

    // Get the content type from the response
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    
    // Stream the file bytes through
    const blob = await res.blob()
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Google Drive file fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch file from Google Drive' },
      { status: 500 }
    )
  }
}

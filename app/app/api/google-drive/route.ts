import { auth0 } from '@/lib/auth0'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // TODO (Step X): Retrieve the Google OAuth token using Token Vault
    // Use auth0.getAccessTokenForConnection() with connection: 'google-oauth2'
    const token = ''

    const folderName = request.nextUrl.searchParams.get('folder')

    if (!folderName) {
      return NextResponse.json({ error: 'folder query param is required' }, { status: 400 })
    }

    // Step 1: Find the folder by name
    const folderParams = new URLSearchParams({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id,name)'
    })

    const folderRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?${folderParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const { files } = await folderRes.json()

    if (!files?.length) {
      return NextResponse.json({ error: `Folder "${folderName}" not found` }, { status: 404 })
    }

    // Step 2: Fetch images from that folder
    const imageParams = new URLSearchParams({
      q: `'${files[0].id}' in parents and mimeType contains 'image/'`,
      fields: 'files(id,name,mimeType,thumbnailLink,webContentLink)'
    })

    const imageRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?${imageParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const imageData = await imageRes.json()

    return NextResponse.json(imageData)

  } catch (error) {
    console.error('Google Drive API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Google Drive' },
      { status: 500 }
    )
  }
}
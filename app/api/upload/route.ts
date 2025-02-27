import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data } = await req.json()

    if (!data) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      )
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(data, {
      folder: 'dishy', // This will create a folder in your Cloudinary account
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return NextResponse.json(
      { error: 'Error uploading image' },
      { status: 500 }
    )
  }
}

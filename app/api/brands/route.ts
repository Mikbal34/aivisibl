import { NextResponse } from 'next/server'
import { createBrand, getBrandById } from '@/lib/supabase/queries'
import { CreateBrandSchema } from '@/lib/validation/brand'
import { AppError, formatErrorResponse } from '@/lib/utils/errors'
import { ApiErrorCode } from '@/types/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate
    const validated = CreateBrandSchema.parse(body)

    // Create brand
    const brand = await createBrand(validated)

    return NextResponse.json(brand, { status: 201 })
  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        formatErrorResponse(
          new AppError(409, 'A brand with this domain already exists', ApiErrorCode.DUPLICATE_DOMAIN)
        ),
        { status: 409 }
      )
    }

    return NextResponse.json(formatErrorResponse(error), { status: 400 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      throw new AppError(400, 'Brand ID is required', ApiErrorCode.VALIDATION_ERROR)
    }

    const brand = await getBrandById(id)
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json(formatErrorResponse(error), { status: 400 })
  }
}

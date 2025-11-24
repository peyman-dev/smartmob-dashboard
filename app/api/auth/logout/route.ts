"use server"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const POST = async () => {
    const cookieStore = await cookies()
    cookieStore.delete(process.env.COOKIE_NAME as string)
    return NextResponse.json({})
}
"use server"
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
    console.log(req)
    return NextResponse.json({})
}
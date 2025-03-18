import { ConnectDB } from "@/lib/Database/ConnectDB";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
ConnectDB()
export async function GET(Request:Request) {
    
    return NextResponse.json({
        msg:"server runnig"
    })
    
}
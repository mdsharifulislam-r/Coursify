import { ConnectDB } from "@/lib/Database/ConnectDB";
import { BlogModel } from "@/lib/Database/Models";
import { BlogType } from "@/lib/Types/Types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"
export async function POST(Request:Request){
    try {
        await ConnectDB()
        const {name,desc,publishDate,author,image,tags}:BlogType = await Request.json()
        if(name&&desc&&publishDate&&author&&image&&tags){
            const res = await BlogModel.create({name,desc,publishDate,author,image,tags})
            if(res){
               return NextResponse.json({
                isOk:true,
                message:"Blog posted successfully"
               }) 
            }else{
                return NextResponse.json({
                    isOk:false,
                    message:"Something went wrong"
                   }) 
            }
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"Server error"
        })
    }
}

export async function GET(Request:Request) {
    try {
        await ConnectDB()
        const data = await BlogModel.find()
        if(!data){
            return NextResponse.json({
                isOk:false,
                message:"something went wrong!"
            })
        }
        return NextResponse.json({
            isOk:true,
            message:"Blog get successfully",
            data:data
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"server error!"
        })
        
    }
}
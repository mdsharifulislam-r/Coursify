import { ConnectDB } from "@/lib/Database/ConnectDB";
import { BookModel } from "@/lib/Database/Models";
import { Booktype } from "@/lib/Types/Types";
import jwt from "jwt-simple"
import { NextResponse } from "next/server";

ConnectDB().then()
export async function POST(Request:Request){
    try {
        await ConnectDB()
        const {payload}:{payload:string}= await Request.json()
        const {name,price,instructor,image,level,publishDate,description,type}:Booktype = jwt.decode(payload,process.env.JWT_SECRET!)
  
        
        if(!price && !name && !instructor?.id && !image && !level && !publishDate && !description){
            return NextResponse.json({
                isOk:false,
                message:"invalid credintials"
            },{
                status:404
            })
        }

        const res = await BookModel.create({name,price,instructor,image,level,publishDate,description,type})
        if(!res){
            return NextResponse.json({
                isOk:false,
                message:"something went wrong"
            },{
                status:200
            })
        }
        return NextResponse.json({
            isOk:true,
            message:"Book created successfully"
        })
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"something went wrong"
        },{
            status:500
        })
    }
}

export async function GET(Request:Request){
    try {
        await ConnectDB()
        const data = await BookModel.find({},{promocodes:0})
        if(data==undefined){
            return NextResponse.json({
                isOk:false,
                message:"Something went wrong"
            })
        }
        return NextResponse.json({
            isOk:true,
            data:data,
            message:"Book Data get Successfully"
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"something went wrong"
        },{
            status:500
        })
    }
}

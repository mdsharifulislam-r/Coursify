import { ConnectDB } from "@/lib/Database/ConnectDB";
import { OrderModel } from "@/lib/Database/Models";
import { OrderType } from "@/lib/Types/Types";
import jwt from "jwt-simple"
import { NextResponse } from "next/server";
ConnectDB().then()
export async function POST(Request:Request) {
    try {
        await ConnectDB()
        const {payload}:{payload:string}= await Request.json()
        if(!payload){
            return NextResponse.json({
                isOk:false,
                message:"invalid credintials"
            })
        }
        
        
        const data:OrderType = jwt.decode(payload,process.env.JWT_SECRET!)
        const {userId,orderDate,orders} = data
        if(!userId&& !orderDate && !orders.length){
            return NextResponse.json({
                isOk:false,
                message:"invalid credintials"
            })
        }
        const res = await OrderModel.create(data)
        if(res){
            return NextResponse.json({
                isOk:true,
                message:"Order placed  Sucessfully"
            })
        }else{
            return NextResponse.json({
                isOk:false,
                message:"something went wrong"
            })  
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"something went wrong"
        })  
    }
}

export async function GET(Request:Request){
    try {
        await ConnectDB()
        const data = await OrderModel.find()
        if(data?.length){
            return NextResponse.json({
                isOk:true,
                message:"Data get successfully",
                data
            })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"something went wrong"
        })  
    }
}
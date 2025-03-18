
import { ConnectDB } from "@/lib/Database/ConnectDB";
import { InstructorModel } from "@/lib/Database/Models";
import { HashPassword } from "@/lib/Helper/HashPassword";
import { InstructorType } from "@/lib/Types/Types";
import jwt from 'jwt-simple'
import { NextRequest, NextResponse } from "next/server";
ConnectDB().then()

export const dynamic = "force-dynamic";

export async function GET(Request: Request) {
  try {
    await ConnectDB()
    const instructors = await InstructorModel.find({},{password:0,isSocialLogin:0});
    if (instructors) {
      return NextResponse.json(
        {
          isOk: true,
          data: instructors,
          message: "Instructors Data get successfully",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          isOk: false,
          message: "Somthing Wen wrong",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    return NextResponse.json({
      isOk:false,
      message:"Something went wrong"
  },{status:400})
    console.log(error);
  }
}

export async function POST(Request: Request) {
  try {
    await ConnectDB()
    const { name, image, title, desc,password,email,type,phone}:InstructorType= await Request.json();
 
   
    if (name && image && title && desc && password&&email&&type&&phone) {
      const hashpassword = await HashPassword(password)
      const instructor = await InstructorModel.create({
        name,
        image,
        title,
        desc,
        password:hashpassword,
        email,
        type,
        phone
      });
      
      if (instructor) {
        return NextResponse.json(
          {
            isOk: true,
            message: "Instructor Created Successfully",
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            isOk: false,
            message: "Instructor Created Failed",
          },
          {
            status: 400,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          isOk: false,
          message: "Fill All the field",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isOk:false,
      message:"Something went wrong"
  },{status:400})

  }
}
export async function PUT(Request:NextRequest){
  try{
    await ConnectDB()
  const {payload}:{payload:string}= await Request.json()
  const formData = jwt.decode(payload,process.env.JWT_SECRET||"")

  
  if(!formData._id){
    return NextResponse.json({
      isOk:false,
      message:"token expired"
    },{
      status:400
    })
  }
  if(!formData){
    return NextResponse.json({
      isOk:false,
      message:"invalid credintials"
    },{
      status:400
    })
  }
  if(formData.secret!=="my-web"){
    return NextResponse.json({
      isOk:false,
      message:"Unauthorized try"
    },{
      status:400
    })
  }
  if(payload){
      const instructor =await InstructorModel.findByIdAndUpdate(formData,{
        ...formData
      },{password:0,isSocialLogin:0})

      if(instructor){
          return NextResponse.json({
              isOk:true,
         
              message:"Instructor update successfully"
          },{
              status:200
          })
      }else{
          return NextResponse.json({
              isOk:false,
              message:"Somthing went wrong"
          },{
              status:400
          })
      }
      
      
  }else{
      return NextResponse.json({
          isOk:false,
          message:"Fill All data"
      },{
          status:400
      })
  }
  
  }catch(error){
    console.log(error);
    return NextResponse.json({
      isOk:false,
      message:"Something went wrong"
  },{status:400})
      
      
  }
  
}


import { ConnectDB } from "@/lib/Database/ConnectDB";
import { InstructorModel } from "@/lib/Database/Models";
import { ComparePassword } from "@/lib/Helper/HashPassword";
import { InstructorType } from "@/lib/Types/Types";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jwt-simple'
import { cookies } from "next/headers";
ConnectDB().then()
export async function GET(Request: Request, { params }: {params:{id:string}}) {
  try {
    await ConnectDB()
    const { id } = params;
  
   
    
    if(!id){
      return NextResponse.json(
        {
          isOk: false,
          message: "invalid credintials",
        },
        {
          status: 400,
        }
      );
    }
    const instructor = await InstructorModel.findOne({ _id: id },{password:0,isSocailLogin:0})
    
    
    if (instructor) {
      return NextResponse.json(
        {
          isOk: true,
          data: instructor,
          message: "instructor data get successfully",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          isOk: false,
          message: "Data not found",
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
    const token =cookies().get("token")?.value
    if(token==undefined){
      return NextResponse.json({
        isOk:false,
        message:"token expired"
      },{
        status:400
      })
    }
    
    const id = jwt.decode(token||"",process.env.JWT_SECRET||"")
    const {payload}:{payload:string}= await Request.json()
    const formData = jwt.decode(payload,process.env.JWT_SECRET||"")  
    if(!id){
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
    const match = await InstructorModel.findOne({_id:id})
    const found = await InstructorModel.findOne({email:formData.email})
    if(found && formData.email !== match.email){
      return NextResponse.json({
        isOk: false,
        message: "Email already used",
      });
    }
    if(payload){
        const instructor =await InstructorModel.findByIdAndUpdate(id,{
          ...formData
        },{password:0,isSocialLogin:0})

        if(instructor){
            return NextResponse.json({
                isOk:true,
                data:instructor,
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

export async function POST(Requset:Request) {
  try {
    await ConnectDB()
    const {email,password,isSocialLogin}:InstructorType = await Requset.json()
  
    
    const data:InstructorType|null= await InstructorModel.findOne({email:email})
    if(!data){
      return NextResponse.json({
        isOk:false,
        message:"Account not register yet"
      })
    }
    if(!(email&&password&&isSocialLogin)){
      return NextResponse.json({
        isOk:false,
        message:"invalid crerdintials"
      })
    }
    if(!isSocialLogin.status){
    const match = await ComparePassword(data?.password,password)
    if(!match){
      return NextResponse.json({
        isOk:false,
        message:"invalid credintials"
      })
    }

    const instructorData = await InstructorModel.findOne({email:email}).select(["email","name","phone",'desc','image','socialLinks',"intrestTypes","type"])
  
    
    const token = jwt.encode(data._id,process.env.JWT_SECRET||"")
    const response = NextResponse.json({
      isOk:true,
      data:instructorData,
      message:"Login Successfully"
    })
    response.cookies.set("token",token)
    return response
  }
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

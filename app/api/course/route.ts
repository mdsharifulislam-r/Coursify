import { CourseType } from "@/components/Courses/CourseCard/CourseCard";
import { ConnectDB } from "@/lib/Database/ConnectDB";
import { CourseModel, InstructorModel } from "@/lib/Database/Models";
import { NextResponse } from "next/server";
import jwt from 'jwt-simple'
import { cookies } from "next/headers";
import { InstructoScema } from "@/lib/Database/instructorSchema/InstructorSchema";
import { InstructorType } from "@/lib/Types/Types";
import { revalidateTag } from "next/cache";

export async function POST(Request: Request) {
  try {
    await ConnectDB()
    const token = cookies().get("token")?.value
    const {payload}:{payload:string} = await Request.json();
    if(!token){
      return NextResponse.json({
        isOk:false,
        message:"Session Expired"
    },{status:400})
    }
    
    if(!payload){
      return NextResponse.json({
        isOk:false,
        message:"Invalid credintials"
    },{status:400})
    }
    const instructorId = jwt.decode(token,process.env.JWT_SECRET||"")
    const instructorData :InstructorType|null= await InstructorModel.findOne({_id:instructorId})
    if(!instructorData){
      return NextResponse.json({
        isOk:false,
        message:"Instructor Not exitst"
    },{status:404})
    }
    const data = jwt.decode(payload,process.env.JWT_SECRET||"")
    const {
      name,
      image,
      instructor,
      language,
      lessons,
      level,
      desc,
      type,
      certifications,
      price,
      promovideo,
      student,
      duration,
      promocodes,
      module
    } = data
    
    if (
      name &&
      image &&
      instructor &&
      language &&
      lessons &&
      level &&
      desc &&
      type &&
      price &&
      promovideo &&
      student &&
      duration
    ) {

        const data = await CourseModel.create({
          name,
          image,
          instructor,
          language,
          lessons,
          level,
          desc,
          type,
          certifications,
          price,
          promovideo,
          student,
        duration,
        promocodes,
        module
        });
        if(data){
          const update = await InstructorModel.findByIdAndUpdate(instructorId,{
            courseCollection:[...instructorData.courseCollection,data._id]
          })
            return NextResponse.json({
                isOk:true,
                message:"Course created successfully"
            },{status:200})
        }else{
            return NextResponse.json({
                isOk:false,
                message:"Something went wrong"
            },{status:400})
        }
        
        
  
    }else{
        return NextResponse.json({
            isOk:false,
            message:"fill all the field"
        },{status:400})
    }
  } catch (error) {
    return NextResponse.json({
      isOk:false,
      message:"fill all the field"
  },{status:400})
  }
}
export async function GET(Request: Request) {
  try {
    await ConnectDB()
    const allcourse = await CourseModel.find()
    if(allcourse){
        return NextResponse.json({
            isOk:true,
            data:allcourse,
            message:"All courses get successfully"
        },{status:200})
    }else{
        return NextResponse.json({
            isOk:false,
            message:"Something went wrong"
        },{status:400})
    }
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isOk:false,
      message:"Something went wrong"
  },{status:400})
    
    
  }
}


export async function PUT(Request:Request) {
  try {
    await ConnectDB()
    const {payload,id}:{payload:string,id:string} = await Request.json()
    if(!payload && !id){
      return NextResponse.json({
        isOk:false,
        message:"Invalid credintials"
    },{status:200})
    }
    const data = jwt.decode(payload,process.env.JWT_SECRET||"")
    const res = await CourseModel.findByIdAndUpdate(id,data)
    if(res){
      revalidateTag("singleCourse")
      return NextResponse.json({
        isOk:true,
        message:"update successfully"
    },{status:200})
    }else{
      return NextResponse.json({
        isOk:false,
        message:"Data not found"
    },{status:404})
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isOk:false,
      message:"Something went wrong"
  },{status:400})
    
  }
}
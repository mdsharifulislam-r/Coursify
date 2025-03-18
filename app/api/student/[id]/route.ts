import { ConnectDB } from "@/lib/Database/ConnectDB";
import { StudentModel } from "@/lib/Database/Models";
import { ComparePassword } from "@/lib/Helper/HashPassword";
import { Student } from "@/lib/Types/Types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jwt-simple";
import { NextApiResponse } from "next";
import { revalidatePath } from "next/cache";

ConnectDB().then()
export async function GET(Requset:NextRequest,{params}:{params:{id:string}}) {
  try {
    await ConnectDB()
    const {id}= params
    
    const arr = id !=='single'? id.split(','):[]
    const token = cookies().get('token')?.value
   
    
    const Id = jwt.decode(token||"",process.env.JWT_SECRET||"")
    
    
    
    if (!id) {
      return NextResponse.json({isOk: false,message: "invalid credintials",},{status: 400,});
    }
    const data =!arr?.length ? await StudentModel.findOne({_id:Id},{password:0,isSocialLogin:0,_id:0}):await StudentModel.findOne({_id:Id}).select(arr)

    if(!data) {return NextResponse.json({isok:false,message:'data not found'},{status:400})}

    const encryptData = jwt.encode(data,process.env.JWT_SECRET||"")


    return NextResponse.json({isOk:true,data:encryptData,message:'data get successfully'})
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      {
        isOk: false,
        message: "invalid credintialsrt",
      },
      {
        status: 404,
      }
    );
  }
}

export async function POST(Request: Request) {
  try {
    await ConnectDB()
    const { email, password, isSocialLogin }: Student = await Request.json();


    const data: Student | null = await StudentModel.findOne({ email: email });
    if (data) {
      if (!isSocialLogin.status && email && password) {
        const match = await ComparePassword(data.password, password);
        if (match) {
          const newData = await StudentModel.findOne(
            { email: email },
            { name: 1, phone: 1, email: 1, type: 1, intrestTypes: 1 ,address:1}
          );
          const oneDay = 24 * 60 * 60;
          const token = jwt.encode(newData._id, process.env.JWT_SECRET || "");
          const response = NextResponse.json({
            isOk: true,
            data: newData,
            token:token,
            message: "Login Successfully",
          });

          response.cookies.set("token", token, {
         
            httpOnly: true,
          });

          
          return response;
        } else {
          return NextResponse.json({
            isOk: false,

            message: "Invalid credintials",
          });
        }
      } else {
        if (email) {

        
       
          const newData: Student | null = await StudentModel.findOne(
            { email: email },
          
          );

          
          
          const token = jwt.encode(newData?._id, process.env.JWT_SECRET || "");
          const response = NextResponse.json({
            isOk: true,
            data: newData,
            message: "Login Successfully",
          });
       response.cookies.set("token", token, {
            httpOnly: true,
          });

          
          return response;
        } else {
          return NextResponse.json(
            {
              isOk: false,

              message: "invalid cradintials",
            },
            {
              status: 404,
            }
          );
        }
      }
    } else {
      return NextResponse.json(
        {
          isOk: false,
          message: "Account Not Registered",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        isOk: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(Request: NextRequest) {
  try {
    await ConnectDB()
    const { payload }: { payload: string } = await Request.json();
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({
        isOk: false,
        message: "Token is expired",
      });
    }
    if (!payload) {
      return NextResponse.json({
        isOk: false,
        message: "invalid credintials",
      });
    }

    const id = jwt.decode(token, process.env.JWT_SECRET || "");
  
    
    const data: { from: string; dataObject: any} = jwt.decode(
      payload,
      process.env.JWT_SECRET || ""
    );    
    if (data.from !== "my-web") {
      return NextResponse.json({
        isOk: false,
        message: "UnAuthorized try",
      });
    }
    if(data.dataObject.email){
    const match = await StudentModel.findOne({_id:id})
    const found = await StudentModel.findOne({email:data.dataObject.email})
    if(found && (data.dataObject.email !== match.email)){
      return NextResponse.json({
        isOk: false,
        message: "Email already used",
      });
    }
  }
  
  const res = await StudentModel.findByIdAndUpdate(id, data.dataObject);

    if (res) {
     
      return NextResponse.json(
        {
          isOk: true,
          message: "Successfully data update",
        },
        {
          status: 200,
        }
      );
    } else {
 

      return NextResponse.json(
        {
          isOk: false,
          message: "Something went wrong",
        },
        {
          status: 400,
        }
      );
    }

  } catch (error) {
    console.log(error);
    NextResponse.json(
      {
        isOk: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(Requset: Request) {
  try {
    cookies().delete("token");
    return NextResponse.json(
      {
        isOk: true,
        message: "Logout Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        isOK: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

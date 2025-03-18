import { signIn } from "@/app/auth";
import { ConnectDB } from "@/lib/Database/ConnectDB";
import { StudentModel } from "@/lib/Database/Models";
import { HashPassword } from "@/lib/Helper/HashPassword";
import { Student } from "@/lib/Types/Types";
import { hash } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
ConnectDB().then()
export async function GET(Requset: Request) {
  try {
    await ConnectDB()
    const data = await StudentModel.find(
      {},
      { password: 0, isSocialLogin: 0, _id: 0 }
    );

    if (data) {
      return NextResponse.json(
        {
          isOk: true,
          data: data,
          message: "Date get successfully",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json({
        msg: "Something is Wrong",
      });
    }
  } catch (err) {
    return NextResponse.json({
      msg: "Something is Wrong",
    });
  }
}

export async function POST(Request: Request) {
  try {
    await ConnectDB()
    const {
      name,
      email,
      password,
      phone,
      isSocialLogin,
      image,
      type,
    }: Student = await Request.json();

    const exist = await StudentModel.findOne({ email: email });
    if (!exist) {
      if (!isSocialLogin.status) {
        if (name && email && password && phone && type) {
          const hashpassword = await HashPassword(password);

          if (hashpassword) {
            const res = await StudentModel.create({
              name,
              email,
              phone,
              password: hashpassword,
              isSocialLogin,
              type,
            });

            if (res) {
              return NextResponse.json(
                {
                  isOk: true,
                  message: "Account created Successfully",
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
          }
        } else {
          return NextResponse.json(
            {
              isOk: false,
              message: "Please fill all field",
            },
            {
              status: 400,
            }
          );
        }
      } else {
        if (isSocialLogin.type) {
          const res = await StudentModel.create({
            type,
            name,
            email,
            image: image ? image : "",
            isSocialLogin,
          });

          if (res) {
            return NextResponse.json({
              isOk: true,
              message: "Account Created Successfully",
            });
          }else{
            return NextResponse.json(
              {
                isOk: false,
                message: "Something went wrong",
              },
              {
                status: 200,
              }
            );
          }
        }
      }
    } else {
      return NextResponse.json(
        {
          isOk: false,
          message: "Account Already Registerd",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        isOk: false,
        message: error,
      },
      { status: 500 }
    );
  }
}

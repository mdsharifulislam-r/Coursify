import { ConnectDB } from "@/lib/Database/ConnectDB";
import { CourseModel, StudentModel } from "@/lib/Database/Models";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";
import jwt from "jwt-simple";
import { CourseType } from "@/components/Courses/CourseCard/CourseCard";
import { Student } from "@/lib/Types/Types";

export async function GET(Request: Request, { params }: Params) {
  try {
    await ConnectDB()
    const { id } = params;
    if (id) {
      const singleCourse = await CourseModel.findOne({ _id: id },{promocodes:0});
      if (singleCourse) {
        return NextResponse.json(
          {
            isOk: true,
            data: singleCourse,
            message: "Course get successfully",
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            isOk: false,

            message: "Course get faild",
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

          message: "Invalid credintials",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        isOk: false,

        message: "Invalid credintials",
      },
      {
        status: 400,
      }
    );
  }
}

export async function PUT(Request: Request) {
  try {
    await ConnectDB()
    const { payload }: { payload: string } = await Request.json();
    if (!payload) {
      return NextResponse.json({
        isOk: false,
        message: "invaild creditials",
      });
    }
    const formData: { courseId: String; userId: string } = jwt.decode(
      payload,
      process.env.JWT_SECRET || ""
    );
    if (formData.courseId==undefined && formData.userId==undefined) {
      return NextResponse.json({
        isOk: false,
        message: "invaild creditials",
      });
    }
  
    
    const course: CourseType | null = await CourseModel.findOne({
      _id: formData.courseId,
    });
    const user: Student | null = await StudentModel.findOne({
      _id: formData.userId,
    });
    if(course?.student && course?.courseStudents && course?.pendingStudents && (course?.student < course?.courseStudents?.length) && (course?.student < course?.pendingStudents.length)){
        return NextResponse.json({
            isOk: false,
            message: "Enrolled Limitation",
          });
    }
    if(course?.courseStudents && course?.pendingStudents && course?.courseStudents?.includes(formData.userId)||course?.pendingStudents?.includes(formData.userId) ){
        return NextResponse.json({
            isOk: false,
            message: "You already enrolled",
          });
    }
    let Courseobj = {};
    let UserObj = {};
    if (!course?.price || course.price.toLowerCase() == "free") {
      Courseobj = {
        courseStudents: course?.courseStudents
          ? [...course?.courseStudents, formData.userId]
          : [formData.userId],
      };
      UserObj = {
        courseCollections: user?.courseCollections
          ? [...user?.courseCollections, formData.courseId]
          : [formData.courseId],
      };
    } else {
      Courseobj = {
        pendingStudents: course?.pendingStudents
          ? [...course?.pendingStudents, formData.userId]
          : [formData.userId],
      };
      UserObj = {
        pendingCourses: user?.pendingCourses
          ? [...user?.pendingCourses, formData.courseId]
          : [formData.courseId],
      };
    }

    const res = await CourseModel.findByIdAndUpdate(
      formData.courseId,
      Courseobj
    );

    const userRes = await StudentModel.findByIdAndUpdate(
      formData.userId,
      UserObj
    );

    if (!res && !userRes) {
      return NextResponse.json({
        isOk: false,
        message: "Something Went wrong",
      });
    }else{
        return NextResponse.json({
            isOk: true,
            message: "Course Enroll Successfully",
          });
    }
  
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        isOk: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

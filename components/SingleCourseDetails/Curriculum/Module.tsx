import Link from "next/link";
import React from "react";
import { IoMdLock } from "react-icons/io";
import { BsPlayCircle } from "react-icons/bs";
import { IoIosEye } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa";
import AddVideo from "@/components/CourseUpdateForm/ModuleUpdate/Addvideo";
import { cookies } from "next/headers";
import { useAppSelector } from "@/lib/hooks/Hooks";
import ModuleLink from "./ModuleLink";
import ModuleDelete from "@/components/CourseUpdateForm/ModuleUpdate/Delete/ModuleDelete";
export interface ModuleLinkPropsType {
  text: string;
  videolink?: string;
  isLock?: boolean;
  courseId?:string | undefined,
  videoId?:string,
  desc?:string,
  moduleId?:string | undefined,
  dev?:boolean
}

export interface ModulePropsType{
    open?:boolean,
    title?:string,
    data?:ModuleLinkPropsType[]
    courseId?:string | undefined,
    moduleId?:string ,
    dev?:boolean
}
export default function Module({open,title,data,courseId,moduleId,dev}:ModulePropsType) {
  const ModuleLinkData = data?.map(item=>{
    // let getId:string[] = []
    // if(!getId.includes(item?.videoId||"")){
      return <ModuleLink
      isLock={item.isLock}
      text={item.text}
      key={item.videoId}
      courseId={courseId}
      videoId={item.videoId}
      moduleId={moduleId}
      dev={dev}
      />
    // }else{
    //   getId.push(item?.videoId||"")
    // }

  })

  return (
    <>
      <div className="collapse collapse-plus border rounded-md">
        <input type="radio" name="my-accordion-3" defaultChecked={open} />
        <div className="collapse-title text-sm font-medium flex gap-2">
          {title}
        </div>
        <div className="collapse-content flex flex-col gap-4">
         {ModuleLinkData}
         <div className="flex gap-3">
    {dev &&<label  htmlFor={moduleId} className="flex justify-center gap-3 place-items-center w-full cursor-pointer text-primary"><FaPlus/> Add Video</label>}
    {dev && 
            <label htmlFor={moduleId+"delete"} className="text-red-500 place-items-center cursor flex text-sm cursor-pointer"><FaTrash/> Delete </label>
    }
    <AddVideo courseId={courseId||""} moduleId={moduleId||""}/>
    <ModuleDelete moduleId={moduleId||""} courseId={courseId||""}/>
    </div>
        </div>
      </div>
    </>
  );
}

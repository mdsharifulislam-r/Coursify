import React, { Suspense } from 'react'
import SideBar from './SideBar'
import Container from './Container'
import { searchObject } from '@/app/(pages)/courses/page'
import { Submit } from '@/lib/Helper/CourseFilter'
import CourseCardSkeliton from "@/components/LoadingSection/CourseCardSkeliton"

export default function CourseContainer({searchData,active}:{searchData:searchObject,active:string}) {

  
  return (
    <div className='w-full flex gap-4 min-h-screen'>
      <div className='w-[25%] hidden lg:block md:block'>
      <SideBar handle={Submit}/>
      </div>

      <input type='checkbox' className='peer hidden' id='filter-drawer' />

      <label htmlFor='filter-drawer' className='fixed top-0 left-0 h-full w-full bg-black peer-checked:opacity-45 opacity-0 pointer-events-none peer-checked:pointer-events-auto z-[9999] '></label>

      <div className='md:hidden bg-white fixed w-[80%] h-dvh top-0 left-0 z-[9999] overflow-y-scroll scrollbar-thin scrollbar-thumb-primary -translate-x-full peer-checked:translate-x-0 duration-200 sm:translate-x-0'>
        <label htmlFor="filter-drawer" className='absolute top-4 right-4 cursor-pointer'>X</label>
        <SideBar handle={Submit}/>
      </div>
      <Suspense fallback={<CourseCardSkeliton/>}>
      <Container active={active} searchData={searchData}/>
      </Suspense>
    
    </div>
  )
}

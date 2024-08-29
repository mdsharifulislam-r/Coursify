
import Header from '@/components/DashBoard/Header/Header'
import DashBoard from '@/components/DashBoard/InstrutorDashBoard/DashBoard'
import EnrollStudents from '@/components/DashBoard/InstrutorDashBoard/EnrollStudents'
import Reviews from '@/components/DashBoard/InstrutorDashBoard/Reviews'
import MainContainer from '@/components/DashBoard/MainContainer/MainContainer'
import SideBar from '@/components/DashBoard/SideBar/SideBar'
import UpdateForm from '@/components/DashBoard/UpdateForm'
import React from 'react'

export default function page({searchParams}:{searchParams:{id:string,type:string,text:string}}) {
  const {id,type,text}=searchParams
  return (
    <div>
      <Header id={id} type={type}/>
      <div className='container flex gap-4'>
        <SideBar id={id} type={type}/>
        <MainContainer>
         <Reviews id={id}/>
        </MainContainer>
      </div>
      
     </div>
  )
}

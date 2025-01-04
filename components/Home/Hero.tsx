import React from 'react'
import Background from '../Common/Background'
import { FaArrowRight } from 'react-icons/fa'
import Image from 'next/image'
import girlImage from "@/assets/Home/girl.webp"
import RedBox from "@/assets/Home/redbox.webp"
import greenBox from "@/assets/Home/greenbox.webp"
import FloatingBg from '../Common/FloatingBg/FloatingBg'
import Link from 'next/link'
interface props{
  width:number,
  left?:string,
  right?:string,
  bottom?:string,
  top?:string,
  color?:string
}
function Box(props:props){
  return <Image src={props.color=="red"?RedBox:greenBox} className={`-z-[1] absolute  w-[${props.width}] h-[${props.width}] ${props.top} ${props.bottom} ${props.right} ${props.left} transition-all duration-500 group-hover:box-animation hidden md:block lg:block`} alt='box image' style={{top:props.top,left:props.left,bottom:props.bottom,right:props.right}} width={props.width} height={props.width}>

  </Image>
}

export default function Hero () {
  return (
    <div className=' overflow-x-hidden -z-10 transition-all group duration-1000 bg-gradient-to-r relative from-dark to-white'>
      <FloatingBg/>
      <div className="container w-full flex flex-col gap-3 lg:flex-row md:flex-row lg:justify-center md:justify-center lg:place-items-center md:place-items-center">
      <div className="textBox z-10 lg:w-[60%] md:w-1/2 w-full relative">
  
        <h1 className='lg:text-6xl md:text-5xl text-5xl font-bold leading-[1.2] text-darkBlack' data-aos="fade-right">Get  <span className='text-primary'>2500+</span> Best Online Courses From <span className='text-secondary'>Coursify</span> </h1>
        <p className='text-xl py-3 text-slate-600 ' data-aos="fade-left">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit.</p>
        <div className="butto" data-aos="fade-right">
            <Link href={"/courses"} className='flex cursor-pointer rounded-md gap-4 bg-primary text-white text-lg px-7 py-4 w-fit justify-center place-items-center'>Find Course <FaArrowRight/></Link>
        </div>
      </div>
      <div className="imageBox lg:w-[40%] md:w-1/2 w-full h-full z-[2] relative " >
     
        <Image data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="1500" priority={false} width={5000} height={5000} src={girlImage} className='w-[130%]' alt='girl pic'/>
      </div>
      </div>
    
    </div>
  )
}

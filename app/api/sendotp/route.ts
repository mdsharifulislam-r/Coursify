import jwt from "jwt-simple"
import { NextResponse } from "next/server"

import { Resend } from "resend"
import nodeMailer from 'nodemailer'
import { InstructorModel, StudentModel } from "@/lib/Database/Models"
import { ConnectDB } from "@/lib/Database/ConnectDB"
ConnectDB().then()


let otps:{email:string,otp:string}[] = []

setTimeout(()=>{
    if(otps?.length){
        const old = otps[0]
        otps= otps.filter(otp=>otp.email != old.email)
        
        console.log(otps);
        
    }
},60000)
const transport = nodeMailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:"muep ihcf srmo fmuo"
    }
})  
export async function POST(Request:Request){
    try {
        await ConnectDB()
        const {payload}:{payload:string} = await Request.json()
        const {email}:{otp:number,email:string}= jwt.decode(payload,process.env.JWT_SECRET!)
        const exist = await StudentModel.findOne({email:email}) || await InstructorModel.findOne({email:email})
        if(exist){
            return NextResponse.json({
                isOk:false,
                message:"Account Already Registerd"
            })
        }
        if(otps.some(item=>item.email==email)){
            return NextResponse.json({
                isOk:false,
                message:"OTP Already sended please 1 minutes for new otp"
            })
        }
        let otp = Math.floor(Math.random()*1000000000000).toString().slice(0,4)

        const info = await transport.sendMail({
            from:process.env.ADMIN_EMAIL,
            to:email,
            subject:"Verification Otp",
         html:`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
	<div style="margin:50px auto;width:70%;padding:20px 0">
	  <div style="border-bottom:1px solid #eee">
		<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Courseify</a>
	  </div>
	  <p style="font-size:1.1em">Hi,</p>
	  <p>Thank you for Registering Courseify. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
	  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
	  <p style="font-size:0.9em;">Regards,<br />Courseify</p>
	  <hr style="border:none;border-top:1px solid #eee" />
	  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
		<p>Courseify Inc</p>
		<p>1600 Amphitheatre Parkway</p>
		<p>California</p>
	  </div>
	</div>
  </div>`
        })
        if(info.accepted){
   
            otps.push({email:email,otp:otp})
           
            return NextResponse.json({
                isOk:true,
                message:"Email Send Successfully"
            })
        }else{
            return NextResponse.json({
                isOk:false,
                message:"Something went wrong"
            })
        }
       
        
      
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"Something went wrong"
            
        })
        
    }
   
}

export async function PUT(Request:Request){
    try {
        const {payload} = await Request.json()
        const {email,otp} = jwt.decode(payload,process.env.JWT_SECRET!)

        
        const obj = otps.find(item=>item.email==email)
   
        if(obj==undefined){
            return NextResponse.json({
                isOk:false,
                message:"OTP Expired"
            })
        }
        if(obj.otp==otp){
            otps = otps.filter(item=>item.email != email)
            return NextResponse.json({
                isOk:true,
                message:"Otp Verified successfully"
            })
        }else{
            return NextResponse.json({
                isOk:false,
                message:"OTP not match"
            })
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isOk:false,
            message:"server error"
        })
    }

}

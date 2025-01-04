"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cart from "./Cart";

import { useAppSelector } from "@/lib/hooks/Hooks";
import dynamic from "next/dynamic";
import ProfileButton from "./ProfileButton/ProfileButton";
import Diamond from "./Diamond/Diamond";
import Image from "next/image";
import logo from "@/assets/Logo/logo.webp"
import SearchBar from "./SearchBar/SearchBar";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
interface props {
  pathname: string;
  link: string;
  text: string;
}

export const navlinksData = [
  {
    text: "Instructors",
    link: "/instructors",
  },
  {
    text: "Courses",
    link: "/courses",
  },
  {
    text: "Book",
    link: "/book",
  },
  {
    text: "Blog",
    link: "/blog",
  },
  {
    text: "Contact Us",
    link: "/contact",
  },
];
function Navlink({ pathname, link, text }: props) {
  return (
    <>
      <li>
        <Link
          className={`text-sm  ${
            pathname == link ? "text-primary" : "text-gray-400"
          } py-1 hover:border-b hover:border-primary hover:text-primary transition-all duration-1000`}
          href={link}
        >
          {text}
        </Link>
      </li>
    </>
  );
}
export default function Navbar() {
  const MyRef = useRef<HTMLDivElement | null>(null);
  const isLogin = useAppSelector((state) => state.userReduicer.user);
  const pathname = usePathname();
  const [extend,setExtend]=useState(false)
  useEffect(() => {
    const listener: any = window.addEventListener("scroll", () => {
      if (MyRef.current) {
        if (window.scrollY > 50) {
          MyRef.current.classList.add("fixed");
          setExtend(true)
          MyRef.current.classList.remove("relative");
        } else {
          MyRef.current.classList.remove("fixed");
          MyRef.current.classList.add("relative");
          setExtend(false)
        }
      }
    });

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  const [navbar, setNavbar] = useState(false);



  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const data = navlinksData.map((item, index) => {
    return (
      <Navlink
        text={item.text}
        link={item.link}
        pathname={pathname}
        
        key={Date.now() + index}
      />
    );
  });
const user = useAppSelector(state=>state.userReduicer.user)
  return (
    <>
      {/* component */}
      <nav className="w-full z-[1000] bg-white shadow md:block hidden ">
        <div className=" place-items-center bg-white px-4 mx-auto justify-between lg:max-w-7xl md:items-center md:flex md:px-8">
<Link href={"/"} className="logo w-16 mt-3 relative cursor-pointer">
<Image src={logo} alt="logo" width={1000} height={1000} priority={false} className=""/>

</Link>
<div className="">
<SearchBar/>
</div>
<div className="flex place-items-center gap-3">
{hydrated && <Cart/>}
<div className="px-3 border-l">
  <Link className="px-3 py-2 rounded-md bg-primary text-white flex justify-center gap-3 place-items-center" href={""}>Enroll <FaArrowRight/></Link>
</div>
</div>
        </div>
        <div ref={MyRef} className={`justify-between  transition-all duration-500 w-full top-0 left-0 bg-white z-[50] px-4 mx-auto ${extend ? " shadow-lg":""} md:items-center md:flex md:px-8`}>
          
        
          <div className="w-full flex place-items-center container">
            <div
              className={` pb-3  flex justify-between place-items-center md:pb-0 md:mt-0 w-full  `}
            >
              <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                {data}
             
              </ul>
              <ul className="list-none flex place-items-center gap-2">
                <li>
                  {extend && <Cart/>}
                </li>
                   {( hydrated && user?.name && user?.type=="student") &&  <li>
               <Diamond id={user?._id||""}/>
                </li>}
           
                {hydrated && (
                 <li className=" ">
                    {!isLogin ? (
                      <div className="">
                           <Link
                        className="px-3 py-2 bg-secondary text-white text-sm rounded-md "
                        href={"/login"}
                      >
                        Sign In{" "}
                      </Link>
                      </div>
                   
                    ) : (
                      <ProfileButton />
                    )}
                  </li>
                )}
              </ul>
            </div>
            <div></div>
          </div>
        </div>
      </nav>
    </>
  );
}

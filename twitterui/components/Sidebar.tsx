
'use client';
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiSearch, FiBell, FiMail, FiUser, FiMoreHorizontal } from "react-icons/fi";
import { MdPeople, MdStars } from "react-icons/md";
import { FaBrain } from "react-icons/fa";
import Image from "next/image";
const menuItems = [
    { name: "Home", icon: <FiHome />, defaultPath: "/main" },
    { name: "Explore", icon: <FiSearch />, defaultPath: "/explore" },
    { name: "Notifications", icon: <FiBell />, defaultPath: "/notifications" },
    { name: "Messages", icon: <FiMail />, defaultPath: "/messages" },
    { name: "Gemini", icon: <FaBrain />, defaultPath: "/grok" },
    { name: "Communities", icon: <MdPeople />, defaultPath: "/communities" },
    { name: "Premium", icon: <MdStars />, defaultPath: "/premium" },
    { name: "Profile", icon: <FiUser />, defaultPath: "/profile" },
    { name: "More", icon: <FiMoreHorizontal />, defaultPath: "/more" },
  ];

interface  SidebarProps{
    routes?: { [key: string]: string }; // Dynamic routes for each menu item
    onNavigate: (path: string) => void;
}

export default function  Sidebar({routes ={}, onNavigate}:SidebarProps){
    const pathname =  usePathname()
    const router  =  useRouter()

    return (

    <div className="h-screen w-64 bg-black text-white flex flex-col justify-between px-4 py-6">
                  <div className="text-2xl font-bold">

                    <Image
                    src="/twitter.jpeg"
                    height={30}
                    width={30}
                    alt="Twitter Logo"
                    />
                  </div>
                <nav
                className="  space-y-4"
                >
                    {menuItems.map((item) =>  {

                        const path  =  routes[item.name] || item.defaultPath;
                        return(
                            <div
                            key={item.name}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer transition ${
                                pathname === path ? "bg-gray-800 text-blue-500 font-semibold" : "hover:bg-[#181818] hover:rounded-full"
                              }`}
                              onClick={() => onNavigate(path)}
                            >

                                <span className=" text-2xl">{item.icon}</span>
                                <span className=" text-xl font-normal">{item.name}</span>


                            </div>
                        )
                    })}

                </nav>

                <button 
                onClick={() => router.push('/Posts')}
                className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-300 transition">
                    Post
                </button>
    </div>

                )

}
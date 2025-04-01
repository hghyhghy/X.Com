// components/Userprofile.tsx
'use client'
import Cookies from "js-cookie";
import { useState } from "react";
import { ReactNode } from "react";
import Image from "next/image";
import { FaCircleUser } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface User {
    username: string;
    email: string;
    avatarUrl?: ReactNode;
}

interface ProfileProps {
    user: User | null;
}

const Userprofile = ({ user }: ProfileProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router=  useRouter()
    const handleSignOut=()=>{
        Cookies.remove("token")
        router.push("/login")
    }
    if (!user) {
        return <p>Loading...</p>;  // Show loading state if no user data
    }

    return (
        <div className="  p-4 bg-[#000000]">
            <div className="mt-4 flex items-center space-x-2 hover:bg-[#181818] hover:rounded-full px-6 py-2 cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center ">
                    {/* Render avatar if it's a string (URL), otherwise render the React icon */}
                    {typeof user.avatarUrl === 'string' ? (
                        <Image
                            src={user.avatarUrl}
                            alt="User Avatar"
                            className="w-full h-full   text-black "
                            width={48}
                            height={48}
                        />
                    ) : (
                        user.avatarUrl || <FaCircleUser  size={20}  />  // Fallback to FaUserCircle if avatarUrl is not provided
                    )}
                </div>
                <div className=" flex flex-row">
                    <div className=" flex flex-col">

                    <p><strong></strong> {user.username}</p>
                    <p className=" text-gray-600">{user.email}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(!isModalOpen)} className="relative mb-5 cursor-pointer">
            <BsThreeDots size={24} className="text-white" />
          </button>

                </div>

                {isModalOpen && (
        <div className="absolute  left-32 top-[38rem] mt-2 w-[18rem] bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-600 rounded-lg shadow-xl p-4 z-50 transition-all duration-300 ease-in-out transform scale-100 opacity-100">
        <button
          onClick={handleSignOut}
          className="block w-full text-left px-6 py-3 text-white rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
                )}
            </div>
        </div>
    );
};

export default Userprofile;

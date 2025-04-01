// components/Userprofile.tsx
import { ReactNode } from "react";
import Image from "next/image";
import { FaCircleUser } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";

interface User {
    username: string;
    email: string;
    avatarUrl?: ReactNode;
    threedots?:ReactNode
}

interface ProfileProps {
    user: User | null;
}

const Userprofile = ({ user }: ProfileProps) => {
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
                    <div>

                    {typeof user.threedots === 'string' ? (
                        <Image
                        src={user.threedots}
                        alt="User threedots"
                        className="w-full h-full   text-black mt-5 p-4 "
                        width={48}
                        height={48}
                        />
                    ) : (
                        user.threedots || <BsThreeDots  size={40}  />  // Fallback to FaUserCircle if avatarUrl is not provided
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Userprofile;

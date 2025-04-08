
'use client';
import { useState ,useEffect, useMemo, useRef} from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiSearch, FiBell, FiMail, FiUser, FiMoreHorizontal } from "react-icons/fi";
import { MdPeople, MdStars } from "react-icons/md";
import { FaBrain } from "react-icons/fa";
import Image from "next/image";
import Cookies from "js-cookie";
import useSWR from "swr";
import PostPage from "../app/Posts/page";
import Myposts1,{MypostsRef} from "./Myposts1";
import Myposts from "./Myposts";
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
  const postsRef  = useRef<MypostsRef>(null)  
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handlePostCreated  = () => {
    postsRef.current?.fetchPosts()
  }

  // Memoize routes to avoid unnecessary re-renders
  const customRoutes = useMemo(
    () => ({
      Home: "/main",
      Explore: "/Explore",
      Notifications: "/alerts",
      Messages: "/chat",
      Grok: "/ai",
      Communities: "/groups",
      Premium: "/membership",
      Profile: "/user/me",
      More: "/settings",
    }),
    []
  );

  const fetchUser = async (url: string, token: string) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return response.json();
  };

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  // Use SWR for better performance
  const { data: user, error } = useSWR(
    token ? "http://localhost:3001/auth/me" : null,
    (url) => fetchUser(url, token as string)
  );

  if (error) {
    console.error("Error fetching user:", error);
  }
    const pathname =  usePathname()

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
                  <nav className="space-y-2 mt-5 flex-1">

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
                    
                <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-300 transition -mt-10 cursor-pointer">
                    Post
                </button>

                {isModalOpen && (
                  <div className="fixed inset-0 z-50 bg-opacity-60 backdrop-blur-lg flex items-center justify-center">
                  <div className="bg-white dark:bg-[#0f0f0f] rounded-xl shadow-lg relative w-full max-w-2xl">
                    <PostPage
                      onClose={() => setIsModalOpen(false)}
                      onPostCreated={handlePostCreated}
                    />
                  </div>
                </div>
                )}


                </nav>




    </div>

                )

}
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BsThreeDots } from "react-icons/bs";

const API_URL = "http://localhost:3001";
const predefinedTopics = ["For You", "Trending", "News", "Sports", "Entertainment", "Technology"];

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const selectedTopic = pathname.split("/").pop()?.replace("-", "") || "";
  const [searchTrending, setSearchTrending] = useState(selectedTopic)
  const [trendingTopic, setTrendingTopic] = useState([]);

  useEffect(() => {
    fetchTrendingTopic();
  }, [searchTrending]); // Fetch new data when topic changes

  const fetchTrendingTopic = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_URL}/trending/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrendingTopic(response.data);
    } catch (error) {
      console.error("Error generating trending topics:", error);
    }
  };

  const handleGenerateTrending = async() =>{
      try {
        const token   =   Cookies.get('token')
        await axios.post(`${API_URL}/trending/generate` , {topic:searchTrending},{
          headers:{Authorization:`Bearer ${token}`}
        } );
        fetchTrendingTopic()
      } catch (error) {
        console.error("Error generating trending topics:", error);

      }
  }

  return (
<div className="flex min-h-screen h-screen">
  {/* Sidebar */}
  <div className="w-1/4 min-h-screen">
    <Sidebar
      routes={{
        Home: "/home",
        Explore: "/Explore",
        Notifications: "/alerts",
        Messages: "/chat",
        Grok: "/ai",
        Communities: "/groups",
        Premium: "/membership",
        Profile: "/user/me",
        More: "/settings",
      }}
      onNavigate={(path) => router.push(path)}
    />
  </div>

  {/* ✅ Fixed Trending Section */}
  <div className="w-3/4 p-5 flex flex-col h-screen">
  <div className=" flex flex-row  gap-5  mb-3">


<label className="relative flex items-center bg-[#181818] text-white px-4 py-2 rounded-md">
        <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
        </g>
        </svg>

        <input
        type="search"
        className="bg-transparent text-sm  py-1 px-12 flex-grow text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent"
        placeholder="Search"
        value={searchTrending}
        onChange={(e) => setSearchTrending(e.target.value)}
        style={{
        boxShadow: "none", // Explicitly remove any focus shadow
        outline: "none", // Remove default outline
        border: "none", // Ensure no border appears
        }}
        />

        <kbd className="kbd kbd-sm bg-transparent border-none">⌘</kbd>
        <kbd className="kbd kbd-sm bg-transparent border-none">K</kbd>
</label>


  <motion.div className="">
    <motion .button 
    className="btn btn-soft py-2"
    onClick={handleGenerateTrending}
    
    >Generate post


    </motion.button>
  </motion.div>

      </div>
    


    {/* Topic Selector Tabs */}
    <div className="flex space-x-6 border-b border-gray-700">
      {predefinedTopics.map((topic) => (
        <button
          key={topic}
          onClick={() => router.push(`/Explore/${topic.replace(" ", "-")}`)}
          className={`pb-2 text-lg font-semibold transition-all duration-200 ease-in-out ${
            selectedTopic === topic
              ? "text-white border-b-3 border-blue-300 hover:bg-[#181818] p-5 hover:cursor-pointer"
              : "text-gray-400 hover:text-white hover:bg-[#181818] p-5 hover:cursor-pointer"
          }`}
        >
          {topic}
        </button>
      ))}
    </div>

    {/* ✅ Scrollable Trending Posts */}
    <motion.div
      key={selectedTopic} // Re-trigger animation when topic changes
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex-1 overflow-y-auto mt-6" // 🔥 Only this section scrolls
    >
      {trendingTopic.length > 0 ? (
        trendingTopic.map((topic: any, index: number) => (
          <div key={index} className="card  shadow-md p-4 flex flex-col">
            <div className="flex flex-row  justify-between ">
              <div className=" flex flex-col">
                <div className=" flex flex-row gap-2">

              <span className=" text-gray-400">{index+1}   </span>.
              <h3 className=" text-gray-400">Trending</h3>
                </div>
              <h2 className="card-title text-1xl font-normal">{topic.topic}</h2>
              <p className="text-gray-400">{topic.posts} posts</p>
              </div>
              <div className="  relative right-0 ml-12">
              <BsThreeDots />
              </div>
            </div>

          </div>
        ))
      ) : (
        <p className="text-center">No trending topics available. Click "Generate" to fetch.</p>
      )}
    </motion.div>
  </div>
</div>

  );
};

export default Page;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const API_URL = "http://localhost:3001";
const predefinedTopics = ["For You", "Trending", "News", "Sports", "Entertainment", "Technology"];

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const selectedTopic  = pathname.split("/").pop()?.replace("-", "") || "";
  const [preGeneratedPosts, setPreGeneratedPosts] = useState([]);
  const [searchTopic, setSearchTopic] = useState(selectedTopic )

  useEffect(() => {
      fetchPreGeneratedPosts()
  }, [searchTopic]);

  const fetchPreGeneratedPosts = async () => {
    if (!searchTopic) return; // Prevent fetching when searchTopic is empty

    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_URL}/explore/${searchTopic}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPreGeneratedPosts(response.data);
    } catch (error) {
      console.error("Error fetching pre-generated posts:", error);
    }
  };

  

  const handleGeneratePost = async () => {
    if (!selectedTopic) return;
    const token = Cookies.get("token");

    try {
      await axios.post(
        `${API_URL}/explore/generate`,
        { topic: searchTopic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPreGeneratedPosts()
    } catch (error) {
      console.error("Error generating post:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
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
      

      {/* Explore Section */}
      <div className="w-3/4 p-6">

      <div className=" flex flex-row  gap-5 ">


      <label className="relative flex items-center bg-[#181818] text-white px-4 py-2 rounded-md">
  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>

  <input
    type="search"
    className="bg-transparent text-sm  py-2 px-12 flex-grow text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent"
    placeholder="Search"
    value={searchTopic}
    onChange={(e) => setSearchTopic(e.target.value)}
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
          <motion.button
            onClick={handleGeneratePost}
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            Generate Post
          </motion.button>
        </motion.div>

            </div>

        {/* Predefined Topics Tabs with Animation */}
        <motion.div className="flex space-x-6 border-b border-gray-700">
          {predefinedTopics.map((topic) => (
            <motion.button
              key={topic}
              onClick={() => router.push(`/Explore/${topic.replace(" ", "-")}`)}
              className={`pb-2 text-lg font-semibold transition-all duration-200 ease-in-out ${
                selectedTopic === topic
                  ? "text-white border-b-3 border-blue-500 hover:bg-[#181818] p-4 hover:cursor-pointer"
                  : "text-gray-400 hover:text-white hover:bg-[#181818] p-4 hover:cursor-pointer"
              }`}
              // whileHover={{ scale: 1.1 }}
              // whileTap={{ scale: 0.95 }}
            >
              {topic}
            </motion.button>
          ))}
        </motion.div>

        {/* Display Pre-generated Posts with Smooth Transition */}
        <h2 className="text-2xl font-bold mt-6">{searchTopic} </h2>
        <motion.div
          key={selectedTopic} // Re-run animation when topic changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
        >
          {preGeneratedPosts.length > 0 ? (
            preGeneratedPosts.map((post: any, index: number) => (
              <motion.div
                key={index}
                className="card bg-base-100 w-[30rem] shadow-sm h-[30rem]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <figure>
                  <Image src="/sports.jpeg" height={300} width={400} alt="Post Image" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {searchTopic}
                    <div className="badge badge-secondary">NEW</div>
                  </h2>
                  <p>{post.content}</p>
                  <div className="card-actions justify-end">
                    <p className="text-sm text-gray-400">{post.hashtags}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center">No posts available for this topic. Click "Generate" to create one.</p>
          )}
        </motion.div>

        {/* Generate Button with Animation */}

      </div>
    </div>
  );
};

export default Page;

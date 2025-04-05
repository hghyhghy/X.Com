"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const API_URL = "http://localhost:3001";

const predefinedTopics = ["For You", "Trending", "News", "Sports", "Technology"];

const TopicPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract the topic name from the URL (e.g., `/explore/sports` → "Sports")
  const selectedTopic = pathname.split("/").pop()?.replace("-", " ") || "For You";

  const [preGeneratedPosts, setPreGeneratedPosts] = useState([]);

  // Fetch posts when the selected topic changes
  useEffect(() => {
    const fetchPreGeneratedPosts = async () => {
      try {
        const token = Cookies.get("token");
        console.log(token)
        const response = await axios.get(`${API_URL}/explore/${selectedTopic}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPreGeneratedPosts(response.data);
      } catch (error) {
        console.error("Error fetching pre-generated posts:", error);
      }
    };

    fetchPreGeneratedPosts();
  }, [selectedTopic]);

  const handleGeneratePost = async () => {
    if (!selectedTopic) return;
    const token = Cookies.get("token");

    try {
      await axios.post(
        `${API_URL}/explore/generate`,
        { topic: selectedTopic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreGeneratedPosts([]);
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
        {/* Predefined Topics Tabs */}
        <div className="flex space-x-6 border-b border-gray-700">
          {predefinedTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => router.push(`/Explore/${topic.replace(" ", "-")}`)}
              className={`pb-2 text-lg font-semibold ${
                selectedTopic.toLowerCase() === topic.toLowerCase()
                  ? "text-white border-b-4 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Display Pre-generated Posts */}
        <h2 className="text-2xl font-bold mt-6">{selectedTopic} Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {preGeneratedPosts.length > 0 ? (
            preGeneratedPosts.map((post: any, index: number) => (
              <div key={index} className="card bg-base-100 w-[30rem] shadow-sm h-[30rem]">
                <figure>
                  <Image src="/sports.jpeg" height={300} width={400} alt="Post Image" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {selectedTopic}
                    <div className="badge badge-secondary">NEW</div>
                  </h2>
                  <p>{post.content} </p>
                  <div className="card-actions justify-end">
                    <p className="text-sm text-gray-400">{post.hashtags}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No posts available for this topic. Click "Generate" to create one.</p>
          )}
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button onClick={handleGeneratePost} className="btn btn-primary">
            Generate Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;

"use client";

import Sidebar from "@/components/Sidebar";
import Myposts from "@/components/Myposts";
import { useRouter } from "next/navigation";
import Userprofile from "@/components/Userprofile";
import { FaCircleUser } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";


import { BsThreeDots } from "react-icons/bs";


// Fetcher function for SWR
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

export default function MainPage() {

  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

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
      Profile: "/Profile",
      More: "/settings",
    }),
    []
  );



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

  return (
    <>
    <div className="  min-h-screen bg-black text-gray-300 flex flex-row">
      <div className=" flex flex-col">

      <section className="px-30 " >
        <Sidebar routes={customRoutes} onNavigate={(path) =>  router.push(path)} />

      </section>
        <div className=" -mt-[7rem] ml-20">

          <Userprofile
          user={user ? { ...user, avatarUrl: <FaCircleUser  size={40} color="#4A90E2" />   
        } : null}
        />
        </div>
      </div>

      <div className="  ">

      <Myposts/>
      </div>

    </div>
        </>
  );
}

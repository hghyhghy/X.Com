'use client';
import { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { FaCircleUser, FaRegCircleUser } from "react-icons/fa6";
import Sidebar from "@/components/Sidebar";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Userprofile from "@/components/Userprofile";
import useSWR from "swr";
import { AiOutlineDislike } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
type Post = {
    id:number,
    user:{
        username:string,
        email:string
    },
    topic:string,
    content:string,
    media:{ url: string; type: 'image' | 'video' }[],
    hashtags:string[],
    links:string[],
    createdAt:string,
    likes:number,
    dislikes:number
}
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




export  default  function  Profile(){
  
    const api = 'http://localhost:3001/posts'; 
    const [bookmarkedPosts, setbookmarkedPosts] = useState<Post[]>([])
    const [posts, setPosts] = useState <Post[]>([])
    
    const token  =  Cookies.get('token')
    const router =    useRouter()
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

    useEffect(()=>{
        fetchBookmarkedPosts()
    },[])
      // Use SWR for better performance
  const { data: user, error } = useSWR(
    token ? "http://localhost:3001/auth/me" : null,
    (url) => fetchUser(url, token as string)
  );

  if (error) {
    console.error("Error fetching user:", error);
  }

  const  fetchPosts = async() => {

    try {
        
        const   resposne  =  await axios.get(`${api}/all`, {
            headers:{
                Authorization:`Bearer ${token}`
            },
            withCredentials:true
        })
        const  arraypost  =   resposne.data.posts.map((post:any) => ({
            ...post,
            hashtags:typeof post.hashtags === 'string'? JSON.parse(post.hashtags):post.hashtags,
            links:typeof post.links === 'string'? JSON.parse(post.links):post.links

        }))

        setPosts(arraypost.reverse())
    } catch (error) {
        console.log('Failed to fetch posts',error)
    }
}

  const  handleLike =  async(postId:number)=>{
    try {
      
      await  axios.patch(`${api}/like/${postId}`, {} ,{
        headers:{
          Authorization:`Bearer  ${token}`
        }
      })
      fetchPosts()
    } catch (error) {
      console.error('error adding  likes', error)
    }
  }

  const  handledislike =  async(postId:number) => {
    try {
      await  axios.patch(`${api}/dislike/${postId}` , {}, {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      fetchPosts()
    } catch (error) {
      console.error('error disliking  post', error)
    }
  }


    const fetchBookmarkedPosts =  async() => {
        try {
            
            const response  =  await axios.get('http://localhost:3001/bookmarks/all', {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            const posts = response.data.map((bookmark: any) => {
              const post = bookmark.post;
        
              return {
                ...post,
                hashtags: typeof post.hashtags === 'string' ? JSON.parse(post.hashtags) : post.hashtags,
                links: typeof post.links === 'string' ? JSON.parse(post.links) : post.links,
              };
            });
        
            setbookmarkedPosts(posts.reverse())
        } catch (error) {
            console.error('Error fetching the bookmarked posts', error)
        }
    }

    return (
        <div className="min-h-screen  flex flex-row bg-black relative">
                <section className=" px-30" >
                  <Sidebar routes={customRoutes} onNavigate={(path) =>  router.push(path)} />
                  <div className="-mt-39">

<Userprofile
user={user ? { ...user, avatarUrl: <FaCircleUser  size={40} color="#4A90E2" />   
} : null}
/>
</div>
                </section>
   
                <div className="max-h-screen overflow-y-auto px-1 relative right-32">


          {bookmarkedPosts.map((post) => (
            <div
              key={post.id}
              className="p-8 mb-4 rounded border border-gray-700 shadow relative "
            >
              <div className="flex items-center gap-2 text-gray-300 font-bold uppercase">
                <FaRegCircleUser className="text-2xl" />
                {post.user.username}
                <MdVerified className="text-blue-500 text-lg" />
                <span className="text-gray-500">@{post.user.email}</span>
                <span className="text-gray-500 ml-2">
                  .{new Date(post.createdAt).toISOString().split("T")[0]}
                </span>
              </div>
    
              <div className="text-gray-100 mt-3">
                <div className="text-[1rem] font-semibold">{post.topic}</div>
                <div className="text-sm mb-2">{post.content}</div>
              </div>
    
              {post.hashtags?.length > 0 && (
                <div className="text-blue-500 text-sm">
                  {post.hashtags.map((tag, i) => (
                    <span key={i}>#{tag} </span>
                  ))}
                </div>
              )}
    
              {post.links?.length > 0 && (
                <div className="text-blue-400 underline text-sm space-y-1 mt-2">
                  {post.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              )}
    
              {post.media.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.media.map((media, idx) =>
                    media.type === "image" ? (
                      <Image
                        key={idx}
                        src={media.url}
                        alt="media"
                        width={550}
                        height={400}
                        className="rounded-xl border border-gray-700 object-cover h-[20rem]"
                      />
                    ) : (
                      <video
                        key={idx}
                        controls
                        className="rounded w-full max-h-60 border border-gray-700"
                      >
                        <source src={media.url} />
                      </video>
                    )
                  )}
                </div>
              )}
          <div className=" mt-2 flex flex-row  gap-3">
            <div>
            <button 
            onClick={() =>handleLike(post.id)}
            className=" text-xl cursor-pointer"
            >
            <CiHeart/>
            </button>  

            </div>
            <div>
              <button
              onClick={()=> handledislike(post.id)}
              className=" text-xl cursor-pointer"
              >
                
              <AiOutlineDislike/>
              </button>
            </div>
          </div>
            </div>
            
          ))}


</div>
    
        </div>
      );


}


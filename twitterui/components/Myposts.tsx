'use client';
import { useState,useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import axios from "axios";
import { MdVerified } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineDislike } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
type Post={
    id: number;
    user:{
        username:string,
        email:string
    },
    topic: string;
    content: string;
    media: { url: string; type: 'image' | 'video' }[];
    hashtags: string[];
    links: string[];
    createdAt:string;
    likes:number;
    dislikes:number;
}


export default function  Myposts(){
    const api = 'http://localhost:3001/posts'; 

    const token  = Cookies.get('token')
    const [posts, setPosts] = useState <Post[]>([])
    useEffect(()=>{
        fetchPosts()
    },[])

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

    const handleLike =  async(postId:number) => {
        try {
            
            await axios.patch(`${api}/like/${postId}`, {}, {
                headers:{
                    Authorization:`Bearer ${token}`
                },
                withCredentials:true
            })

            fetchPosts();

        } catch (error) {
            console.log('Error fetching likes ', error)
        }
    }

    const handledislike  =  async(postId:number) => {
        try {
            await axios.patch(`${api}/dislike/${postId}` , {} , {
                headers:{
                    Authorization:`Bearer ${token}`
                },
                withCredentials:true
            })
            fetchPosts()
        } catch (error) {
            console.log('Error disliking post', error)
        }
    }

    return(
                    <div className=" min-h-screen relative">
                             <div className="absolute -left-0 top-0 bottom-0 w-px bg-gray-600 min-h-screen " />
                             <div className="absolute -right-0 top-0 bottom-0 w-px bg-gray-600 min-h-screen " />

      <div className="max-h-screen overflow-y-auto px-4">
        
                        {posts.map((post) => (
        
                            <div
                            key={post.id}
                            className="p-8  rounded shadow  border-b-2 border-gray-700 "
                            >  

                            <div className=' flex flex-row gap-1 '>
                                <div className=' text-gray-300  font-bold  uppercase flex  flex-row'>
                                <FaRegCircleUser className="  text-3xl relative -left-7 -mr-6"  /> {post.user.username} <MdVerified  className=' mt-[0.1rem] ml-1 text-blue-500 text-lg' /> 
                                </div>
                                <div className=' text-gray-500'>
                                    @{post.user.email}
                                </div>
                                <div className=' text-gray-500 ml-1'>
                                <div className=' mb-2'>
                                .{new Date(post.createdAt).toISOString().split('T')[0]}
                                </div>
                                </div>
                            </div>
        
                            <div className=' flex flex-col gap-2'>
                            <div className="text-sm text-gray-100  flex flex-col  gap-2">
                                <div className=" text-[1rem]">

                                    {post.topic}
                                </div>
                                <div className=" text-[1rem] -mt-3 mb-2">

                                    {post.content}
                                </div>
                                </div>
                                <div className=" flex flex-row">

        
                                {Array.isArray(post.hashtags) &&    
                                    post.hashtags.map((tag, index) => (
                                        <span key={index} className="text-blue-600 text-lg -mt-4 ">
                                        {tag}{','}
                                        </span>
                                    ))
                                }
                                </div>
        
                                {post.links && post.links.length > 0 && (
        
                                        <div
                                        className="text-sm text-blue-500 underline space-y-1 mb-2"
                                        >
                                            {post.links.map((link,idx) => (
        
                                                <a 
                                                key={idx}
                                                href={link}
                                                target="_blank" rel="noopener noreferrer"
                                                className='  border-none outline-none'
                                                >
                                                    {link}
                                                </a>
                                            ))}
        
                                        </div>
                                )}
                            </div>
        
        
                                <div
                                className="flex flex-wrap gap-2 mt-2"
                                >
                                    {post.media.map((m,i) =>  
                                    m.type === 'video'?(
                                        <div
                                        key={i}
                                        className=' w-full'
                                        >
                                            <video
                                            controls
                                            className=' rounded w-full max-h-60'
                                            >
                                                <source src={m.url} />
                                            </video>

        
                                        </div>
                                    ) : (
        
                                        <div
                                        key={i}
                                        className=' relative'
                                        >
                                            <Image
                                            src={m.url}
                                            height={400}
                                            width={550}
                                            alt='media'
                                            className=' object-cover rounded-xl h-[20rem] border border-gray-700'
                                            />
        
        
                                        </div>
                                        
                                    )

                                    
                                    )}
        
                                </div>
        
                                <div
                                className=' mt-2'
                                >

        
                                </div>
                                    <div className=" flex flex-row gap-3 mt-4">
                                        <div className=" flex flex-row gap-1">
                                        <div>

                                        <button
                                        onClick={() => handleLike(post.id)}
                                        className=" cursor-pointer"
                                        >
                                            <CiHeart className=" text-xl " />
                                        </button>
                                            </div>
                                            <div className=" text-gray-500  cursor-pointer">
                                            {post.likes}K
                                            </div>
                                            </div>

                                         <div className=" flex flex-row">
                                            <div className=" mt-1">
                                            <button
                                        onClick={() => handledislike(post.id)}
                                        className=" cursor-pointer"

                                        >
                                                <AiOutlineDislike className=" text-xl" />

                                        </button>
                                
                                            </div>
                                            <div className=" text-gray-500  cursor-pointer">
                                            {post.dislikes}K    
                                            </div>    
                                        </div>   

                                    </div>
        
                            </div>

                            
                        ))}
      </div>

                    </div>
    )

}
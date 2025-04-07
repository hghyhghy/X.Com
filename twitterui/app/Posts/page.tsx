
'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { v4 as uuid } from 'uuid';
import Cookies from 'js-cookie';
type Post={
    id: number;
    topic: string;
    content: string;
    media: { url: string; type: 'image' | 'video' }[];
    hashtags?: string[];
    links?: string[];
    createdAt:string
}

export default function  PostPage(){
    const [posts, setPosts] = useState<Post[]>([]);
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [links, setLinks] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [mediaToAdd, setMediaToAdd] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filePreviews, setFilePreviews] = useState <string[]>([])
    const [mediaToAddPreviews, setMediaToAddPreviews] = useState<string[]> ([])
    const api = 'http://localhost:3001/posts'; 
    const token  =  Cookies.get('token')

    const fetchPosts =  async() => {
            try {
                const response  =   await  axios.get(`${api}/all`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                        ,
                        withCredentials:true
                    },
                    
                )
        
                setPosts(response.data.posts.reverse())
            } catch (error) {
                console.error('Failed to fetch error', error)
            }
    
    }

    useEffect(() => {
        fetchPosts()
    },[])

    const parseList  = (input:string) => 
        input.split(',').map((i) =>  i.trim()).filter(Boolean)
    const handleCreatePost  =  async() =>{

        const formData  =  new FormData();
        formData.append('topic', topic);
        formData.append('content', content);
        formData.append('hashtags', JSON.stringify(parseList(hashtags).map((h) => (h.startsWith('#') ? h : `#${h}`))));
        formData.append('links', JSON.stringify(parseList(links)));
        files.forEach((file) => formData.append('media', file));

        try {
            await axios.post(`${api}/create`, formData , {
                headers:{
                    Authorization:`Bearer ${token}`
                },
                withCredentials:true
            })
    
            setTopic('')
            setContent('')
            setHashtags('')
            setLinks('')
            setFiles([])
            fetchPosts()
        } catch (error) {
            console.error("Error  creating  post", error)
        }
    
    }

    const handleDeletePost  =  async(id:number) => {
        try {
            await axios.delete(`${api}/delete/${id}`, {
                headers:{
                    Authorization:`Bearer ${token}`
                },
                withCredentials:true
            })
            fetchPosts()
        } catch (error) {
            console.log('Error deleting  post', error)
        }
    }

    const handleRemoveMedia =  async(postId:number,  mediaUrl:string) =>{
        try {
            
            await  axios.patch(`${api}/remove-media/${postId}`,
                {mediaUrlToRemove:mediaUrl},
                {headers:{
                    Authorization:`Bearer ${token}`
                }, 
            withCredentials:true}
            )
            fetchPosts()
            
        } catch (error) {
            console.log('Error rmeving media files', error)
        }
    }

    const handleAddMedia   =  async(postId:number) => {
        const formData =  new FormData()
        mediaToAdd.forEach((file) =>  formData.append('media',file));

        try {
            
            await axios.patch(`${api}/add-media/${postId}` ,  formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }, 
                withCredentials:true
            })
            setMediaToAdd([])
            fetchPosts()
        } catch (error) {
            console.log('Error addidng media ',   error)
        }
    }

    const  handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const  selected  =  Array.from(e.target.files  || [])
        const  limited  =  [...files,...selected].slice(0,10)
        setFiles(limited)
        const previews  =  limited.map((file) => URL.createObjectURL(file))
        setFilePreviews(previews)
    }

    const handleMediaAddChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const selected  =  Array.from(e.target.files || [])
        setMediaToAdd(selected)
    }

    const handleRemoveSelectedFile= (index:number) =>{
        const updatedFile = [...files]
        const updatedPreview  =  [...filePreviews]

        updatedFile.splice(index,1)
        updatedPreview.splice(index,1)

        setFiles(updatedFile)
        setFilePreviews(updatedPreview)
    }

    return(

        <div className="max-w-2xl mx-auto p-4">
                      <h1 className="text-2xl font-bold mb-4">Create a Post</h1>
            <div className=' space-y-2 mb-4'>
                <input 
                type="text"
                placeholder='topic'
                value={topic}
                onChange={(e)=> setTopic(e.target.value)}
                className="w-full p-2 border rounded"

                
                />

                <textarea
                placeholder='What is happening'
                value={content}
                onChange={(e)=> setContent(e.target.value)}
                className="w-full p-2 border rounded resize-none"

                />
                <input 
                type="text"
                placeholder='Hashtags (comma separated)'
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full p-2 border rounded"

                />
                <input 
                type="text"
                placeholder="Links (comma separated)"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="w-full p-2 border rounded"

                />
                    <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className='block'
                    
                    />
<div className="flex flex-wrap gap-2 mt-2">
  {filePreviews.map((preview, i) => {
    const isVideo = files[i]?.type.startsWith('video');

    return (
      <div key={i} className="relative ">
        {isVideo ? (
          <video src={preview} controls className="w-32 rounded " />
        ) : (
          <Image
          key={i}
          src={preview}
          height={418}
          width={528}
          alt="preview"
          className="object-cover rounded-xl"
          />
        )}
        <button
          onClick={() => handleRemoveSelectedFile(i)}
          className="absolute top-1 right-1 bg-white text-red-600 text-xs p-1 rounded"
        >
          x
        </button>
      </div>
    );
  })}
</div>
  


                <button
                onClick={handleCreatePost}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                                  Post

                </button>

            </div>
            <hr className="my-4" />
            <h2 className="text-xl font-semibold mb-2">Posts</h2>
            <div className="space-y-6">
                {posts.map((post) => (

                    <div
                    key={post.id}
                    className="p-4 border rounded shadow"
                    >
                        <div className="text-sm text-gray-600 mb-1">
                            {post.topic}
                        </div>
                        <div className=' mb-2'>
                            {post.content}
                        </div>
                        {Array.isArray(post.hashtags) && 
                        
                        post.hashtags.map((tag, index) => (
                            <span key={index} className="text-blue-500">
                                {tag}{' '}
                            </span>
                        ))
                        }

                        {post.links && post.links.length > 0 && (

                                <div
                                className="text-sm text-blue-500 underline space-y-1 mb-2"
                                >
                                    {post.links.map((link,idx) => (

                                        <a 
                                        key={idx}
                                        href={link}
                                        target="_blank" rel="noopener noreferrer"
                                        >
                                            {link}
                                        </a>
                                    ))}

                                </div>
                        )}

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
                                    <button
                                    className=' text-red-500  text-sm'
                                    onClick={() => handleRemoveMedia(post.id, m.url)}
                                    >
                                        Remove video

                                    </button>

                                </div>
                            ) : (

                                <div
                                key={i}
                                className=' relative  w-32 h-32'
                                >
                                    <Image
                                    src={m.url}
                                    alt='media'
                                    fill
                                    className=' object-cover rounded'
                                    />
                                    <button
                                     className="absolute top-1 right-1 bg-white text-red-600 text-xs p-1 rounded"
                                     onClick={() => handleRemoveMedia(post.id ,  m.url)}
                                    >
                                        x

                                    </button>

                                </div>
                            )
                            )}

                        </div>

                        <div
                        className=' mt-2'
                        >
                            <input 
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleMediaAddChange}
                            className=' block  mb-1'
                            />
                            <button
                            onClick={() => handleAddMedia(post.id)}
                             className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                                Add Media 

                            </button>

                        </div>

                        <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500 mt-2 text-sm"
                        >
                            Delete Post
                        </button>

                    </div>
                ))}
            </div>

        </div>
    )


}
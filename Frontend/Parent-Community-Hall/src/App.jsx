import { useState,useRef,useEffect } from 'react'
import './App.css'
import io from "socket.io-client"
import Navbar from './Components/Navbar'
import AllBlogs from './Components/AllBlogs'
import axios from "axios"
import SetName from './Components/SetName'
import PostForm from './Components/PostForm'

function App() {

  const [name,setName] = useState(localStorage.getItem('parentName'))
  const [allPosts,setAllPosts] = useState(null)
  const [filterBy,setFilterBy] = useState('DateAsc')
  let [askName,setAskName] = useState(false)
  const [comments,setComments] = useState({})
  const [postForm,showPostForm] = useState(false)


  const socketRef = useRef()
  const socketIdRef = useRef()
  const postAvailable  = useRef(false)
  const commentRef = useRef()


  const realTimeConnection=()=>{
     socketRef.current = io(import.meta.env.VITE_WS_SERVER_URL)

     socketRef.current.on("connect",()=>{
      socketIdRef.current = socketRef.current.id
     })

     socketRef.current.on("incrLike",(postId,likeCount,token)=>{
         setAllPosts(posts=>(
           posts.map(post=>{
            if(post._id===postId){
              return {
                ...post,
                likes:likeCount,
                likedBy:post.likedBy? [...post.likedBy,token]:[token]
              }
            }
            return post
           })
         ))
     })

     const handleIncrComment=(postId,commentCount,comment)=>{
          let cmAvailablePosts = Object.keys(commentRef.current)
          
           setAllPosts(posts=>(
            posts.map(post=>{
              if(post._id===postId){
                return {
                  ...post,
                  commentCount,
                }
              }
              return post
            })
           ))

           if(cmAvailablePosts.includes(postId)){ 
            setComments(comments=>({...comments,[postId]:[...comments[postId],comment]}))
           }
     }

     const handleNewPosts=(newPost)=>{
            setAllPosts(posts=>([newPost,...posts]))
     }

     socketRef.current.on("incrComment",handleIncrComment)
     socketRef.current.on("newPost",handleNewPosts)

  }

  const server =  axios.create({
    baseURL : `${import.meta.env.VITE_SERVER_URL}/api/post`
  })

  const findPosts = async (filterBy)=>{
     const response = await server.get(`/posts/${filterBy}`)
     setAllPosts(response.data?.allPosts)
     postAvailable.current = true
  }
  
  useEffect(()=>{
     if(socketRef.current===undefined)
      realTimeConnection()
  },[])

  useEffect(()=>{
      findPosts(filterBy)
  },[filterBy])

  useEffect(()=>{
       commentRef.current=comments

       console.log('cmt',comments);
       
     },[comments])

  return (
    <>
      <main className='h-[100vh] w-[100vw] flex flex-col gap-[1rem] relative' style={{backgroundImage:'url(/background.png)', backgroundRepeat:'no-repeat',backgroundSize:'100% 100%'}}>
    
      {(askName || postForm) &&<div className="sheet absolute bg-[rgba(0,0,0,.4)] z-1 h-full w-full"></div>}
        <Navbar name={name} filterBy={filterBy} setFilterBy={setFilterBy} setAskName={setAskName} showPostForm={showPostForm}/>
        {
          allPosts?
        <AllBlogs blogs={allPosts} filterBy={filterBy} setFilterBy={setFilterBy} server={server} comments={comments} setComments={setComments}/>:<div className='relative top-[30%] left-[46%] b w-[12%] text-center'><div className="loader"></div>
        <p className='text-white text-2xl'><span className='text-orange-500'>Fetching</span> Posts...</p>
        </div>}
        {askName && <SetName displayName={setName} server={server} setAskName={setAskName}/>}
        {postForm && <PostForm server={server} showPostForm={showPostForm} setName={setName}/>}
       
      </main>
    </>
  )
}

export default App

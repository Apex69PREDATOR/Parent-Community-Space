import {useState} from 'react'
import FilterPosts from './FilterPosts'
import {CommentOutlined,FavoriteBorder,Favorite} from "@mui/icons-material"
import { TextField } from '@mui/material'

const AllBlogs = ({blogs,filterBy,setFilterBy,server,comments,setComments}) => {

  const token = localStorage.getItem('pchToken')
  const name =localStorage.getItem('parentName')
  const [showComments,setShowComments] = useState([])

  const giveLike=async (postId)=>{
    let response = await server.post(`/like/${postId}`,{token})
    // alert(response.data.message)
    }

    const addComent = async (postId,text)=>{
    let response = await server.post(`/comments/${postId}`,{author:name,text:text.value})
     
    if(response.status==200)
      text.value = ""
    // alert(response.data.message)
    }

  const fetchComments = async (postId)=>{
    if(showComments.includes(postId)){
      setShowComments(prev=>(prev.filter(val=>(val!==postId))))
      return
    }
    if(!comments[postId]){
    let response = await server.get(`/comments/${postId}`)
    setComments(prev=>({...prev,[`${postId}`]:response.data.comments?.comments}))
    }
    setShowComments(prev=>([...prev,postId]))

  }

  const calculateTime = (cDate)=>{
     let diffTime = Date.now() - new Date(cDate).getTime()
     let timeStr = ""

     let sec = diffTime/1000
     
      if(sec<60)
        return `${Math.floor(sec)} sec ago`
      let min = sec/60
        if(min<60)
        return `${Math.floor(min)} min ago`
      let hr = min/60
         if(hr<24)
        return `${Math.floor(hr)} hour ago`
      let days = hr/24
        if(days<30)
        return `${Math.floor(days)} days ago`
      let month = days/30
       if(month<12)
        return `${Math.floor(sec)} months ago`
       let year = month/12
        return `${Math.floor(year)} years ago`
         

  }

  return (
    <div className='md:h-[80%] h-[90%] w-full py-[1rem] px-[2rem] bg-[rgba(242,242,242,.1)]'>
      <h2 className='text-white md:mb-2 mb-3'><span className='text-xl font-medium'>All Posts in order : </span> <FilterPosts filterBy={filterBy} setFilterBy={setFilterBy}/></h2>
      <div className='h-[90%] w-full text-black flex flex-col items-center overflow-auto gap-[1rem]'>
        {blogs?.map(tweet=>(
            <div className='bg-white md:w-[60%] w-[95%] flex flex-col p-2 rounded-md shadow-md' id={tweet._id} key={tweet._id}>
              {/* Tweet Content */}
              <div className="flex flex-col gap-[1rem] flex-grow">
                <div className="header flex items-center border-b border-gray-200 pb-2">
                  <img src="" className='bg-black h-[3rem] w-[3rem] rounded-full' alt="" />
                  <span className='ml-[1rem] text-xl font-medium'>{tweet.author}</span>
                  <pre className='text-sm text-gray-500'>   {calculateTime(tweet.createdAt)}</pre>
                </div> 
                <div className="tweetContent pb-2 text-[1.1rem] px-3 flex-grow overflow-auto max-w-[54rem]">
                  {tweet.message}
                </div>
                {tweet?.picPath && <img className='md:max-h-[300px] max-h-[200px] object-contain md:max-w-[500px] max-w-[300px] rounded-xl shadow-md' src={tweet.picPath} alt="tweet"/>}
                
                {/* Utilities */}
                <div className="utilities w-full flex justify-evenly p-1 text-gray-500 bg-white border-t border-gray-200">
                  <span>{tweet?.likedBy.includes(token)?<Favorite sx={{color:'red'}}/>:<FavoriteBorder className='cursor-pointer' onClick={()=>giveLike(tweet._id)}/>} {tweet.likes}</span> 
                  <span><CommentOutlined onClick={()=>fetchComments(tweet._id)} className='cursor-pointer'/> {tweet.commentCount}</span>
                </div>
              </div>

              {/* Comments Section */}
              {showComments.includes(tweet._id) && (
                <div className='w-full mt-2 border-t border-gray-200 pt-2'>
                  <h3 className='text-xl font-medium mb-3'>Comments</h3>
                  <div className='max-h-[250px] overflow-y-auto flex items-center flex-col gap-2'>
                    {comments[tweet._id]?.map(val=>(
                      <div key={val._id} className='p-1 px-2 flex flex-col gap-1 bg-gray-100 rounded-xl w-[85%]'>
                        <span className='font-medium'>{val.author}</span>
                        <span>{val.text}</span>
                      </div>
                    ))}
                  </div>
                  <TextField label="Add a comment" className='w-full' sx={{marginTop:'7px'}} onKeyDown={(e)=>{e.key==="Enter" && addComent(tweet._id,e.target)
                  }
                  }/>
                </div>
              )}
            </div>
        ))}
      </div>
    </div>
  )
}

export default AllBlogs
import { useState } from "react"
import {TextField,Button} from "@mui/material"
import { CloseOutlined } from "@mui/icons-material"

const SetName = ({server,setAskName,displayName}) => {
  let [name,setname] = useState("")
  let [loading,setLoading] = useState(false)
  const setName = async ()=>{
    setLoading(true)
     let response = await server.post('/setName',{name})

     if(response.status===200){
        localStorage.setItem("parentName",response.data.name)
        localStorage.setItem("pchToken",response.data.token)
        displayName(response.data.name)
     }
        

     alert(response.data.message)
     setAskName(false)
     setLoading(false)

  }
  return (
    <div className='p-[7rem] bg-white shadow-2xl rounded-md flex flex-col gap-8 absolute top-[15%] left-[33%] z-2'>

        <CloseOutlined className="top-[2%] right-[2%] absolute cursor-pointer" sx={{fontSize:'2rem'}} onClick={()=>setAskName(false)}/>

        <p className="text-2xl font-medium">What's your name ?</p>

        <TextField onChange={(e)=>{setname(e.target.value)}} label="Enter your name"/>
        
        <Button variant="contained" disabled={loading} onClick={setName}>Submit</Button>

      
    </div>
  )
}

export default SetName

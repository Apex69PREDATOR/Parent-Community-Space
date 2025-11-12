import express from "express"
import { config } from "dotenv"
import cors from "cors"
import {createServer} from "node:http"
import atlasConnect from "./DBconnectivity.js"
import router from "./Routes/ParentPosts.Route.js"
import { wsServer } from "./Controllers/Socket.setup.js"
config()
atlasConnect()

const app = express()
const server = createServer(app)
app.use(cors({
    origin:"*",
    methods:['GET','POST']
}))
app.use(express.json({limit:'1mb'}))
app.use(express.urlencoded({limit:'5mb'}))
app.set("PORT",process.env.PORT)

app.use('/api/post',router)

app.get('/',(req,res)=>{
    res.send("hiii")
})

const io = wsServer(server)

function start(){
server.listen(app.get("PORT"),()=>{

    console.log('process url -->',`http://localhost:${app.get("PORT")}`);
    
})
}

start()

export {io}


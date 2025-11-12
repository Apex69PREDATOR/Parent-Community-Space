import { Server, Socket } from "socket.io";

const candidates = new Set()

const wsServer = (server)=>{
    const io =new Server(server,{
        cors:{
            origin:"*",
            methods:['GET','POST'],
            allowedHeaders:"*",
            credentials:true
        }

    })

    console.log('WS server started');
    

    io.on("connection",(Socket)=>{

        console.log('new socket client',Socket.id);

        candidates.add(Socket.id)

        Socket.on("disconnect",()=>{
            candidates.delete(Socket.id)
        })
        
    })
    return io
}

export {wsServer,candidates}
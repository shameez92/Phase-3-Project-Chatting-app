let express = require("express");
let app = express();
let http = require("http").createServer(app);

let objDatabase = require("mongodb").MongoClient;
let urlDatabase ="mongodb://localhost:27017";
// create the reference of socket io with the help of 
// http module
let io = require("socket.io")(http);

// http://localhost:9090
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"\\index.html");
})
// this code will execute when any client send the request to 
// this application using socket.io library 
io.on("connection",(socket)=> {
    // this message dislay on server console. 
    console.log("Client connected...");

    // this code is use to receive the message from browser client 
    socket.on("clientMessage",(msg)=> {
        console.log(msg);

        objDatabase.connect(urlDatabase,(err,result)=> {
            if(!err){
                let date = new Date();
                msg.time = `${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${date.getMonth() == 0 ? 1 : date.getMonth() + 1}/${date.getFullYear()}`;
                let db = result.db("chatserver");
                db.collection("chatlog").insertOne(msg,(err,res)=> {
                    if(!err){
                        console.log("Record inserted...");
                        console.log(res);
                    }else {
                        console.log(err)
                    }
                    result.close();
                })
            }
            
        })    

    })
    // send message to browser client 
    socket.emit("serverResp","From Server: You connected socket io library successfully!")
})



http.listen(9090,()=>console.log("Server running on port number 9090"));
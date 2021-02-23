const ws = require('nodejs-websocket')

let count = 0 
var allsocket = []; 
const server = ws.createServer((conn)=>{
    conn.on('text' , (str)=>{
        // 判断是不是消息 
        let msg = str.indexOf('##')
        if(msg == -1) {    // 说明是用户 
            if(allsocket.includes(str)) {
                broadcast(JSON.stringify(allsocket))
                return 
            } else {
                allsocket.push(str)
                // 向当前客户端发送一个消息
                broadcast(JSON.stringify(allsocket))
            }
        } else{
            broadcast(JSON.stringify(str) , 'socket')
        }
    })
})



function broadcast(data , type = null) {
    if(type) {
        //所有的窗口都储存在connections里面，所以用循环把消息发给所有的窗口 
       server.connections.forEach((conn,i) => {	
        console.log(`${JSON.parse(data)}##${allsocket[i]}`)							
        conn.send(JSON.stringify(`${JSON.parse(data)}##${allsocket[i]}`))  //sendText 服务端发送给客户端方法
    })
    return 
    }
    //所有的窗口都储存在connections里面，所以用循环把消息发给所有的窗口 
       server.connections.forEach((conn,i) => {								
           conn.send(data)  //sendText 服务端发送给客户端方法
       })
   }



server.listen(4000 , ()=>{
    console.log('chat 服务器启动成功')
})
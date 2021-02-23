const ws = require('nodejs-websocket')

let count = 0;
var allsocket = [];     // 做一个记录
var allsocketId = [];
let total = 0;
const server = ws.createServer((conn) => {
    // console.log(conn.key)
    // total
    // console.log(server.connections[total].key)
    // console.log("服务器启动成功")
    // 每次有人连的时候 total ++;
    total++;
    conn.on('text', (str) => {
        let unique = str.indexOf('##')       //    用户 广播 自己的id 的时候  直接 进行 没有## 就一定进入 -1 ;
        if (unique == -1) {
            if (allsocket.length == 0) {       // 这是 第一个用户 
                allsocket.push({
                    user_id: str,
                    item: conn
                })
                allsocketId.push(str)
                broadcastall(JSON.stringify(allsocketId))
            }

            else {
                let old_user = -1;
                allsocket.forEach((item, index) => {      // 当前用户 重新进入的时候     过滤
                    if (item.user_id == str) {
                        old_user = index
                        allsocket.splice(index,1)
                        allsocketId.splice(index,1)
                    }
                })
                if (old_user == -1) {
                    allsocket.push({
                        user_id: str,
                        item: conn
                    })
                    allsocketId.push(str)
                    broadcastall(JSON.stringify(allsocketId))
                }
                else {
                    allsocket.push({
                        user_id: str,
                        item: conn
                    })
                    allsocketId.push(str)
                    broadcastall(JSON.stringify(allsocketId))
                }
            }
            // console.log(allsocket)
        }
        else {
            str = str.slice(2)
             broadcast(str)
        }
    })

    conn.on('close', (code) => {
        console.log('关闭了链接')
        allsocket = [] 
        allsocketId = []
        total = 0 
    })
    conn.on('error', (code) => {
        allsocket = [] 
        allsocketId = []
        total = 0 
        console.log('有错误')
    })



    function broadcast (res){
        let friend_id = res.slice(0,32)      // 
        let connect = res.slice(32)
        allsocket.forEach((s_item,s_index)=>{
          if(s_item.user_id == friend_id ){
              console.log(JSON.stringify({friend_id : friend_id  ,connect : connect , current_id : s_item.user_id  }))
             s_item.item.send(JSON.stringify({friend_id : friend_id  ,connect : connect , current_id : s_item.user_id  }))
          }     
        })

        // server.connections.forEach((conn,i) => {	
        //     // console.log(`${JSON.parse(data)}##${allsocketId[i]}`)							
        //     conn.send(JSON.stringify({friend_id : friend_id  ,connect : connect   }))  //sendText 服务端发送给客户端方法
        // })
    }

    
function broadcastall(data , type = null) {
    if(type) {
        //所有的窗口都储存在connections里面，所以用循环把消息发给所有的窗口 
       server.connections.forEach((conn,i) => {							
        conn.send(JSON.stringify(`${JSON.parse(data)}##${allsocketId[i]}`))  //sendText 服务端发送给客户端方法
    })

    return 
    }
    //所有的窗口都储存在connections里面，所以用循环把消息发给所有的窗口 
       server.connections.forEach((conn,i) => {								
           conn.send(data)  //sendText 服务端发送给客户端方法
       })
   }

})



server.listen(4000, () => {
    console.log("启动成功,监听端口" + 4000)
})
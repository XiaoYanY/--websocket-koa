const Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
var moment  = require('moment')
const http = require('http')
const app = new Koa()
const server = http.createServer(app.callback()) //server接收一个回调函数作为参数
const io = require('socket.io')(server)
const {addUser,findUser,findAllUser} = require('./user.js')

app.use(serve(__dirname+'/static'))
io.on('connection',(socket)=>{//建立与client连接
	// console.log('已连接');
	socket.on('joinChat',(login)=>{//登陆房间
		const {username,room} = login;
		const id = socket.id;

		socket.join(room);
		addUser(id,username,room);
		var users = findAllUser();//当前房间所有用户名

		socket.emit('message',createMessage('机器人','欢迎来到聊天吧!',room),users);
		socket.broadcast.to(room).emit('message',createMessage('机器人',`欢迎${username}来到聊天吧!`,room),users);	
		
	})

	socket.on('chatMessage',(msg)=>{ //client传到服务端的消息，发送消息
		//console.log('客户端传过来的消息',msg);
		var user = findUser(socket.id);
		var {username,room} = user;
		socket.emit('message',createMessage(username,msg,room))
		socket.broadcast.to(room).emit('message',createMessage(username,msg,room)) //server处理消息后传回前端渲染（发送所有人）
	})

	socket.on('disconnect',()=>{ //断开连接 - 离开房间
		// console.log('用户离开');
		var user = findUser(socket.id);
		if(!user)return;
		
		var {username,room} = user;
		//通知房间内其他用户  who已经离开了房间
		socket.broadcast.to(room).emit('message',createMessage('机器人',`${username}已经离开聊天吧`))
	})

})

function createMessage(username,msg,room){
	return {
			username,
			room,
			date:getDate(),
			msg,
		}
}
function getDate(){
	return moment().format('YYYY-MM-DD hh:mm')
}

server.listen(3000,()=>{
	console.log('服务启动成功');
})
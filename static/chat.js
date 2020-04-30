var socket = io('http://localhost:3000/')

var sendBtn = document.querySelector('#sendBtn');//聊天房间发送信息按钮
var contentMsg = document.querySelector(".chat-messages");//内容框
var msg = document.querySelector('#msg');//消息
var roomName = document.querySelector('#room-name'); //房间号
var usersUl = document.querySelector('#users')//用户列表容器

var query = queryString();
socket.emit('joinChat',query)//发送房间、用户信息
//同步房间名
setRoomName(query.room);
function setRoomName(room){
	roomName.innerHTML = room;
}
//同步同一房间用户列表
function setAllUsers(users){
	console.log('用户列表',users);
	if(!users)return;
	usersUl.innerHTML = users.map((item)=>`<li>${item}</li>`).join('');
}

//发送信息
sendBtn.onclick = ()=>{
	socket.emit('chatMessage',msg.value)
	msg.value = '';
	return false; //阻止form-submit默认刷新页面
}


socket.on('message',(userInfo,users)=>{ //接收服务端传回的消息及时间
	//显示用户列表
	setAllUsers(users);
	//显示用户发送消息
	let color = query.username == userInfo.username?'Msg selfMsg':'Msg friendMsg'
	let str = `<div class='${color}'>
			  <p class='gray'>${userInfo.username}:</p>
              <span>${userInfo.msg}</span><i>${userInfo.date}</i>
          </div>`;
	contentMsg.innerHTML = str + contentMsg.innerHTML;
})

function queryString(){ //整理入口登陆进来的参数get方式，返回{username:root,room:语文}
	var result = {};
	var search = decodeURI(location.search);
	var infoArray = search.slice(1).split('&');
	infoArray.forEach((item)=>{
		let info = item.split('=');
		let key = info[0];
		let value = info[1];
		result[key] = value;
	})
	return result
}


const users = [];

module.exports={
	addUser(id,username,room){
		users.push({id,username,room})
	},
	findUser(id){
		return users.find((item)=>item.id==id)
	},
	findAllUser(){
		var allUser = [];
		users.forEach((item)=>{
			allUser.push(item.username)
		})
		return  allUser;
	}
}
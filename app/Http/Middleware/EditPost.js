'use strict'
const User = use('App/Model/User')
const Role = use('App/Model/Role')
var i = 0
var f = 0
class EditPost {

  * handle (request, response, next) {
	  const user = request.currentUser
	  if(user){
		  const user_role = yield User.find(user.id)
		  const role = (yield user.roles().fetch()).first().toJSON()
		  const per_role = yield Role.find(role.id)
		  const per = (yield per_role.permissions().fetch()).toJSON()

		  for(i ; i < per.length; i++){
			  if(per[i].name == 'edit'){
				  //yield response.send(per[i].name)
				  f = 1
				}
		  }
		  if(f == 0){
			  yield response.unauthorized('you cannot edit')
		  }
	}
    yield next
  }

}

module.exports = EditPost

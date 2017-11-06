'use strict'
const User = use('App/Model/User')
class LoginController {
	* redirect (request, response) {
		yield request.ally.driver('facebook').redirect()
	}
	* handleCallback (request, response) {
		const fbUser = yield request.ally.driver('facebook').getUser()
		//yield response.send(fbUser)

		const searchAttr = {
		  email: fbUser.getEmail()
		}

		const newUser = {
		  email: fbUser.getEmail(),
		  avatar: fbUser.getAvatar(),
		  username: fbUser.getName()
		}
		yield response.send(newUser)

//		const user = yield User.findOrCreate(searchAttr, newUser) 
//
//		request.auth.loginViaId(user.id) 
	}
}

module.exports = LoginController

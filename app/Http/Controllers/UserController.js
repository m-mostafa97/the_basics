'use strict'
const Helpers = use('Helpers')
const User = use('App/Model/User')
const Database = use('Database')
const Validator = use('Validator')
const Hash = use('Hash')
class UserController {
	* signout(request, response) {
			const user = request.currentUser
			if (user) {
				yield request.auth.logout()
				yield response.redirect('/')
			} else {
				yield response.redirect('/')
			}
		}
		* showLogin(request, response) {
			const user = request.currentUser
			const error = request.input('error')
			if (user) {
				yield response.redirect('/')
			} else {
				yield response.sendView('login', {error})
				return
			}
		}
		* showsignup(request, response) {
			const user = request.currentUser
			if (user) {
				yield response.redirect('/')
			} else {
				yield response.sendView('signup')
				return
			}
		}
		* signup(request, response) {
			const avatar = request.file('avatar', {
				maxSize: '2mb',
				allowedExtensions: ['jpg', 'png', 'jpeg']
			})
			const fileName = `${new Date().getTime()}.${avatar.extension()}`
			yield avatar.move(Helpers.publicPath(), fileName)
			if (!avatar.moved()) {
				yield response.sendView('signup', {
					avatarError: avatar.errors()
				})
				return
			}
			const rules = {
				fname: 'required',
				lname: 'required',
				email: 'required|email|unique:users',
				password: 'required'
			}
			const body = request.all()
			const validation = yield Validator.validate(body, rules)
			if (validation.fails()) {
				yield request
					.withOnly('fname', 'lname', 'email', 'avatar', 'password')
					.andWith({
						errors: validation.messages()
					})
					.flash()
				response.redirect('/signup')
				return
			} else {
				const fname = body['fname']
				const lname = body['lname']
				const avatar = fileName
				const password = yield Hash.make(body['password'])
				const email = body['email']
				yield Database.insert({
					fname: fname,
					lname: lname,
					avatar: avatar,
					password: password,
					email: email
				}).into('users')
				response.redirect('/')
			}

		}
		* login(request, response) {
			const user = request.currentUser
			if (user) {
				yield response.redirect('/')
			} else {
				const email = request.input('email')
				const password = request.input('password')
				try {
				  yield request.auth.attempt(uid, password)
				  yield response.redirect('/')
				} catch (e) {
				  yield request.with({error: e.message}).flash()
				  response.redirect('/login')
				}
			}
		}
		* profile(request, response) {
			const user = request.currentUser
			if (user) {
				const posts = yield Database.table('users').innerJoin('posts', 'users.id', 'posts.user_id').where('users.id', user.id)
				const num = (yield Database.count('title').table('users').innerJoin('posts', 'users.id', 'posts.user_id').where('users.id', user.id).first())["count(`title`)"]
				const user_role = yield User.find(user.id)
				const role = (yield user.roles().fetch()).toJSON()
				//yield response.send(role)
				yield response.sendView('profile', {
					user,
					posts,
					num,
					role
				})
			} else {
				yield response.sendView('404')
			}
		}
}

module.exports = UserController
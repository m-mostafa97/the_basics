'use strict'
const Database = use('Database')
const User = use('App/Model/User')
const Post = use('App/Model/Post')
const Role = use('App/Model/Role')
const Comment = use('App/Model/Comment')
const Helpers = use('Helpers')
const Validator = use('Validator')
var i = 0
class PostController {

	* index(request, response) {
		const category = request.input('category')
		const page = request.input('page')
		const search = request.input('search')
		try {
			const user = request.currentUser


			const numOfPages = (yield Database.count('title').table('users').innerJoin('posts', 'users.id', 'posts.user_id').first())["count(`title`)"]
			const num = Math.ceil(numOfPages / 10)
			//ddddddddd
			const maxRateUser = (yield Database.table('posts').sum('rate').select("user_id").groupBy('user_id').orderBy("sum(`rate`)", 'desc').first())['user_id']
			const selectUser = yield User.find(maxRateUser)
			const maxRatePost = (yield Database.table('posts').max('rate').first())["max(`rate`)"]
			const selectPost = yield Database.select('*').from('posts').where('rate', maxRatePost).first()



			if (search) {
				const posts = yield Database.table('users').innerJoin('posts', 'users.id', 'posts.user_id').where(function () {
					this.where('title', 'like', `%${search}%`).orWhere('content', 'like', `%${search}%`).orWhere('category', 'like', `%${search}%`)
				}).andWhere('posts.deleted_at', null).paginate(1, 8)

				yield response.sendView('index', {
					posts: posts.data,
					selectUser,
					selectPost,
					user,
					num: posts.lastPage,
					lastPage: posts.lastPage,
					currentPage: posts.currentPage
				})
			} else if (category) {
				//if we click to a category
				if (page) {
					const posts = yield Database.table('users').innerJoin('posts', 'users.id', 'posts.user_id').where('category', category).andWhere('posts.deleted_at', null).paginate(page, 8)
					yield response.sendView('index', {
						posts: posts.data,
						selectUser,
						selectPost,
						user,
						num: posts.lastPage,
						currentPage: posts.currentPage,
						lastPage: posts.lastPage,
						category: category
					})
				} else {
					const posts = yield Database.table('users').innerJoin('posts', 'users.id', 'posts.user_id').where('category', category).andWhere('posts.deleted_at', null).paginate(1, 8)
					yield response.sendView('index', {
						posts: posts.data,
						selectUser,
						selectPost,
						user,
						num: posts.lastPage,
						currentPage: posts.currentPage,
						lastPage: posts.lastPage,
						category: category
					})
				}
			} else if (page) {
				//will view the number of page of the website

				const posts = yield Database.table('users').innerJoin('posts', 'users.id', 'posts.user_id').andWhere('posts.deleted_at', null).paginate(page, 8)
				yield response.sendView('index', {
					posts: posts.data,
					selectUser,
					selectPost,
					user,
					num: posts.lastPage,
					lastPage: posts.lastPage,
					currentPage: posts.currentPage
				})
			} else {
				//will view the main page of the website
				const posts = yield Database.select('title', 'content', 'fname', 'lname', 'posts.avatar', 'posts.updated_at').table('users').innerJoin('posts', 'users.id', 'posts.user_id').andWhere('posts.deleted_at', null).paginate(1, 8)

				yield response.sendView('index', {
					posts: posts.data,
					selectUser,
					selectPost,
					user,
					num: posts.lastPage,
					lastPage: posts.lastPage,
					currentPage: posts.currentPage
				})
			}
		} catch (e) {
			if (e == "TypeError: Cannot read property 'user_id' of undefined") {
				const error = 'there is no posts'
				yield response.sendView('index', {
					error
				})
			} else {
				yield response.sendView('index', {
					e
				})
			}
		}

	}

	* create(request, response) {
			const user = request.currentUser
			if (user) {
				const user_role = yield User.find(user.id)
				const role = (yield user.roles().fetch()).first().toJSON()
				const per_role = yield Role.find(role.id)
				const per = (yield per_role.permissions().fetch()).toJSON()

				for (i; i < per.length; i++) {
					if (per[i].name == 'create') {
						yield response.sendView('create', {
							user
						})
						return
					}
					i = 0
				}
				yield response.sendView('permission', {
					user
				})
			} else {
				yield response.sendView('404')
			}
		}
		* store(request, response) {
			const user = request.currentUser
			try {
				if (user) {
					const avatar = request.file('avatar', {
						maxSize: '2mb',
						allowedExtensions: ['jpg', 'png', 'jpeg']
					})
					const fileName = `${new Date().getTime()}.${avatar.extension()}`
					yield avatar.move(Helpers.publicPath(), fileName)

					if (!avatar.moved()) {
						response.badRequest({
							avatarError: avatar.errors()
						})
						return
					}
					const rules = {
						title: 'required',
						content: 'required'
					}
					const userData = yield request.all()
					const validation = yield Validator.validate(userData, rules)
					if (validation.fails()) {
						response.sendView('create', {
							errors: validation.messages()
						})
						return
					} else {
						const post = new Post()
						post.title = request.input('title')
						post.content = request.input('content')
						post.avatar = fileName
						post.category = request.input('category')
						post.user_id = user.id
						yield post.save()
						yield response.redirect('/')
					}
				}
			} catch (e) {
				yield response.sendView('create', {
					e
				})
			}
		}

	* show(request, response) {
		const user = request.currentUser
		try {
			const id = request.param('id')

			const post1 = yield Post.find(id)
			post1.rate = (post1.rate + 1)
			yield post1.save()
			const post = yield Database.table('users').innerJoin('posts', 'users.id', 'posts.user_id').where('posts.id', id).first()

			const maxRateUser = (yield Database.table('posts').sum('rate').select("user_id").groupBy('user_id').orderBy("sum(`rate`)", 'desc').first())['user_id']
			const selectUser = yield User.find(maxRateUser)
			const maxRatePost = (yield Database.table('posts').max('rate').first())["max(`rate`)"]
			const selectPost = yield Database.select('*').from('posts').where('rate', maxRatePost).first()
			const comments = yield Database.table('users').innerJoin('comments', 'users.id', 'comments.post_id').where('comments.post_id', id)


			yield response.sendView('post', {
				post,
				selectUser,
				selectPost,
				user,
				comments
			})
		} catch (e) {
			yield response.sendView('404')
		}
	}

	* edit(request, response) {
		const user = request.currentUser
		const id = request.param('id')
		try {
			const post = yield Post.find(id)
			if (user) {
				const user_role = yield User.find(user.id)
				const role = (yield user.roles().fetch()).first().toJSON()
				const per_role = yield Role.find(role.id)
				const per = (yield per_role.permissions().fetch()).toJSON()
				//yield response.send(per[0].name)
				for (i; i < per.length; i++) {
					if ((per[i].name == 'edit') || (post.user_id == user.id)) {
						yield response.sendView('edit', {
							post: post.toJSON(),
							user
						})
						return
					}
					i = 0
				}
				yield response.sendView('permission', {
					user
				})
			} else {
				yield response.sendView('404')
			}
		} catch (e) {
			yield response.sendView('404')
		}
	}

	* update(request, response) {
		const user = request.currentUser
		const id = request.param('id')
		try {
			if (user) {
				const avatar = request.file('avatar', {
					maxSize: '2mb',
					allowedExtensions: ['jpg', 'png', 'jpeg']
				})
				const fileName = `${new Date().getTime()}.${avatar.extension()}`
				yield avatar.move(Helpers.publicPath(), fileName)

				if (!avatar.moved()) {
					response.badRequest(avatar.errors())
					return
				}
				const rules = {
					title: 'required',
					content: 'required'
				}
				const userData = yield request.all()
				const validation = yield Validator.validate(userData, rules)
				if (validation.fails()) {
					response.sendView('create', {
						errors: validation.messages()
					})
					return
				} else {
					const post = yield Post.find(id)
					post.title = request.input('title')
					post.content = request.input('content')
					post.avatar = fileName
					post.category = request.input('category')
					post.user_id = user.id
					yield post.save()
					yield response.redirect('/')
				}
			} else {
				yield response.sendView('404')
			}
		} catch (e) {
			yield response.sendView('post', {
				e
			})
		}
	}

	* destroy(request, response) {
		const id = request.param('id')
		const user = request.currentUser
		try {
			const post = yield Post.find(id)
			if (user) {
				const user_role = yield User.find(user.id)
				const role = (yield user.roles().fetch()).first().toJSON()
				const per_role = yield Role.find(role.id)
				const per = (yield per_role.permissions().fetch()).toJSON()
				for (i; i < per.length; i++) {
					if ((per[i].name == 'delete') || (post.user_id == user.id)) {
						if (post) {
							//							const comments = yield Comment.findBy('post_id', id)
							//							yield comments.delete()
							yield post.delete()
							yield response.redirect('/')
						}
						return
					}
					i = 0
				}
				yield response.sendView('permission', {
					user
				})
			} else {
				yield response.sendView('404')
			}

		} catch (e) {
			yield response.sendView('404', {
				e
			})
		}
	}
	//	* test(request, response){
	//		const user = request.currentUser
	//		const user_role = yield User.find(user.id)
	//		const role = (yield user.roles().fetch()).first().toJSON()
	//		const per_role = yield Role.find(role.id)
	//		const per = (yield per_role.permissions().fetch()).toJSON()
	//		yield response.send(per)
	//	}
	* all(request, response) {
		yield response.sendView('404')
	}

}

module.exports = PostController
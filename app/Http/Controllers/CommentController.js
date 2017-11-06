'use strict'
const Comment = use('App/Model/Comment')
class CommentController {
	* create(request, response){
		const user = request.currentUser
		const comment = new Comment()
		comment.cotent	= request.input('comment')
		comment.user_id = user.id
		comment.post_id = request.input('comment_id')
		yield comment.save()
		yield response.redirect('/')
	}
}

module.exports = CommentController

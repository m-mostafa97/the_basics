'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')



Route.get('/login', 'UserController.showLogin')
Route.get('/signup', 'UserController.showsignup')
Route.post('/login', 'UserController.login')
Route.post('/signup', 'UserController.signup')
Route.get('/signout', 'UserController.signout')
Route.get('/profile', 'UserController.profile')




Route.resource('/', 'PostController')





Route.post('/addComment', 'CommentController.create')
Route.get('facebook/login', 'LoginController.redirect')
Route.get('facebook/authenticated', 'LoginController.handleCallback')
//Route.get('/test', 'PostController.test')
Route.any('*', 'PostController.all')
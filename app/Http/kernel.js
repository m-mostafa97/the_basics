'use strict'

const Middleware = use('Middleware')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on every request and must be defined
| inside below array.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/Cors',
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/Flash',
  'Adonis/Middleware/AuthInit',
  'Adonis/Middleware/Ally'
//  'App/Http/Middleware/CreatePost',
//  'App/Http/Middleware/EditPost',
//  'App/Http/Middleware/DeletePost'
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware are key/value pairs. Keys are later used on routes
| which binds middleware to specific routes.
|
*/
const namedMiddleware = {
  auth: 	'Adonis/Middleware/Auth'
//  create: 	'App/Http/Middleware/CreatePost',
//  edit: 	'App/Http/Middleware/EditPost',
//  delete: 	'App/Http/Middleware/DeletePost'
}

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Here we finally register our defined middleware to Middleware provider.
|
*/
Middleware.global(globalMiddleware)
Middleware.named(namedMiddleware)

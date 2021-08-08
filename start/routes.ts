/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Home
Route.get('/', async () => {
  return { hello: 'world' }
})

// Authentication User
Route.group(() => {
  // register
  Route.post('register', 'AuthController.register')
  // login
  Route.post('login', 'AuthController.login')
}).prefix('auth')

// Guard Router
Route.group(() => {
  // get authenticated user data
  Route.get('myData', 'AuthController.user')
  // get list user
  Route.get('user', 'AuthController.listUser')

  // get list post
  Route.get('post', 'PostsController.index')
  // create new post
  Route.post('post', 'PostsController.store')

  // detail post
  Route.get('post/:id', 'PostsController.show')
  // update post
  Route.put('post/:id', 'PostsController.update')
  // delete post
  Route.delete('post/:id', 'PostsController.destroy')
}).middleware('auth:api')

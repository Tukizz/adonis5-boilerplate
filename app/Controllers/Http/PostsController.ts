import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostValidator from 'App/Validators/PostValidator'

export default class PostsController {
  /**
   * @description for list post
   *
   * @private need to be authenticated
   *
   * @returns {json}
   */
  public async index({ response }: HttpContextContract) {
    try {
      const posts = await Post.query().preload('user')
      return response.status(200).send({
        message: 'get data success',
        code: 200,
        error: false,
        results: posts,
      })
    } catch (err) {
      return response.status(400).send({
        message: err.message,
        code: 400,
        error: true,
        results: null,
      })
    }
  }

  /**
   * @description for get detail post
   *
   * @private need to be authenticated
   *
   * @returns {json}
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const post = await Post.query().where('id', params.id).firstOrFail()
      await post.preload('user')
      return response.status(200).send({
        message: 'get data success',
        code: 200,
        error: false,
        results: post,
      })
    } catch (err) {
      return response.status(404).send({
        message: err.message,
        code: 404,
        error: true,
        results: null,
      })
    }
  }

  /**
   * @description for update post
   *
   * @private need to be authenticated
   *
   * @param {string} title
   * @requires
   *
   * @param {string} content
   *
   * @returns {json}
   */
  public async update({ request, params, response }: HttpContextContract) {
    const data = request.only(['title', 'content'])
    const valid = await request.validate(PostValidator)
    if (!valid) {
      return response.status(400).send({
        message: 'Validation Error',
        code: 400,
        error: true,
        results: valid,
      })
    }

    try {
      const post = await Post.query().where('id', params.id).firstOrFail()

      post.title = data.title
      post.content = data.content
      await post.save()
      await post.preload('user')
      return response.status(200).send({
        message: 'Save data Success',
        code: 200,
        error: false,
        results: post,
      })
    } catch (err) {
      return response.status(400).send({
        message: err.message,
        code: 400,
        error: true,
        results: null,
      })
    }
  }

  /**
   * @description for create post
   *
   * @private need to be authenticated
   *
   * @param {string} title
   * @requires
   *
   * @param {string} content
   *
   * @returns {json}
   */
  public async store({ auth, request, response }: HttpContextContract) {
    const data = request.only(['title', 'content'])
    const valid = await request.validate(PostValidator)
    if (!valid) {
      return response.status(200).send({
        message: 'Validation Error',
        code: 200,
        error: false,
        results: valid,
      })
    }

    try {
      const user = await auth.authenticate()
      const post = new Post()
      post.title = data.title
      post.content = data.content

      await user.related('posts').save(post)
      return response.status(200).send({
        message: 'Save data Success',
        code: 200,
        error: false,
        results: post,
      })
    } catch (err) {
      return response.status(400).send({
        message: err.message,
        code: 400,
        error: true,
        results: null,
      })
    }
  }

  /**
   * @description for delete post
   *
   * @private need to be authenticated
   *
   * @param {id} params.id
   * @requires
   *
   * @returns {json}
   */
  public async destroy({ response, auth, params }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      await Post.query().where('user_id', user.id).where('id', params.id).delete()

      return response.status(200).send({
        message: 'delete data success',
        code: 200,
        error: false,
        results: null,
      })
    } catch (err) {
      return response.status(400).send({
        message: err.message,
        code: 400,
        error: true,
        results: null,
      })
    }
  }
}

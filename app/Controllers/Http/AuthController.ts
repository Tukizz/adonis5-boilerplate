import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'

export default class AuthController {
  /**
   * @description for user login
   *
   * @param {email} email
   * @requires
   *
   * @param {string} password
   * @requires
   *
   * @returns {json}
   */
  public async login({ request, auth, response }: HttpContextContract) {
    const data = request.only(['email', 'password'])
    const valid = await request.validate(LoginUserValidator)
    if (!valid) {
      return response.status(400).send({
        message: 'Validation Error',
        code: 400,
        error: true,
        results: valid,
      })
    }

    try {
      const token = await auth.use('api').attempt(data.email, data.password, {
        expiresIn: '10 days',
      })

      return response.status(200).send({
        message: 'Login Success',
        code: 200,
        error: false,
        results: token,
      })
    } catch (err) {
      return response.status(400).send({
        message: err.message,
        code: 400,
        error: false,
        results: null,
      })
    }
  }

  /**
   * @description for user register
   *
   * @param {string} name
   * @requires
   *
   * @param {email} email
   * @requires
   * @unique
   *
   * @param {string} password
   * @requires
   *
   * @returns {json}
   */
  public async register({ request, auth, response }: HttpContextContract) {
    const data = request.only(['email', 'name', 'password'])
    const valid = await request.validate(RegisterUserValidator)
    if (!valid) {
      return response.status(400).send({
        message: 'Validation Error',
        code: 400,
        error: true,
        results: valid,
      })
    }

    try {
      const newUser = new User()
      newUser.email = data.email
      newUser.password = data.password
      newUser.name = data.name
      await newUser.save()
      const token = await auth.use('api').login(newUser, {
        expiresIn: '10 days',
      })
      return response.status(200).send({
        message: 'Register Success',
        code: 200,
        error: false,
        results: token,
      })
    } catch (err) {
      return response.status(400).send({
        message: err.message,
        code: 400,
        error: true,
        results: valid,
      })
    }
  }

  /**
   * @description get authenticated user data
   *
   * @private need to be authenticated
   *
   * @returns {json}
   */
  public async user({ auth, response }: HttpContextContract) {
    try {
      return response.status(200).send({
        message: 'Get User Success',
        code: 200,
        error: false,
        results: auth.user,
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
   * @description get list user
   *
   * @private need to be authenticated
   *
   * @returns {json}
   */
  public async listUser({ response }: HttpContextContract) {
    try {
      const user = await User.all()
      return response.status(200).send({
        message: 'Get User Success',
        code: 200,
        error: false,
        results: user,
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

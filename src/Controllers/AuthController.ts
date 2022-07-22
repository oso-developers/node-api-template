import { Context } from "@/Core/Server"
import { report, password, random } from "@/Core/Helpers"
import { User, AuthToken } from "@/Models"
import schema from "./AuthController.schema"
import authConfig from "@/Core/Config/auth.json"

/**
 *  register a new user
 * 
*/
async function Register(ctx: Context) {
  const { body } = ctx.request
  const { error } = schema.register.validate(body)
  if (error) {
    return report(ctx, {}, error, 422)
  }

  const user = new User({
    email: body.email,
    password: await password.hash(body.password),
    user_role: authConfig.default_role,
  })

  try {
    await user.save()
  } catch (err) {
    return report(ctx, err, {}, 400)
  }
  
  const { _id, email, user_role, approved } = user.toObject()
  ctx.status = 201
  ctx.body = { _id, email, user_role, approved }
}

/**
 *  log-in a registered user
 * 
*/
async function Login(ctx: Context) {
  const { body } = ctx.request
  const { error } = schema.login.validate(body)
  if (error) {
    return report(ctx, {}, error, 422)
  }

  const user = await User.findOne({ email: body.email }).select("+password")
  if (!user) {
    return report(ctx, {}, {}, 401)
  }

  const verified = await password.verify(user.password, body.password)
  if (!verified) {
    return report(ctx, {}, {}, 401)
  }

  const token = random.string(authConfig.tokens.bytes)
  const authToken = new AuthToken({ user, token })
  await authToken.save()

  // TODO: remove password field from response
  ctx.body = { ...user.toObject(), token }
}

/** 
 *  logout a logged-in user
 * 
*/
async function Logout(ctx: Context) {
  const user = ctx.state["user"]
  const { token } = ctx.request

  const authToken = await AuthToken.findOne({ user, token })
  if (!authToken) {
    const error = new Error("invalid auth token")
    return report(ctx, error, {}, 401)
  }

  await authToken.delete()
  ctx.status = 200
}

export default {
  Register,
  Login,
  Logout,
}
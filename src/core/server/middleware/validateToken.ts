import { FastifyRequest } from "fastify"
import { AuthException } from "@/core/entities/exceptions"
import { Auth } from "@/core/helpers"
import { UserRepository } from "@/app/modules/user/userRepository"

export const validateToken = async (req: FastifyRequest) => {
  const token = parseBearerToken(req)
  if (!token) {
    throw AuthException("invalid bearer token")
  }

  const { userId, userRole } = await Auth.validateLoginAuthToken(token)
    const user = await UserRepository.findById(userId)
  if (!user || user.status === "INACTIVE") {
    throw AuthException("token expired due to inactive user");
  }

  /* store id of the validated user on the request object */
  req.requestContext.set("userId" as never, userId as never)
  req.requestContext.set("userRole" as never, userRole as never)
}

function parseBearerToken(req: FastifyRequest): string | undefined {
  const header = req.headers["authorization"]
  if (!header) return

  const token = header.replace("Bearer ", "")
  if (!token) return

  return token
}

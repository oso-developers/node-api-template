import { FastifyRequest } from "fastify"
import { AuthException } from "@/core/entities/exceptions"
import { Auth } from "@/core/helpers"

export const validateToken = async (req: FastifyRequest) => {
  const token = parseBearerToken(req)
  if (!token) {
    throw AuthException("invalid bearer token")
  }
  const { userId, userRole, userStatus } = await Auth.validateLoginAuthToken(token)
  console.log("Auth Response:", { userId, userRole, userStatus });

  // const user = await UserRepository.findById(userId)
  if (!userId || userStatus === "INACTIVE") {
    throw AuthException("token expired due to inactive user")
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

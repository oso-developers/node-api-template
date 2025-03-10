import "module-alias/register"
/** import all configs effectively validates there are no errors */
import "@/app/config"

import { Server } from "@/core/server"
import { logger } from "./core/server/logger"
import { db } from "./core/database"

async function main(): Promise<void> {

  // const user =await db.user.deleteMany()
  const server = Server.new()
  await Server.start(server)
}

main().catch(logger.error)

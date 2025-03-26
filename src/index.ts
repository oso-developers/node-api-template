import "module-alias/register"
/** import all configs effectively validates there are no errors */
import "@/app/config"

import { Server } from "@/core/server"
import { logger } from "./core/server/logger"
import puppeteer from "puppeteer"
import { Resend } from "resend"
import { emailConfig } from "@/app/config"
import { EmailService } from "./core/email"
import { ResendEmailService } from "./core/helpers/email"
import { DocumentGeneratorService } from "./core/helpers/genratePDForPNG"
// import { db } from "./core/database"

async function main(): Promise<void> {
  const server = Server.new()
  await Server.start(server)
}

main().catch((err) => logger.error(err))

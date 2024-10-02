import "reflect-metadata";

import { createServer, Server as HttpServer } from 'http'
import express from 'express'
import { config } from 'dotenv'
import { port, environment } from './config/globals'
import { Server } from './Api/server'
import Logger from './core/Logger';
import "./joi.types"
import "./database"

config();
// Run simple-update-notifier in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('simple-update-notifier')();
}

(async function main(): Promise<void> {
  try {

    process.on('uncaughtException', (e) => {
      Logger.error(e);
    });


    // Init express server
    const app: express.Application = new Server().app
    const server: HttpServer = createServer(app)

    // Start express server
    server.listen(port)

    server.on('listening', () => {
      Logger.info(`node server is listening on port ${port} in ${environment} mode`)
    })

  } catch (err: any) {
    console.log(err);
    Logger.error(err.stack);
  }
})();

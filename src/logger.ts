import pino from 'pino';
import path from 'path';
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },

      {
        target: "pino/file",
        level: "info",
        options: {
          destination: path.join(process.cwd(), "logs", "app.log"),
          mkdir: true,
          
        },
      },

      {
        target: "pino/file",
        level: "error",
        options: {
          destination: path.join(process.cwd(), "logs", "erreurs.log"),
          mkdir: true,
        },
      },
    ],
  },
});



export { logger };

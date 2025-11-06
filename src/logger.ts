import pino, { destination } from 'pino';
import path from 'path';

const logger = pino({
  base: {
    service: 'test-api',
  },
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
          // translateTime: 'HH:MM:ss',  
          ignore: 'pid,hostname',
          singleLine: true,           
          messageFormat: '{levelLabel} - {msg}',  // Format simple
        }
      },
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
          // translateTime: 'HH:MM:ss',  
          ignore: 'pid,hostname',
          singleLine: true,            
          messageFormat: '{levelLabel} - {msg}',  // Format simple
          destination: path.join(process.cwd(), 'logs/file.log')
        }
      }
    ]
  }
});

export default logger;
import 'dotenv/config';import app from './app.js';import {prisma,connectOptionalStores,closeStores} from './db/index.js';import pino from 'pino';
const logger=pino({level:process.env.LOG_LEVEL??'info'});const port=Number(process.env.PORT??4000);
if(!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32){logger.fatal('SESSION_SECRET must be configured with at least 32 characters');process.exit(1)}
let server:ReturnType<typeof app.listen>;
async function start(){await prisma.$connect();logger.info('PostgreSQL connected');await connectOptionalStores();server=app.listen(port,()=>logger.info({port},'Terra API listening'));}
async function shutdown(signal:string){logger.info({signal},'Graceful shutdown started');server?.close();await closeStores();process.exit(0)}
process.on('SIGTERM',()=>void shutdown('SIGTERM'));process.on('SIGINT',()=>void shutdown('SIGINT'));
start().catch(err=>{logger.fatal({err},'API startup failed');process.exit(1)});

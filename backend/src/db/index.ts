import { PrismaClient } from '@prisma/client';
import { MongoClient, type Collection } from 'mongodb';
import Redis from 'ioredis';
import pino from 'pino';
const logger=pino({level:process.env.LOG_LEVEL??'info'});
export const prisma=new PrismaClient({log:process.env.NODE_ENV==='development'?['error','warn']:['error']});
let mongoClient:MongoClient|undefined;let telemetry:Collection|undefined;let redis:Redis|undefined;
export async function connectOptionalStores(){
 if(process.env.MONGODB_URI){try{mongoClient=new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:2500});await mongoClient.connect();const db=mongoClient.db();telemetry=db.collection('telemetry_events');await telemetry.createIndex({createdAt:1},{expireAfterSeconds:60*60*24*30});await telemetry.createIndex({binCode:1,createdAt:-1});logger.info('MongoDB telemetry archive connected')}catch(e){logger.warn({err:e},'MongoDB unavailable; telemetry archival disabled');await mongoClient?.close().catch(()=>{});mongoClient=undefined;telemetry=undefined}}
 if(process.env.REDIS_URL){try{redis=new Redis(process.env.REDIS_URL,{lazyConnect:true,maxRetriesPerRequest:1,connectTimeout:1800,retryStrategy:()=>null});redis.on('error',err=>logger.warn({err},'Redis connection error'));await redis.connect();logger.info('Redis connected')}catch(e){logger.warn({err:e},'Redis unavailable; cache disabled');redis?.disconnect();redis=undefined}}
}
export async function archiveTelemetry(event:Record<string,unknown>){if(!telemetry)return;try{await telemetry.insertOne({...event,createdAt:new Date()})}catch(e){logger.warn({err:e},'Telemetry archival failed')}}
export async function cacheGet<T>(key:string):Promise<T|undefined>{if(!redis)return;try{const raw=await redis.get(key);return raw?JSON.parse(raw) as T:undefined}catch(e){logger.warn({err:e},'Cache read failed');return undefined}}
export async function cacheSet(key:string,value:unknown,ttlSeconds=30){if(!redis)return;try{await redis.set(key,JSON.stringify(value),'EX',ttlSeconds)}catch(e){logger.warn({err:e},'Cache write failed')}}
export async function invalidateCache(prefix:string){if(!redis)return;try{const keys=await redis.keys(`${prefix}*`);if(keys.length)await redis.del(...keys)}catch(e){logger.warn({err:e},'Cache invalidation failed')}}
export async function closeStores(){await Promise.allSettled([prisma.$disconnect(),mongoClient?.close(),redis?.quit()])}
export function storesStatus(){return{postgres:'required',mongodb:!!mongoClient,redis:!!redis}}

import {PrismaClient} from '@prisma/client';const prisma=new PrismaClient();
async function main(){const bins=[
{code:'TR-104',name:'Central Market',area:'Civic Centre',fillLevel:94,status:'OVERFLOWING' as const,latitude:21.1458,longitude:79.0882},
{code:'TR-118',name:'Riverside Walk',area:'Civil Lines',fillLevel:78,status:'WARNING' as const,latitude:21.1574,longitude:79.0756},
{code:'TR-092',name:'Garden Gate',area:'Dharampeth',fillLevel:42,status:'NORMAL' as const,latitude:21.1371,longitude:79.0669},
{code:'TR-121',name:'Station Road',area:'Sitabuldi',fillLevel:67,status:'NORMAL' as const,latitude:21.1463,longitude:79.0849},
{code:'TR-077',name:'Lake View',area:'Ambazari',fillLevel:18,status:'NORMAL' as const,latitude:21.1347,longitude:79.0508}];
for(const bin of bins)await prisma.bin.upsert({where:{code:bin.code},update:{},create:bin});
console.info('Inserted or preserved 5 explicitly illustrative demo bins. No live device data was created.');}
main().finally(()=>prisma.$disconnect());

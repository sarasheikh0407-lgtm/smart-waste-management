import {describe,it,expect} from 'vitest';
import {z} from 'zod';
const reportSchema=z.object({category:z.enum(['Overflowing bin','Illegal dumping','Missed collection','Damaged bin','Other waste issue']),description:z.string().trim().min(8).max(1000),area:z.string().trim().min(2).max(120),latitude:z.number().min(-90).max(90).optional(),longitude:z.number().min(-180).max(180).optional()});
describe('citizen report validation',()=>{
 it('accepts a well-formed report',()=>{expect(reportSchema.safeParse({category:'Overflowing bin',description:'Waste is spilling into the street',area:'Civic Centre'}).success).toBe(true)});
 it('rejects short descriptions and invalid coordinates',()=>{expect(reportSchema.safeParse({category:'Overflowing bin',description:'bad',area:'Civic Centre'}).success).toBe(false);expect(reportSchema.safeParse({category:'Illegal dumping',description:'Waste is dumped here daily',area:'Civic Centre',latitude:200}).success).toBe(false)});
 it('rejects unsupported report categories',()=>{expect(reportSchema.safeParse({category:'Not a category',description:'Waste is dumped here daily',area:'Civic Centre'}).success).toBe(false)});
});

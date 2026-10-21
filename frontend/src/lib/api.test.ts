import {describe,it,expect,vi,afterEach} from 'vitest';
import {api} from './api';
afterEach(()=>vi.restoreAllMocks());
describe('typed API client',()=>{
 it('parses successful response envelope',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({success:true,data:{status:'ok'}})}));await expect(api.health()).resolves.toEqual({status:'ok'})});
 it('surfaces backend error messages for non-2xx responses',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status:400,json:async()=>({success:false,error:{message:'Invalid report'}})}));await expect(api.health()).rejects.toThrow('Invalid report')});
});

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';
export type Bin = { id:string; code:string; name:string; area:string; fillLevel:number; status:'NORMAL'|'WARNING'|'OVERFLOWING'|'OFFLINE'; latitude:number; longitude:number; lastSeen:string };
export type WasteReport = { id:string; category:string; description:string; area:string; status:string; createdAt:string };
export type RoutePlan = { stops:Bin[]; totalStops:number; estimatedMinutes:number; distanceKm:number };
async function request<T>(path:string, init:RequestInit = {}):Promise<T>{
  const response=await fetch(`${API_BASE}${path}`,{...init,credentials:'include',headers:{'Content-Type':'application/json',...init.headers}});
  const body=await response.json().catch(()=>({success:false,error:{message:'The server returned an unreadable response.'}}));
  if(!response.ok || body.success===false) throw new Error(body.error?.message ?? `Request failed (${response.status})`);
  return body.data as T;
}
export const api={
  bins:()=>request<Bin[]>('/bins'),
  reports:()=>request<WasteReport[]>('/reports'),
  createReport:(input:{category:string;description:string;area:string;latitude?:number;longitude?:number})=>request<WasteReport>('/reports',{method:'POST',body:JSON.stringify(input)}),
  planRoute:()=>request<RoutePlan>('/routes/optimize',{method:'POST',body:JSON.stringify({})}),
  health:()=>request<{status:string}>('/health'),
  me:()=>request<{id:string;name:string;email:string;role:string}>('/auth/me'),
  login:(input:{email:string;password:string})=>request<{id:string;name:string;email:string;role:string}>('/auth/login',{method:'POST',body:JSON.stringify(input)}),
  register:(input:{name:string;email:string;password:string})=>request<{id:string;name:string;email:string;role:string}>('/auth/register',{method:'POST',body:JSON.stringify(input)}),
  logout:()=>request<{loggedOut:boolean}>('/auth/logout',{method:'POST'})
};

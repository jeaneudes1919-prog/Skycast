import {motion} from "framer-motion";import {info,temp} from "./lib.js";
const rnd=i=>{const x=Math.sin(i*127.1)*43758.5453;return x-Math.floor(x)};
const arr=n=>Array.from({length:n},(_,i)=>i);
export function Sky({m,day}){return <div className="pointer-events-none absolute inset-0 overflow-hidden">
{(m==="rain"||m==="storm")&&arr(60).map(i=><i key={i} className="drop" style={{left:rnd(i)*100+"%",animationDuration:.6+rnd(i+9)*.5+"s",animationDelay:-rnd(i+3)*2+"s"}}/>)}
{m==="snow"&&arr(50).map(i=><i key={i} className="flake" style={{left:rnd(i)*100+"%",animationDuration:6+rnd(i+9)*6+"s",animationDelay:-rnd(i+3)*8+"s"}}/>)}
{!day&&m!=="fog"&&m!=="storm"&&arr(50).map(i=><i key={i} className="star" style={{left:rnd(i)*100+"%",top:rnd(i+5)*60+"%",animationDuration:2+rnd(i+2)*3+"s"}}/>)}
{m==="clear"&&day&&<div className="rays"/>}
{(m==="cloud"||m==="fog"||m==="rain"||m==="storm")&&arr(4).map(i=><div key={i} className="cloud" style={{width:"45vw",height:"18vh",top:rnd(i+1)*40+"%",animationDuration:50+rnd(i)*40+"s",animationDelay:-rnd(i+4)*60+"s"}}/>)}
{m==="storm"&&<div className="flash"/>}</div>}
export function Hourly({d,i0,unit}){const sl=a=>a.slice(i0,i0+24);const ts=sl(d.hourly.time),tp=sl(d.hourly.temperature_2m),wc=sl(d.hourly.weather_code),pp=sl(d.hourly.precipitation_probability);
const mn=Math.min(...tp),mx=Math.max(...tp),W=64,H=48;const y=v=>H-8-((v-mn)/((mx-mn)||1))*(H-18);
return <div className="overflow-x-auto pb-2"><div style={{width:ts.length*W}}>
<div className="flex">{ts.map((t,i)=>{const h=+t.slice(11,13);const I=info(wc[i],h>=6&&h<19).I;return <div key={t} style={{width:W}} className="flex flex-col items-center gap-1.5 text-xs"><span className="opacity-70">{i?h+"h":"Maint."}</span><I size={22}/><b className="text-sm">{temp(tp[i],unit)}</b></div>})}</div>
<svg width={ts.length*W} height={H}><motion.polyline initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.2}} fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={tp.map((v,i)=>`${i*W+W/2},${y(v)}`).join(" ")}/>{tp.map((v,i)=><circle key={i} cx={i*W+W/2} cy={y(v)} r="3" fill="#fff"/>)}</svg>
<div className="flex">{pp.map((p,i)=><span key={i} style={{width:W}} className="text-center text-[11px] text-sky-200">{p>0?p+"%":""}</span>)}</div></div></div>}
export function Daily({d,unit}){const D=d.daily;const mn=Math.min(...D.temperature_2m_min),mx=Math.max(...D.temperature_2m_max),sp=(mx-mn)||1;
return <ul>{D.time.map((t,i)=>{const I=info(D.weather_code[i]).I;const lo=D.temperature_2m_min[i],hi=D.temperature_2m_max[i];
return <li key={t} className="flex items-center gap-3 border-t border-white/10 py-3 text-sm first:border-0"><span className="w-24 capitalize">{i?new Date(t+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"long"}):"Aujourd'hui"}</span><I size={22}/>
<span className="w-14 text-xs text-sky-200">{D.precipitation_sum[i]>0?D.precipitation_sum[i].toFixed(1)+" mm":""}</span><span className="w-9 text-right opacity-70">{temp(lo,unit)}</span>
<div className="relative h-1.5 flex-1 rounded bg-white/15"><motion.div initial={{width:0}} animate={{width:(hi-lo)/sp*100+"%"}} className="absolute h-full rounded bg-gradient-to-r from-sky-300 to-amber-300" style={{left:(lo-mn)/sp*100+"%"}}/></div><span className="w-9">{temp(hi,unit)}</span></li>})}</ul>}
export function SunArc({sr,ss,now}){const a=new Date(sr),b=new Date(ss),n=new Date(now);const p=Math.max(0,Math.min(1,(n-a)/(b-a)));const th=Math.PI*p;
return <svg viewBox="0 0 180 100" className="w-full"><path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="2" strokeDasharray="4 4"/><motion.circle initial={{cx:20,cy:90}} animate={{cx:90-70*Math.cos(th),cy:90-70*Math.sin(th)}} transition={{duration:1.2}} r="8" fill="#FBBF24"/></svg>}
export const Skeleton=()=><div className="animate-pulse space-y-4"><div className="glass h-64 rounded-3xl"/><div className="glass h-40 rounded-3xl"/><div className="glass h-72 rounded-3xl"/></div>;

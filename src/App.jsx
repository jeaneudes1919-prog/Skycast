import {useEffect,useState} from "react";import {AnimatePresence,motion} from "framer-motion";
import {Bookmark,Droplets,Heart,LocateFixed,RefreshCw,Search as SearchIcon,Sunrise,Sunset,Sun,Wind,CloudRain,WifiOff,X} from "lucide-react";
import {CITY,info,bg,temp,uvLabel,getWeather,searchCities,load,save} from "./lib.js";import {Sky,Hourly,Daily,SunArc,Skeleton} from "./parts.jsx";
const same=(a,b)=>a.lat===b.lat&&a.lon===b.lon;
function Search({onPick}){const [v,setV]=useState("");const [rs,setRs]=useState([]);const [open,setOpen]=useState(false);const [i,setI]=useState(-1);
useEffect(()=>{if(v.trim().length<2){setRs([]);return}const t=setTimeout(()=>{searchCities(v.trim()).then(r=>{setRs(r);setOpen(true);setI(-1)}).catch(()=>setRs([]))},350);return()=>clearTimeout(t)},[v]);
const pick=r=>{if(!r)return;onPick(r);setV("");setRs([]);setOpen(false)};
const key=e=>{if(e.key==="ArrowDown"){e.preventDefault();setI((i+1)%(rs.length||1))}else if(e.key==="ArrowUp"){e.preventDefault();setI((i-1+rs.length)%(rs.length||1))}else if(e.key==="Enter")pick(rs[i>=0?i:0]);else if(e.key==="Escape")setOpen(false)};
return <div className="relative flex-1"><SearchIcon size={16} className="absolute left-4 top-3.5 opacity-70"/><input value={v} onChange={e=>setV(e.target.value)} onKeyDown={key} onFocus={()=>setOpen(true)} placeholder="Rechercher une ville" aria-label="Rechercher une ville" className="glass w-full rounded-full py-3 pl-11 pr-4 text-sm outline-none placeholder:text-white/60"/>
<AnimatePresence>{open&&rs.length>0&&<motion.ul initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="glass absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-slate-900/70">{rs.map((r,k)=><li key={r.lat+","+r.lon}><button onClick={()=>pick(r)} className={"block w-full px-4 py-3 text-left text-sm transition hover:bg-white/15 "+(k===i?"bg-white/15":"")}><b>{r.name}</b> <span className="opacity-70">{[r.admin,r.country].filter(Boolean).join(", ")}</span></button></li>)}</motion.ul>}</AnimatePresence></div>}
const Card=({title,icon:I,children,className=""})=><motion.section initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:.6}} className={"glass rounded-3xl p-5 "+className}><h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest opacity-70">{I&&<I size={14}/>}{title}</h3>{children}</motion.section>;
export default function App(){
const [place,setPlace]=useState(()=>load("sc-place",CITY));const [unit,setUnit]=useState(()=>load("sc-unit","C"));const [favs,setFavs]=useState(()=>load("sc-favs",[]));
const [res,setRes]=useState(null);const [loading,setLoading]=useState(true);const [err,setErr]=useState("");const [tick,setTick]=useState(0);const [panel,setPanel]=useState(false);const [msg,setMsg]=useState("");const [now,setNow]=useState(Date.now());
useEffect(()=>{let ok=true;setLoading(true);setErr("");setRes(null);save("sc-place",place);
getWeather(place).then(r=>ok&&setRes(r)).catch(()=>ok&&setErr("Impossible de charger la météo. Vérifiez votre connexion.")).finally(()=>ok&&setLoading(false));return()=>{ok=false}},[place,tick]);
useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),30000);return()=>clearInterval(t)},[]);
useEffect(()=>save("sc-unit",unit),[unit]);useEffect(()=>save("sc-favs",favs),[favs]);
const flash=m=>{setMsg(m);setTimeout(()=>setMsg(""),2500)};
const geo=()=>{if(!navigator.geolocation)return flash("Géolocalisation indisponible");navigator.geolocation.getCurrentPosition(p=>setPlace({name:"Ma position",country:"",lat:p.coords.latitude,lon:p.coords.longitude}),()=>flash("Position refusée ou indisponible"))};
const isFav=favs.some(f=>same(f,place));const toggleFav=()=>setFavs(isFav?favs.filter(f=>!same(f,place)):[...favs,place]);
const d=res?.d,c=d?.current,day=c?c.is_day===1:true,inf=c?info(c.weather_code,day):{m:"clear"};
const i0=d?Math.max(0,d.hourly.time.findIndex(t=>t>=c.time.slice(0,13)+":00")):0;
const local=d?new Date(now+d.utc_offset_seconds*1000):null;
return <div className="relative min-h-screen overflow-hidden">
<AnimatePresence><motion.div key={inf.m+day} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1}} className="fixed inset-0" style={{background:bg(inf.m,day)}}><Sky m={inf.m} day={day}/></motion.div></AnimatePresence>
<div className="relative mx-auto max-w-3xl space-y-4 px-4 py-6">
<header className="flex items-center gap-2"><Search onPick={setPlace}/>
<button aria-label="Ma position" onClick={geo} className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:scale-105 active:scale-95"><LocateFixed size={18}/></button>
<button aria-label="Changer d'unité" onClick={()=>setUnit(unit==="C"?"F":"C")} className="glass h-11 w-11 shrink-0 rounded-full text-sm font-semibold transition hover:scale-105 active:scale-95">°{unit}</button>
<button aria-label="Villes favorites" onClick={()=>setPanel(true)} className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:scale-105 active:scale-95"><Bookmark size={18}/></button></header>
{loading&&!res&&<Skeleton/>}
{err&&<div className="glass rounded-3xl p-8 text-center"><p>{err}</p><button onClick={()=>setTick(tick+1)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm transition hover:bg-white/30"><RefreshCw size={15}/>Réessayer</button></div>}
{d&&<>
<motion.section initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass rounded-3xl p-6 text-center">
<div className="flex items-center justify-between text-sm"><span className="opacity-80">{local.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",timeZone:"UTC"})} · {local.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",timeZone:"UTC"})}</span>
<button aria-label="Favori" onClick={toggleFav} className="transition hover:scale-110"><Heart size={20} className={isFav?"fill-rose-400 text-rose-400":""}/></button></div>
<h1 className="mt-4 text-2xl font-medium">{place.name}{place.country&&<span className="opacity-70">, {place.country}</span>}</h1>
{res.offline&&<p className="mx-auto mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400/25 px-3 py-1 text-xs"><WifiOff size={12}/>Données hors ligne</p>}
<motion.p key={unit+c.temperature_2m} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} className="my-2 text-[8rem] font-extralight leading-none tracking-tighter sm:text-[10rem]">{temp(c.temperature_2m,unit)}</motion.p>
<p className="flex items-center justify-center gap-2 text-xl"><inf.I size={26}/>{inf.l}</p>
<p className="mt-2 text-sm opacity-80">Ressenti {temp(c.apparent_temperature,unit)} · Min {temp(d.daily.temperature_2m_min[0],unit)} · Max {temp(d.daily.temperature_2m_max[0],unit)}</p></motion.section>
<Card title="Prévisions sur 24 heures"><Hourly d={d} i0={i0} unit={unit}/></Card>
<Card title="7 prochains jours"><Daily d={d} unit={unit}/></Card>
<div className="grid grid-cols-2 gap-4">
<Card title="Humidité" icon={Droplets}><p className="text-3xl font-light">{c.relative_humidity_2m}%</p><div className="mt-3 h-1.5 overflow-hidden rounded bg-white/15"><motion.div initial={{width:0}} animate={{width:c.relative_humidity_2m+"%"}} transition={{duration:1}} className="h-full bg-sky-300"/></div></Card>
<Card title="Vent" icon={Wind}><p className="text-3xl font-light">{Math.round(c.wind_speed_10m)}<span className="text-base opacity-70"> km/h</span></p></Card>
<Card title="Indice UV" icon={Sun}><p className="text-3xl font-light">{Math.round(d.daily.uv_index_max[0])}</p><p className="text-sm opacity-80">{uvLabel(d.daily.uv_index_max[0])}</p><div className="mt-2 h-1.5 rounded bg-gradient-to-r from-emerald-400 via-yellow-300 to-rose-500"><div className="h-3 w-1 -translate-y-0.5 rounded bg-white" style={{marginLeft:Math.min(100,d.daily.uv_index_max[0]/12*100)+"%"}}/></div></Card>
<Card title="Précipitations" icon={CloudRain}><p className="text-3xl font-light">{d.daily.precipitation_sum[0].toFixed(1)}<span className="text-base opacity-70"> mm</span></p><p className="text-sm opacity-80">aujourd'hui</p></Card></div>
<Card title="Lever et coucher du soleil"><SunArc sr={d.daily.sunrise[0]} ss={d.daily.sunset[0]} now={c.time}/><div className="flex justify-between text-sm"><span className="flex items-center gap-1"><Sunrise size={16}/>{d.daily.sunrise[0].slice(11,16)}</span><span className="flex items-center gap-1"><Sunset size={16}/>{d.daily.sunset[0].slice(11,16)}</span></div></Card></>}
<footer className="pb-6 pt-2 text-center text-xs opacity-60">Données Open-Meteo · Projet de démonstration</footer></div>
<AnimatePresence>{panel&&<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setPanel(false)} className="fixed inset-0 z-40 bg-black/40"/>
<motion.aside initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:30,stiffness:260}} className="glass fixed right-0 top-0 z-50 h-full w-full max-w-xs bg-slate-900/80 p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Villes favorites</h2><button aria-label="Fermer" onClick={()=>setPanel(false)}><X/></button></div>
{favs.length?<ul className="space-y-2">{favs.map(f=><li key={f.lat+","+f.lon} className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><button onClick={()=>{setPlace(f);setPanel(false)}} className="flex-1 text-left text-sm"><b>{f.name}</b> <span className="opacity-70">{f.country}</span></button><button aria-label="Retirer" onClick={()=>setFavs(favs.filter(x=>!same(x,f)))} className="opacity-60 hover:opacity-100"><X size={16}/></button></li>)}</ul>:<p className="text-sm opacity-70">Aucune ville favorite. Cliquez sur le cœur d'une ville pour l'ajouter.</p>}</motion.aside></>}</AnimatePresence>
<AnimatePresence>{msg&&<motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{opacity:0}} className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black/80 px-6 py-3 text-sm">{msg}</motion.div>}</AnimatePresence></div>}

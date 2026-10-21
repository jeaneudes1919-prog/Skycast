import {Sun,Moon,CloudSun,CloudMoon,Cloud,CloudFog,CloudDrizzle,CloudRain,CloudSnow,CloudLightning} from "lucide-react";
export const CITY={name:"Cotonou",country:"Bénin",lat:6.3703,lon:2.3912};
export const toF=c=>c*9/5+32;
export const temp=(c,u)=>Math.round(u==="F"?toF(c):c)+"°";
export function info(code,day=true){
if(code===0||code===1)return{l:code?"Plutôt dégagé":"Ciel dégagé",I:day?Sun:Moon,m:"clear"};
if(code===2)return{l:"Partiellement nuageux",I:day?CloudSun:CloudMoon,m:"cloud"};
if(code===3)return{l:"Couvert",I:Cloud,m:"cloud"};
if(code===45||code===48)return{l:"Brouillard",I:CloudFog,m:"fog"};
if(code>=51&&code<=57)return{l:"Bruine",I:CloudDrizzle,m:"rain"};
if((code>=61&&code<=67)||(code>=80&&code<=82))return{l:code>=80?"Averses":"Pluie",I:CloudRain,m:"rain"};
if((code>=71&&code<=77)||code===85||code===86)return{l:"Neige",I:CloudSnow,m:"snow"};
if(code>=95)return{l:"Orage",I:CloudLightning,m:"storm"};
return{l:"Variable",I:Cloud,m:"cloud"}}
const BG={clear:["#2b8cff,#6ec6ff 60%,#bfe6ff","#0b1030,#1b2a6b 60%,#3b2f7a"],cloud:["#5b7a99,#93a9bf","#1a2234,#2c3750"],rain:["#3b4a5e,#5d6f85","#10151f,#1f2937"],storm:["#1b1b2e,#3a2f4f","#0c0c18,#241d36"],snow:["#8fa6bf,#dbe7f3","#1b2438,#3d4b66"],fog:["#8c97a3,#c5ccd3","#252b33,#3a424c"]};
export const bg=(m,day)=>`linear-gradient(165deg,${BG[m][day?0:1]})`;
export const uvLabel=u=>u<3?"Faible":u<6?"Modéré":u<8?"Élevé":u<11?"Très élevé":"Extrême";
const FC="https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto";
export const key=p=>"sc-cache-"+p.lat.toFixed(2)+","+p.lon.toFixed(2);
export async function getWeather(p){try{const r=await fetch(`${FC}&latitude=${p.lat}&longitude=${p.lon}`);if(!r.ok)throw new Error("HTTP "+r.status);const d=await r.json();try{localStorage.setItem(key(p),JSON.stringify(d))}catch{}return{d,offline:false}}
catch(e){try{const c=JSON.parse(localStorage.getItem(key(p)));if(c)return{d:c,offline:true}}catch{}throw e}}
export async function searchCities(q){const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=fr`);const j=await r.json();return(j.results||[]).map(x=>({name:x.name,country:x.country||"",admin:x.admin1||"",lat:x.latitude,lon:x.longitude}))}
export const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
export const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

import { seeded } from '../utils/random';
import { GROUPS, STADIUMS } from './competition';

const RR=[[[0,1],[2,3]],[[0,2],[3,1]],[[3,0],[1,2]]];

/* Point de départ de la phase de groupes : ancré sur "aujourd'hui" (et non
 * une date calendaire figée) pour que la démo reste cohérente avec la date
 * réelle, quel que soit le jour où l'application est consultée. */
function groupsAnchor(){
  const d=new Date();
  d.setHours(18,0,0,0);
  d.setDate(d.getDate()-2);
  return d;
}

/* ─── GÉNÉRATION DES MATCHS DE POULES ─── */
export function buildGroupMatches(){
  const matches=[];let si=0;
  const anchor=groupsAnchor();
  Object.entries(GROUPS).forEach(([g,teams],gi)=>{
    RR.forEach((day,di)=>{
      day.forEach(([hi,ai])=>{
        const date=new Date(anchor);
        date.setDate(date.getDate()+gi+di*4);
        const[stadium,city]=STADIUMS[si++%STADIUMS.length];
        matches.push({id:`G${g}-${di+1}-${hi}${ai}`,phase:"groups",group:g,matchday:di+1,
          home:teams[hi],away:teams[ai],datetime:date.toISOString(),stadium,city,
          status:"scheduled",homeScore:null,awayScore:null,minute:null});
      });
    });
  });
  return matches;
}

/* ─── ÉTAT INITIAL SIMULÉ (résultats déjà joués / match en direct) ─── */
export function seedResults(matches){
  const rnd=seeded(2026);const played=["A","B","C","D"];
  const now=new Date().toISOString();
  matches.forEach((m)=>{
    if(m.phase!=="groups")return;
    if(m.matchday===1&&played.includes(m.group)){
      const hs=Math.floor(rnd()*4),as=Math.floor(rnd()*3);
      const live=(m.group==="C"&&m.home==="BRA")||(m.group==="D"&&m.home==="USA");
      if(live){m.status="live";m.minute=m.group==="C"?57:34;m.homeScore=1;m.awayScore=m.group==="C"?0:1;m.datetime=now;}
      else{m.status="finished";m.homeScore=hs;m.awayScore=as;m.minute=90;}
    }
  });
  const open=matches.find((m)=>m.id==="GA-1-02");
  if(open){open.status="finished";open.homeScore=2;open.awayScore=0;open.minute=90;}
  return matches;
}

/* ─── GÉNÉRATION DE L'ARBRE À ÉLIMINATION DIRECTE ─── */
export function buildKnockout(){
  const ko=[];const G=Object.keys(GROUPS);
  const anchor=groupsAnchor();
  anchor.setDate(anchor.getDate()+17); // démarre 17 jours après le coup d'envoi des poules
  const mk=(phase,n,lh,la,off,st)=>{
    const date=new Date(anchor);
    date.setDate(date.getDate()+off);
    ko.push({id:`${phase}-${n}`,phase,n,matchday:null,
    home:null,away:null,placeholderHome:lh,placeholderAway:la,
    datetime:date.toISOString(),
    stadium:STADIUMS[st%STADIUMS.length][0],city:STADIUMS[st%STADIUMS.length][1],
    status:"scheduled",homeScore:null,awayScore:null,minute:null});
  };
  for(let i=0;i<16;i++)mk("r32",i+1,`1er Gr. ${G[i%12]}`,i%2?`2e Gr. ${G[(i+3)%12]}`:`3e (rep.)`,Math.floor(i/2),i);
  for(let i=0;i<8;i++) mk("r16",i+1,`Vainq. 16e #${i*2+1}`,`Vainq. 16e #${i*2+2}`,8+i,i);
  for(let i=0;i<4;i++) mk("qf",i+1,`Vainq. 8e #${i*2+1}`,`Vainq. 8e #${i*2+2}`,16+i,i+4);
  for(let i=0;i<2;i++) mk("sf",i+1,`Vainq. Quart #${i*2+1}`,`Vainq. Quart #${i*2+2}`,21+i,i+8);
  mk("third",1,"Perdant Demi #1","Perdant Demi #2",24,10);
  mk("final",1,"Vainq. Demi #1","Vainq. Demi #2",25,1);
  return ko;
}

export const ALL_MATCHES=[...seedResults(buildGroupMatches()),...buildKnockout()];

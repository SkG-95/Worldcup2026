import { TEAMS } from '../../data/teams';
import { GROUPS } from '../../data/competition';
import { computeStandings } from '../../utils/standings';

/* ─── IA : ANALYSE DE FORME D'UNE ÉQUIPE (simulée) ─── */
export function analyzeTeam(code,matches){
  const teamMatches=matches.filter(m=>(m.home===code||m.away===code)&&m.status!=="scheduled");
  if(!teamMatches.length)return null;
  let W=0,D=0,L=0,GF=0,GA=0;
  teamMatches.forEach(m=>{
    const isHome=m.home===code;
    const gs=isHome?m.homeScore:m.awayScore;
    const gc=isHome?m.awayScore:m.homeScore;
    GF+=gs;GA+=gc;
    if(gs>gc)W++;else if(gs===gc)D++;else L++;
  });
  const form=teamMatches.slice(-3).map(m=>{
    const isHome=m.home===code;
    const gs=isHome?m.homeScore:m.awayScore;
    const gc=isHome?m.awayScore:m.homeScore;
    return gs>gc?"V":gs===gc?"N":"D";
  });
  const grpEntry=Object.entries(GROUPS).find(([,t])=>t.includes(code));
  let rank="-";
  if(grpEntry){
    const st=computeStandings(matches,grpEntry[0]);
    rank=st.findIndex(r=>r.team===code)+1;
  }
  let txt;
  if(W===teamMatches.length)txt=`${TEAMS[code].n} est inarrêtable : ${W} victoire${W>1?"s":""} en ${teamMatches.length} match${teamMatches.length>1?"s":""} avec ${GF} buts marqués.`;
  else if(L===teamMatches.length)txt=`${TEAMS[code].n} traverse une passe difficile : ${L} défaite${L>1?"s":""} en ${teamMatches.length} match${teamMatches.length>1?"s":""}.`;
  else if(W>L)txt=`${TEAMS[code].n} est en bonne forme (${W}V ${D}N ${L}D), ${GF} buts marqués pour ${GA} encaissés.`;
  else txt=`${TEAMS[code].n} montre des signes de fragilité (${W}V ${D}N ${L}D). À surveiller.`;
  if(rank===1)txt+=" Leader de son groupe.";
  else if(rank===2)txt+=" Bien placé pour se qualifier.";
  return{txt,form,W,D,L,GF,GA,rank};
}

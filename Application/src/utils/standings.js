import { GROUPS } from '../data/competition';

/* ─── CALCUL DU CLASSEMENT D'UN GROUPE ─── */
export function computeStandings(matches,groupId){
  const rows={};GROUPS[groupId].forEach((t)=>{rows[t]={team:t,P:0,W:0,D:0,L:0,GF:0,GA:0,Pts:0};});
  matches.filter((m)=>m.phase==="groups"&&m.group===groupId&&m.status!=="scheduled").forEach((m)=>{
    const h=rows[m.home],a=rows[m.away];
    h.P++;a.P++;h.GF+=m.homeScore;h.GA+=m.awayScore;a.GF+=m.awayScore;a.GA+=m.homeScore;
    if(m.homeScore>m.awayScore){h.W++;a.L++;h.Pts+=3;}
    else if(m.homeScore<m.awayScore){a.W++;h.L++;a.Pts+=3;}
    else{h.D++;a.D++;h.Pts++;a.Pts++;}
  });
  return Object.values(rows).sort((x,y)=>y.Pts-x.Pts||(y.GF-y.GA)-(x.GF-x.GA)||y.GF-x.GF);
}

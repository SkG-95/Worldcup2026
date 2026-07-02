import { GROUPS } from '../../data/competition';
import { computeStandings } from '../../utils/standings';

/* ─── IA : PRÉDICTION DE MATCH (simulée, basée sur les stats réelles) ─── */
export function predictMatch(m,matches){
  if(!m.home||!m.away)return null;
  const grpH=Object.entries(GROUPS).find(([,t])=>t.includes(m.home));
  const grpA=Object.entries(GROUPS).find(([,t])=>t.includes(m.away));
  if(!grpH||!grpA)return{home:40,draw:22,away:38};
  const sh=computeStandings(matches,grpH[0]).find(r=>r.team===m.home)||{Pts:0,GF:0,GA:0};
  const sa=computeStandings(matches,grpA[0]).find(r=>r.team===m.away)||{Pts:0,GF:0,GA:0};
  const scoreH=(sh.Pts*10)+(sh.GF*3)-sh.GA+50;
  const scoreA=(sa.Pts*10)+(sa.GF*3)-sa.GA+50;
  const tot=scoreH+scoreA+30;
  const h=Math.round((scoreH/tot)*100);
  const a=Math.round((scoreA/tot)*100);
  const d=100-h-a;
  return{home:Math.max(5,h),draw:Math.max(5,d),away:Math.max(5,a)};
}

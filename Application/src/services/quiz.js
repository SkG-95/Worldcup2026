import { seeded, seededShuffle } from '../utils/random';
import { TEAMS } from '../data/teams';
import { GROUPS } from '../data/competition';

/* ─── QUIZ : GÉNÉRATION DE QUESTIONS (à graine, reproductible) ─── */
export function buildQuiz(matches,seed){
  const rnd=seeded(seed);const allCodes=Object.keys(TEAMS);const groupKeys=Object.keys(GROUPS);const questions=[];
  {const code=allCodes[Math.floor(rnd()*allCodes.length)];const cg=Object.entries(GROUPS).find(([,t])=>t.includes(code))[0];const distractors=seededShuffle(groupKeys.filter(g=>g!==cg),seed+1).slice(0,3);questions.push({q:`Dans quel groupe joue ${TEAMS[code].n} ${TEAMS[code].f} ?`,options:seededShuffle([cg,...distractors],seed+2).map(g=>`Groupe ${g}`),answer:`Groupe ${cg}`});}
  questions.push({q:"Combien d'équipes participent à la Coupe du Monde FIFA 2026 ?",options:seededShuffle(["32","48","24","40"],seed+3),answer:"48"});
  questions.push({q:"Quels pays organisent la Coupe du Monde 2026 ?",options:seededShuffle(["USA, Canada, Mexique","France, Espagne, Portugal","Qatar, Arabie Saoudite, EAU","Brésil, Argentine, Uruguay"],seed+4),answer:"USA, Canada, Mexique"});
  {const g=groupKeys[Math.floor(rnd()*groupKeys.length)];const[t1,t2]=GROUPS[g];const otherCode=seededShuffle(allCodes.filter(c=>!GROUPS[g].includes(c)),seed+5)[0];const opts=seededShuffle([...new Set([TEAMS[t2].n,TEAMS[otherCode].n,TEAMS[seededShuffle(allCodes,seed+6)[0]].n,TEAMS[seededShuffle(allCodes,seed+7)[1]].n])],seed+8).slice(0,4);questions.push({q:`Quelle équipe partage le groupe ${g} avec ${TEAMS[t1].n} ?`,options:opts,answer:TEAMS[t2].n});}
  questions.push({q:"Combien de matchs sont joués lors de la phase de groupes (12 groupes de 4) ?",options:seededShuffle(["48","72","64","36"],seed+9),answer:"72"});
  const open=matches.find(m=>m.id==="GA-1-02");
  if(open)questions.push({q:`Quel a été le score du match d'ouverture ${TEAMS[open.home]?.n} – ${TEAMS[open.away]?.n} ?`,options:seededShuffle(["2-0","1-0","1-1","3-1"],seed+10),answer:"2-0"});
  return seededShuffle(questions,seed+99).slice(0,6);
}

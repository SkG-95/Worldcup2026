import { TEAMS } from '../../data/teams';
import { GROUPS } from '../../data/competition';
import { computeStandings } from '../../utils/standings';
import { analyzeTeam } from './analyzeTeam';
import { fmtDate } from '../../utils/format';

function buildAiContext(matches){
  const live=matches.filter(m=>m.status==="live");
  const upcoming=matches.filter(m=>m.status==="scheduled"&&m.home)
    .sort((a,b)=>new Date(a.datetime)-new Date(b.datetime)).slice(0,5);
  return{live,upcoming};
}

/* ─── IA SIMULÉE (mots-clés) : repli sans back-end ni connexion ─── */
function simulatedAssistant({question,matches}){
  return new Promise(resolve=>{
    setTimeout(()=>{
      const q=question.toLowerCase();
      const ctx=buildAiContext(matches);
      const teamMatch=Object.entries(TEAMS).find(([code,t])=>q.includes(t.n.toLowerCase())||q.includes(code.toLowerCase()));
      const groupMatch=q.match(/groupe\s+([a-l])/i);
      let answer;
      if(/direct|en cours|live/.test(q)){
        answer=ctx.live.length
          ?`Actuellement en direct : ${ctx.live.map(m=>`${TEAMS[m.home].n} ${m.homeScore}-${m.awayScore} ${TEAMS[m.away].n} (${m.minute}')`).join(", ")}.`
          :"Aucun match n'est en direct pour le moment.";
      }else if(groupMatch){
        const g=groupMatch[1].toUpperCase();
        const rows=computeStandings(matches,g);
        answer=`Classement du groupe ${g} : `+rows.map((r,i)=>`${i+1}. ${TEAMS[r.team].n} (${r.Pts} pts)`).join(", ")+".";
      }else if(teamMatch){
        const[code,t]=teamMatch;
        const analysis=analyzeTeam(code,matches);
        answer=analysis?`${t.f} ${t.n} — ${analysis.txt}`:`${t.f} ${t.n} n'a pas encore joué.`;
      }else if(/prochain|aujourd|demain|qui joue/.test(q)){
        answer=ctx.upcoming.length
          ?"Prochains matchs : "+ctx.upcoming.map(m=>`${TEAMS[m.home].n} - ${TEAMS[m.away].n} (${fmtDate(m.datetime)})`).join(", ")+"."
          :"Aucun match à venir.";
      }else if(/prédict|pronostic|gagner/.test(q)){
        answer="Demandez-moi la prédiction pour un match précis en mentionnant les deux équipes, par exemple : « prédit France Maroc ».";
      }else{
        answer="Je peux répondre sur les matchs en direct, le classement d'un groupe, une équipe, les prochains matchs, ou vous donner une analyse de forme.";
      }
      resolve({answer});
    },650);
  });
}

/* ─── Résumé texte des données réelles, envoyé en contexte au vrai LLM ─── */
function buildContextSummary(matches){
  const live=matches.filter(m=>m.status==="live"&&m.home);
  const upcoming=matches.filter(m=>m.status==="scheduled"&&m.home)
    .sort((a,b)=>new Date(a.datetime)-new Date(b.datetime)).slice(0,5);
  const fmtMatch=(m)=>`${TEAMS[m.home]?.n} ${m.homeScore}-${m.awayScore} ${TEAMS[m.away]?.n}${m.minute?` (${m.minute}')`:""}`;
  const groupsSummary=Object.keys(GROUPS).map(g=>{
    const rows=computeStandings(matches,g);
    return `Groupe ${g} : `+rows.map((r,i)=>`${i+1}. ${TEAMS[r.team]?.n} (${r.Pts} pts)`).join(", ");
  }).join("\n");
  return[
    live.length?`Matchs en direct : ${live.map(fmtMatch).join(" | ")}`:"Aucun match en direct actuellement.",
    upcoming.length?`Prochains matchs : ${upcoming.map(m=>`${TEAMS[m.home]?.n} - ${TEAMS[m.away]?.n} (${fmtDate(m.datetime)})`).join(" | ")}`:"",
    `Classements des groupes :\n${groupsSummary}`,
  ].filter(Boolean).join("\n\n");
}

/* ─── IA : ASSISTANT CONVERSATIONNEL ─── */
export async function aiAssistant({question,matches}){
  try{
    const res=await fetch("/api/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question,context:buildContextSummary(matches)}),
    });
    if(res.ok){
      const data=await res.json();
      if(data.answer)return{answer:data.answer};
    }
  }catch{
    // service indisponible (hors ligne, clé non configurée…) : repli simulé
  }
  return simulatedAssistant({question,matches});
}

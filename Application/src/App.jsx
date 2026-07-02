import { useState, useMemo } from 'react';
import './styles/app.css';

/* ============================================================
 *  SUIVI COUPE DU MONDE FIFA 2026 — Style FIFA Ultimate Team
 *  M1-DI · ENSITECH · 2025-2026
 * ============================================================ */

import { PHASES } from './data/competition';
import { useLiveScores } from './hooks/useLiveScores';

import Ticker from './components/Ticker';
import Hero from './components/Hero';
import MatchCard from './components/MatchCard';
import Standings from './components/Standings';
import Bracket from './components/Bracket';
import Detail from './components/Detail';
import AiAssistant from './components/AiAssistant';
import Quiz from './components/Quiz';
import TeamsView from './components/TeamsView';

export default function App(){
  const[phase,setPhase]=useState("groups");
  const[gf,setGf]=useState("A");
  const[view,setView]=useState("matches");
  const[koView,setKoView]=useState("bracket");
  const[sel,setSel]=useState(null);
  const[quizOpen,setQuizOpen]=useState(false);
  const[teamView,setTeamView]=useState(false);

  const{matches,loading,error,updatedAt,retry}=useLiveScores();
  const liveCount=matches.filter(m=>m.status==="live").length;
  const featured=useMemo(()=>{
    const live=matches.filter(m=>m.status==="live"&&m.home);
    if(live.length)return live[0];
    const soon=matches.filter(m=>m.status==="scheduled"&&m.home).sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));
    return soon[0]||null;
  },[matches]);

  const phaseMatches=useMemo(()=>{
    if(phase==="groups"){
      return matches.filter(m=>m.phase==="groups"&&(gf==="all"||m.group===gf));
    }
    return matches.filter(m=>m.phase===phase);
  },[matches,phase,gf]);

  return(
    <div className="wc">
      <header className="hd">
        <div className="hd-brand">
          <div className="hd-logo">26</div>
          <div>
            <div className="hd-title">FIFA World Cup 2026</div>
            <div className="hd-sub">USA · CANADA · MEXIQUE · 11 JUIN – 19 JUILLET</div>
          </div>
        </div>
        <div className="hd-r">
          <span className={`pill ${liveCount?"on":""}`}><i className="d"/>{liveCount} en direct</span>
          <button className="quiz-cta" onClick={()=>setQuizOpen(true)}>🧠 Quiz</button>
          <button className="quiz-cta" style={{background:teamView?"rgba(201,150,10,.2)":"rgba(255,255,255,.03)",borderColor:teamView?"#f5d060":"var(--line2)",color:teamView?"#f5d060":"var(--muted)"}} onClick={()=>setTeamView(v=>!v)}>🃏 Équipes FUT</button>
          <span className="upd">{updatedAt?`MAJ ${updatedAt.toLocaleTimeString("fr-FR")}`:"Chargé"}</span>
        </div>
      </header>

      {!loading&&!error&&<Ticker matches={matches}/>}
      {!loading&&!error&&featured&&!teamView&&<Hero featured={featured} onOpen={setSel}/>}

      {!teamView&&(
        <nav className="nav-outer">
          <div className="nav-phases">
            {PHASES.map(p=>(
              <button key={p.id}className={`ph ${p.id==="final"?"ph-final":""} ${phase===p.id?"on":""}`}
                onClick={()=>{setPhase(p.id);setView("matches");setKoView("bracket");}}>
                {p.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {!teamView&&phase==="groups"&&(
        <div className="nav-sub">
          {["A","B","C","D","E","F","G","H","I","J","K","L"].map(g=>(
            <button key={g}className={`gf-btn ${gf===g?"on":""}`} onClick={()=>setGf(g)}>Gr. {g}</button>
          ))}
          <button className={`vw-btn ${view==="matches"?"on":""}`} onClick={()=>setView("matches")}>Matchs</button>
          <button className={`vw-btn ${view==="standings"?"on":""}`} onClick={()=>setView("standings")}>Classements</button>
        </div>
      )}

      {!teamView&&phase!=="groups"&&(
        <div className="nav-sub">
          <button className={`vw-btn ${koView==="bracket"?"on":""}`} onClick={()=>setKoView("bracket")}>Tableau</button>
          <button className={`vw-btn ${koView==="list"?"on":""}`} onClick={()=>setKoView("list")}>Liste</button>
        </div>
      )}

      <main className="content">
        {loading&&<div className="state"><div className="spin"/><span>Chargement des données…</span></div>}
        {error&&<div className="state err"><span className="state-icon">⚠️</span>{error}<button className="retry" onClick={retry}>Réessayer</button></div>}

        {!loading&&!error&&teamView&&<TeamsView matches={matches}/>}

        {!loading&&!error&&!teamView&&phase==="groups"&&view==="matches"&&(
          phaseMatches.length===0
            ?<div className="state"><span className="state-icon">🔍</span>Aucun match pour cette sélection.</div>
            :<div className="grid">{phaseMatches.map(m=><MatchCard key={m.id} m={m} onOpen={setSel}/>)}</div>
        )}
        {!loading&&!error&&!teamView&&phase==="groups"&&view==="standings"&&<Standings matches={matches} group={gf}/>}
        {!loading&&!error&&!teamView&&phase!=="groups"&&koView==="bracket"&&<Bracket matches={phaseMatches}/>}
        {!loading&&!error&&!teamView&&phase!=="groups"&&koView==="list"&&(
          <div className="grid">{phaseMatches.map(m=><MatchCard key={m.id} m={m} onOpen={setSel}/>)}</div>
        )}
      </main>

      {sel&&<Detail m={matches.find(x=>x.id===sel.id)||sel} onClose={()=>setSel(null)}/>}
      {quizOpen&&(
        <div className="ov" onClick={()=>setQuizOpen(false)}>
          <div className="dt quiz-modal" onClick={e=>e.stopPropagation()}>
            <button className="x" onClick={()=>setQuizOpen(false)}>✕</button>
            <Quiz matches={matches}/>
          </div>
        </div>
      )}
      {!loading&&!error&&<AiAssistant matches={matches}/>}
      <footer className="ft">FIFA World Cup 2026 Tracker · Données simulées · Architecture en couches · Projet M1-DI ENSITECH</footer>
    </div>
  );
}

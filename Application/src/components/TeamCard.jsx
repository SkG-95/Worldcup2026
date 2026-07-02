import { useMemo } from 'react';
import { TEAMS } from '../data/teams';
import { GROUPS } from '../data/competition';
import { computeStandings } from '../utils/standings';
import { analyzeTeam } from '../services/ai/analyzeTeam';

export default function TeamCard({code,matches,onSelect}){
  const grpEntry=Object.entries(GROUPS).find(([,t])=>t.includes(code));
  const rank=useMemo(()=>{
    if(!grpEntry)return 99;
    return computeStandings(matches,grpEntry[0]).findIndex(r=>r.team===code)+1;
  },[matches,code]);
  const variant=rank===1?"gold":rank===2?"silver":rank<=3?"green":"bronze";
  const analysis=useMemo(()=>analyzeTeam(code,matches),[matches,code]);
  const colors={
    gold:{bg:"linear-gradient(145deg,#3a2800,#c9960a 35%,#f5d060 50%,#c9960a 65%,#3a2800)",border:"#f5d060",txt:"#ffe066",shadow:"rgba(255,200,0,0.45)"},
    silver:{bg:"linear-gradient(145deg,#1a1a2e,#6e7a8a 35%,#c0c8d4 50%,#6e7a8a 65%,#1a1a2e)",border:"#c0c8d4",txt:"#dce8f0",shadow:"rgba(160,180,200,0.35)"},
    green:{bg:"linear-gradient(145deg,#001a05,#0d6b2a 35%,#1fdb5a 50%,#0d6b2a 65%,#001a05)",border:"#1fdb5a",txt:"#7fffa8",shadow:"rgba(31,219,90,0.4)"},
    bronze:{bg:"linear-gradient(145deg,#1a0a00,#7a4010 35%,#c07030 50%,#7a4010 65%,#1a0a00)",border:"#c07030",txt:"#ffba80",shadow:"rgba(180,100,30,0.35)"},
  }[variant]||colors.bronze;
  const t=TEAMS[code];
  const rating=rank===1?88:rank===2?82:rank===3?76:70;
  return(
    <button className="fut-team-card" onClick={()=>onSelect(code)}
      style={{background:colors.bg,border:`1.5px solid ${colors.border}`,boxShadow:`0 10px 32px ${colors.shadow}`}}>
      <div className="ftc-inner">
        <div className="ftc-top">
          <div className="ftc-rating" style={{color:colors.txt}}>{rating}</div>
          <div className="ftc-pos" style={{color:colors.txt}}>GRP {grpEntry?.[0]||"?"}</div>
        </div>
        <div className="ftc-flag">{t.f}</div>
        <div className="ftc-name" style={{color:colors.txt}}>{t.n}</div>
        <div className="ftc-div" style={{background:colors.border}}/>
        {analysis&&(
          <div className="ftc-stats">
            <div className="ftc-stat"><span style={{color:colors.txt}}>{analysis.W}</span><span style={{color:colors.txt,opacity:.7}}>V</span></div>
            <div className="ftc-stat"><span style={{color:colors.txt}}>{analysis.GF}</span><span style={{color:colors.txt,opacity:.7}}>BTS</span></div>
            <div className="ftc-stat"><span style={{color:colors.txt}}>{analysis.L}</span><span style={{color:colors.txt,opacity:.7}}>D</span></div>
            <div className="ftc-stat"><span style={{color:colors.txt}}>{analysis.GF-analysis.GA>0?"+":""}{analysis.GF-analysis.GA}</span><span style={{color:colors.txt,opacity:.7}}>+/-</span></div>
          </div>
        )}
        {!analysis&&(
          <div className="ftc-upcoming" style={{color:colors.txt}}>Pas encore joué</div>
        )}
        {rank<=2&&<div className="ftc-crown" style={{color:colors.txt}}>{rank===1?"👑":"⭐"}</div>}
      </div>
    </button>
  );
}

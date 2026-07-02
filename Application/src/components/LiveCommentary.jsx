import { useState, useEffect, useRef } from 'react';
import { TEAMS } from '../data/teams';

export default function LiveCommentary({m}){
  const[comments,setComments]=useState([]);
  const prevMinute=useRef(m.minute||0);
  const prevHome=useRef(m.homeScore||0);
  const prevAway=useRef(m.awayScore||0);
  const templates=[
    (min)=>`${min}' — Belle accélération côté gauche, le défenseur résiste de justesse.`,
    (min)=>`${min}' — Coup franc accordé à 25 mètres du but. Situation dangereuse !`,
    (min)=>`${min}' — Le gardien réalise une parade spectaculaire !`,
    (min)=>`${min}' — Le rythme monte d'un cran en cette fin de mi-temps.`,
    (min)=>`${min}' — Tentative de loin, le ballon passe au-dessus du cadre.`,
    (min)=>`${min}' — Duel aérien remporté par la défense.`,
  ];
  useEffect(()=>{
    if(!m||m.status!=="live")return;
    const cur=m.minute||0;
    const cH=m.homeScore||0;const cA=m.awayScore||0;
    if(cH>prevHome.current){
      setComments(c=>[{id:Date.now(),txt:`⚽ BUUUT ! ${TEAMS[m.home]?.n} marque à la ${cur}e minute ! Score : ${cH}-${cA}`,type:"goal"},...c].slice(0,6));
    }else if(cA>prevAway.current){
      setComments(c=>[{id:Date.now(),txt:`⚽ BUUUT ! ${TEAMS[m.away]?.n} égalise à la ${cur}e ! Score : ${cH}-${cA}`,type:"goal"},...c].slice(0,6));
    }else if(cur!==prevMinute.current&&cur%7===0&&cur>0){
      const t=templates[Math.floor(Math.random()*templates.length)](cur);
      setComments(c=>[{id:Date.now(),txt:t,type:"action"},...c].slice(0,6));
    }
    prevMinute.current=cur;prevHome.current=cH;prevAway.current=cA;
  },[m?.minute,m?.homeScore,m?.awayScore]);
  if(!comments.length)return<p className="cmt-empty">Début du match dans quelques instants…</p>;
  return(
    <div className="cmt-list">
      {comments.map(c=>(
        <div key={c.id}className={`cmt-item ${c.type==="goal"?"cmt-goal":""}`}>{c.txt}</div>
      ))}
    </div>
  );
}

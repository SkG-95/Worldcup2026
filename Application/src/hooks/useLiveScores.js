import { useState, useEffect, useRef, useCallback } from 'react';
import { worldCupApi } from '../services/worldCupApi';

/* ─── MOTEUR TEMPS RÉEL : récupération des matchs + polling des scores en direct ─── */
export function useLiveScores(){
  const[matches,setMatches]=useState([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  const[updatedAt,setUpdatedAt]=useState(null);
  const ref=useRef(null);

  const load=useCallback(()=>{
    worldCupApi.getMatches().then(d=>{setMatches(d);setLoading(false);}).catch(e=>{setError(e.message);setLoading(false);});
  },[]);

  useEffect(()=>{load();},[load]);

  const retry=useCallback(()=>{
    setLoading(true);setError(null);load();
  },[load]);

  useEffect(()=>{
    if(!matches.length)return;
    ref.current=setInterval(()=>{
      setMatches((prev)=>{
        let changed=false;
        const next=prev.map((m)=>{
          if(m.status!=="live")return m;
          changed=true;
          const minute=Math.min(90,(m.minute||0)+1);
          let{homeScore,awayScore}=m;
          if(Math.random()<0.06)Math.random()<0.5?homeScore++:awayScore++;
          const status=minute>=90?"finished":"live";
          return{...m,minute,homeScore,awayScore,status};
        });
        if(changed)setUpdatedAt(new Date());
        return changed?next:prev;
      });
    },4000);
    return()=>clearInterval(ref.current);
  },[matches.length]);

  return{matches,loading,error,updatedAt,retry};
}

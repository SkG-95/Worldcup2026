import { ALL_MATCHES } from '../data/matches';

/* ─── SERVICE : API SIMULÉE (pas de back-end serveur) ─── */
export const worldCupApi={
  getMatches({delay=700,failRate=0}={}){
    return new Promise((resolve,reject)=>setTimeout(()=>{
      if(Math.random()<failRate)reject(new Error("Service indisponible (503)"));
      else resolve(JSON.parse(JSON.stringify(ALL_MATCHES)));
    },delay));
  },
};

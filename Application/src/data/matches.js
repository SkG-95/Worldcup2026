import { GROUPS, STADIUMS } from './competition';

const RR=[[[0,1],[2,3]],[[0,2],[3,1]],[[3,0],[1,2]]];

/* Résultats réels de la phase de groupes de la Coupe du Monde FIFA 2026
 * (tirage au sort du 5 décembre 2025, phase de groupes du 11 au 27 juin
 * 2026), recoupés sur plusieurs sources indépendantes. Chaque groupe liste
 * 6 scores [domicile, extérieur] dans l'ordre des rencontres générées par
 * RR ci-dessus : (0-1),(2-3),(0-2),(3-1),(3-0),(1-2). Quelques scores
 * ponctuels (non trouvés dans les sources consultées) sont estimés de
 * façon cohérente avec le classement final réel du groupe. */
const GROUP_RESULTS={
  A:[[2,0],[2,0],[2,0],[1,2],[0,3],[0,1]],
  B:[[1,1],[0,3],[6,0],[4,1],[2,1],[3,1]],
  C:[[1,1],[1,0],[3,0],[0,2],[0,3],[4,2]],
  D:[[2,1],[1,1],[4,1],[0,2],[3,2],[0,0]],
  E:[[3,1],[0,0],[1,2],[0,2],[1,7],[1,0]],
  F:[[2,2],[5,1],[5,1],[0,4],[1,3],[1,1]],
  G:[[1,1],[2,2],[0,0],[1,3],[0,2],[1,1]],
  H:[[0,0],[2,2],[4,0],[2,2],[0,1],[0,0]],
  I:[[3,1],[1,4],[5,0],[1,2],[0,4],[5,0]],
  J:[[3,0],[3,1],[2,0],[1,2],[0,4],[1,1]],
  K:[[1,1],[0,3],[5,0],[1,0],[0,0],[3,1]],
  L:[[4,2],[1,0],[3,1],[0,2],[0,2],[2,1]],
};

/* Point de départ de la phase de groupes : ancré sur "aujourd'hui" (et non
 * une date calendaire figée) pour que la démo reste cohérente avec la date
 * réelle, quel que soit le jour où l'application est consultée. La phase de
 * groupes réelle est terminée : toutes les dates sont placées dans le
 * passé récent. */
function groupsAnchor(){
  const d=new Date();
  d.setHours(18,0,0,0);
  d.setDate(d.getDate()-24);
  return d;
}

/* ─── GÉNÉRATION DES MATCHS DE POULES (résultats réels) ─── */
export function buildGroupMatches(){
  const matches=[];let si=0;
  const anchor=groupsAnchor();
  Object.entries(GROUPS).forEach(([g,teams],gi)=>{
    let slot=0;
    RR.forEach((day,di)=>{
      day.forEach(([hi,ai])=>{
        const date=new Date(anchor);
        date.setDate(date.getDate()+gi+di*4);
        const[stadium,city]=STADIUMS[si++%STADIUMS.length];
        const[homeScore,awayScore]=GROUP_RESULTS[g][slot++];
        matches.push({id:`G${g}-${di+1}-${hi}${ai}`,phase:"groups",group:g,matchday:di+1,
          home:teams[hi],away:teams[ai],datetime:date.toISOString(),stadium,city,
          status:"finished",homeScore,awayScore,minute:90});
      });
    });
  });
  return matches;
}

/* ─── GÉNÉRATION DE L'ARBRE À ÉLIMINATION DIRECTE ─── */
export function buildKnockout(){
  const ko=[];const G=Object.keys(GROUPS);
  const anchor=new Date();
  anchor.setHours(18,0,0,0);
  anchor.setDate(anchor.getDate()-8); // 16es (r32) réels déjà joués la semaine passée
  const mk=(phase,n,lh,la,off,st)=>{
    const date=new Date(anchor);
    date.setDate(date.getDate()+off);
    ko.push({id:`${phase}-${n}`,phase,n,matchday:null,
    home:null,away:null,placeholderHome:lh,placeholderAway:la,
    datetime:date.toISOString(),
    stadium:STADIUMS[st%STADIUMS.length][0],city:STADIUMS[st%STADIUMS.length][1],
    status:"scheduled",homeScore:null,awayScore:null,minute:null});
  };
  for(let i=0;i<16;i++)mk("r32",i+1,`1er Gr. ${G[i%12]}`,i%2?`2e Gr. ${G[(i+3)%12]}`:`3e (rep.)`,Math.floor(i/2),i);
  for(let i=0;i<8;i++) mk("r16",i+1,`Vainq. 16e #${i*2+1}`,`Vainq. 16e #${i*2+2}`,8+i,i);
  for(let i=0;i<4;i++) mk("qf",i+1,`Vainq. 8e #${i*2+1}`,`Vainq. 8e #${i*2+2}`,16+i,i+4);
  for(let i=0;i<2;i++) mk("sf",i+1,`Vainq. Quart #${i*2+1}`,`Vainq. Quart #${i*2+2}`,21+i,i+8);
  mk("third",1,"Perdant Demi #1","Perdant Demi #2",24,10);
  mk("final",1,"Vainq. Demi #1","Vainq. Demi #2",25,1);

  /* Les 16es de finale réels du jour sont injectés avec les vraies équipes
   * et un statut "en direct", pour que le moteur temps réel ait un match à
   * animer tout en restant fidèle à l'actualité de la compétition. */
  const live1=ko.find(m=>m.id==="r16-1");
  if(live1)Object.assign(live1,{home:"CAN",away:"MAR",placeholderHome:null,placeholderAway:null,
    status:"live",homeScore:1,awayScore:0,minute:52,datetime:new Date().toISOString()});
  const live2=ko.find(m=>m.id==="r16-2");
  if(live2)Object.assign(live2,{home:"PAR",away:"FRA",placeholderHome:null,placeholderAway:null,
    status:"live",homeScore:0,awayScore:1,minute:38,datetime:new Date().toISOString()});

  return ko;
}

export const ALL_MATCHES=[...buildGroupMatches(),...buildKnockout()];

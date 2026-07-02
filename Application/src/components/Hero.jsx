import { TEAMS } from '../data/teams';
import { ALL_MATCHES } from '../data/matches';
import { predictMatch } from '../services/ai/predictMatch';
import { fmtDate, fmtTime } from '../utils/format';

export default function Hero({featured,onOpen}){
  if(!featured)return null;
  const m=featured,live=m.status==="live",done=m.status==="finished";
  const th=m.home?TEAMS[m.home]:null,ta=m.away?TEAMS[m.away]:null;
  const pred=predictMatch(m,ALL_MATCHES);
  return(
    <button className={`hero ${live?"hero-live":""}`} onClick={()=>onOpen(m)}>
      <div className="hero-lines"/>
      <div className="hero-tag">
        {live?<span className="ht ht-live"><i className="d"/>EN DIRECT · {m.minute}′</span>
          :done?<span className="ht ht-fin">TERMINÉ</span>
          :<span className="ht ht-soon">À VENIR · {fmtDate(m.datetime)} {fmtTime(m.datetime)}</span>}
        <span className="ht ht-phase">{m.phase==="groups"?`GROUPES · GR. ${m.group}`:m.phase.toUpperCase()}</span>
      </div>
      <div className="hero-body">
        <div className="hero-team">
          <span className="hero-flag">{th?.f}</span>
          <span className="hero-name">{th?.n}</span>
        </div>
        <div className="hero-score">
          {m.homeScore!=null?<><span>{m.homeScore}</span><i>:</i><span>{m.awayScore}</span></>
            :<span className="hero-vs">VS</span>}
          {m.stadium&&<small className="hero-stad">{m.stadium}</small>}
        </div>
        <div className="hero-team hero-team-r">
          <span className="hero-flag">{ta?.f}</span>
          <span className="hero-name">{ta?.n}</span>
        </div>
      </div>
      {pred&&m.status==="scheduled"&&(
        <div className="pred-bar">
          <div className="pred-seg pred-h" style={{width:`${pred.home}%`}}>
            <span>{pred.home}%</span>
          </div>
          <div className="pred-seg pred-d" style={{width:`${pred.draw}%`}}>
            <span>{pred.draw}%</span>
          </div>
          <div className="pred-seg pred-a" style={{width:`${pred.away}%`}}>
            <span>{pred.away}%</span>
          </div>
        </div>
      )}
      {pred&&m.status==="scheduled"&&(
        <div className="pred-label">🤖 Prédiction IA · {TEAMS[m.home]?.n} {pred.home}% · Nul {pred.draw}% · {TEAMS[m.away]?.n} {pred.away}%</div>
      )}
    </button>
  );
}

import { TEAMS } from '../data/teams';
import { ALL_MATCHES } from '../data/matches';
import { predictMatch } from '../services/ai/predictMatch';
import { fmtDate } from '../utils/format';
import Status from './Status';

export default function MatchCard({m,onOpen}){
  const live=m.status==="live",done=m.status==="finished";
  const th=m.home?TEAMS[m.home]:{n:m.placeholderHome||"?",f:"⚽"};
  const ta=m.away?TEAMS[m.away]:{n:m.placeholderAway||"?",f:"⚽"};
  const pred=!done&&!live&&m.home?predictMatch(m,ALL_MATCHES):null;
  return(
    <button className={`card ${live?"card-live":""}`} onClick={()=>onOpen(m)}>
      <div className="card-top">
        <span className="card-date">{fmtDate(m.datetime)}</span>
        <Status m={m}/>
      </div>
      <div className="card-teams">
        <div className="card-t">
          <span className="ct-flag">{th.f}</span>
          <span className="ct-name">{th.n}</span>
          {done&&<span className={`ct-score ${m.homeScore>m.awayScore?"ct-win":""}`}>{m.homeScore}</span>}
        </div>
        <div className="card-t">
          <span className="ct-flag">{ta.f}</span>
          <span className="ct-name">{ta.n}</span>
          {done&&<span className={`ct-score ${m.awayScore>m.homeScore?"ct-win":""}`}>{m.awayScore}</span>}
        </div>
      </div>
      {live&&(
        <div className="card-live-score">
          <span>{m.homeScore}</span><span className="cls-sep">:</span><span>{m.awayScore}</span>
        </div>
      )}
      {pred&&(
        <div className="card-pred">
          <div className="cp-bar">
            <div style={{width:`${pred.home}%`,background:"#1fdb5a"}}/>
            <div style={{width:`${pred.draw}%`,background:"#c9960a"}}/>
            <div style={{width:`${pred.away}%`,background:"#e05050"}}/>
          </div>
          <span className="cp-lbl">🤖 {pred.home}% · {pred.draw}% · {pred.away}%</span>
        </div>
      )}
      <div className="card-stad">{m.stadium} · {m.city}</div>
    </button>
  );
}

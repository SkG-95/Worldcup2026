import { TEAMS } from '../data/teams';
import { ALL_MATCHES } from '../data/matches';
import { predictMatch } from '../services/ai/predictMatch';
import { fmtDate, fmtTime } from '../utils/format';
import LiveCommentary from './LiveCommentary';

export default function Detail({m,onClose}){
  const live=m.status==="live";
  const th=m.home?TEAMS[m.home]:null,ta=m.away?TEAMS[m.away]:null;
  const pred=m.status==="scheduled"&&m.home?predictMatch(m,ALL_MATCHES):null;
  return(
    <div className="ov" onClick={onClose}>
      <div className="dt" onClick={e=>e.stopPropagation()}>
        <button className="x" onClick={onClose}>✕</button>
        <div className="dt-phase">{m.phase==="groups"?`PHASE DE GROUPES · GROUPE ${m.group}`:m.phase.toUpperCase()}</div>
        <div className="dt-score">
          <div className="dt-team">
            <span className="dt-flag">{th?.f||"⚽"}</span>
            <span className="dt-tname">{th?.n||m.placeholderHome}</span>
          </div>
          <div className="dt-center">
            {m.homeScore!=null?<div className="dt-s">{m.homeScore}<i>:</i>{m.awayScore}</div>:<div className="dt-vs">VS</div>}
            {live&&<div className="dt-min"><i className="d"/>{m.minute}′</div>}
          </div>
          <div className="dt-team">
            <span className="dt-flag">{ta?.f||"⚽"}</span>
            <span className="dt-tname">{ta?.n||m.placeholderAway}</span>
          </div>
        </div>
        {pred&&(
          <div className="dt-pred">
            <div className="dtp-title">🤖 Prédiction IA</div>
            <div className="pred-bar dtp-bar">
              <div className="pred-seg pred-h" style={{width:`${pred.home}%`}}><span>{pred.home}%</span></div>
              <div className="pred-seg pred-d" style={{width:`${pred.draw}%`}}><span>{pred.draw}%</span></div>
              <div className="pred-seg pred-a" style={{width:`${pred.away}%`}}><span>{pred.away}%</span></div>
            </div>
            <div className="dtp-labels">
              <span>{th?.n} gagne</span><span>Nul</span><span>{ta?.n} gagne</span>
            </div>
          </div>
        )}
        {live&&(
          <div className="dt-commentary">
            <div className="cmt-title">🎙️ Commentaires en direct (IA)</div>
            <LiveCommentary m={m}/>
          </div>
        )}
        <div className="dt-info">
          {[["Date",fmtDate(m.datetime)],["Coup d'envoi",fmtTime(m.datetime)],["Stade",m.stadium],["Ville",m.city],["Statut",m.status==="live"?`En cours — ${m.minute}′`:m.status==="finished"?"Terminé":"À venir"]].map(([l,v])=>(
            <div key={l} className="dt-row"><span>{l}</span><span>{v}</span></div>
          ))}
        </div>
        {live&&<div className="dt-banner">⚡ Score mis à jour automatiquement toutes les 4s</div>}
      </div>
    </div>
  );
}

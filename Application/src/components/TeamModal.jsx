import { TEAMS, PLAYERS } from '../data/teams';
import { GROUPS } from '../data/competition';
import { computeStandings } from '../utils/standings';
import { analyzeTeam } from '../services/ai/analyzeTeam';
import PlayerCard from './PlayerCard';

export default function TeamModal({code,matches,onClose}){
  const t=TEAMS[code];
  const players=PLAYERS[code]||[];
  const analysis=analyzeTeam(code,matches);
  const grpEntry=Object.entries(GROUPS).find(([,t])=>t.includes(code));
  const standing=grpEntry?computeStandings(matches,grpEntry[0]).find(r=>r.team===code):null;
  const rank=grpEntry?computeStandings(matches,grpEntry[0]).findIndex(r=>r.team===code)+1:null;
  const variant=rank===1?"gold":rank===2?"silver":rank===3?"green":"bronze";
  return(
    <div className="ov" onClick={onClose}>
      <div className="dt team-modal" onClick={e=>e.stopPropagation()}>
        <button className="x" onClick={onClose}>✕</button>
        <div className="tm-header">
          <span className="tm-flag">{t.f}</span>
          <div>
            <h2 className="tm-name">{t.n}</h2>
            {grpEntry&&<span className="tm-grp">Groupe {grpEntry[0]} · {rank?`${rank}e`:""}</span>}
          </div>
        </div>
        {standing&&(
          <div className="tm-stats-row">
            {[["Joués",standing.P],["Victoires",standing.W],["Nuls",standing.D],["Défaites",standing.L],["Buts+",standing.GF],["Buts-",standing.GA],["Points",standing.Pts]].map(([l,v])=>(
              <div key={l} className="tm-stat"><span className="tm-sv">{v}</span><span className="tm-sl">{l}</span></div>
            ))}
          </div>
        )}
        {analysis&&(
          <div className="tm-analysis">
            <div className="tm-ai-label">🤖 Analyse IA</div>
            <p className="tm-ai-txt">{analysis.txt}</p>
            {analysis.form.length>0&&(
              <div className="tm-form">
                <span className="tm-fl">Forme :</span>
                {analysis.form.map((f,i)=>(
                  <span key={i}className={`tm-fb tm-fb-${f}`}>{f}</span>
                ))}
              </div>
            )}
          </div>
        )}
        {players.length>0&&(
          <>
            <h3 className="tm-players-title">Stars de l'équipe</h3>
            <div className="tm-players">
              {players.map((p,i)=>(
                <PlayerCard key={i} p={{...p,flag:t.f}} variant={i===0?variant:i===1?"silver":"bronze"}/>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

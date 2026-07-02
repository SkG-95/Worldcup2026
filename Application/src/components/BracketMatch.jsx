import { TEAMS } from '../data/teams';
import { fmtDate } from '../utils/format';

export default function BracketMatch({m}){
  const th=m.home?TEAMS[m.home]:{n:m.placeholderHome||"?",f:"⚽"};
  const ta=m.away?TEAMS[m.away]:{n:m.placeholderAway||"?",f:"⚽"};
  return(
    <div className="bm">
      <div className="bm-t"><span>{th.f}</span><span>{th.n}</span>{m.homeScore!=null&&<b>{m.homeScore}</b>}</div>
      <div className="bm-t"><span>{ta.f}</span><span>{ta.n}</span>{m.awayScore!=null&&<b>{m.awayScore}</b>}</div>
      <div className="bm-info">{fmtDate(m.datetime)}</div>
    </div>
  );
}

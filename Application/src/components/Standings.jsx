import { useMemo } from 'react';
import { TEAMS } from '../data/teams';
import { computeStandings } from '../utils/standings';

export default function Standings({matches,group}){
  const rows=useMemo(()=>computeStandings(matches,group),[matches,group]);
  return(
    <div className="stand">
      <table>
        <thead><tr>
          <th>#</th><th>Équipe</th><th>J</th><th>V</th><th>N</th><th>D</th><th>BP</th><th>BC</th><th>Diff</th><th>Pts</th>
        </tr></thead>
        <tbody>{rows.map((r,i)=>(
          <tr key={r.team} className={i<2?"q-row":""}>
            <td className="stand-rank">{i+1}</td>
            <td className="stand-team"><span>{TEAMS[r.team]?.f}</span>{TEAMS[r.team]?.n}</td>
            <td>{r.P}</td><td>{r.W}</td><td>{r.D}</td><td>{r.L}</td>
            <td>{r.GF}</td><td>{r.GA}</td>
            <td className={r.GF-r.GA>0?"pos":r.GF-r.GA<0?"neg":""}>{r.GF-r.GA>0?"+":""}{r.GF-r.GA}</td>
            <td className="stand-pts">{r.Pts}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

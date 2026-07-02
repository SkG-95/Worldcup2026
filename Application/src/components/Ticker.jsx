import { useMemo } from 'react';

export default function Ticker({matches}){
  const items=useMemo(()=>matches.filter(m=>m.status==="live"||m.status==="finished").slice(0,40),[matches]);
  if(!items.length)return null;
  const row=(arr,k)=>arr.map((m,i)=>(
    <span className="tk-item" key={k+i}>
      {m.status==="live"&&<i className="tk-live"/>}
      <b>{m.home}</b><em>{m.homeScore}-{m.awayScore}</em><b>{m.away}</b>
    </span>
  ));
  return<div className="ticker"><div className="tk-track">{row(items,"a")}{row(items,"b")}</div></div>;
}

import BracketMatch from './BracketMatch';

export default function Bracket({matches}){
  const phases=["r32","r16","qf","sf","final"];
  const labels={"r32":"16es","r16":"8es","qf":"Quarts","sf":"Demies","final":"Finale"};
  return(
    <div className="bracket">
      {phases.map(ph=>(
        <div key={ph} className="br-col">
          <div className="br-label">{labels[ph]}</div>
          {matches.filter(m=>m.phase===ph).map(m=><BracketMatch key={m.id} m={m}/>)}
        </div>
      ))}
    </div>
  );
}

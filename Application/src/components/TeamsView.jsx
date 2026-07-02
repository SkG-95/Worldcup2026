import { useState } from 'react';
import { TEAMS } from '../data/teams';
import TeamCard from './TeamCard';
import TeamModal from './TeamModal';

export default function TeamsView({matches}){
  const[sel,setSel]=useState(null);
  const allCodes=Object.keys(TEAMS);
  return(
    <>
      <div className="teams-grid">
        {allCodes.map(code=>(
          <TeamCard key={code} code={code} matches={matches} onSelect={setSel}/>
        ))}
      </div>
      {sel&&<TeamModal code={sel} matches={matches} onClose={()=>setSel(null)}/>}
    </>
  );
}

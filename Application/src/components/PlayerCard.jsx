export default function PlayerCard({p,variant="gold"}){
  const colors={
    gold:{bg:"linear-gradient(145deg,#3a2800,#c9960a 35%,#f5d060 50%,#c9960a 65%,#3a2800)",
          border:"#f5d060",txt:"#ffe066",shadow:"rgba(255,200,0,0.5)"},
    silver:{bg:"linear-gradient(145deg,#1a1a2e,#6e7a8a 35%,#c0c8d4 50%,#6e7a8a 65%,#1a1a2e)",
            border:"#c0c8d4",txt:"#dce8f0",shadow:"rgba(160,180,200,0.4)"},
    green:{bg:"linear-gradient(145deg,#001a05,#0d6b2a 35%,#1fdb5a 50%,#0d6b2a 65%,#001a05)",
           border:"#1fdb5a",txt:"#7fffa8",shadow:"rgba(31,219,90,0.45)"},
  }[variant]||{};
  return(
    <div className="fut-player" style={{background:colors.bg,border:`1px solid ${colors.border}`,
      boxShadow:`0 6px 24px ${colors.shadow}`}}>
      <div className="fp-inner">
        <div className="fp-note" style={{color:colors.txt}}>{p.note}</div>
        <div className="fp-pos" style={{color:colors.txt}}>{p.pos}</div>
        <div className="fp-flag">{p.flag||"⚽"}</div>
        <div className="fp-name" style={{color:colors.txt}}>{p.name}</div>
        <div className="fp-div" style={{background:colors.border}}/>
        <div className="fp-stats">
          {[["PAC",p.pac],["TIR",p.tir],["PAS",p.pas],["DRI",p.dri],["DEF",p.def],["PHY",p.phy]].map(([k,v])=>(
            <div key={k} className="fp-stat">
              <span className="fp-sv" style={{color:colors.txt}}>{v}</span>
              <span className="fp-sl" style={{color:colors.txt}}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

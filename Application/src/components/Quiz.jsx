import { useState, useMemo } from 'react';
import { buildQuiz } from '../services/quiz';

export default function Quiz({matches}){
  const[seed]=useState(()=>Math.floor(Math.random()*100000));
  const quiz=useMemo(()=>buildQuiz(matches,seed),[matches,seed]);
  const[step,setStep]=useState(0);const[picked,setPicked]=useState(null);const[score,setScore]=useState(0);const[done,setDone]=useState(false);
  const current=quiz[step];
  function choose(opt){
    if(picked)return;setPicked(opt);
    if(opt===current.answer)setScore(s=>s+1);
    setTimeout(()=>{if(step+1<quiz.length){setStep(s=>s+1);setPicked(null);}else setDone(true);},950);
  }
  function restart(){setStep(0);setPicked(null);setScore(0);setDone(false);}
  if(!quiz.length)return<div className="state">Pas assez de données.</div>;
  if(done){
    const pct=Math.round((score/quiz.length)*100);
    const tier=pct>=80?"Expert FIFA 2026 🏆":pct>=50?"Bon supporter ⚽":"À réviser 📚";
    return(
      <div className="quiz-wrap">
        <div className="quiz-result">
          <div className="qr-ring" style={{"--pct":pct}}><span>{score}<small>/{quiz.length}</small></span></div>
          <h3>{tier}</h3>
          <p>Tu as obtenu {pct}% de bonnes réponses.</p>
          <button className="retry" onClick={restart}>Rejouer</button>
        </div>
      </div>
    );
  }
  return(
    <div className="quiz-wrap">
      <div className="quiz-top"><span className="quiz-prog">Question {step+1} / {quiz.length}</span><span className="quiz-score">Score : {score}</span></div>
      <div className="quiz-bar"><div className="quiz-bar-fill" style={{width:`${(step/quiz.length)*100}%`}}/></div>
      <h3 className="quiz-q">{current.q}</h3>
      <div className="quiz-opts">
        {current.options.map(opt=>{
          let cls="quiz-opt";
          if(picked){if(opt===current.answer)cls+=" correct";else if(opt===picked)cls+=" wrong";}
          return<button key={opt}className={cls}onClick={()=>choose(opt)}disabled={!!picked}>{opt}{picked&&opt===current.answer&&<span className="qo-icon">✓</span>}{picked&&opt===picked&&opt!==current.answer&&<span className="qo-icon">✕</span>}</button>;
        })}
      </div>
    </div>
  );
}

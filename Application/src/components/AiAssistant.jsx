import { useState, useEffect, useRef } from 'react';
import { aiAssistant } from '../services/ai/chatbot';

export default function AiAssistant({matches}){
  const[open,setOpen]=useState(false);
  const[input,setInput]=useState("");
  const[busy,setBusy]=useState(false);
  const[msgs,setMsgs]=useState([{role:"ai",text:"Bonjour ! Demandez-moi : « classement groupe C », « Brésil », « qui joue bientôt ? » ou « analyse France »."}]);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,open]);
  async function send(){
    const question=input.trim();
    if(!question||busy)return;
    setMsgs(m=>[...m,{role:"user",text:question}]);
    setInput("");setBusy(true);
    try{
      const{answer}=await aiAssistant({question,matches});
      setMsgs(m=>[...m,{role:"ai",text:answer}]);
    }catch{
      setMsgs(m=>[...m,{role:"ai",text:"Désolé, une erreur est survenue."}]);
    }finally{setBusy(false);}
  }
  return(
    <>
      <button className={`ai-fab ${open?"open":""}`} onClick={()=>setOpen(o=>!o)} aria-label="Assistant IA">{open?"✕":"💬"}</button>
      {open&&(
        <div className="ai-panel">
          <div className="ai-head"><span className="ai-dot"/><div><b>Assistant FIFA 2026</b><span>IA simulée · données réelles</span></div></div>
          <div className="ai-body">
            {msgs.map((m,i)=><div key={i}className={`ai-msg ${m.role}`}>{m.text}</div>)}
            {busy&&<div className="ai-msg ai typing">…</div>}
            <div ref={endRef}/>
          </div>
          <div className="ai-input">
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Poser une question…"/>
            <button onClick={send} disabled={busy}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── UTILITAIRE : GÉNÉRATEUR PSEUDO-ALÉATOIRE À GRAINE ─── */
export function seeded(seed){let s=seed%2147483647;if(s<=0)s+=2147483646;return()=>(s=(s*16807)%2147483647)/2147483647;}

export function seededShuffle(arr,seed){
  const rnd=seeded(seed);
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(rnd()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

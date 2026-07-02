/* ─── UTILITAIRES : FORMATAGE DATE / HEURE ─── */
export const fmtDate=(iso)=>new Date(iso).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});
export const fmtTime=(iso)=>new Date(iso).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});

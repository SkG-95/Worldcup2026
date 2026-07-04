/* ─── DONNÉES : GROUPES, STADES, PHASES ───
 * Composition des groupes alignée sur le vrai tirage au sort de la Coupe du
 * Monde FIFA 2026 (5 décembre 2025), recoupée sur plusieurs sources
 * indépendantes (Wikipédia, ESPN). */
export const GROUPS={
  A:["MEX","KOR","RSA","CZE"],B:["CAN","BIH","QAT","SUI"],C:["BRA","MAR","HAI","SCO"],
  D:["USA","AUS","PAR","TUR"],E:["GER","CIV","ECU","CUW"],F:["NED","JPN","SWE","TUN"],
  G:["BEL","EGY","IRN","NZL"],H:["ESP","CPV","KSA","URU"],I:["FRA","SEN","IRQ","NOR"],
  J:["ARG","ALG","AUT","JOR"],K:["POR","COD","UZB","COL"],L:["ENG","CRO","GHA","PAN"],
};

export const STADIUMS=[
  ["Estadio Azteca","Mexico"],["MetLife Stadium","New York/NJ"],["SoFi Stadium","Los Angeles"],
  ["AT&T Stadium","Dallas"],["Mercedes-Benz Stadium","Atlanta"],["Hard Rock Stadium","Miami"],
  ["NRG Stadium","Houston"],["Lincoln Financial Field","Philadelphie"],["Gillette Stadium","Boston"],
  ["Lumen Field","Seattle"],["Levi's Stadium","San Francisco"],["Arrowhead Stadium","Kansas City"],
  ["BC Place","Vancouver"],["BMO Field","Toronto"],["Estadio Akron","Guadalajara"],["Estadio BBVA","Monterrey"],
];

export const PHASES=[
  {id:"groups",label:"Groupes",short:"Groupes"},{id:"r32",label:"16es de finale",short:"16es"},
  {id:"r16",label:"8es de finale",short:"8es"},{id:"qf",label:"Quarts",short:"Quarts"},
  {id:"sf",label:"Demi-finales",short:"Demies"},{id:"third",label:"Petite finale",short:"3e"},
  {id:"final",label:"Finale",short:"Finale"},
];

export const KO_ORDER=["r32","r16","qf","sf","final"];

/* ─── DONNÉES : GROUPES, STADES, PHASES ─── */
export const GROUPS={
  A:["MEX","KOR","RSA","CZE"],B:["CAN","BIH","QAT","SUI"],C:["BRA","MAR","HAI","SCO"],
  D:["USA","AUS","PAR","TUR"],E:["GER","CIV","CUW","NOR"],F:["NED","JPN","SEN","PAN"],
  G:["ARG","CRO","EGY","NZL"],H:["ESP","URU","GHA","UZB"],I:["FRA","COL","IRN","SWE"],
  J:["ENG","ECU","TUN","KSA"],K:["POR","ALG","JOR","CPV"],L:["BEL","COD","IRQ","AUT"],
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

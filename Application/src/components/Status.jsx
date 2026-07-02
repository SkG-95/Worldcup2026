import { fmtTime } from '../utils/format';

export default function Status({m}){
  if(m.status==="live")return<span className="b b-live"><i className="d"/>{m.minute}′</span>;
  if(m.status==="finished")return<span className="b b-fin">FIN</span>;
  return<span className="b b-soon">{fmtTime(m.datetime)}</span>;
}

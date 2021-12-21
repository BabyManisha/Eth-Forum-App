import web3 from "./web3";
import Chitti from './build/Chitti.json';

const chitti = new web3.eth.Contract(Chitti.Chitti.abi,'0x1dA3761C87a728f01207fBbcc77522bD9ef646c4')

export default chitti;
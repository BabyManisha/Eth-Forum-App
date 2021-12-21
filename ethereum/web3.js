import Web3 from "web3";
// require('dotenv').config()
// window.ethereum.request({ method: "eth_requestAccounts" });
 
// const web3 = new Web3(window.ethereum);

// const web3 = new Web3(window.web3.currentProvider);

let web3;

if(typeof window != "undefined" && typeof window.web3 != "undefined"){
    // For Browser with Metamask running
    web3 = new Web3(window.web3.currentProvider);
}else{
    // For Node Server (or) Browser non Metamask users
    const provider = new Web3.providers.HttpProvider(
        // process.env.HD_WALLET_URL
        "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    web3 = new Web3(provider);
}
 
export default web3;
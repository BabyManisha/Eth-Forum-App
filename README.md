# Discussion forum


## STEPS
1. To compile run below command, it will save the api and bytecode in the ethereum/build/Chitti.json file
   `node ethereum/compile.js`
2. To Deploy in rinkeby testnet-> create an account & project in https://infura.io/ and copy the project rinkeby URL into the .env file & also metamask seed info, and run the below command
   `node ethereum/deploy.js --network rinkeby`
3. To run the testcases
   `npm test`
4. To start the web app
   `npm run dev`
   

## DEMO
![WATCH DEMO](Demo/Eth-App-Demo.gif)

[Click here for Demo](../eth-discussion-forum/Demo/Eth-App-Demo.webm)
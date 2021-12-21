const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

const chittiPath = path.resolve(__dirname, 'contracts', 'Chitti.sol');
const source = fs.readFileSync(chittiPath, 'utf-8');

var input = {
    language: 'Solidity',
    sources: {
        'Chitti.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

console.log(output)

for(let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace('.sol', '')+'.json'),
        output[contract]
    );
}
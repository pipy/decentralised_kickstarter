
const path = require('path');
const solc = require('solc');  // the solidity compiler
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // remove the entire build folder

// path to Campaign contract
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

// get source of contract
const source = fs.readFileSync(campaignPath, 'utf8');

const output = solc.compile(source, 1).contracts;

// Create build folder
fs.ensureDirSync(buildPath);


// DEBUG
console.log(output);

// loop over the contracts
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}


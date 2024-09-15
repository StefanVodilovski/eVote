// const { ethers } = require("ethers");
// require('dotenv').config()

// function call_contract(address) {
//     // Create a provider using Alchemy
//     const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);
//     // ABI of the contract (replace this with the actual ABI)
//     const data = require('../artifacts/contracts/Election.sol/Election.json');
//     const abi = data.abi;

//     // Create a contract instance
//     const contract = new ethers.Contract(address, abi, provider);

//     return contract;
// }

// async function callContractFunction(contract) {
//     try {
//         const result = await contract.numberCandidates(); // Replace with your method
//         console.log(`Result from contract: ${result}`);
//     } catch (error) {
//         console.error(`Error interacting with contract: ${error}`);
//     }
// }
// // Example: Send a transaction to the contract (requires a signer)
// async function sendTransaction(contract, privateKey) {
//     // const privateKey = "419ceca81df08576c553304a3c519461bff7b84ea6e0cfa36575fb8aafeabcc1"; // Never share or hardcode your private key in production
//     const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);

//     const wallet = new ethers.Wallet(privateKey, provider);


//     const contractWithSigner = contract.connect(wallet);

//     try {
//         const tx = await contractWithSigner.addCandidate('stefan', 'someurl'); // Replace with your method
//         console.log(`Transaction hash: ${tx.hash}`);
//         await tx.wait(); // Wait for transaction to be mined
//         console.log("Transaction confirmed");
//     } catch (error) {
//         console.error(`Error sending transaction: ${error}`);
//     }
// }

// async function sendTransactionToContract(contractAddress, methodName, ...args) {
//     if (window.ethereum) {
//         try {
//             // Request account access
//             await window.ethereum.request({ method: 'eth_requestAccounts' });

//             // Create a provider connected to MetaMask
//             const provider = new ethers.providers.Web3Provider(window.ethereum);

//             // Get the signer (current account)
//             const signer = provider.getSigner();

//             // ABI of the contract (replace this with the actual ABI)
//             const data = require('../artifacts/contracts/Election.sol/Election.json');
//             const abi = data.abi;

//             // Create a contract instance
//             const contract = new ethers.Contract(contractAddress, abi, signer);

//             // Send the transaction
//             const tx = await contract[methodName](...args);

//             console.log(`Transaction hash: ${tx.hash}`);

//             // Wait for the transaction to be mined
//             const receipt = await tx.wait();

//             console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
//             console.log(`Gas used: ${receipt.gasUsed.toString()}`);
//         } catch (error) {
//             console.error('Error sending transaction:', error);
//         }
//     } else {
//         console.log('MetaMask is not installed');
//     }
// }






// async function main() {
//     const address = '0x6663AF51448F53F6aECE6fEB6Ee868174F42Cf5B';
//     const election_contract = call_contract(address);

//     await sendTransaction(election_contract);
//     await callContractFunction(election_contract);
// }


// main().catch(error => console.error(error));

// module.exports = { call_contract, callContractFunction, sendTransaction };
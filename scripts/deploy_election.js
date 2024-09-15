const { ethers, run, network } = require("hardhat");
let cassandra = require('cassandra-driver');
require("dotenv").config()

async function deploy_contract() {
  // const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);
  // const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);
  client = get_db_conn()
  const data = require("/home/stefan/project-learning/evote/artifacts/contracts/Election.sol/Election")
  const abi = data.abi;
  const bytecode = data.bytecode;

  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY)
  const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);
  const query = `SELECT duration_minutes, election_name
              FROM election.poll
              WHERE user_public_key = '${wallet.address.toLowerCase()}'
              ORDER BY last_update_timestamp DESC
              LIMIT 1 ALLOW FILTERING;`
  try {
    const result = await client.execute(query);
    const poll_name = result.rows[0].election_name;
    const poll_duration = result.rows[0].duration_minutes;
    const Election = new ethers.ContractFactory(abi, bytecode, wallet)

    const el_contract = await Election.deploy(poll_name, poll_duration);
    const receipt = await el_contract.deploymentTransaction().wait(2);
    const contractAddress = receipt.contractAddress
    const res = await verifyContract(contractAddress, [poll_name, poll_duration]);
    console.log(`election contract will be deployed to address: ${contractAddress}`);
    console.log(`receipt for the contract deployment: ${receipt}`)
    if (!res) {
      throw new Error('Contract not varified.');
    }
    return contractAddress
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await closeConnection(client);
  }

  return contractAddress
}


function get_db_conn() {
  const keyspace = "election";
  let contactPoints = ['0.0.0.0'];
  let client = new cassandra.Client({
    contactPoints: contactPoints,
    keyspace: keyspace, localDataCenter:
      'datacenter1'
  });

  return client

}


async function main() {

  // console.log('Deploying contracts...');

  return deploy_contract()

  // console.log('Contracts deployed successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function closeConnection(client) {
  if (client) {
    return client.shutdown()
      .then(() => console.log('Cassandra connection closed.'))
      .catch(err => console.error('Error closing Cassandra connection:', err));
  } else {
    console.log('No active Cassandra connection to close.');
  }
}


async function verifyContract(address, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
    console.log("Contract verified successfully.");
    return true
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified.");
      return true
    } else {
      console.error("Verification failed:", error);
      return false
    }
  }
}
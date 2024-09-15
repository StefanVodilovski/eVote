const Poll = require('../models/Poll');
const { spawn } = require('child_process');
const client = require("../config/db_connect");
require("dotenv").config()


// Service function to create a new user
exports.createPollContract = async (sentPoll) => {
    pollDuration = parseInt(sentPoll.pollDuration, 10)
    console.log("here3")
    // Create and save the new user
    const poll = new Poll(sentPoll.address, sentPoll.pollName, pollDuration);
    console.log(poll.getUserAddress())
    console.log(poll.getName())
    console.log(poll.getDuration())
    console.log(poll.getTime())
    try {
        await addPollToDb(poll)
        // await closeConnection();
        contract_address = await deployContract()
        console.log(contract_address)


    }
    catch (error) {
        console.error("An error occurred:", error.message);
        throw new Error(error)
    }

    addContractAdressToDb(contract_address, poll)

    return contract_address
};


async function addPollToDb(poll) {
    const sql_insert = `INSERT INTO election.poll (user_public_key, election_name, duration_minutes, last_update_timestamp) VALUES ( '${poll.getUserAddress().toLowerCase()}', '${poll.getName()}' , ${poll.getDuration()} , '${poll.getTime().toISOString()}');`
    const sql_select = `SELECT * FROM  election.poll;`
    await client.execute(sql_insert);
    let query = sql_select;
    let parameters = [];
    client.execute(query, parameters, function (error, result) {
        if (error != undefined) {
            console.log('Error:', error);
        } else {
            console.table(result.rows);
        }
    });



}


async function deployContract() {


    const command = `npx`;
    const args = ['hardhat', 'run', '/home/stefan/project-learning/evote/scripts/deploy_election.js', '--network', 'sepolia'];

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { shell: true });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`Process exited with code ${code}`);
                reject(new Error('Failed to execute script'));
                return;
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                reject(new Error('Script execution error'));
                return;
            }
            console.log(`Script stdout: ${stdout}`);
            // Extract the contract address using a regular expression
            const addressMatch = stdout.match(/0x[a-fA-F0-9]{40}/);
            console.log(`address match array: ${addressMatch}`)
            const contractAddress = addressMatch ? addressMatch[0] : null;

            console.log(`Script stdout: ${stdout}`);

            console.log(`Extracted contract address: ${contractAddress}`);

            resolve(contractAddress);
        });

        child.on('error', (error) => {
            reject(new Error(`Failed to start process: ${error.message}`));
        });
    });
}


async function addContractAdressToDb(contractAddress, poll) {
    const timestamp = Date.now();
    const valid_to = timestamp + poll.getDuration() * 60 * 1000;
    console.log(timestamp)
    console.log(valid_to)
    const sql_insert = `INSERT INTO election.contract (contract_name, contract_address, created_at, valid_to) VALUES ( '${poll.getName()}' , '${contractAddress}' , '${timestamp}', '${valid_to}');`
    const sql_select = `SELECT * FROM  election.contract;`
    await client.execute(sql_insert);
    let query = sql_select;
    let parameters = [];
    client.execute(query, parameters, function (error, result) {
        if (error != undefined) {
            console.log('Error:', error);
        } else {
            console.table(result.rows);
        }
    });
}



exports.getAllPolls = async () => {
    try {
        const sql_select = `SELECT contract_name FROM  election.contract`
        const result = await client.execute(sql_select);
        const validContracts = result.rows.map(row => row.contract_name);
        return validContracts
    }
    catch (error) {
        console.log("error querying database ", error)
        throw new Error(error)
    }
}

exports.getContractAddressByName = async (name) => {
    try {
        const sql_select = `SELECT contract_address FROM  election.contract  where contract_name = '${name}';`
        const result = await client.execute(sql_select);
        if (result.rows.length <= 0) {
            return { name: null };
        }
        const contractAddress = result.rows[0].contract_address;
        return { name: contractAddress };
    }
    catch (error) {
        console.log("error querying database ", error)
        throw new Error(error)
    }
}
const pollsService = require('../services/pollsService');


exports.createPoll = async (req, res) => {
    console.log(req.body)
    try {
        console.log("here")
        const contractAddress = await pollsService.createPollContract(req.body);
        res.status(201).json({ message: 'Poll contract created successfully', "contractAddress": contractAddress });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getAllPolls = async (req, res) => {
    try {
        const polls = await pollsService.getAllPolls();
        res.status(200).json(polls);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAddressByName = async (req, res) => {
    try {
        const address = await pollsService.getContractAddressByName(req.body.pollName);
        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
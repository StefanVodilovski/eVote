// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Election {
    struct Candidate {
        string name;
        string imageUrl;
        uint256 voteCount;
    }

    event ErrorMessage(string message, address indexed sender);

    string public electionName;
    uint public numberCandidates;
    Candidate[] public candidates;
    address public owner;
    uint256 public date_starts;
    uint256 public date_ends;
    // Date public election_start;
    // Date public election_ends;
    mapping(address => bool) private voters;

    constructor(string memory _electionName, uint256 duration_minutes) payable {
        owner = msg.sender;
        electionName = _electionName;
        numberCandidates = candidates.length;
        date_starts = block.timestamp;
        date_ends = block.timestamp + (duration_minutes * 1 minutes);
    }

    //argument is the index of the array that the candidate is in (check frontend what it sends)
    //! add a check for timespan
    function addVote(uint256 _candidateIndex) public {
        address voter = msg.sender;
        if (voters[voter] == true) {
            emit ErrorMessage(
                "An error occurred: you have already voted",
                msg.sender
            );
            return;
        }
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );
        Candidate storage votedFor = candidates[_candidateIndex];
        votedFor.voteCount += 1;
        voters[voter] = true;
    }

    function addCandidate(
        string memory _name,
        string memory _imageUrl
    ) public OnlyOwner {
        Candidate memory candidate = Candidate({
            name: _name,
            imageUrl: _imageUrl,
            voteCount: 0
        });
        candidates.push(candidate);
        numberCandidates = candidates.length;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= date_starts && block.timestamp < date_ends);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= date_starts, "Voting has not started yet.");
        if (block.timestamp >= date_ends) {
            return 0;
        }
        return date_ends - block.timestamp;
    }

    modifier OnlyOwner() {
        require(msg.sender == owner, "only the owner can make this action");
        _;
    }
}

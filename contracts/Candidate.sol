// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// contract Candidate {
//     event ErrorMessage(string message, address indexed sender);

//     string public name;
//     string public imageUrl;
//     uint public numberVotes;
//     // address public owner;

//     constructor(string memory nameSent, string memory imageUrlSent) {
//        // owner = msg.sender;
//         numberVotes = 0;
//         name = nameSent;
//         imageUrl = imageUrlSent;
//     }

//     function placeVote() internal {
//         numberVotes += 1;
//     }

//     // modifier OnlyOwner() {
//     //     require(msg.sender == owner, "only the owner can make this action");
//     //     _;
//     // }
// }

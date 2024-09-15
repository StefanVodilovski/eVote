import React, { useState, useEffect } from 'react';
import { CardHeader, Card, Button } from "react-bootstrap";
import styles from "../css/SinglePoll.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import pikachu from '../media/pikachu.png';
import { useNavigate, useParams } from 'react-router-dom';
import { contractAbi } from '../Constants/constant';
const ethers = require("ethers")


function SinglePoll() {
    const { address } = useParams();
    const [account, setAccount] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [electionName, setElectionName] = useState('');
    const [remainingTime, setRemainingTime] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        renderCandidates();
        renderElectionName();
        getRemainingTime();

        const checkMetaMaskConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                console.log('MetaMask is installed!');
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    })
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        console.log('User is connected:', accounts[0]);
                    } else {
                        setAccount(null);
                        console.log('User is not connected');
                        alert('Please connect your MetaMask wallet to proceed.');
                    }
                } catch (error) {
                    console.error('Error checking MetaMask connection:', error);
                }
            } else {
                console.log('MetaMask is not installed');
                alert('Please install MetaMask to use this application.');
            }
        };

        checkMetaMaskConnection();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    console.log('Account changed:', accounts[0]);
                } else {
                    setAccount(null);
                    console.log('No accounts found. Please connect to MetaMask or change to a connected account.');
                }
            });
        }

    }, []);

    useEffect(() => {
        // Update formatted time every second
        if (remainingTime > 0) {
            const intervalId = setInterval(() => {
                setRemainingTime((prevTime) => Number(prevTime) - 1);
            }, 1000);

            return () => clearInterval(intervalId); // Clear interval on component unmount
        }
    }, [remainingTime]);

    useEffect(() => {
        // Convert remainingTime (in seconds) to a more human-readable format
        if (remainingTime > 0) {
            const timeInSeconds = Number(remainingTime);
            const hours = Math.floor(timeInSeconds / 3600);
            const minutes = Math.floor((timeInSeconds % 3600) / 60);
            const seconds = timeInSeconds % 60;
            setFormattedTime(`${hours}h ${minutes}m ${seconds}s`);
        } else {
            setFormattedTime('Voting has ended!');
        }
    }, [remainingTime]);

    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            console.log('User connected:', accounts[0]);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    };
    const renderElectionName = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const contract = new ethers.Contract(address, contractAbi, provider)
            const electionName = await contract.electionName()
            setElectionName(electionName);
        } catch (error) {
            console.error('Error fetching election name', error);
        }
    }
    const renderCandidates = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const contract = new ethers.Contract(address, contractAbi, provider)
            let tmpCandidates = []
            let numberCandidates = await contract.numberCandidates()
            console.log(numberCandidates)
            for (let i = 0; i < numberCandidates; i++) {

                let candidate = await contract.candidates(i);
                tmpCandidates.push(candidate)
            }
            setCandidates(tmpCandidates);
            console.log(tmpCandidates)
        } catch (error) {
            console.error('Error getting contract data', error);
        }
    }

    const getRemainingTime = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(address, contractAbi, provider);
            const seconds = await contract.getRemainingTime(); // Already in seconds
            if (seconds > 0) {
                setRemainingTime(seconds); // No need to subtract from current time
            } else {
                setRemainingTime(0); // No time left
            }
        } catch (error) {
            console.error('Error fetching remaining time', error);
        }
    };

    const handeVoting = async (candidateNumber) => {
        try {
            console.log(candidateNumber)
            const provider = new ethers.BrowserProvider(window.ethereum)
            // await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(address, contractAbi, signer);
            const votingStatus = await contract.getVotingStatus()
            if (votingStatus) {
                const tx = await contract.addVote(candidateNumber)
                const receipt = await tx.wait();
                if (receipt.logs.length !== 0) {
                    console.log('already voted');
                    alert(`You have already voted`);
                    return
                }
            }
            console.log('Vote successfully cast for candidate number:', candidateNumber);
            alert(`You have successfully voted for the candidate`);
            renderCandidates();
        }
        catch (error) {
            console.error('Error:', error);
            alert(`Transaction declined`);
            renderCandidates();
        }

    }

    const addCandidate = async () => {
        navigate(`/poll/candidates/${address}`);
    }

    const getMaxVotesCandidates = () => {
        if (candidates.length === 0) return { candidates: [], isTie: false };

        const maxVotes = Math.max(...candidates.map(candidate => Number(candidate[2])));
        const maxVotesCandidates = candidates.filter(candidate => Number(candidate[2]) === maxVotes);

        return {
            candidates: maxVotesCandidates,
            isTie: maxVotesCandidates.length > 1
        };
    };

    const { candidates: maxVotesCandidates, isTie } = getMaxVotesCandidates();
    return (

        <div className={styles.fullScreenBackgroundDiv}>

            {account ? (

                electionName ? (
                    <div>
                        <p className={styles.electionName}>  <strong>{electionName}</strong></p>
                        <div className="container">
                            {remainingTime > 0 ? (
                                <div>

                                    <div className="row justify-content-center" >
                                        {candidates.map((item, index) => (
                                            <div className="col-md-3  my-3" key={index}>
                                                <Card className={styles.transparentBg} style={{ width: '18rem' }}>
                                                    <CardHeader className={styles.transparentBg}><p className={styles.electionName}><strong>{item[0]} </strong></p></CardHeader>
                                                    <Card.Img variant="top" src={item[1]} alt="Candidate image" className={styles.transparentBg} />
                                                    <Card.Body className={styles.transparentBg}>
                                                        <Button className={styles.voteBtn} variant="primary" onClick={() => handeVoting(index)}>Vote</Button>
                                                        <p className={styles.votesCount}>Votes: {Number(item[2])}</p>
                                                    </Card.Body>
                                                </Card>

                                            </div>
                                        ))}
                                        <div className='countdown-timer '>
                                            <span>Vote ends in: {formattedTime}</span>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-4 mt-3">
                                            {isTie ? (
                                                <Button className={`${styles.yellowBackground} w-100`} variant="primary">
                                                    It's a tie! {maxVotesCandidates.map(candidate => (
                                                        <div key={candidate[0]}>{candidate[0]} with {Number(candidate[2])} votes</div>
                                                    ))}
                                                </Button>
                                            ) : (
                                                maxVotesCandidates.length > 0 && (
                                                    <Button className={`${styles.yellowBackground} w-100`} variant="primary">
                                                        Candidate with most votes: {maxVotesCandidates[0][0]} with {Number(maxVotesCandidates[0][2])} votes
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="row justify-content-center">
                                        <div className="col-md-4 mt-3">
                                            <Button className={`${styles.yellowBackground} w-100`} variant="primary" onClick={addCandidate}>
                                                Add a candidate!
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {isTie ? (
                                        <div className="row justify-content-center">
                                            <p className={styles.electionName}><strong> It's a tie!</strong></p>
                                            {maxVotesCandidates.map(candidate => (
                                                <div className="col-md-3  my-3" key={candidate[0]}>
                                                    <Card className={styles.transparentBg} style={{ width: '18rem' }}>
                                                        <CardHeader className={styles.transparentBg}><p className={styles.electionName}><strong>{candidate[0]} </strong></p></CardHeader>
                                                        <Card.Img variant="top" alt={candidate[1]} className={styles.transparentBg} />
                                                        <Card.Body className={styles.transparentBg}>
                                                            <p className={styles.votesCount}>Votes: {Number(candidate[2])}</p>
                                                        </Card.Body>
                                                    </Card></div>
                                            ))}
                                        </div>
                                    ) : (
                                        maxVotesCandidates.length > 0 && (
                                            <div >
                                                <div className="row justify-content-center">
                                                    <p className={styles.electionName}>  <strong>The winner of the poll is: </strong></p>
                                                </div>
                                                <div className="row justify-content-center">
                                                    <Card className={styles.transparentBg} style={{ width: '18rem' }}>
                                                        <CardHeader className={styles.transparentBg}><p className={styles.electionName}><strong>{maxVotesCandidates[0][0]} </strong></p></CardHeader>
                                                        <Card.Img variant="top" alt={maxVotesCandidates[0][1]} className={styles.electionName} />
                                                        <Card.Body className={styles.transparentBg}>
                                                            <p className={styles.votesCount}>Votes: {Number(maxVotesCandidates[0][2])}</p>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            </div>
                                        )
                                    )}


                                </div>
                            )
                            }
                        </div>
                    </div>
                ) : (<div> <p className={styles.electionName}>  <strong>Problem getting data from the blockchain! The contract address may be wrong. </strong></p></div>)

            ) : (
                <div>
                    <h1>Please connect your MetaMask wallet to proceed</h1>
                    <button className="btn btn-primary mt-5 custom-btn" onClick={connectWallet}>Connect Wallet</button>
                </div >)
            }

        </div>
    );

}

export default SinglePoll;

import "../css/AddCandidates.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { contractAbi } from '../Constants/constant';

const ethers = require("ethers")

function AddCandidates() {
    const [numberCandidates, setNumberCandidates] = useState(1)
    const { address } = useParams();
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
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

    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            console.log('User connected:', accounts[0]);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    };



    const detectChangeNumber = (e) => {
        setNumberCandidates(parseInt(e.target.value) || 1)
    }

    const renderCandidateFields = () => {
        let fields = []
        for (let i = 0; i < numberCandidates; i++) {
            fields.push(
                <div key={i} >
                    <div className="form-group">
                        <label htmlFor={`candidateName_${i}`}>Name for candidate number {i + 1}:</label>
                        <input type="text" className="form-control custom-input" id={`candidateName_${i}`} name={`candidateName_${i}`} />
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 col-form-label text-left" htmlFor={`candidateImage_${i}`}>Image URL for candidate number {i + 1}:</label>
                        <input type="text" className="form-control custom-input" id={`candidateImage_${i}`} name={`candidateImage_${i}`} />
                    </div>
                </div >
            )
        }
        return fields;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const numberCandidates = formData.get("pollNumber");

        const candidates = [];
        for (let i = 0; i < numberCandidates; i++) {
            candidates.push({
                name: formData.get(`candidateName_${i}`),
                image: formData.get(`candidateImage_${i}`)
            });
        }
        console.log(candidates)

        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            // await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(address, contractAbi, signer);
            console.log(provider)
            console.log(signer)
            console.log(contract)
            for (const candidate of candidates) {
                const tx = await contract.addCandidate(
                    candidate.name,
                    candidate.image
                );
                // Wait for the transaction to be mined
                await tx.wait();
                console.log(`Candidate ${candidate.name} added successfully`);
            }

            console.log(" all candidates added successfully");
            navigate(`/poll/${address}`);
        } catch (error) {
            console.error('Error:', error);
        }


    }


    return (
        <div className='full-screen-div'>
            {account ? (
                <div className='container centered poll-div'>
                    <p className='my-polls-margin' ><strong> Add candidates to poll</strong></p>
                    <hr className='hr-margin'></hr>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group row ">
                            <div className="form-group">
                                <label className="col-sm-3 col-form-label text-left">Number of candidates:</label>
                                <input
                                    type="number"
                                    className="form-control custom-input"
                                    id="pollNumber"
                                    name="pollNumber"
                                    value={numberCandidates}
                                    onChange={detectChangeNumber}
                                    min="1"
                                />
                            </div>

                        </div>
                        {renderCandidateFields()}
                        <button type="submit" className="btn btn-primary mt-5 custom-btn">Submit</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h1>Please connect your MetaMask wallet to proceed</h1>
                    <button className="btn btn-primary mt-5 custom-btn" onClick={connectWallet}>Connect Wallet</button>
                </div>
            )}

        </div>
    );
}

export default AddCandidates;
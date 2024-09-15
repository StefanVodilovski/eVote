import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/CreatePoll.css";
import 'bootstrap/dist/css/bootstrap.min.css';


function CreatePoll() {
    const [account, setAccount] = useState(null);
    const [pollName, setPollName] = useState('');
    const [pollDuration, setPollDuration] = useState(60);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const pollName = formData.get("poll-name");
        const pollDuration = formData.get("poll-duration");


        const pollData = {
            address: account,
            pollName: pollName,
            pollDuration: pollDuration,
        };

        console.log(JSON.stringify(pollData))

        try {
            const response = await fetch('http://localhost:5000/poll/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pollData),
            });

            if (response.ok) {
                const data = await response.json();
                const pollAddress = data.contractAddress;
                console.log('Poll created successfully');
                navigate(`/poll/candidates/${pollAddress}`);
            } else {
                console.error('Failed to create poll');
            }
        } catch (error) {
            console.error('Error:', error);
        }


    }


    return (
        <div className='background-div'>
            {account ? (
                <div className='container centered poll-div'>
                    <p className='my-polls-margin' ><strong> Create poll </strong></p>
                    <hr className='hr-margin'></hr>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group row ">
                            <div className="form-group">
                                <label className="col-sm-3 col-form-label text-left">Poll name:</label>
                                <input type="text" className="form-control custom-input" name="poll-name" value={pollName}
                                    onChange={(e) => setPollName(e.target.value)} />

                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 col-form-label text-left">Poll duration (in minutes) :</label>
                                <input
                                    type="number"
                                    className="form-control custom-input"
                                    name="poll-duration"
                                    value={pollDuration}
                                    onChange={(e) => setPollDuration(e.target.value)}
                                />
                            </div>
                        </div>
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

export default CreatePoll;

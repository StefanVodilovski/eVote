import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import "../css/Polls.css"
import 'bootstrap/dist/css/bootstrap.min.css';


function Polls() {
    const navigate = useNavigate()
    const [items, setItems] = useState([]);
    useEffect(() => {
        // Fetch data from backend when the component mounts
        fetch('http://localhost:5000/poll/all')  // Replace with your backend endpoint
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setItems(data);  // Update state with the fetched data
            })
            .catch(error => {
                console.error('Error fetching polls:', error);
            });
    }, []);

    const handleButtonClick = (name) => {

        const pollData = {
            pollName: name,

        };
        fetch(`http://localhost:5000/poll/address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pollData),
        })
            .then(response => {
                if (!response.ok) {
                    // Handle non-200 status codes
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle the response data
                console.log('Response from request:', data.name);
                navigate(`/poll/${data.name}`);
            })
            .catch(error => {
                console.error('Error making request:', error);
                throw new Error(error);
            });
    };
    return (
        <div className='full-screen-div-polls'>
            <div className='container centered poll-div '>
                <p className='my-polls-margin' > <strong>My polls</strong> </p>
                <hr className='hr-margin'></hr>

                {items.map((item, index) => {
                    const buttonColor = index % 3 === 0 ? 'blue-background' :
                        index % 3 === 1 ? 'red-background' :
                            'yellow-background';

                    return (
                        <div key={index} className='item'>
                            <Button
                                onClick={() => handleButtonClick(item)}
                                className={`${buttonColor} col-md-12 mt-3`}
                                size='lg'>
                                {item}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}

export default Polls;
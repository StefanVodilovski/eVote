import Bar from '../Components/Bar.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import blockchain from '../media/blockchain.png'
import "../css/Home.css";
import Button from 'react-bootstrap/Button';


function Home() {
    return (
        <div className='background '>
            <div className='container full-screen-div  '>
                <div className='row '>
                    <div className='col-md-3'>
                        <img src={blockchain} alt="blockchain app" />
                    </div>
                    <div className='col-md-4 mx-auto  vertical-center ml-5'>
                        <div className='row'>
                            <p className='centered first-paragraph '>Be part of the <strong>Blockchain</strong> future </p>
                        </div>
                        <div className='row mt-3'>
                            <p className='centered second-third-paragraph '>Using blockchain technology <strong>eVote</strong> provides you with a platform for safe, anonymous voting.</p>
                        </div>
                        <div className='row mt-3'>
                            <p className='centered second-third-paragraph'> Be part of the future and start voting online!  </p>
                        </div>
                        <div className='row mt-3'>
                            <Button href='/CreatePoll' className='col-md-4 btn-background btn-create-poll' variant="primary">Create poll</Button>{' '}
                            <Button href='/Polls' className='col-md-4 btn-background btn-create-poll' variant="primary">Go to poll</Button>{' '}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;
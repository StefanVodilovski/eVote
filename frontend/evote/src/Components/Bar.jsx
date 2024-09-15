import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/nav-color.css";
import profile from '../media/profile.png';
import vote from '../media/positive-vote.png';

function Bar() {
    return (
        <Navbar expand="lg" className="custom-navbar" data-bs-theme="dark" >
            <Container>
                <Navbar.Brand href="/Home"><img src={vote} alt="brand_img" className="acc-img " /></Navbar.Brand>
                <Navbar.Brand href="/Home">eVote</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav ">
                    <Nav className="ms-auto align-items-center d-flex">
                        <Nav.Link href="/Polls" className="ms-3">Polls</Nav.Link>
                        <Nav.Link href="/CreatePoll" className="ms-3">Add poll</Nav.Link>
                        <Nav.Link href="/Home" className="ms-3" >
                            <img className="acc-img" src={profile} alt="account image" />
                        </Nav.Link>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Bar;
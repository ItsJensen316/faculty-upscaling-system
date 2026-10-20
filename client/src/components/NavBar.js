import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function NavBar({children}) {
  const navigate = useNavigate();
  console.log("navbarrrrrrrrrrrrrr")
  return (
    <Navbar bg='dark' variant='dark' collapseOnSelect expand="lg" >
      <Container>
        <Navbar.Brand className='font-semibold cursor-pointer' onClick={() => navigate('/')}>🔖SkillPathway</Navbar.Brand>
        {children}
      </Container>
    </Navbar>
  );
}

export default NavBar;
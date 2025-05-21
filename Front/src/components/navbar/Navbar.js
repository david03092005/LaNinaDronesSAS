import '../navbar/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaUserCircle, FaRobot } from 'react-icons/fa';
import { getRecord } from '../../redux/historialSlice';
import { useNavigate } from "react-router-dom";

function NavbarComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    dispatch(getRecord(data));
    navigate('/Historial');
  }

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
        <Nav className="me-auto">
          <Nav.Link onClick={() => navigate('/Inicio')}>
            <FaRobot size={30} />
          </Nav.Link>
          <Nav.Link onClick={() => navigate('/Agendar')}>Agendar</Nav.Link>
          <Nav.Link onClick={() => navigate('/Robots')}>Robots</Nav.Link>
          <Nav.Link onClick={handleSubmit}>Historial</Nav.Link>
          <Nav.Link onClick={() => navigate('/Usuarios')}>Usuarios</Nav.Link>
        </Nav>
        <Nav.Link onClick={() => navigate('/')} className="perfil-link">
          <FaUserCircle size={40} />
        </Nav.Link>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;

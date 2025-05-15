import '../navbar/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaUserCircle, FaRobot } from 'react-icons/fa';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
        <Nav className="me-auto">
          <Nav.Link href="/Inicio">
            <FaRobot size={30} />
          </Nav.Link>
          <Nav.Link href="/Agendar">Agendar</Nav.Link>
          <Nav.Link href="/Robots">Robots</Nav.Link>
          <Nav.Link href="/Historial">Historial</Nav.Link>
          <Nav.Link href="/Usuarios">Usuarios</Nav.Link>
        </Nav>
        <Nav.Link href="/" className="perfil-link">
          <FaUserCircle size={40} />
        </Nav.Link>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;

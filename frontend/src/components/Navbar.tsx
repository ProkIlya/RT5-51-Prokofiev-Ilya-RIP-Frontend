import type { FC} from 'react';
import { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../Routes';

export const NavigationBar: FC = () => {
  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg" className="mb-0" style={{ borderBottom: '1px solid #e2e3e3' }}>
      <Container fluid style={{ padding: '0 20px' }}>
        {/* Название сайта слева */}
        <Navbar.Brand as={Link} to={ROUTES.HOME} className="fw-bold">
          Tesla Charge Calculator
          <Nav.Link 
              as={Link} 
              to={ROUTES.SCENARIOS}
              className={location.pathname === ROUTES.SCENARIOS ? 'active fw-bold' : ''}
            ></Nav.Link>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Страницы слева */}
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to={ROUTES.SCENARIOS}
              className={location.pathname === ROUTES.SCENARIOS ? 'active fw-bold' : ''}
            >
              Сценарии
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
import type { FC } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/userSlice';
import { clearDraft } from '../store/draftTripSlice';
import { setSearch, setType } from '../store/filtersSlice';
import { ROUTES } from '../Routes';

export const NavigationBar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  //const { cartCount, tripId } = useAppSelector((state) => state.draftTrip);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearDraft());
    dispatch(setSearch(''));
    dispatch(setType(''));
    navigate(ROUTES.HOME);
  };

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE);
  };

  /*const handleCartClick = () => {
    if (tripId) {
      // Используем ROUTES.DRAFT_TRIP и заменяем :tripId на реальный ID
      const draftTripPath = ROUTES.DRAFT_TRIP.replace(':tripId', tripId.toString());
      navigate(draftTripPath);
    }
  };*/


  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      fixed="top"
      className="mb-0" 
      style={{ 
        borderBottom: '1px solid #e2e3e3',
        zIndex: 1030
      }}
    >
      <Container fluid style={{ padding: '0 20px' }}>
        <Navbar.Brand as={Link} to={ROUTES.HOME} className="fw-bold">
          Tesla Charge Calculator
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to={ROUTES.SCENARIOS}
              className={location.pathname === ROUTES.SCENARIOS ? 'active fw-bold' : ''}
            >
              Сценарии
            </Nav.Link>
            
            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to={ROUTES.TRIPS}
                className={location.pathname === ROUTES.TRIPS ? 'active fw-bold' : ''}
              >
                Мои поездки
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center">
            {isAuthenticated ? (
              <>
                
                
                <Nav.Item className="d-flex align-items-center">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handleProfileClick}
                    className="me-2"
                  >
                    {user?.login}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    Выход
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to={ROUTES.LOGIN}
                  className={location.pathname === ROUTES.LOGIN ? 'active fw-bold' : ''}
                >
                  Вход
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to={ROUTES.REGISTER}
                  className={location.pathname === ROUTES.REGISTER ? 'active fw-bold' : ''}
                >
                  Регистрация
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
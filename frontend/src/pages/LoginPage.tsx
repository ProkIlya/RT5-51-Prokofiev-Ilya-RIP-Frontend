import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/userSlice';
import { ROUTES } from '../Routes';
import './LoginPage.css';

export const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.SCENARIOS);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (login && password) {
      await dispatch(loginUser({ login, password }));
    }
  };

  return (
    <Container className="login-container">
      <Card className="login-card">
        <Card.Body>
          <h2 className="login-title">Вход в систему</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Войти'}
            </Button>

            <div className="text-center mt-3">
              <span>Нет аккаунта? </span>
              <Link to={ROUTES.REGISTER} className="login-link">
                Зарегистрироваться
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
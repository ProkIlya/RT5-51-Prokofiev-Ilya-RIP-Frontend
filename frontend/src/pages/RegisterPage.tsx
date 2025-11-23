import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError } from '../store/userSlice';
import { ROUTES } from '../Routes';
import './RegisterPage.css';

export const RegisterPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    if (login && password) {
      await dispatch(registerUser({ login, password }));
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <Container className="register-container">
      <Card className="register-card">
        <Card.Body>
          <h2 className="register-title">Регистрация</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="register-form">
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

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                isInvalid={password !== confirmPassword && confirmPassword !== ''}
              />
              <Form.Control.Feedback type="invalid">
                Пароли не совпадают
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="register-btn"
              disabled={loading || password !== confirmPassword}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Зарегистрироваться'}
            </Button>

            <div className="text-center mt-3">
              <span>Уже есть аккаунт? </span>
              <Link to={ROUTES.LOGIN} className="register-link">
                Войти
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
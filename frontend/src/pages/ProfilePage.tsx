import { useState } from 'react';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUserProfile } from '../store/userSlice';
import './ProfilePage.css';

export const ProfilePage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      await dispatch(updateUserProfile({ password }));
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <Card.Body>
          <h2 className="profile-header">Личный кабинет</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="user-info-section">
            <h5>Информация о пользователе</h5>
            <p><strong>Логин:</strong> {user?.login}</p>
            <p><strong>Роль:</strong> {user?.is_moderator ? 'Модератор' : 'Пользователь'}</p>
          </div>

          <hr />

          <div className="password-section">
            <h5>Смена пароля</h5>
            <Form onSubmit={handleSubmit} className="password-form">
              <Form.Group className="mb-3">
                <Form.Label>Новый пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Подтверждение пароля</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                className="password-btn"
                disabled={loading || !password || password !== confirmPassword}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Сменить пароль'}
              </Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
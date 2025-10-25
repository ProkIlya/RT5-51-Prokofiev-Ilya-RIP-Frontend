import type{ FC } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes';

export const HomePage: FC = () => {
  return (
    <div style={{ padding: 0, margin: 0 }}>
      {/* Герой-секция с фоновой картинкой */}
      <div 
        style={{
          backgroundImage: 'url(/tesla-menu.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
          position: 'relative'
        }}
      >
        {/* Затемнение фона для лучшей читаемости текста */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Tesla Charge Calculator
          </h1>
          <p style={{ 
            fontSize: '1.5rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Рассчитайте расход заряда вашего Tesla в различных условиях движения
          </p>
        </div>
      </div>

      {/* Карточки под герой-секцией */}
      <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Row>
          <Col md={4} className="mb-4">
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Card.Title>Сценарии движения</Card.Title>
                <Card.Text>
                  Выберите из готовых сценариев движения или создайте свой собственный
                </Card.Text>
                <div style={{ color: '#6c757d' }}>Перейдите в раздел "Сценарии"</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Card.Title>Расчет заряда</Card.Title>
                <Card.Text>
                  Точный расчет оставшегося заряда батареи с учетом всех параметров
                </Card.Text>
                <div style={{ color: '#6c757d' }}>Скоро будет доступно</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Card.Title>Планирование поездок</Card.Title>
                <Card.Text>
                  Создавайте и сохраняйте маршруты для будущих поездок
                </Card.Text>
                <div style={{ color: '#6c757d' }}>Скоро будет доступно</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
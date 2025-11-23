import { Carousel, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import { ROUTES } from '../Routes';
import type { FC } from 'react';
import './HomePage.css'; // Добавляем импорт CSS
import teslaMenuImage from "../assets/tesla-menu.jpg"

export const HomePage: FC = () => {
  const carouselItems = [
    {
      cards: [
        {
          title: "Сценарии",
          description: "Выбирайте готовые сценарии езды для поездок",
          action: "Перейти к сценариям",
          link: "#" // ROUTES.SCENARIOS 
        },
        {
          title: "Поездки", 
          description: "Настраивайте и формируйте поездки для расчета оставшегося заряда",
          action: "Перейти к поездкам",
          link: "#" // ROUTES.TRIPS
        },
        {
          title: "Просмотр поездок",
          description: "Просматривайте оставшийся заряд предыдущих поездок",
          action: "Перейти к истории",
          link: "#" // ROUTES.TRIPS_TABLE
        }
      ]
    },
    {
      cards: [
        {
          title: "Авторизация",
          description: "Авторизуйтесь, чтобы формировать поездки",
          action: "Войти в систему",
          link: "#" // ROUTES.LOGIN
        },
        {
          title: "Регистрация",
          description: "Зарегистрируйтесь, чтобы рассчитывать заряды поездок",
          action: "Зарегистрироваться",
          link: "#" // ROUTES.REGISTER
        },
        {
          title: "Личный кабинет",
          description: "Просматривайте информацию о себе в личном кабинете",
          action: "Перейти в кабинет",
          link: "#" // ROUTES.PROFILE
        }
      ]
    }
  ];

  // Останавливаем всплытие события, чтобы карусель не переключалась
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div style={{ padding: 0, margin: 0 }}>
      {/* Герой-секция с CSS классами */}
      <div 
        className="hero-section"
        style={{ backgroundImage: `url(${teslaMenuImage})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Tesla Charge Calculator
          </h1>
          <p className="hero-subtitle">
            Рассчитайте расход заряда вашей Tesla в различных условиях движения
          </p>
        </div>
      </div>

      {/* Карусель с карточками */}
      <Container className="carousel-container">
        <Carousel 
          indicators={true} 
          interval={5000} 
          controls={true}
          // Отключаем переключение при клике на слайд
          onClick={() => {}}
        >
          {carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <Row>
                {item.cards.map((card, cardIndex) => (
                  <Col md={4} className="mb-4" key={cardIndex}>
                    <Card 
                      style={{ height: '100%' }}
                      onClick={handleCardClick}
                    >
                      <Card.Body>
                        <Card.Title>{card.title}</Card.Title>
                        <Card.Text>{card.description}</Card.Text>
                        {card.link !== "#" ? (
                          <Link 
                            to={card.link}
                            onClick={handleCardClick}
                            style={{ 
                              color: '#3E6AE1',
                              textDecoration: 'none',
                              fontWeight: 'bold',
                              display: 'block',
                              marginTop: '10px'
                            }}
                          >
                            {card.action}
                          </Link>
                        ) : (
                          <div style={{ 
                            color: '#6c757d',
                            marginTop: '10px'
                          }}>
                            {card.action}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};
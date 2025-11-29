import { useEffect, useState } from 'react';
import { Container, Button, Form, Row, Col, Spinner, Alert, Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getTrips } from '../store/tripsSlice';
import './TripsPage.css';
import { BreadCrumbs } from '../components/BreadCrumbs';

export const TripsPage = () => {
  const dispatch = useAppDispatch();
  const { trips, loading, error } = useAppSelector((state) => state.trips);
  const { user } = useAppSelector((state) => state.user);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    const filters: any = {};
    if (statusFilter) filters.status = statusFilter;
    if (dateFrom) filters.date_from = dateFrom;
    if (dateTo) filters.date_to = dateTo;
    
    dispatch(getTrips(filters));
  };

  const getStatusVariant = (status: string = '') => {
    switch (status) {
      case 'черновик': return 'secondary';
      case 'сформирован': return 'warning';
      case 'завершён': return 'success';
      case 'отклонён': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string = '') => {
    if (!dateString) return '-';
    
    // Если дата в формате "dd.mm.yyyy"
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.');
      return new Date(`${year}-${month}-${day}`).toLocaleDateString('ru-RU');
    }
    
    // Если дата в ISO формате
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Container className="trips-container">
      <div style={{ marginBottom: '20px' }}>
        <BreadCrumbs />
      </div>
      <h2 className="trips-header">
        {user?.is_moderator ? 'Все поездки' : 'Мои поездки'}
      </h2>

      {/* Фильтры */}
      <Card className="filters-card">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Статус</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Все статусы</option>
                  <option value="сформирован">Сформирован</option>
                  <option value="завершён">Завершён</option>
                  <option value="отклонён">Отклонён</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Дата с</Form.Label>
                <Form.Control
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Дата по</Form.Label>
                <Form.Control
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="primary" onClick={loadTrips} className="w-100">
                Применить
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="trips-cards">
          {/* Шапка таблицы - видна только на десктопе */}
          <div className="trip-table-header d-none d-md-grid">
            <div className="trip-header-item">ID поездки</div>
            <div className="trip-header-item">Статус</div>
            <div className="trip-header-item">Начальный заряд (кВт⋅ч)</div>
            <div className="trip-header-item">Остаток заряда (кВт⋅ч)</div>
            <div className="trip-header-item">Дата создания</div>
            <div className="trip-header-item">Дата отправки</div>
            <div className="trip-header-item">Дата завершения</div>
            <div className="trip-header-item">Действия</div>
          </div>
          
          {trips.map((trip) => (
            <div className="trip-card d-md-grid" key={trip.id}>
              {/* Мобильный заголовок */}
              <div className="trip-card-header d-md-none">
                <div className="trip-card-title">
                  <h4>Поездка #{trip.id}</h4>
                  <Badge bg={getStatusVariant(trip.status)} className="status-badge">
                    {trip.status}
                  </Badge>
                </div>
                {user?.is_moderator && (
                  <div className="trip-creator">
                    Создатель: {trip.creator_login}
                  </div>
                )}
              </div>
              
              {/* Содержимое - одинаковое для мобильных и десктопа, но по-разному отображается */}
              <div className="trip-card-content">
                {/* ID поездки */}
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">ID поездки:</span>
                  <span className="trip-info-value">#{trip.id}</span>
                </div>
                
                {/* Статус */}
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Статус:</span>
                  <span className="trip-info-value">
                    <Badge bg={getStatusVariant(trip.status)} className="status-badge">
                      {trip.status}
                    </Badge>
                  </span>
                </div>
                
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Начальный заряд (кВт⋅ч):</span>
                  <span className="trip-info-value">{trip.start_charge ? `${trip.start_charge}` : '-'}</span>
                </div>
                
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Остаток заряда (кВт⋅ч):</span>
                  <span className="trip-info-value">{trip.remaining_charge ? `${trip.remaining_charge}` : '-'}</span>
                </div>
                
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Дата создания:</span>
                  <span className="trip-info-value">{formatDate(trip.created_at)}</span>
                </div>
                
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Дата отправки:</span>
                  <span className="trip-info-value">{trip.submitted_at ? formatDate(trip.submitted_at) : '-'}</span>
                </div>
                
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Дата завершения:</span>
                  <span className="trip-info-value">{trip.completed_at ? formatDate(trip.completed_at) : '-'}</span>
                </div>
                
                <div className="trip-card-actions">
                  <Link to={`/trips/${trip.id}`}>
                    <Button variant="outline-primary" size="sm">
                      Просмотреть
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && trips.length === 0 && (
        <Alert variant="info" className="no-trips-alert text-center">
          Поездки не найдены
        </Alert>
      )}
    </Container>
  );
};
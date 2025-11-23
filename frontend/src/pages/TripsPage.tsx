import { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Row, Col, Spinner, Alert, Badge, Card } from 'react-bootstrap';
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
        <div className="trips-table">
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Начальный заряд</th>
                <th>Остаток заряда</th>
                <th>Дата создания</th>
                <th>Дата отправки</th>
                <th>Дата завершения</th>
                {user?.is_moderator && <th>Создатель</th>}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>
                    <Link 
                      to={`/trips/${trip.id}`}
                      style={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      {trip.id}
                    </Link>
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(trip.status)} className="status-badge">
                      {trip.status}
                    </Badge>
                  </td>
                  <td>{trip.start_charge ? `${trip.start_charge} кВт⋅ч` : '-'}</td>
                  <td>{trip.remaining_charge ? `${trip.remaining_charge} кВт⋅ч` : '-'}</td>
                  <td>{formatDate(trip.created_at)}</td>
                  <td>{trip.submitted_at ? formatDate(trip.submitted_at) : '-'}</td>
                  <td>{trip.completed_at ? formatDate(trip.completed_at) : '-'}</td>
                  {user?.is_moderator && <td>{trip.creator_login}</td>}
                  <td>
                    <Link to={`/trips/${trip.id}`}>
                      <Button variant="outline-primary" size="sm">
                        Просмотреть
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
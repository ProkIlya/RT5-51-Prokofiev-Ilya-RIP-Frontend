import { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Button, Form, Row, Col, Spinner, Alert, Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getTrips, reviewTrip } from '../store/tripsSlice';
import './TripsPage.css';
import { BreadCrumbs } from '../components/BreadCrumbs';

export const TripsPage = () => {
  const dispatch = useAppDispatch();
  const { trips, loading, backgroundLoading, error } = 
    useAppSelector((state) => state.trips);
  const { user } = useAppSelector((state) => state.user);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');
  const [appliedCreatorFilter, setAppliedCreatorFilter] = useState('');
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  // Функция для загрузки поездок
  const loadTrips = useCallback((background: boolean = false, applyCreatorFilter: boolean = false) => {
    const filters: any = {};
    if (statusFilter) filters.status = statusFilter;
    if (dateFrom) filters.date_from = dateFrom;
    if (dateTo) filters.date_to = dateTo;
    
    dispatch(getTrips({ ...filters, background }));
    
    if (!background) {
      setIsApplyingFilters(true);
      setTimeout(() => setIsApplyingFilters(false), 1000);
      
      // Применяем фильтр по создателю только после загрузки данных
      if (applyCreatorFilter) {
        setAppliedCreatorFilter(creatorFilter);
      }
    }
  }, [statusFilter, dateFrom, dateTo, creatorFilter, dispatch]);

  // Эффект для инициализации и ручной загрузки
  useEffect(() => {
    loadTrips(false, false); // Первая загрузка - не фоновая, без фильтра по создателю
  }, []);

  // Эффект для short polling (только для модератора)
  useEffect(() => {
    if (user?.is_moderator) {
      // Запускаем polling каждые 5 секунд
      pollingRef.current = setInterval(() => {
        loadTrips(true, false); // Фоновая загрузка
      }, 5000);
      
      // Очистка при размонтировании
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    }
  }, [user?.is_moderator, loadTrips]);

  const handleReviewTrip = async (tripId: number, action: 'complete' | 'reject') => {
    try {
      await dispatch(reviewTrip({ tripId, action })).unwrap();
      // Для модератора polling обновит список автоматически
      // Для обычного пользователя нужно перезагрузить список
      if (!user?.is_moderator) {
        loadTrips(false, false);
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
    }
  };

  const getStatusVariant = (status: string = '') => {
    switch (status) {
      case 'сформирован': return 'warning';
      case 'завершён': return 'success';
      case 'отклонён': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string = '') => {
    if (!dateString) return '-';
    
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.');
      return new Date(`${year}-${month}-${day}`).toLocaleDateString('ru-RU');
    }
    
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  // Получаем уникальных создателей для фильтра
  const creators = Array.from(new Set(trips.map(trip => trip.creator_login)));

  // Фильтруем поездки по примененному фильтру создателя
  const filteredTrips = appliedCreatorFilter 
    ? trips.filter(trip => trip.creator_login === appliedCreatorFilter)
    : trips;

  const gridClass = user?.is_moderator ? 'moderator' : 'user';
  const gridCardClass = user?.is_moderator ? 'moderator-grid' : 'user-grid';

  return (
    <Container className="trips-container">
      <div style={{ marginBottom: '20px' }}>
        <BreadCrumbs />
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="trips-header">
          {user?.is_moderator ? 'Все поездки' : 'Мои поездки'}
        </h2>
      </div>

      {/* Фильтры */}
      <Card className="filters-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Статус</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            {user?.is_moderator && (
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Водитель</Form.Label>
                  <Form.Select
                    value={creatorFilter}
                    onChange={(e) => setCreatorFilter(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Все водители</option>
                    {creators.map(creator => (
                      <option key={creator} value={creator}>
                        {creator}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
            <Col md={user?.is_moderator ? 12 : 3} className="d-flex align-items-end">
              <div className="d-flex gap-2 w-100">
                <Button 
                  variant="primary" 
                  onClick={() => loadTrips(false, true)} 
                  className="flex-grow-1"
                  disabled={loading}
                >
                  {isApplyingFilters ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Применяем...
                    </>
                  ) : loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Загрузка...
                    </>
                  ) : (
                    'Применить фильтры'
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" dismissible onClose={() => {}}>
          {error}
        </Alert>
      )}

      {loading && trips.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Загрузка поездок...</div>
        </div>
      ) : (
        <div className="trips-cards">
          {/* Шапка таблицы для десктопа */}
          <div className={`trip-table-header d-none d-md-grid ${gridClass}`}>
            <div className="trip-header-item">ID</div>
            <div className="trip-header-item">Статус</div>
            {user?.is_moderator && <div className="trip-header-item">Водитель</div>}
            <div className="trip-header-item">Нач. заряд</div>
            <div className="trip-header-item">Ост. заряд</div>
            <div className="trip-header-item">Создана</div>
            <div className="trip-header-item">Отправлена</div>
            <div className="trip-header-item">Завершена</div>
            <div className="trip-header-item">Действия</div>
          </div>
          
          {filteredTrips.map((trip) => (
            <div className={`trip-card d-md-grid ${gridCardClass}`} key={trip.id}>
              {/* Мобильный заголовок */}
              <div className="trip-card-header d-md-none">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4>Поездка #{trip.id}</h4>
                    <Badge bg={getStatusVariant(trip.status)} className="status-badge">
                      {trip.status}
                    </Badge>
                  </div>
                  <Link to={`/trips/${trip.id}`}>
                    <Button variant="outline-primary" size="sm">
                      Просмотреть
                    </Button>
                  </Link>
                </div>
                {user?.is_moderator && (
                  <div className="mt-2 trip-creator">
                    <small>Создатель: {trip.creator_login}</small>
                  </div>
                )}
              </div>
              
              {/* Содержимое для мобильных и десктопа */}
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
                
                {/* Создатель (только для модератора) */}
                {user?.is_moderator && (
                  <div className="trip-info-item">
                    <span className="trip-info-label d-md-none">Создатель:</span>
                    <span className="trip-info-value">{trip.creator_login}</span>
                  </div>
                )}
                
                {/* Начальный заряд */}
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Начальный заряд (кВт⋅ч):</span>
                  <span className="trip-info-value">{trip.start_charge ? `${trip.start_charge}` : '0'}</span>
                </div>
                
                {/* Остаток заряда */}
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Остаток заряда (кВт⋅ч):</span>
                  <span className="trip-info-value">
                    {trip.status === 'завершён' 
                      ? (trip.remaining_charge !== null && trip.remaining_charge !== undefined 
                          ? `${trip.remaining_charge.toFixed(2)}` 
                          : 'расчет...') 
                      : '—'
                    }
                  </span>
                </div>
                
                {/* Дата создания */}
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Дата создания:</span>
                  <span className="trip-info-value">{formatDate(trip.created_at)}</span>
                </div>
                
                {/* Дата отправки */}
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Дата отправки:</span>
                  <span className="trip-info-value">{trip.submitted_at ? formatDate(trip.submitted_at) : '-'}</span>
                </div>
                
                {/* Дата завершения */}
                <div className="trip-info-item">
                  <span className="trip-info-label d-md-none">Дата завершения:</span>
                  <span className="trip-info-value">{trip.completed_at ? formatDate(trip.completed_at) : '-'}</span>
                </div>
                
                {/* Действия */}
                <div className="trip-card-actions">
                  <div className="d-flex">
                    <div className="d-flex flex-column gap-1 w-100">
                      <Link to={`/trips/${trip.id}`}>
                        <Button variant="outline-primary" size="sm" className="w-100">
                          Просмотреть
                        </Button>
                      </Link>
                      
                      {/* Кнопки для модератора */}
                      {user?.is_moderator && trip.status === 'сформирован' && (
                        <div className="d-flex flex-column gap-1">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => {
                              if (trip.id !== undefined) {
                                handleReviewTrip(trip.id, 'complete');
                              }
                            }}
                            disabled={loading}
                            className="w-100"
                          >
                            Завершить
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => {
                              if (trip.id !== undefined) {
                                handleReviewTrip(trip.id, 'reject');
                              }
                            }}
                            disabled={loading}
                            className="w-100"
                          >
                            Отклонить
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredTrips.length === 0 && (
        <Alert variant="info" className="no-trips-alert text-center">
          Поездки не найдены
        </Alert>
      )}
    </Container>
  );
};
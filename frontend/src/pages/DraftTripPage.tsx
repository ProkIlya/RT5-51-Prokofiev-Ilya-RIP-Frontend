import { useEffect, useState } from 'react';
import { Container, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getTrip, updateTrip, submitTrip, deleteTrip } from '../store/tripsSlice';
import { updateTripScenario, removeScenarioFromTrip } from '../store/draftTripSlice';
import { ROUTES } from '../Routes';
import './DraftTripPage.css';
import defaultImage from "../assets/default-scenario.jpg";
import { BreadCrumbs } from '../components/BreadCrumbs';

export const DraftTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTrip, loading, error } = useAppSelector((state) => state.trips);
  const { user } = useAppSelector((state) => state.user);
  
  const [startCharge, setStartCharge] = useState(0);
  const [editingDurations, setEditingDurations] = useState<{ [key: number]: number }>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Безопасное преобразование tripId в число
  const numericTripId = tripId ? parseInt(tripId, 10) : null;

  useEffect(() => {
    if (numericTripId && !isNaN(numericTripId)) {
      dispatch(getTrip(numericTripId));
    }
  }, [numericTripId, dispatch]);

  useEffect(() => {
    if (currentTrip) {
      setStartCharge(currentTrip.start_charge || 0);
      const durations: { [key: number]: number } = {};
      currentTrip.scenarios?.forEach((item: any) => {
        durations[item.scenario_id] = item.duration || 0;
      });
      setEditingDurations(durations);
      setHasUnsavedChanges(false);
    }
  }, [currentTrip]);

  const isDraft = currentTrip?.status === 'черновик';
  const isOwner = currentTrip?.creator_login === user?.login;

  const handleSaveTrip = async () => {
    if (!numericTripId || !currentTrip) return;

    setIsSubmitting(true);
    try {
      // Сохраняем начальный заряд
      await dispatch(updateTrip({ 
        tripId: numericTripId, 
        start_charge: startCharge 
      })).unwrap();

      // Сохраняем все измененные длительности сценариев
      const updatePromises = Object.entries(editingDurations).map(([scenarioId, duration]) => {
        const scenario = currentTrip.scenarios?.find((s: any) => s.scenario_id === parseInt(scenarioId));
        if (scenario && scenario.duration !== duration) {
          return dispatch(updateTripScenario({
            tripId: numericTripId,
            scenarioId: parseInt(scenarioId),
            duration
          })).unwrap();
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Обновляем данные после сохранения
      await dispatch(getTrip(numericTripId)).unwrap();
      setHasUnsavedChanges(false);
      
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTrip = async () => {
    if (!numericTripId) return;

    if (hasUnsavedChanges) {
      alert('Пожалуйста, сначала сохраните изменения перед формированием поездки');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(submitTrip(numericTripId)).unwrap();
      navigate(ROUTES.TRIPS);
    } catch (error) {
      console.error('Ошибка формирования поездки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (numericTripId) {
      await dispatch(deleteTrip(numericTripId));
      navigate(ROUTES.TRIPS);
    }
  };

  const handleDurationChange = (scenarioId: number, duration: number) => {
    setEditingDurations(prev => ({
      ...prev,
      [scenarioId]: duration
    }));
    setHasUnsavedChanges(true);
  };

  const handleStartChargeChange = (value: number) => {
    setStartCharge(value);
    setHasUnsavedChanges(true);
  };

  const handleRemoveScenario = async (scenarioId: number) => {
    if (numericTripId) {
      await dispatch(removeScenarioFromTrip({
        tripId: numericTripId,
        scenarioId
      }));
      // Обновляем данные после удаления
      dispatch(getTrip(numericTripId));
      setHasUnsavedChanges(true);
    }
  };

  // Проверка на неверный tripId
  if (tripId && isNaN(parseInt(tripId, 10))) {
    return (
      <Container className="draft-trip-container">
        <Alert variant="danger">Неверный идентификатор поездки</Alert>
        <Link to={ROUTES.TRIPS} className="btn btn-primary">
          Вернуться к поездкам
        </Link>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="draft-trip-container text-center">
        <Spinner animation="border" />
        <div>Загрузка поездки...</div>
      </Container>
    );
  }

  if (!currentTrip) {
    return (
      <Container className="draft-trip-container">
        <Alert variant="danger">Поездка не найдена</Alert>
        <Link to={ROUTES.TRIPS} className="btn btn-primary">
          Вернуться к поездкам
        </Link>
      </Container>
    );
  }

  return (
    <div className="draft-trip-page">
      {/* Хедер удален - используем общий NavigationBar */}

      <Container className="trip-detail-container">
        {/* Хлебные крошки */}
        <div style={{ marginBottom: '20px' }}>
          <BreadCrumbs />
        </div>
      
        {/* Статус заявки */}
        <div className="trip-header">
          <h2>Поездка #{currentTrip.id}</h2>
          <Badge bg={
            currentTrip.status === 'черновик' ? 'secondary' :
            currentTrip.status === 'сформирован' ? 'warning' :
            currentTrip.status === 'завершён' ? 'success' : 'danger'
          }>
            {currentTrip.status}
          </Badge>
          {hasUnsavedChanges && (
            <Badge bg="warning" text="dark" className="ms-2">
              Есть несохраненные изменения
            </Badge>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Основная информация */}
        <div className="trip-info">
          <div className="info-row">
            <Form.Group>
              <Form.Label>Начальный заряд (кВт⋅ч)</Form.Label>
              <Form.Control
                type="number"
                value={startCharge}
                onChange={(e) => handleStartChargeChange(parseFloat(e.target.value))}
                disabled={!isDraft || !isOwner}
                min="0"
                step="1"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Остаток заряда (кВт⋅ч)</Form.Label>
              <Form.Control
                type="text"
                value={currentTrip.remaining_charge ? 
                  `${currentTrip.remaining_charge.toFixed(2)}` : 'Не рассчитан'
                }
                disabled
              />
            </Form.Group>

            {isDraft && isOwner && (
              <div className="trip-actions">
                <Button 
                  variant="primary" 
                  onClick={handleSaveTrip}
                  className="save-btn"
                  disabled={!hasUnsavedChanges || isSubmitting}
                >
                  {isSubmitting ? <Spinner size="sm" /> : 'Сохранить изменения'}
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleSubmitTrip}
                  className="submit-btn"
                  disabled={hasUnsavedChanges || isSubmitting}
                >
                  {isSubmitting ? <Spinner size="sm" /> : 'Сформировать поездку'}
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteTrip}
                  className="delete-btn"
                  disabled={isSubmitting}
                >
                  Удалить поездку
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Список сценариев */}
        <div className="scenarios-list">
          <h3>Сценарии езды в поездке</h3>
          
          {currentTrip.scenarios && currentTrip.scenarios.length > 0 ? (
            currentTrip.scenarios.map((item: any) => (
              <div className="scenario-container" key={item.scenario_id}>
                <div className="scenario-in-trip">
                  <img 
                    src={item.scenario.image_url || defaultImage} 
                    alt={item.scenario.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultImage;
                    }}
                  />
                  <div className="scenario-details">
                    <h4>{item.scenario.name}</h4>
                    <div className="scenario-parameters">
                      {item.scenario.speed !== undefined && item.scenario.speed !== null && (
                        <span className="scenario-parameter">
                          Скорость: {item.scenario.speed} км/ч 
                        </span>
                      )}
                      {item.scenario.aero_coeff !== undefined && item.scenario.aero_coeff !== null &&(
                        <span className="scenario-parameter">
                          Аэродинамика: {item.scenario.aero_coeff} 
                        </span>
                      )}
                      {item.scenario.rolling_coeff !== undefined && item.scenario.rolling_coeff !== null && (
                        <span className="scenario-parameter">
                          Качение: {item.scenario.rolling_coeff} 
                        </span>
                      )}
                      {item.scenario.system_consumption !== undefined && item.scenario.system_consumption !== null && (
                        <span className="scenario-parameter">
                          Потребление: {item.scenario.system_consumption} кВт⋅ч
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="scenario-side">
                  <div className="scenario-side-row">
                    {item.scenario.type === 'дорога' ? (
                      <>
                        <span className="scenario-side-label">Расстояние (км)</span>
                        <Form.Control
                          type="number"
                          value={editingDurations[item.scenario_id] || 0}
                          onChange={(e) => handleDurationChange(
                            item.scenario_id, 
                            parseFloat(e.target.value)
                          )}
                          disabled={!isDraft || !isOwner}
                          min="0"
                          step="1"
                          className="calculation-purpose"
                        />
                      </>
                    ) : (
                      <>
                        <span className="scenario-side-label">Время (ч)</span>
                        <Form.Control
                          type="number"
                          value={editingDurations[item.scenario_id] || 0}
                          onChange={(e) => handleDurationChange(
                            item.scenario_id, 
                            parseFloat(e.target.value)
                          )}
                          disabled={!isDraft || !isOwner}
                          min="0"
                          step="1"
                          className="calculation-purpose"
                        />
                      </>
                    )}
                  </div>
                  
                  {isDraft && isOwner && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveScenario(item.scenario_id)}
                      className="remove-scenario-btn"
                      disabled={isSubmitting}
                    >
                      Удалить сценарий езды
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Alert variant="info">В заявке нет сценариев</Alert>
          )}
        </div>
      </Container>
    </div>
  );
};
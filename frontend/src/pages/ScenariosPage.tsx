import { useEffect } from 'react';
import type { FC } from 'react';
import { Container, Form, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ScenarioCard } from '../components/ScenarioCard';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { CartIcon } from '../components/ScenariosCartIcon';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getScenarios } from '../store/scenariosSlice';
import { getDraftTrip } from '../store/draftTripSlice';
import { setSearch, setType } from '../store/filtersSlice';
import { ROUTES } from '../Routes';
import type { HandlerScenarioResponse } from '../api/Api';
import './ScenariosPage.css';

export const ScenariosPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { scenarios, loading, error } = useAppSelector((state) => state.scenarios);
  const { cartCount, tripId } = useAppSelector((state) => state.draftTrip);
  const filters = useAppSelector((state) => state.filters);
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  // Определяем, является ли пользователь модератором
  const isModerator = user?.is_moderator || false;

  useEffect(() => {
    loadScenarios();
    // Модераторам не загружаем корзину
    if (isAuthenticated && !isModerator) {
      dispatch(getDraftTrip());
    }
  }, [isAuthenticated, isModerator]);

  const loadScenarios = () => {
    dispatch(getScenarios({ 
      name: filters.search, 
      type: filters.type 
    }));
  };

  const handleSearch = () => {
    loadScenarios();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value));
  };

  const handleTypeChange = (value: string) => {
    dispatch(setType(value));
    setTimeout(() => loadScenarios(), 0);
  };

  const handleCartClick = () => {
    // Модераторам недоступна корзина
    if (isModerator) return;
    
    if (cartCount > 0 && isAuthenticated && tripId) {
      // Используем tripId из draftTripSlice для навигации
      navigate(ROUTES.DRAFT_TRIP.replace(':tripId', tripId.toString()));
    }
  };

  const displayCartCount = isModerator ? 0 : cartCount;
  const cartDisabled = isModerator || !isAuthenticated || cartCount === 0 || !tripId;

  return (
    <Container fluid style={{ padding: 0 }}>
      <BreadCrumbs />
      
      {/* Хедер с поиском и корзиной */}
      <div className="search-and-cart">
        <div className="search-wrapper">
          <div className="search-form">
            <Form.Select 
              value={filters.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="">Все типы</option>
              <option value="дорога">Дорога</option>
              <option value="комфорт">Комфорт</option>
            </Form.Select>
            
            <Form.Control
              type="text"
              placeholder="Поиск условий езды..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            
            <Button 
              variant="primary"
              onClick={handleSearch}
              style={{ marginLeft: '10px' }}
            >
              Поиск
            </Button>
          </div>
          
          <CartIcon 
            count={displayCartCount} 
            onClick={handleCartClick}
            disabled={cartDisabled}
          />
        </div>
      </div>

      {error && (
        <Alert variant="danger" style={{ maxWidth: '1200px', margin: '20px auto' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <Spinner animation="border" />
          <div style={{ marginTop: '10px' }}>Загрузка сценариев...</div>
        </div>
      ) : (
        <div className="scenarios-grid">
          {scenarios.map((scenario: HandlerScenarioResponse) => (
            <ScenarioCard 
              key={scenario.id} 
              scenario={scenario} 
              isModerator={isModerator}
              onAddToTrip={() => {
                loadScenarios();
                // Модераторам не обновляем корзину
                if (isAuthenticated && !isModerator) {
                  dispatch(getDraftTrip());
                }
              }}
            />
          ))}
        </div>
      )}

      {!loading && scenarios.length === 0 && (
        <Alert variant="info" style={{ maxWidth: '1200px', margin: '20px auto' }}>
          Сценарии не найдены
        </Alert>
      )}
    </Container>
  );
};
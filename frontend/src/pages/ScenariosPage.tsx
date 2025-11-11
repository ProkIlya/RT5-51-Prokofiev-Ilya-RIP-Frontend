import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Container, Form, Spinner, Alert, Button } from 'react-bootstrap';
import { ScenarioCard } from '../components/ScenarioCard';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { CartIcon } from '../components/ScenariosCartIcon';
import { api } from '../utils/api';
import type { DrivingScenario } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearch, setType } from '../store/filtersSlice';
import './ScenariosPage.css';

export const ScenariosPage: FC = () => {
  const [scenarios, setScenarios] = useState<DrivingScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cartCount, setCartCount] = useState(0);

  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const loadScenarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getScenarios({ 
        search: filters.search,
        type: filters.type 
      });
      setScenarios(data);
    } catch (err) {
      setError('Ошибка загрузки сценариев');
      console.error('Error loading scenarios:', err);
    } finally {
      setLoading(false);
    }
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
    // Автоматически применяем фильтр при изменении типа
    setTimeout(() => loadScenarios(), 0);
  };

  useEffect(() => {
    loadScenarios();
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await api.getCart();
      setCartCount(cartData.count);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

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
    
    <CartIcon count={cartCount} />
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
          {scenarios.map(scenario => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
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
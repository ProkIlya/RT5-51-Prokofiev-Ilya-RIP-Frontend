import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Container, Form, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { ScenarioCard } from '../components/ScenarioCard';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { CartIcon } from '../components/CartIcon';
import { api } from '../utils/api';
import type { DrivingScenario } from '../types';
import './ScenariosPage.css';

export const ScenariosPage: FC = () => {
  const [scenarios, setScenarios] = useState<DrivingScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const loadScenarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getScenarios({ 
        search: searchQuery,
        type: typeFilter 
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

  useEffect(() => {
    loadScenarios();
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await api.getCart();
      setCartCount(cartData.Count);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  return (
    <Container fluid style={{ padding: 0 }}>
      <BreadCrumbs />
      
      {/* Хедер с поиском и корзиной */}
      <div className="search-and-cart">
        <div className="search-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          <Form.Select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="">Все типы</option>
            <option value="дорога">Дорога</option>
            <option value="комфорт">Комфорт</option>
          </Form.Select>
          
          <Form.Control
            type="text"
            placeholder="Поиск условий езды..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ width: '300px' }}
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
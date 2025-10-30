import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Container, Form, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { ScenarioCard } from '../components/ScenarioCard';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { CartIcon } from '../components/ScenariosCartIcon';
import { api } from '../utils/api';
import type { DrivingScenario } from '../types';
import './ScenariosPage.css';

export const ScenariosPage: FC = () => {
  const [scenarios, setScenarios] = useState<DrivingScenario[]>([]);
  const [loadingscenarios, setLoadingscenarios] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchscenariosQuery, setSearchScenariosQuery] = useState('');
  const [ScenarioTypeFilter, setScenarioTypeFilter] = useState('');
  const [scenariocartCount, setScenariosCartCount] = useState(0);

  const loadScenarios = async () => {
    setLoadingscenarios(true);
    setError('');
    try {
      const data = await api.getScenarios({ 
        search: searchscenariosQuery,
        type: ScenarioTypeFilter 
      });
      setScenarios(data);
    } catch (err) {
      setError('Ошибка загрузки сценариев');
      console.error('Error loading scenarios:', err);
    } finally {
      setLoadingscenarios(false);
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
      setScenariosCartCount(cartData.count);
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
            value={ScenarioTypeFilter}
            onChange={(e) => setScenarioTypeFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="">Все типы</option>
            <option value="дорога">Дорога</option>
            <option value="комфорт">Комфорт</option>
          </Form.Select>
          
          <Form.Control
            type="text"
            placeholder="Поиск условий езды..."
            value={searchscenariosQuery}
            onChange={(e) => setSearchScenariosQuery(e.target.value)}
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
        
        <CartIcon count={scenariocartCount} />
      </div>

      {error && (
        <Alert variant="danger" style={{ maxWidth: '1200px', margin: '20px auto' }}>
          {error}
        </Alert>
      )}

      {loadingscenarios ? (
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

      {!loadingscenarios && scenarios.length === 0 && (
        <Alert variant="info" style={{ maxWidth: '1200px', margin: '20px auto' }}>
          Сценарии не найдены
        </Alert>
      )}
    </Container>
  );
};
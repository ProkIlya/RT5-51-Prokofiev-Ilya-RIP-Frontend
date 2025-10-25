import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Container, Form, Spinner, Alert } from 'react-bootstrap';
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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadScenarios();
    loadCart();
  }, [searchQuery]);

  const loadScenarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getScenarios({ search: searchQuery });
      setScenarios(data);
    } catch (err) {
      setError('Ошибка загрузки сценариев');
      console.error('Error loading scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await api.getCart();
      setCartCount(cartData.Count);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Container fluid style={{ padding: 0 }}>
      <BreadCrumbs />
      
      {/* Хедер с поиском и корзиной */}
      <div className="search-and-cart">
        <Form className="search-form" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Form.Control
            type="text"
            placeholder="Поиск условий езды..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '50%',
              maxWidth: '400px',
              padding: '10px',
              border: '1px solid #e2e3e3',
              borderRadius: '4px',
              marginRight: '10px'
            }}
          />
        </Form>
        
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
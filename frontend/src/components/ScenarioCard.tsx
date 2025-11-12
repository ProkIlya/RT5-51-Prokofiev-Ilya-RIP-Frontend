import type { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { DrivingScenario } from '../types';
//import { getImageUrl } from '../utils/api';

interface ScenarioCardProps {
  scenario: DrivingScenario;
}

export const ScenarioCard: FC<ScenarioCardProps> = ({ scenario }) => {
  const defaultImage = './default-scenario.jpg';

  return (
    <Card 
      className="h-100 scenario-card" 
      style={{ 
        backgroundColor: '#eee', 
        border: '1px solid #d1d1d1',
        transition: 'transform 0.2s ease-in-out',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
       <Link to={`${scenario.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card.Img 
          variant="top" 
          src={scenario.image_url || defaultImage} // src={scenario.image_url || defaultImage} 
          style={{ 
            height: '200px', 
            objectFit: 'cover',
            backgroundColor: '#f8f9fa'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <Card.Body className="d-flex flex-column" style={{ flex: 1 }}>
          <Card.Title style={{ color: '#171A20', fontSize: '1.25rem' }}>
            {scenario.name}
          </Card.Title>
          
          {/* Параметры в зависимости от типа сценария */}
          {scenario.type === 'дорога' ? (
            <div className="mt-auto">
              <div className="mb-1">
                <small style={{ color: '#171A20' }}>
                  <strong>Скорость:</strong> {scenario.speed} км/ч
                </small>
              </div>
              <div className="mb-1">
                <small style={{ color: '#171A20' }}>
                  <strong>Аэродинамика:</strong> {scenario.aero_coeff}
                </small>
              </div>
              <div className="mb-1">
                <small style={{ color: '#171A20' }}>
                  <strong>Качение:</strong> {scenario.rolling_coeff}
                </small>
              </div>
            </div>
          ) : (
            <div className="mb-1" style={{ marginTop: 'auto' }}>
              <small style={{ color: '#171A20' }}>
                <strong>Потребление:</strong> {scenario.system_consumption} кВт
              </small>
            </div>
          )}
        </Card.Body>
      </Link>
      
      {/* Кнопка добавления - всегда внизу без границы */}
      <div style={{ padding: '15px', paddingTop: '0' }}>
        <Button 
          style={{ 
            backgroundColor: '#3E6AE1', 
            borderColor: '#3E6AE1',
            opacity: 0.5,
            cursor: 'not-allowed',
            width: '100%'
          }}
          disabled
        >
          Добавить в поездку
        </Button>
      </div>
    </Card>
  );
};
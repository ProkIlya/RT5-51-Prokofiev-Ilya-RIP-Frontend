import { useState, useEffect } from 'react';
import type { FC} from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { api, getImageUrl } from '../utils/api';
import type { DrivingScenario } from '../types';
import { ROUTES } from '../Routes';
import './ScenarioDetailPage.css';
import defaultImage from "../assets/default-scenario.jpg"

export const ScenarioDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scenario, setScenario] = useState<DrivingScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  //const defaultImage = '/default-scenario.jpg';
  
  useEffect(() => {
    if (id) {
      loadScenario(parseInt(id));
    }
  }, [id]);

  const loadScenario = async (scenarioId: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getScenario(scenarioId);
      setScenario(data);
    } catch (err) {
      setError('Ошибка загрузки сценария');
      console.error('Error loading scenario:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="scenario-detail-loading">
        <Spinner animation="border" />
        <div>Загрузка сценария...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Link to={ROUTES.SCENARIOS} className="btn btn-primary">
          Вернуться к списку сценариев
        </Link>
      </Container>
    );
  }

  if (!scenario) {
    return (
      <Container>
        <Alert variant="warning">Сценарий не найден</Alert>
        <Link to={ROUTES.SCENARIOS} className="btn btn-primary">
          Вернуться к списку сценариев
        </Link>
      </Container>
    );
  }

  return (
    <Container className="scenario-detail-container">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <BreadCrumbs />
      </div>

      <div className="scenario-detail">
        <img 
          src={getImageUrl(scenario.image_url)} 
          alt={scenario.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <h1>{scenario.name}</h1>
        <p className="description">{scenario.description}</p>

        <div className="parameters">
          {scenario.type === 'дорога' ? (
            <>
              <div className="parameter">
                <span className="name">Скорость:</span>
                <span className="value">{scenario.speed} км/ч</span>
                <p className="description">Средняя скорость движения.</p>
              </div>
              <div className="parameter">
                <span className="name">Коэффициент аэродинамического сопротивления:</span>
                <span className="value">{scenario.aero_coeff}</span>
                <p className="description">Зависит от качества дороги, наличия груза сверху или прицепа.</p>
              </div>
              <div className="parameter">
                <span className="name">Коэффициент сопротивления качению:</span>
                <span className="value">{scenario.rolling_coeff}</span>
                <p className="description">Зависит от качества дороги. Для идеального асфальта - 0.005, для песка или грунта - 0.3.</p>
              </div>
            </>
          ) : (
            <div className="parameter">
              <span className="name">Мощность потребления систем:</span>
              <span className="value">{scenario.system_consumption} кВт</span>
              <p className="description">Мощность потребления заряда систем комфорта: кондиционер, обогрев и прочее.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
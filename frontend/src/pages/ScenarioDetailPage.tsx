import { useEffect } from 'react';
import type { FC} from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getScenario, clearCurrentScenario } from '../store/scenariosSlice';
import { ROUTES } from '../Routes';
import './ScenarioDetailPage.css';
import defaultImage from "../assets/default-scenario.jpg"

export const ScenarioDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentScenario, loading, error } = useAppSelector((state) => state.scenarios);
  
  useEffect(() => {
    if (id) {
      dispatch(getScenario(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentScenario());
    };
  }, [id, dispatch]);

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

  if (!currentScenario) {
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
          src={currentScenario.image_url || defaultImage} 
          alt={currentScenario.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <h1>{currentScenario.name}</h1>
        <p className="description">{currentScenario.description}</p>

        <div className="parameters">
          {currentScenario.type === 'дорога' ? (
            <>
              <div className="parameter">
                <span className="name">Скорость:</span>
                <span className="value">{currentScenario.speed} км/ч</span>
                <p className="description">Средняя скорость движения.</p>
              </div>
              <div className="parameter">
                <span className="name">Коэффициент аэродинамического сопротивления:</span>
                <span className="value">{currentScenario.aero_coeff}</span>
                <p className="description">Зависит от качества дороги, наличия груза сверху или прицепа.</p>
              </div>
              <div className="parameter">
                <span className="name">Коэффициент сопротивления качению:</span>
                <span className="value">{currentScenario.rolling_coeff}</span>
                <p className="description">Зависит от качества дороги. Для идеального асфальта - 0.005, для песка или грунта - 0.3.</p>
              </div>
            </>
          ) : (
            <div className="parameter">
              <span className="name">Мощность потребления систем:</span>
              <span className="value">{currentScenario.system_consumption} кВт</span>
              <p className="description">Мощность потребления заряда систем комфорта: кондиционер, обогрев и прочее.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
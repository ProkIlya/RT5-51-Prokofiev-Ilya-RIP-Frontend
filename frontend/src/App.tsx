import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NavigationBar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ScenarioDetailPage } from './pages/ScenarioDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { TripsPage } from './pages/TripsPage';
import { DraftTripPage } from './pages/DraftTripPage';
import { store } from './store/store';
import { ROUTES } from './Routes';
import { BASE_PATH } from './utils/target_config';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  useEffect(() => {
    if (window.__TAURI__) {
      console.log('Running in Tauri environment');
    }
  }, []);
  
  return (
    <Provider store={store}>
      <Router basename={BASE_PATH}>
        <NavigationBar />
        <div style={{ paddingTop: '76px' }}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.SCENARIO_DETAIL} element={<ScenarioDetailPage />} />
            <Route path={ROUTES.SCENARIOS} element={<ScenariosPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.TRIPS} element={<TripsPage />} />
            <Route path={ROUTES.DRAFT_TRIP} element={<DraftTripPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
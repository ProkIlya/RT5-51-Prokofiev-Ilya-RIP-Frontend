import type { FC } from 'react';
import { useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NavigationBar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ScenarioDetailPage } from './pages/ScenarioDetailPage';
import { store } from './store/store';
import { ROUTES } from './Routes';
import { BASE_PATH } from './utils/target_config';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: FC = () => {
  useEffect(() => {
    if (window.__TAURI__) {
      console.log('Running in Tauri environment');
    }
  }, []);
  
  return (
    <Provider store={store}>
      <Router basename={BASE_PATH}>
        <NavigationBar />
        <div style={{ paddingTop: '56px' }}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.SCENARIO_DETAIL} element={<ScenarioDetailPage />} />
            <Route path={ROUTES.SCENARIOS} element={<ScenariosPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
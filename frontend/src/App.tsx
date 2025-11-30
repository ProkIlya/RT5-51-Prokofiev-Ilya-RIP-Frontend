import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NavigationBar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ScenarioDetailPage } from './pages/ScenarioDetailPage';
import { store } from './store/store';
import { ROUTES } from './Routes';
//import { invoke } from "@tauri-apps/api/core";
//import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: FC = () => {
  return (
    <Provider store={store}>
      <Router basename="/RT5-51-Prokofiev-Ilya-Tesla-Charge-Calculator-Frontend/">
        <NavigationBar />
        {/* Добавьте этот div с отступом сверху */}
        <div style={{ paddingTop: '56px' }}> {/* 56px - стандартная высота Navbar */}
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
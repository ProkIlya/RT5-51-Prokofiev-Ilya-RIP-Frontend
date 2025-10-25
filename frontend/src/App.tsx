import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavigationBar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ScenarioDetailPage } from './pages/ScenarioDetailPage';
//import { TripPage } from './pages/TripPage';
import { ROUTES } from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: FC = () => {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SCENARIOS} element={<ScenariosPage />} />
        <Route path={ROUTES.SCENARIO_DETAIL} element={<ScenarioDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
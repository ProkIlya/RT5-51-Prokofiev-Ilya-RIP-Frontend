import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { HashRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NavigationBar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ScenarioDetailPage } from './pages/ScenarioDetailPage';
import { store } from './store/store';
import { ROUTES } from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SCENARIO_DETAIL} element={<ScenarioDetailPage />} />
          <Route path={ROUTES.SCENARIOS} element={<ScenariosPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
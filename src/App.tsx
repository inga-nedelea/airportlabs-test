import { Route, Routes } from 'react-router';
import { FlightsPage } from './pages/FlightsPage/FlightsPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FlightsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

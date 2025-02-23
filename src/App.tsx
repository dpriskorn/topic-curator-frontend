import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Subtopics from './pages/Subtopics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/subtopics" element={<Subtopics />} />
      </Routes>
    </Router>
  );
}

export default App;
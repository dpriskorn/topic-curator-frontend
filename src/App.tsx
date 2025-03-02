import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Subtopics from './pages/Subtopics';
import Terms from './pages/TermsPage';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/subtopics" element={<Subtopics />} />
        <Route path="/terms" element={<Terms lang={undefined} subgraph={undefined} default_limit={undefined} />} /> {/* Add this line */}
        <Route path="/results" element={<Results lang={undefined} subgraph={undefined} default_limit={undefined} />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;

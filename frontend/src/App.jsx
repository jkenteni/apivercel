import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import Cadastro from './component/Cadastro';
import PrivateRoute from './component/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/cadastro" element={
          <PrivateRoute>
            <Cadastro />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

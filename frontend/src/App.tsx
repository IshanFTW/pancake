import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route
                    path="/send"
                    element={<PrivateRoute  element={<SendMoney />} />}
                />
                <Route
                    path="/dashboard"
                    element={<PrivateRoute element={<Dashboard />} />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

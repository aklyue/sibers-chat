import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat";
import useAppSelector from "./hooks/useAppSelector";

function App() {
  const isAuth = useAppSelector((state) => state.user.isAuthenticated);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat"
            element={isAuth ? <Chat /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

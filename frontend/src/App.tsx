import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BaseLayout from "./components/BaseLayout";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Logout from "./Auth/Logout";
import Home from "./Home/Home";

function App() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/auth/login" Component={Login} />
          <Route path="/auth/sign-up" Component={SignUp} />
          <Route path="/auth/logout" Component={Logout} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
}

export default App;

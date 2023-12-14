import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BaseLayout from "./components/BaseLayout";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

function App() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path="/" Component={Login} />
          <Route path="/auth/login" Component={Login} />
          <Route path="/auth/sign-up" Component={SignUp} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
}

export default App;

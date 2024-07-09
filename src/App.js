import { Routes, Route } from "react-router-dom";
import Error from "./Components/Error";
import LoginPage from "./Components/Pages/Loginpage";
import Home from "./Components/Pages/Homepage";
import Website from "./Components/Pages/Website";
import Accepted from "./Components/Pages/Accepted";
import Transferred from "./Components/Pages/Transferred";
import Users from "./Components/Pages/Users";

import "./style/app.css";
import Referense from "./Components/Pages/Referense";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/website" element={<Website />}>
        <Route index element={<Home />} />
        <Route path="/website/users" element={<Accepted />} />
        <Route path="/website/catigories" element={<Transferred />} />
        <Route path="/website/catigories-food" element={<Users />} />
        <Route path="/website/ref" element={<Referense />} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
}

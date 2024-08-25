import { Routes, Route } from "react-router-dom";
import Error from "./Components/Error";
import LoginPage from "./Components/Pages/Loginpage";
import Website from "./Components/Pages/Website";
import Users from "./Components/Pages/Users";
import "./style/app.css";
import Transfers from "./Components/Pages/Transfers";
import Accepted from "./Components/Pages/Homepage";
import EditPassword from "./Components/Pages/EditPassword";
import { UserProvider } from "./Components/Pages/userContex";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/website" element={<Website />}>
          <Route index element={<Accepted />} />
          <Route path="/website/users" element={<Users />} />
          <Route path="/website/transfers" element={<Transfers />} />
          <Route path="/website/editpassword" element={<EditPassword />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import FileMaintenance from "./pages/FileMaintenance";
import InvestmentSavings from "./pages/InvestmentSavings";
import Loan from "./pages/Loan";
import Maintenance from "./pages/Maintenance";
import Members from "./pages/Members";
import Membership from "./pages/Maintenance";
import Report from "./pages/Report";
import Users from "./pages/Users";
import NotFoundPage from "./pages/NotFound";
import Announcement from "./pages/Announcement";

function App() {
  return (
    <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<Dashboard />} /> 
          <Route path="members" element={<Members />} />
          <Route path="membership" element={<Membership />} />
          <Route path="file-maintenance" element={<FileMaintenance />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="investment-savings" element={<InvestmentSavings />} />
          <Route path="loan" element={<Loan />} />
          <Route path="report" element={<Report />} />
          <Route path="users" element={<Users />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="*" element={<NotFoundPage />} />  
        </Route>
    </Routes>


  
  );
}

export default App;

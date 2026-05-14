import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Provisioning from "./pages/Provisioning";
import Lite from "./pages/Lite";
import { AppStore, AppStoreDetail } from "./pages/AppStore";
import Reports from "./pages/Reports";
import Digital from "./pages/Digital";
import AddOns from "./pages/AddOns";
import ApiDocs from "./pages/ApiDocs";
import UserManagement from "./pages/admin/UserManagement";
import AdminProvisioning from "./pages/admin/AdminProvisioning";
import AppStoreAdmin from "./pages/admin/AppStoreAdmin";
import TapAdmin from "./pages/admin/TapAdmin";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Developer */}
          <Route path="/dashboard" element={<ProtectedRoute role="developer"><DeveloperDashboard /></ProtectedRoute>} />
          <Route path="/provisioning" element={<ProtectedRoute><Provisioning /></ProtectedRoute>} />
          <Route path="/lite" element={<ProtectedRoute><Lite /></ProtectedRoute>} />
          <Route path="/lite/:sub" element={<ProtectedRoute><Lite /></ProtectedRoute>} />
          <Route path="/digital" element={<ProtectedRoute role="developer"><Digital /></ProtectedRoute>} />
          <Route path="/add-ons" element={<ProtectedRoute role="developer"><AddOns /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          {/* App Store - public */}
          <Route path="/appstore" element={<AppStore />} />
          <Route path="/appstore/:id" element={<AppStoreDetail />} />
          <Route path="/api-docs" element={<ApiDocs />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/provisioning" element={<ProtectedRoute role="admin"><AdminProvisioning /></ProtectedRoute>} />
          <Route path="/admin/appstore" element={<ProtectedRoute role="admin"><AppStoreAdmin /></ProtectedRoute>} />
          <Route path="/admin/tap" element={<ProtectedRoute role="admin"><TapAdmin /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

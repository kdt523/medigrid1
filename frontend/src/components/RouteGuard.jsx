import { Navigate } from 'react-router-dom';

const ADMIN_ROLES = ['system_admin', 'hospital_admin', 'authority', 'operator'];

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem('medigrid_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CitizenRoute({ children }) {
  const token = localStorage.getItem('medigrid_token');
  const user = getUserFromStorage();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'citizen') return <Navigate to="/admin/dashboard" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const token = localStorage.getItem('medigrid_token');
  const user = getUserFromStorage();

  if (!token || !user) return <Navigate to="/admin/login" replace />;
  if (user.role === 'citizen') return <Navigate to="/app" replace />;
  return children;
}

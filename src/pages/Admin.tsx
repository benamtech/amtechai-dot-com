import { useState, useEffect } from 'react';
import AdminLogin, { isAdminAuthenticated } from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    isAdminAuthenticated().then((result) => {
      setAuthenticated(result);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  if (!authenticated) {
    return <AdminLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}

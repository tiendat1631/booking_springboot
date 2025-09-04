
import AdminSidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-4">
      <Outlet />
      
      </div>
    </div>
  );
}

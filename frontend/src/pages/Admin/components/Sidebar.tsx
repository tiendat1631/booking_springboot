import { NavLink } from 'react-router-dom';
import { FaBus, FaTicketAlt, FaRoute } from 'react-icons/fa';

export default function Sidebar() {
  const linkClass =
    'flex items-center gap-2 p-4 text-white hover:bg-blue-600 transition-colors rounded-lg';
  const activeClass = 'bg-blue-700';

  return (
    <div className="w-64 bg-blue-800 min-h-screen p-4 text-white space-y-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/trip"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ''}`
          }
        >
          <FaRoute />
          Quản lý lịch trình
        </NavLink>

        <NavLink
          to="/admin/bus"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ''}`
          }
        >
          <FaBus />
          Quản lý xe
        </NavLink>

        <NavLink
          to="/admin/booking"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ''}`
          }
        >
          <FaTicketAlt />
          Quản lý vé
        </NavLink>
      </nav>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-gray-800 text-white h-full p-4 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col items-center`}>
      <div onClick={toggleSidebar} className="text-xl font-bold mb-4 cursor-pointer flex items-center justify-center">
        {isCollapsed ? (
          <img src="img/reorder.png" alt="Logo" className="w-6 h-6 filter-white" />
        ) : (
          <h2>Regenix</h2>
        )}
      </div>
      <nav>
        <ul className="w-full">
          {/* Section start culture */}
          <li className="py-4">
            <Link to ="/culture">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="img/start.png" alt="Logo" className="w-6 h-6 mr-2 filter-white" />
                {!isCollapsed && <span>Start culture</span>}
              </div>
            </Link>
          </li>
          {/* Section Dashboard */}
          <li className="py-4">
            <Link to ="/dashboard">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="img/dashboard.png" alt="Logo" className="w-6 h-6 mr-2 filter-white" />
                {!isCollapsed && <span>Dashboard</span>}
              </div>
            </Link>
          </li>
          {/* Section pH */}
          <li className="py-4">
            <Link to ="/ph">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="img/ph.png" alt="Logo" className="w-6 h-6 mr-2 filter-white" />
                {!isCollapsed && <span>pH</span>}
              </div>
            </Link>
          </li>
          {/* Section DO */}
          <li className="py-4">
            <Link to ="/do">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="img/do.png" alt="Logo" className="w-6 h-6 mr-2 filter-white" />
                {!isCollapsed && <span>DO</span>}
              </div>
            </Link>
          </li>
          {/* Section Temperature */}
          <li className="py-4">
            <Link to ="/temp">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="img/temp.png" alt="Logo" className="w-6 h-6 mr-2 filter-white" />
                {!isCollapsed && <span >Temperature</span>}
              </div>
            </Link>
          </li>
          {/* Section Debit */}
          <li className="py-4">
            <Link to ="/debit">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="img/debit.png" alt="Logo" className="w-6 h-6 mr-2 filter-white" />
                {!isCollapsed && <span >Flow rate</span>}
              </div>
            </Link>
          </li>
          {/* Section Log d'erreur */}
          <li className="py-4">
            <Link to ="/log">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <img src="img/error.png" alt="Logo" className="w-6 h-6 mr-2 filter-white" />
                {!isCollapsed && <span>Log d'erreur</span>}
              </div>
          </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
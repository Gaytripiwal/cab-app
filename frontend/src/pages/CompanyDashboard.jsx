import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import RideTable from '../components/RideTable';
import sampleRides from '../data/sampleRides';
import Footer from '../components/Footer';
import './CompanyDashboard.css';

const sections = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'employees', label: 'Employees' },
  { key: 'billing', label: 'Billing' },
  { key: 'rides', label: 'Rides' },
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
];

const cardIcons = [
  '🚗', // Total Rides
  '✅', // Completed
  '⏳', // Pending
];

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ employeeId: '', employeeName: '', email: '', password: '' });
  const [employeeError, setEmployeeError] = useState('');
  const [employeeLoading, setEmployeeLoading] = useState(false);

  // useEffect(() => {
  //   if (activeSection === 'employees') {
  //     const fetchEmployees = async () => {
  //       setEmployeeLoading(true);
  //       setEmployeeError('');
  //       try {
  //         const token = localStorage.getItem('token');
  //         const response = await fetch('http://localhost:5000/api/company/employees', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         const data = await response.json();
  //         if (response.ok) {
  //           setEmployees(data.employees || []);
  //         } else {
  //           setEmployeeError(data.message || 'Failed to fetch employees');
  //         }
  //       } catch (err) {
  //         setEmployeeError('Server error. Try again.');
  //       } finally {
  //         setEmployeeLoading(false);
  //       }
  //     };
  //     fetchEmployees();
  //   }
  // }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="row mb-4 justify-content-center">
              <div className="col-md-4">
                <DashboardCard title="Total Rides" value={sampleRides.length} icon={cardIcons[0]} />
              </div>
              <div className="col-md-4">
                <DashboardCard title="Completed" value={sampleRides.filter(r => r.status === 'Completed').length} icon={cardIcons[1]} />
              </div>
              <div className="col-md-4">
                <DashboardCard title="Pending" value={sampleRides.filter(r => r.status === 'Pending').length} icon={cardIcons[2]} />
              </div>
            </div>
            <div className="table-card-container">
              <RideTable rides={sampleRides} />
            </div>
          </>
        );
      case 'employees':
        return (
          <div className="p-4">
            <h3 className="mb-4" style={{ color: '#2b7cff', fontWeight: 700 }}>Employees</h3>
            <form className="mb-4" onSubmit={handleAddEmployee} style={{ maxWidth: 500 }}>
  <div className="row g-2 align-items-end">
    <div className="col-12 col-md-3">
      <input type="text" className="form-control" name="employeeId" placeholder="Employee ID" value={newEmployee.employeeId} onChange={handleEmployeeInput} required />
    </div>
    <div className="col-12 col-md-3">
      <input type="text" className="form-control" name="employeeName" placeholder="Employee Name" value={newEmployee.employeeName} onChange={handleEmployeeInput} required />
    </div>
    <div className="col-12 col-md-3">
      <input type="email" className="form-control" name="email" placeholder="Email" value={newEmployee.email} onChange={handleEmployeeInput} required />
    </div>
    <div className="col-12 col-md-2">
      <input type="password" className="form-control" name="password" placeholder="Password" value={newEmployee.password} onChange={handleEmployeeInput} required />
    </div>
    <div className="col-12 col-md-1 d-grid">
      <button type="submit" className="btn btn-primary" disabled={employeeLoading}>Add</button>
    </div>
  </div>
  {employeeError && <div className="text-danger mt-2">{employeeError}</div>}
</form>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeLoading ? (
                    <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                  ) : employeeError ? (
                    <tr><td colSpan="4" className="text-danger text-center">{employeeError}</td></tr>
                  ) : employees.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No employees found.</td></tr>
                  ) : employees.map(emp => (
                    <tr key={emp.employeeId}>
                      <td>
                        <span className="avatar-circle bg-primary text-white" style={{ padding: '6px 12px', borderRadius: '50%', fontWeight: 700, fontSize: 18 }}>
                          {emp.employeeName ? emp.employeeName[0] : 'E'}
                        </span>
                      </td>
                      <td>{emp.employeeName}</td>
                      <td>{emp.email}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleRemoveEmployee(emp.employeeId)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="p-4">
            <h3 className="mb-4" style={{ color: '#2b7cff', fontWeight: 700 }}>Billing</h3>
            <div className="card p-4 shadow-sm" style={{ borderRadius: 16, background: '#fff' }}>
              <p>Invoices and ride expenses will be shown here.</p>
            </div>
          </div>
        );
      case 'rides':
        return <div className="table-card-container"><RideTable rides={sampleRides} /></div>;
      case 'profile':
        return <div className="p-4"><h3>Profile</h3><p>Profile details and edit form will go here.</p></div>;
      case 'settings':
        return <div className="p-4"><h3>Settings</h3><p>Settings options will go here.</p></div>;
      default:
        return null;
    }
  };

  const handleEmployeeInput = (e) => {
  const { name, value } = e.target;
  setNewEmployee((prev) => ({ ...prev, [name]: value }));
};
  const handleAddEmployee = async (e) => {
  e.preventDefault();
  setEmployeeError('');
  if (!newEmployee.employeeId || !newEmployee.employeeName || !newEmployee.email || !newEmployee.password) {
    setEmployeeError('All fields are required.');
    return;
  }
  setEmployeeLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newEmployee)
    });
    const data = await response.json();
    if (!response.ok) {
      setEmployeeError(data.message || 'Failed to add employee');
    } else {
      setEmployees((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          employeeId: data.user.employeeId,
          employeeName: data.user.employeeName,
          email: data.user.email,
        },
      ]);
      setNewEmployee({ employeeId: '', employeeName: '', email: '', password: '' });
    }
  } catch (err) {
    setEmployeeError('Server error. Try again.');
  } finally {
    setEmployeeLoading(false);
  }
};
  const handleRemoveEmployee = (id) => {
    setEmployees((prev) => prev.filter(emp => emp.id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-root d-flex">
        {/* Sidebar */}
        <nav className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-branding d-flex flex-column align-items-center p-4 border-bottom">
            <div className="dashboard-logo mb-2">
              <span role="img" aria-label="logo" style={{ fontSize: 38 }}>🚕</span>
            </div>
            <div className="dashboard-company-name fw-bold" style={{ fontSize: 20, letterSpacing: 1 }}>CabApp</div>
          </div>
          <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <span className="fw-bold">Menu</span>
            <button className="btn btn-sm btn-outline-secondary d-md-none" onClick={() => setSidebarOpen(false)}>&times;</button>
          </div>
          <ul className="nav flex-column p-2 mt-2">
            {sections.map(section => (
              <li className="nav-item" key={section.key}>
                <button
                  className={`nav-link btn btn-link text-start w-100 ${activeSection === section.key ? 'active fw-bold' : ''}`}
                  onClick={() => { setActiveSection(section.key); setSidebarOpen(false); }}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* Overlay for mobile */}
        {sidebarOpen && <div className="sidebar-overlay d-md-none" onClick={() => setSidebarOpen(false)}></div>}
        {/* Main Content */}
        <div className="dashboard-content flex-grow-1">
          <div className="container-fluid mt-4">
            {/* Sticky header for dashboard title */}
            <div className="dashboard-header sticky-top bg-white mb-3 py-2 px-2 d-flex align-items-center justify-content-between" style={{ zIndex: 1020, borderRadius: 12, boxShadow: '0 2px 12px rgba(80,80,160,0.06)' }}>
              <h2 className="dashboard-title mb-0" style={{ fontWeight: 800, color: '#2b7cff', fontSize: '2rem', letterSpacing: 1 }}>Company Dashboard</h2>
              {/* Hamburger for mobile */}
              <button className="btn btn-outline-primary d-md-none" onClick={() => setSidebarOpen(true)}>
                <span className="navbar-toggler-icon"></span> Menu
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyDashboard; 
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Admin.css';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaCheckCircle, FaBars } from 'react-icons/fa';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'companies', label: 'Companies', icon: '🏢' },
  { key: 'employees', label: 'Employees', icon: '👥' },
  { key: 'bookings', label: 'Bookings', icon: '🚕' },
  { key: 'billing', label: 'Billing & Revenue', icon: '💰' },
  { key: 'pricing', label: 'Pricing & Add-ons', icon: '⚙️' },
];

const DUMMY_COMPANIES = [
  { id: 1, name: 'Om Cab Services', email: 'company@omcab.com', status: 'Active' },
  { id: 2, name: 'City Cabs', email: 'city@cab.com', status: 'Inactive' },
];

const EMPLOYEE_TABS = [
  { key: 'employee', label: 'Employee Management' },
  { key: 'logs', label: 'Usage Logs' },
  { key: 'billing', label: 'Billing Reports' },
  { key: 'branch', label: 'Branch Management' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'vendors', label: 'Vendor Ratings' },
];

const DUMMY_EMPLOYEES = [
  { id: 1, name: 'John Doe', email: 'john.doe@company.com', contact: '+91 98765 43210', department: 'IT', branch: 'Bangalore', status: 'active' },
];

const Admin = ({ sidebarOpen, setSidebarOpen }) => {
  const [active, setActive] = useState('dashboard');
  const [companies, setCompanies] = useState(DUMMY_COMPANIES);
  const [newCompany, setNewCompany] = useState({ companyName: '', companyId: '', email: '', password: '' });
  const [companyTab, setCompanyTab] = useState('register');
  const [employeeTab, setEmployeeTab] = useState('employee');
  const [employees, setEmployees] = useState(DUMMY_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', contact: '', department: '', branch: '' });

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  const handleCompanyInput = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  // const handleCompanyRegister = (e) => {
  //   e.preventDefault();
  //   if (!newCompany.name || !newCompany.email || !newCompany.password) return;
  //   setCompanies((prev) => [
  //     ...prev,
  //     { id: prev.length + 1, name: newCompany.name, email: newCompany.email, status: 'Active' },
  //   ]);
  //   setNewCompany({ name: '', email: '', password: '' });
  // };

  const handleCompanyRegister = async (e) => {
    e.preventDefault();
  
    if (!newCompany.companyName || !newCompany.companyId || !newCompany.email || !newCompany.password) return;
  
    try {
      const response = await fetch('http://localhost:5000/api/company/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompany),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update frontend state only if backend registration succeeds
        setCompanies((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            name: newCompany.companyName,
            email: newCompany.email,
            status: 'Active',
          },
        ]);
        alert('Company registered successfully!');
        setNewCompany({ companyName: '', companyId: '', email: '', password: '' });
      } else {
        // alert(Registration failed: ${data.message});
      }
    } catch (error) {
      console.error('❌ Error registering company:', error);
      alert('❌ Server error. Try again later.');
    }
  };






  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEmployeeInput = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;
    setEmployees((prev) => [
      ...prev,
      { id: prev.length + 1, ...newEmployee, status: 'active' },
    ]);
    setNewEmployee({ name: '', email: '', contact: '', department: '', branch: '' });
  };
  const handleRemoveEmployee = (id) => {
    setEmployees((prev) => prev.filter(emp => emp.id !== id));
  };

  // Close sidebar when a nav item is clicked (on mobile)
  const handleNavClick = (key) => {
    setActive(key);
    setSidebarOpen(false);
  };

 

  React.useEffect(() => {
    const fetchBookings = async () => {
      if (active === 'bookings') {
        setBookingsLoading(true);
        setBookingsError('');
        try {
          const res = await fetch('http://localhost:5000/api/allBookings');
          const data = await res.json();
          console.log("Fetched bookings:", data);
          console.log("Active Tab:", active);

          if (data && Array.isArray(data.bookings)) {
            setBookings(data.bookings);
          } else {
            setBookings([]);
            setBookingsError('No bookings data received.');
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
          setBookings([]);
          setBookingsError('Failed to fetch bookings.');
        } finally {
          setBookingsLoading(false);
        }
      }
    };
    fetchBookings();
  }, [active]);
  

  return (
    <>
      <Navbar />
      {/* Sidebar hamburger for mobile, always visible below Navbar */}
      <button
        className="admin-hamburger admin-sidebar-hamburger"
        style={{ display: 'flex', margin: '16px 0 8px 16px', zIndex: 1101 }}
        onClick={() => setSidebarOpen && setSidebarOpen(true)}
        aria-label="Open sidebar menu"
        type="button"
      >
        <FaBars />
      </button>
      <div className="admin-root-premium">
        {/* Sidebar with open/close logic */}
        <aside className={`admin-sidebar-premium${sidebarOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-title">Super Admin</div>
          <ul className="admin-nav-premium">
            {MODULES.map(m => (
              <li key={m.key}>
                <button className={active === m.key ? 'active' : ''} onClick={() => handleNavClick(m.key)}>
                  <span className="admin-nav-icon">{m.icon}</span> {m.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {/* Overlay for closing sidebar on mobile */}
        {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
        <main className="admin-main-premium">
          <div className="admin-header-bar">{MODULES.find(m => m.key === active)?.label}</div>
          {active === 'dashboard' && (
            <section>
              <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: 24, color: '#2b7cff', fontWeight: 600, boxShadow: '0 2px 12px #2b7cff22', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 18, color: '#222' }}>Total Employees</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#2b7cff', marginTop: 8 }}>150</div>
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: 24, color: '#22c55e', fontWeight: 600, boxShadow: '0 2px 12px #22c55e22', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 18, color: '#222' }}>Active Rides</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#22c55e', marginTop: 8 }}>12</div>
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: 24, color: '#a855f7', fontWeight: 600, boxShadow: '0 2px 12px #a855f722', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 18, color: '#222' }}>Monthly Expenses</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#a855f7', marginTop: 8 }}>₹2.5L</div>
                </div>
              </div>
            </section>
          )}
          {active === 'companies' && (
            <section>
              <div className="admin-company-tabs">
                <button className={companyTab === 'register' ? 'active' : ''} onClick={() => setCompanyTab('register')}>Register Company</button>
                <button className={companyTab === 'history' ? 'active' : ''} onClick={() => setCompanyTab('history')}>Company History</button>
              </div>
              {companyTab === 'register' && (
                <div className="admin-company-form-card">
                  <h3>Register New Company</h3>
                  <form className="admin-company-form" onSubmit={handleCompanyRegister} autoComplete="off">
                    <input type="text" name="companyName" placeholder="Company Name" value={newCompany.companyName} onChange={handleCompanyInput} required />
                    <input type="text" name="companyId" placeholder="Company ID" value={newCompany.companyId} onChange={handleCompanyInput} required />
                    <input type="email" name="email" placeholder="Company Email" value={newCompany.email} onChange={handleCompanyInput} required />
                    <input type="password" name="password" placeholder="Password" value={newCompany.password} onChange={handleCompanyInput} required />
                    <button type="submit">Register Company</button>
                  </form>
                </div>
              )}
              {companyTab === 'history' && (
                <div className="admin-table-premium">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.name}</td>
                          <td>{c.email}</td>
                          <td>{c.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
          {active === 'employees' && (
            <section style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px #2b7cff11', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
                {EMPLOYEE_TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={employeeTab === tab.key ? 'admin-emp-tab-active' : 'admin-emp-tab'}
                    onClick={() => setEmployeeTab(tab.key)}
                    style={{ background: employeeTab === tab.key ? '#e8f1ff' : '#fff', color: employeeTab === tab.key ? '#2b7cff' : '#222', border: 'none', borderBottom: employeeTab === tab.key ? '2.5px solid #2b7cff' : '2.5px solid transparent', fontWeight: 600, fontSize: 16, padding: '10px 22px', borderRadius: 8, transition: 'all 0.2s' }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {employeeTab === 'employee' && (
                <>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ flex: 1, background: '#f3f6fa', border: '1px solid #e5e7eb', borderRadius: 8, color: '#222', padding: '10px 14px', fontSize: 16 }}
                    />
                    <button style={{ background: '#2b7cff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => {}}>
                      <FaUserPlus /> Add Employee
                    </button>
                  </div>
                  <form onSubmit={handleAddEmployee} style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                    <input type="text" name="name" placeholder="Name" value={newEmployee.name} onChange={handleEmployeeInput} style={{ flex: 1, background: '#f3f6fa', border: '1px solid #e5e7eb', borderRadius: 8, color: '#222', padding: '8px 12px' }} />
                    <input type="email" name="email" placeholder="Email" value={newEmployee.email} onChange={handleEmployeeInput} style={{ flex: 1, background: '#f3f6fa', border: '1px solid #e5e7eb', borderRadius: 8, color: '#222', padding: '8px 12px' }} />
                    <input type="text" name="contact" placeholder="Contact" value={newEmployee.contact} onChange={handleEmployeeInput} style={{ flex: 1, background: '#f3f6fa', border: '1px solid #e5e7eb', borderRadius: 8, color: '#222', padding: '8px 12px' }} />
                    <input type="text" name="department" placeholder="Department" value={newEmployee.department} onChange={handleEmployeeInput} style={{ flex: 1, background: '#f3f6fa', border: '1px solid #e5e7eb', borderRadius: 8, color: '#222', padding: '8px 12px' }} />
                    <input type="text" name="branch" placeholder="Branch" value={newEmployee.branch} onChange={handleEmployeeInput} style={{ flex: 1, background: '#f3f6fa', border: '1px solid #e5e7eb', borderRadius: 8, color: '#222', padding: '8px 12px' }} />
                    <button type="submit" style={{ background: '#2b7cff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600 }}>Add</button>
                  </form>
                  <div style={{ background: '#f9fafb', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <table style={{ width: '100%', color: '#222', fontSize: 16 }}>
                      <thead style={{ background: '#f3f6fa', color: '#2b7cff' }}>
                        <tr>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>NAME</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>CONTACT</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>DEPARTMENT</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>BRANCH</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>STATUS</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map(emp => (
                          <tr key={emp.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '10px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#2b7cff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                                {emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{emp.name}</div>
                                <div style={{ fontSize: 14, color: '#888' }}>{emp.email}</div>
                              </div>
                            </td>
                            <td style={{ padding: '10px 8px' }}>{emp.contact}</td>
                            <td style={{ padding: '10px 8px' }}>{emp.department}</td>
                            <td style={{ padding: '10px 8px' }}>{emp.branch}</td>
                            <td style={{ padding: '10px 8px' }}>
                              <span style={{ background: '#e8fbe8', color: '#22c55e', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 14 }}>active</span>
                            </td>
                            <td style={{ padding: '10px 8px' }}>
                              <button style={{ background: 'none', border: 'none', color: '#2b7cff', marginRight: 8 }}><FaEdit /></button>
                              <button style={{ background: 'none', border: 'none', color: '#ff6b81' }} onClick={() => handleRemoveEmployee(emp.id)}><FaTrash /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {/* Other tabs can be scaffolded here */}
            </section>
          )}
          {active === 'rides' && (
            <section>
              <div className="admin-table-placeholder">[Rides Table: Filter, view, cancel, reassign]</div>
            </section>
          )}
          {active === 'billing' && (
            <section>
              <div className="admin-table-placeholder">[Billing: Company invoices, revenue by period, exports]</div>
            </section>
          )}
          {active === 'bookings' && (
            <section style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px #2b7cff11', border: '1px solid #e5e7eb' }}>
              <h3 style={{ color: '#2b7cff', fontWeight: 700, marginBottom: 18 }}>All Bookings</h3>
              {bookingsLoading ? (
                <div style={{ textAlign: 'center', color: '#2b7cff', padding: 24 }}>Loading bookings...</div>
              ) : bookingsError ? (
                <div style={{ textAlign: 'center', color: '#ff6b81', padding: 24 }}>{bookingsError}</div>
              ) : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: 24 }}>No bookings found.</div>
              ) : (
                <div className="admin-table-premium">
                  <table>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Employee Name</th>
                        <th>Email</th>
                        <th>Pickup</th>
                        <th>Drop</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, idx) => (
                        <tr key={b._id || idx}>
                          <td>{b._id}</td>
                          <td>{b.userId?.employeeName || '-'}</td>
                          <td>{b.userId?.email || '-'}</td>
                          <td>{b.pickup || '-'}</td>
                          <td>{b.dropoff || '-'}</td>
                          <td>{b.date ? new Date(b.date).toLocaleString() : '-'}</td>
                          <td>{b.status || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
          {active === 'pricing' && (
            <section>
              <div className="admin-table-placeholder">[Pricing controls: Base fare, per km, stay charges, extras]</div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Admin;
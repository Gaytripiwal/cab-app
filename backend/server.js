<<<<<<< HEAD
// ===== Imports =====
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { initSocket } = require('./utils/socket');

// Route imports
const adminRouter = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const seedAdmin = require('./seeders/adminSeeder');
const notificationRoutes = require('./routes/notificationRoutes')

// ===== Config =====
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// ===== View Engine =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== MongoDB Connection =====
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cab-app';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedAdmin();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRouter);
app.use('/api', notificationRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// EJS Views
app.get('/admin/login', (req, res) => {
  res.render('admin/login');
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Cab App API' });
});

// ===== Create HTTP Server =====
const server = http.createServer(app);

// ===== Initialize WebSocket =====
initSocket(server);

// ===== Start Server =====
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 WebSocket server running on port ${PORT}`);
});
=======
// // ===== Imports =====
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const cors = require('cors');
// const dotenv = require('dotenv');

// const authRoutes = require('./routes/authRoutes');
// const companyRoutes = require('./routes/companyRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');


// // ===== Config =====
// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;

// // ===== Middleware =====
// // Enable CORS for frontend (React at port 5173)
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static('public'));

// // ===== View Engine =====
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'cab', 'views'));

// // ===== MongoDB Connection =====
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// // ===== Routes =====
// app.use('/api', authRoutes);
// app.use('/api', companyRoutes);
// app.use('/api', bookingRoutes);

// // EJS Views
// app.get('/admin/login', (req, res) => {
//   res.render('admin/login');
// });

// app.get('/', (req, res) => {
//   res.render('index');
// });

// // ===== Start Server =====
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });



// ===== Imports =====
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

const adminRouter = require('./routes/adminRoutes.js');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seedAdmin = require('./seeders/adminSeeder'); // <- make sure this is added

// ===== Config =====
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ===== View Engine =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'cab', 'views'));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedAdmin(); // ✅ Correctly placed inside async .then block
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// ===== Routes =====
app.use('/api', adminRouter);
app.use('/api', authRoutes);
app.use('/api', companyRoutes);
app.use('/api', bookingRoutes);

// ===== EJS Views =====
app.get('/admin/login', (req, res) => {
  res.render('admin/login');
});

app.get('/', (req, res) => {
  res.render('index');
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

>>>>>>> 18b3bb154fe4bc562397050ecc39746c89c3272e

// const express = require('express');
// const router = express.Router();
// const Company = require('../models/company');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // Fix these values as your "database"
// const FIXED_EMAIL = 'company@omcab.com';
// const FIXED_PASSWORD = 'company123';

// // POST /api/company/login
// router.post('/company/login', async (req, res) => {
//     const { email, password } = req.body;

//     // Check against fixed values
//     if (email !== FIXED_EMAIL) {
//         return res.status(400).json({ message: 'Company not found' });
//     }
//     if (password !== FIXED_PASSWORD) {
//         return res.status(400).json({ message: 'Invalid password' });
//     }

//     // Find the company in the database to get its _id
//     const company = await Company.findOne({ email });
//     if (!company) {
//         return res.status(400).json({ message: 'Company not found in DB' });
//     }

//     // Generate a token for the company, including its id
//     const token = jwt.sign({ id: company._id, email, role: 'company' }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ message: 'Login successful', token });
// });

// // POST /api/company/register
// router.post('/register', async (req, res) => {
//     const { companyName, companyId, email, password } = req.body;
//     if (!companyName || !companyId || !email || !password) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }
//     try {
//         // Check for existing company
//         const existing = await Company.findOne({ $or: [{ email }, { companyId }] });
//         if (existing) {
//             return res.status(400).json({ message: 'Company with this email or ID already exists' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const company = await Company.create({
//             companyName,
//             companyId,
//             email,
//             password: hashedPassword
//         });
//         res.status(201).json({ message: 'Company registered', company: { companyName, companyId, email } });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Company = require('../models/company');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register Company
router.post('/company/register', async (req, res) => {
  try {
    const { companyName, companyId, email, password } = req.body;
    if (!companyName || !companyId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await Company.findOne({ $or: [{ email }, { companyId }] });
    if (existing) {
      return res.status(400).json({ message: "Company already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = new Company({ companyName, companyId, email, password: hashedPassword });
    await newCompany.save();
    res.status(201).json({ message: "Company registered successfully", company: newCompany });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Middleware to verify company JWT and attach company id to req.user
function verifyCompanyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'company') return res.status(403).json({ message: 'Not authorized as company' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.post('/employees', verifyCompanyToken, async (req, res) => {
  try {
    const { employeeId, employeeName, email, password } = req.body;
    if (!employeeId || !employeeName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if user (employee) already exists with this email or employeeId for this company
    const existing = await User.findOne({
      $or: [
        { email },
        { employeeId, companyId: req.user.id }
      ]
    });
    if (existing) {
      return res.status(409).json({ message: 'Employee with this email or ID already exists' });
    }
    // Get company info for companyName
    const company = await Company.findById(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user with role 'user'
    const user = new User({
      role: 'user',
      employeeId,
      employeeName,
      companyName: company.companyName,
      companyId: company.companyId,
      email,
      password: hashedPassword
    });
    await user.save();
    res.status(201).json({ message: 'Employee registered', user: {
      employeeId: user.employeeId,
      employeeName: user.employeeName,
      companyName: user.companyName,
      companyId: user.companyId,
      email: user.email
    }});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Company Login
router.post('/company/login', async (req, res) => {
  const { email, password } = req.body;
  const company = await Company.findOne({ email });
  if (!company) {
    return res.status(400).json({ message: 'Company not found' });
  }
  const valid = await bcrypt.compare(password, company.password);
  if (!valid) {
    return res.status(400).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ id: company._id, email, role: 'company' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

module.exports = router;
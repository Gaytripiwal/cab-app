<<<<<<< HEAD
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const seedAdmin = require('./seeders/adminSeeder');

dotenv.config();

(async () => {
  await seedAdmin();
  process.exit();
=======
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const seedAdmin = require('./seeders/adminSeeder');

dotenv.config();

(async () => {
  await seedAdmin();
  process.exit();
>>>>>>> 18b3bb154fe4bc562397050ecc39746c89c3272e
})();
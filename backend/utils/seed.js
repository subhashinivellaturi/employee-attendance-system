const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

dotenv.config({ path: '../.env' });

// Connect to DB
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
};

// Data to import
const users = [
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'manager',
        employeeId: 'MGR001',
        department: 'HR'
    },
    {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP101',
        department: 'Engineering'
    },
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP102',
        department: 'Engineering'
    },
    {
        name: 'Bob Brown',
        email: 'bob@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP201',
        department: 'Sales'
    }
];

// Import data into DB
const importData = async () => {
    try {
        await User.deleteMany();
        await Attendance.deleteMany();

        await User.create(users);

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Attendance.deleteMany();

        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Run the script
(async () => {
    try {
        await connectDB();
        if (process.argv[2] === '-d') {
            await deleteData();
        } else {
            await importData();
        }
    } catch (error) {
        console.error('Failed to run seed script:', error.message);
        process.exit(1);
    }
})();

// To run this: node utils/seed.js
// To destroy: node utils/seed.js -d
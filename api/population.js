const mongoose = require('mongoose');
const cors = require('cors');

// โหลดตัวแปรจาก .env
require('dotenv').config();

// เชื่อมต่อ MongoDB Atlas โดยใช้ตัวแปรสิ่งแวดล้อม
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// สร้าง Schema สำหรับประชากร
const populationSchema = new mongoose.Schema({
    Year: Number,
    'Country name': String,
    Population: Number
});

const Population = mongoose.model('Population', populationSchema, 'populationDB');

// ฟังก์ชัน handler สำหรับ API ของ Netlify
exports.handler = async (event, context) => {
    const year = parseInt(event.queryStringParameters.year); // ใช้ query แทน param
    try {
        const data = await Population.find({ Year: year }).sort({ Population: -1 });
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch population data' })
        };
    }
};

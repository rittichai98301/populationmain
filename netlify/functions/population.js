const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => {
      console.error('MongoDB connection error:', err);
  });

const populationSchema = new mongoose.Schema({
    Year: Number,
    'Country name': String,
    Population: Number
});

const Population = mongoose.model('Population', populationSchema, 'populationDB');

exports.handler = async (event, context) => {
    const year = parseInt(event.queryStringParameters.year);
    console.log('Year received:', year);
    try {
        const data = await Population.find({ Year: year }).sort({ Population: -1 });
        console.log('Data fetched:', data);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error fetching data:', error); // log error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch population data', details: error.message })
        };
    }
};

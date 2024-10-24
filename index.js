const express = require('express');
const mongoose = require('mongoose');
const tripModel = require('./trips.model');
const ApiFeatures = require('./features');
const validation = require('./validation');
const {validationResult} = require('express-validator');

const app = express();
app.use(express.json());

app.get('/trips', async (req, res) => {
    try {
        const features = new ApiFeatures(tripModel.getQueryObject(), req.query).fieldsFilter().paginate().sort();
        const trips = await features.queryObject;
        res.status(200).json({
            data: {trips}
        })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trips', err});
    }
});

app.post('/', validation.arr, async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const [day, month, year] = req.body.startDate.split('-');
        const formattedDate = new Date(`${year}-${month}-${day}`);
        const trip = {
            departure: req.body.departure,
            destination: req.body.destination,
            startDate: formattedDate,
            duration: req.body.duration,
            passengers: req.body.passengers
        };
        await tripModel.addNewTrip(trip);
        res.status(201).json({ message: 'Trip added successfully', trip: trip });
    } catch (err) {
        res.status(500).json({ message: 'Error scheduling the trip', error: err });
    }
})
mongoose.connect('mongodb://127.0.0.1:27017/tripDB')
.then(() => {
    console.log('Connected to database');
})
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

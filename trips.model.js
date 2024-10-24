const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    departure: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    passengers: {
        type: Number,
        required: true,
        min: 2
    }
});

const Trip = mongoose.model('Trip', tripSchema);

exports.getQueryObject = () => {
    const trips = Trip.find();
    return trips;
}

exports.addNewTrip = async(obj) => {
    const trip = new Trip(obj);
    await trip.save();
}

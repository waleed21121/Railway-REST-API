const { check } = require("express-validator");

const isValidDate = (dateStr) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(`${year}-${month}-${day}`);
    
    return date && date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year;
};

exports.arr = [
    check('departure').notEmpty().withMessage('Departure place is required'),
    check('destination').notEmpty().withMessage('Destination is required'),
    check('startDate').custom(isValidDate).withMessage('Invalid date format, use DD-MM-YYYY'),
    check('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
    check('passengers').isInt({ min: 2 }).withMessage('Number of passengers must be greater than 1'),
]
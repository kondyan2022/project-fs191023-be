const { HttpError } = require("../helpers");

const getDateParts = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return { year, month, day };
};


const validateDate = (req, res, next) => {
      const { date } = req.body;
      if(date) {
        let formattedDate = '';
        if (typeof date === 'string') {
          const dateObj = new Date(date);
          if(isNaN(dateObj.getTime())) return next(HttpError(400, 'Invalid date format'));
          const { year, month, day } = getDateParts(dateObj);
          formattedDate = `${year}${month}${day}`;
        }
        else if (date instanceof Date) {
          const { year, month, day } = getDateParts(date);
          formattedDate = `${year}${month}${day}`;
        }
        req.body.date = formattedDate;
      }
      next();
}


module.exports = validateDate;

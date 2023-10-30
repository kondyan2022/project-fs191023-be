const { HttpError } = require("../helpers");

const getDateParts = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return { year, month, day };
};


const validateDate = (req, res, next) => {
      const { date } = req.body;
      const regex =  /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19[0-9][0-9]|20[012][0-9])$/
      let dateForm;
      if(regex.test(date)) {
        console.log('We find correct date version 1!');

        dateForm = date.slice(6) + date.slice(3, 5) + date.slice(0, 2);
        console.log(dateForm);
      }
      else {

          const dateObj = new Date(date).toString();
          console.log(dateObj);
          if(dateObj === 'Invalid Date') return next(HttpError(400, 'Invalid date format'));
          
          const { year, month, day } = getDateParts(dateObj);
          
          dateForm = `${year}/${month}/${day}`;       
          console.log(dateForm);
      }
      req.body = { ...req.body, date: dateForm };
      next();     
}


module.exports = validateDate;

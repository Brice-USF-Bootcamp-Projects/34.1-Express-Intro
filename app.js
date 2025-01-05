const express = require("express");
const ExpressError = require("./expressError");

const app = express();

// Helper function to calculate statistics
function calculateStatistic(statType, nums) {
  if (!nums) throw new ExpressError("nums are required.", 400);

  const numbers = nums.split(",").map((num) => {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) throw new ExpressError(`${num} is not a number.`, 400);
    return parsed;
  });

  switch (statType) {
    case "mean":
      return numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    case "median":
      numbers.sort((a, b) => a - b);
      const mid = Math.floor(numbers.length / 2);
      return numbers.length % 2 !== 0
        ? numbers[mid]
        : (numbers[mid - 1] + numbers[mid]) / 2;
    case "mode":
      const frequency = {};
      let maxFreq = 0;
      let mode = null;
      numbers.forEach((num) => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
          maxFreq = frequency[num];
          mode = num;
        }
      });
      if (Object.values(frequency).filter((freq) => freq === maxFreq).length > 1) {
        throw new ExpressError("No unique mode exists.", 400);
      }
      return mode;
    default:
      throw new ExpressError("Invalid statistic type.", 400);
  }
}

// Routes
app.get("/mean", (req, res, next) => {
  try {
    const nums = req.query.nums;
    const result = calculateStatistic("mean", nums);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

app.get("/median", (req, res, next) => {
  try {
    const nums = req.query.nums;
    const result = calculateStatistic("median", nums);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

app.get("/mode", (req, res, next) => {
  try {
    const nums = req.query.nums;
    const result = calculateStatistic("mode", nums);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

// If no other route matches, respond with a 404
app.use((req, res, next) => {
    const e = new ExpressError("Page Not Found", 404)
    next(e)
  })

// Error handler
app.use(function (err, req, res, next) { //Note the 4 parameters!
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.msg;
  
    // set the status and alert the user
    return res.status(status).json({
      error: { message, status }
    });
  });

module.exports = app;

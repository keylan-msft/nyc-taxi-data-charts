const { models } = require('../db');

async function getAll(req, res) {
  const where = {};

  // Filters
  if (req.query.pickup_borough_id) {
    where.pickup_borough_id = req.query.pickup_borough_id;
  }
  if (req.query.dropoff_borough_id) {
    where.dropoff_borough_id = req.query.dropoff_borough_id;
  }
  if (req.query.taxi_type_id) {
    where.taxi_type_id = req.query.taxi_type_id;
  }
  if (req.query.pickup_date) {
    where.pickup_date = req.query.pickup_date;
  }
  if (req.query.pickup_hour) {
    where.pickup_hour = req.query.pickup_hour;
  }

  const trip_summaries = await models.trip_summaries.findAll({ where });
  res.status(200).json(trip_summaries);
}

module.exports = {
  getAll,
};

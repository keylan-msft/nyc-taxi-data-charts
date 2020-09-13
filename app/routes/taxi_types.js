const { models } = require('../db');

async function getAll(req, res) {
  const taxi_types = await models.taxi_types.findAll();
  res.status(200).json(taxi_types);
}

module.exports = {
  getAll,
};

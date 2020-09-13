const { models } = require('../db');

async function getAll(req, res) {
  const boroughs = await models.boroughs.findAll();
  res.status(200).json(boroughs);
}

module.exports = {
  getAll,
};

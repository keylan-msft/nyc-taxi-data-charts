const { Sequelize } = require('sequelize');
// const { applyExtraSetup } = require('./extra-setup');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

const modelDefiners = [
  require('./models/boroughs.model'),
  require('./models/locations.model'),
  require('./models/taxi_types.model'),
  require('./models/trip_summaries.model'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
// applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;

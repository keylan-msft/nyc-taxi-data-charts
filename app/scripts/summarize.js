const fs = require('fs');
const csv = require('@fast-csv/parse');
const moment = require('moment-timezone');
const { models } = require('../db');

const greenColumnMap = {
  pickup_datetime: 1,
  dropoff_datetime: 2,
  pickup_location_id: 5,
  dropoff_location_id: 6,
  passenger_count: 7,
  trip_distance: 8,
  total_amount: 16,
  payment_type: 17,
};
const yellowColumnMap = {
  pickup_datetime: 1,
  dropoff_datetime: 2,
  passenger_count: 3,
  trip_distance: 4,
  pickup_location_id: 7,
  dropoff_location_id: 8,
  payment_type: 9,
  total_amount: 16,
};
const fhvColumnMap = {
  pickup_datetime: 1,
  dropoff_datetime: 2,
  pickup_location_id: 3,
  dropoff_location_id: 4,
};
const trips = {};

let boroughMap = {};
let locationMap = {};
let rowsProcessed = 0;
let rowsToCreate = 0;
let stats = true;
let columnMap;
let taxiType = 1;

function processRow(row) {
  rowsProcessed++;
  // Ignore abnormal trips when appropriate (refunds, voids, etc)
  if (
    rowsProcessed === 1 ||
    (Object.prototype.hasOwnProperty.call(columnMap, 'payment_type') &&
      row[columnMap['payment_type']] > 2)
  ) {
    return;
  }

  if (rowsProcessed % 10000 === 0) {
    console.log({ rowsProcessed, rowsToCreate });
  }

  const pickupLocation =
    boroughMap[locationMap[row[columnMap['pickup_location_id']]]];
  const dropoffLocation =
    boroughMap[locationMap[row[columnMap['dropoff_location_id']]]];

  if (!parseFloat(pickupLocation) || !parseFloat(dropoffLocation)) {
    // Skip invalid data
    return;
  }

  if (!trips[pickupLocation]) {
    trips[pickupLocation] = {};
  }
  if (!trips[pickupLocation][dropoffLocation]) {
    trips[pickupLocation][dropoffLocation] = {};
  }

  const puDateTime = moment.tz(
    row[columnMap['pickup_datetime']],
    'America/New_York'
  );
  const puDate = puDateTime.format('YYYY-MM-DD');
  const puHour = puDateTime.hour();

  if (!trips[pickupLocation][dropoffLocation][puDate]) {
    trips[pickupLocation][dropoffLocation][puDate] = {};
  }

  if (!trips[pickupLocation][dropoffLocation][puDate][puHour]) {
    rowsToCreate++;
    trips[pickupLocation][dropoffLocation][puDate][puHour] = {
      totalPassengers: 0,
      totalDistance: 0,
      totalTrips: 0,
      totalAmount: 0,
    };
  }

  trips[pickupLocation][dropoffLocation][puDate][
    puHour
  ].totalPassengers += parseInt(row[columnMap['passenger_count']]);
  trips[pickupLocation][dropoffLocation][puDate][
    puHour
  ].totalDistance += parseFloat(row[columnMap['trip_distance']]);
  trips[pickupLocation][dropoffLocation][puDate][puHour].totalTrips += 1;
  trips[pickupLocation][dropoffLocation][puDate][
    puHour
  ].totalAmount += parseFloat(row[columnMap['total_amount']]);
}

async function afterProcess(rowCount) {
  console.log(`Parsed ${rowCount} rows`);

  for (const [pickupLocation, dropOffs] of Object.entries(trips)) {
    for (const [dropOffLocation, puDates] of Object.entries(dropOffs)) {
      for (const [puDate, puHours] of Object.entries(puDates)) {
        for (const [puHour, values] of Object.entries(puHours)) {
          let data = {
            taxi_type_id: taxiType,
            pickup_borough_id: pickupLocation,
            dropoff_borough_id: dropOffLocation,
            pickup_date: puDate,
            pickup_hour: puHour,
            total_trips: values.totalTrips,
          };
          if (stats) {
            data.average_passengers =
              values.totalPassengers / values.totalTrips;
            data.total_passengers = values.totalPassengers;
            data.average_distance = values.totalDistance / values.totalTrips;
            data.total_distance = values.totalDistance;
            data.average_amount = values.totalAmount / values.totalTrips;
            data.total_amount = values.totalAmount;
          }

          try {
            await models.trip_summaries.create(data);
          } catch (e) {
            console.log('Error creating trip summary:');
            console.log(JSON.stringify(data, null, 2));
            console.log(e);
          }
        }
      }
    }
  }
}

(async () => {
  try {
    if (!process.argv[2]) {
      console.error(
        'Please pass the taxi data csv file as the first argument.'
      );
      return;
    }

    const filename = process.argv[2];

    if (filename.indexOf('green') >= 0) {
      columnMap = greenColumnMap;
    } else if (filename.indexOf('yellow') >= 0) {
      columnMap = yellowColumnMap;
      taxiType = 2;
    } else if (filename.indexOf('fhv') >= 0) {
      columnMap = fhvColumnMap;
      taxiType = 3;
      // FHV doesn't have stats data
      stats = false;
    } else {
      console.error('Unknown file type.');
      return;
    }

    const boroughs = await models.boroughs.findAll({ raw: true });
    boroughs.forEach((borough) => {
      boroughMap[borough.id] = borough.name;
      boroughMap[borough.name] = borough.id;
    });

    const locations = await models.locations.findAll({ raw: true });
    locations.forEach((location) => {
      locationMap[location.id] = location.borough;
      locationMap[location.borough] = location.id;
    });

    console.log(filename);

    fs.createReadStream(filename)
      .pipe(csv.parse())
      .on('error', (error) => console.error(error))
      .on('data', processRow)
      .on('end', afterProcess);
  } catch (e) {
    console.log(e);
  }
})();

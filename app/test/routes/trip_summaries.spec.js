const MockExpressResponse = require('mock-express-response');
let tripSummaryRoute = require('../../routes/trip_summaries');

jest.mock('../../db', () => {
  const SequelizeMock = require('sequelize-mock');
  const DBConnectionMock = new SequelizeMock();
  const TripSummary = DBConnectionMock.define(
    'trip_summaries',
    {
      id: 1,
      taxi_type_id: 1,
      pickup_borough_id: 1,
      dropoff_borough_id: 2,
      pickup_date: '2018-01-01',
      pickup_hour: 0,
      average_passengers: 1.5,
      total_passengers: 3,
      average_distance: 75,
      total_distance: 150,
      total_trips: 2,
      average_amount: 30,
      total_amount: 60,
    },
    {
      timestamps: false,
    }
  );

  TripSummary.$queueResult([
    TripSummary.build(),
    TripSummary.build(),
    TripSummary.build(),
  ]);

  return {
    models: {
      trip_summaries: TripSummary,
    },
  };
});

describe('Test Basic getAll', () => {
  it('Should return all the records', async () => {
    const response = new MockExpressResponse();

    await tripSummaryRoute.getAll({ query: {} }, response);
    const json = response._getJSON();

    expect(json.length).toEqual(3);
    expect(json[0].id).toEqual(1);
  });
});

describe('Test Date Filter', () => {
  it('Should filter by date', async () => {
    const response = new MockExpressResponse();
    await tripSummaryRoute.getAll(
      { query: { pickup_date: '2018-01-02' } },
      response
    );

    const json = response._getJSON();
    expect(json[0].pickup_date).toEqual('2018-01-02');
  });

  it('Should filter by hour', async () => {
    const response = new MockExpressResponse();
    await tripSummaryRoute.getAll({ query: { pickup_hour: 5 } }, response);

    const json = response._getJSON();
    expect(json[0].pickup_hour).toEqual(5);
  });

  it('Should filter by pickup borough', async () => {
    const response = new MockExpressResponse();
    await tripSummaryRoute.getAll(
      { query: { pickup_borough_id: 2 } },
      response
    );

    const json = response._getJSON();
    expect(json[0].pickup_borough_id).toEqual(2);
  });

  it('Should filter by dropoff borough', async () => {
    const response = new MockExpressResponse();
    await tripSummaryRoute.getAll(
      { query: { dropoff_borough_id: 3 } },
      response
    );

    const json = response._getJSON();
    expect(json[0].dropoff_borough_id).toEqual(3);
  });

  it('Should filter by taxi type', async () => {
    const response = new MockExpressResponse();
    await tripSummaryRoute.getAll({ query: { taxi_type_id: 1 } }, response);

    const json = response._getJSON();
    expect(json[0].taxi_type_id).toEqual(1);
  });
});

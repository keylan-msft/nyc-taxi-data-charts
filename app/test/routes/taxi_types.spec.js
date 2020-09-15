const MockExpressResponse = require('mock-express-response');
let taxiTypesRoute = require('../../routes/taxi_types');

jest.mock('../../db', () => {
  const SequelizeMock = require('sequelize-mock');
  const DBConnectionMock = new SequelizeMock();

  const TaxiType = DBConnectionMock.define(
    'taxi_types',
    {
      id: 1,
      name: 'Cool Taxi',
    },
    {
      timestamps: false,
    }
  );

  TaxiType.$queueResult([TaxiType.build(), TaxiType.build(), TaxiType.build()]);

  return {
    models: {
      taxi_types: TaxiType,
    },
  };
});

describe('Test Basic getAll', () => {
  it('Should return all the records', async () => {
    const response = new MockExpressResponse();

    await taxiTypesRoute.getAll({ query: {} }, response);
    const json = response._getJSON();

    expect(json.length).toEqual(3);
    expect(json[0].id).toEqual(1);
  });
});

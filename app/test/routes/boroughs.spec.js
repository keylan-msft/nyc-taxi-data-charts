const MockExpressResponse = require('mock-express-response');
let boroughRoute = require('../../routes/boroughs');

jest.mock('../../db', () => {
  const SequelizeMock = require('sequelize-mock');
  const DBConnectionMock = new SequelizeMock();

  const Borough = DBConnectionMock.define(
    'boroughs',
    {
      id: 1,
      name: 'Cool Borough',
    },
    {
      timestamps: false,
    }
  );

  Borough.$queueResult([Borough.build(), Borough.build(), Borough.build()]);

  return {
    models: {
      boroughs: Borough,
    },
  };
});

describe('Test Basic getAll', () => {
  it('Should return all the records', async () => {
    const response = new MockExpressResponse();

    await boroughRoute.getAll({ query: {} }, response);
    const json = response._getJSON();

    expect(json.length).toEqual(3);
    expect(json[0].id).toEqual(1);
  });
});

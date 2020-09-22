import { shallowMount, createLocalVue } from '@vue/test-utils';
import { BootstrapVue } from 'bootstrap-vue';
import App from '../../src/App.vue';
import axios from 'axios';

jest.mock('axios');

const localVue = createLocalVue();

localVue.use(BootstrapVue);

describe('manage data', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('can mount', async () => {
    axios.all = jest
      .fn()
      .mockResolvedValue([
        { data: [{ pickup_hour: 0, total_trips: 1 }] },
        { data: [{ pickup_hour: 1, total_trips: 2 }] },
        { data: [{ pickup_hour: 2, total_trips: 3 }] }
      ]);
    const wrapper = shallowMount(App, {
      localVue,
      mocks: {
        $api: {
          get: jest.fn().mockReturnValue({
            data: []
          })
        }
      }
    });

    expect(wrapper.is(App)).toBe(true);
  });

  it('can filter', async () => {
    axios.all = jest
      .fn()
      .mockResolvedValue([
        { data: [{ pickup_hour: 0, total_trips: 1 }] },
        { data: [{ pickup_hour: 1, total_trips: 2 }] },
        { data: [{ pickup_hour: 2, total_trips: 3 }] }
      ]);

    const mockGet = jest.fn().mockReturnValue({
      data: []
    });

    await shallowMount(App, {
      localVue,
      mocks: {
        $api: {
          get: mockGet
        }
      },
      data: function() {
        return {
          pickup: 1,
          dropoff: 2,
          tripDate: '2018-01-02'
        };
      }
    });

    expect(mockGet).toHaveBeenCalledTimes(4);

    expect(mockGet).toHaveBeenCalledWith(
      '/api/trip_summaries?taxi_type_id=1&pickup_date=2018-01-02&pickup_borough_id=1&dropoff_borough_id=2'
    );
    expect(mockGet).toHaveBeenCalledWith(
      '/api/trip_summaries?taxi_type_id=2&pickup_date=2018-01-02&pickup_borough_id=1&dropoff_borough_id=2'
    );
    expect(mockGet).toHaveBeenCalledWith(
      '/api/trip_summaries?taxi_type_id=3&pickup_date=2018-01-02&pickup_borough_id=1&dropoff_borough_id=2'
    );
  });
});

<template>
  <div id="app">
    <h3>Total Trips By Taxi Type By Hour</h3>
    <label for="tripDate">Date</label>
    <b-form-datepicker
      id="tripDate"
      size="sm"
      v-model="tripDate"
      :min="minDate"
      :max="maxDate"
    ></b-form-datepicker>
    <label for="pickupBorough">Pickup Borough</label>
    <b-form-select
      id="pickupBorough"
      v-model="pickup"
      :options="boroughs"
    ></b-form-select>
    <label for="dropoffBorough">Dropoff Borough</label>
    <b-form-select
      id="dropoffBorough"
      v-model="dropoff"
      :options="boroughs"
    ></b-form-select>
    <bar v-if="loaded" :chartData="numTripData" :options="numTripOptions" />
  </div>
</template>

<script>
import bar from './components/bar.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    bar
  },
  data() {
    return {
      loaded: false,
      boroughs: [],
      pickup: null,
      dropoff: null,
      tripDate: '2018-01-01',
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2018, 0, 31),
      numTripData: {
        labels: [...Array(24).keys()]
      },
      numTripOptions: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Hour of Day'
              },
              stacked: true
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: '# of Trips'
              },
              stacked: true,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    async setData() {
      // Pre-populate all hours with 0 trips
      const greenData = Array(24).fill(0);
      const yellowData = Array(24).fill(0);
      const fhvData = Array(24).fill(0);

      let filters = [`pickup_date=${this.tripDate}`];

      this.loaded = false;

      // borough filters
      if (this.pickup) {
        filters.push(`pickup_borough_id=${this.pickup}`);
      }
      if (this.dropoff) {
        filters.push(`dropoff_borough_id=${this.dropoff}`);
      }

      try {
        const [greenTripData, yellowTripData, fhvTripData] = await axios.all([
          this.$api.get(
            '/api/trip_summaries?taxi_type_id=1&' + filters.join('&')
          ),
          this.$api.get(
            '/api/trip_summaries?taxi_type_id=2&' + filters.join('&')
          ),
          this.$api.get(
            '/api/trip_summaries?taxi_type_id=3&' + filters.join('&')
          )
        ]);

        // Format the data for charts.js
        greenTripData.data.forEach(trip => {
          greenData[trip.pickup_hour] += trip.total_trips;
        });
        yellowTripData.data.forEach(trip => {
          yellowData[trip.pickup_hour] += trip.total_trips;
        });
        fhvTripData.data.forEach(trip => {
          fhvData[trip.pickup_hour] += trip.total_trips;
        });
      } catch (e) {
        console.log(e);
      }

      this.numTripData.datasets = [
        {
          label: 'FHV Trips',
          data: fhvData,
          fill: false,
          backgroundColor: 'rgba(153, 102, 255, 0.3)'
        },
        {
          label: 'Green Taxi Trips',
          data: greenData,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.3)'
        },
        {
          label: 'Yellow Taxi Trips',
          data: yellowData,
          fill: false,
          backgroundColor: 'rgba(255, 205, 86, 0.3)'
        }
      ];
      this.loaded = true;
    }
  },
  async mounted() {
    let self = this;

    try {
      // Load boroughs for filters
      const boroughs = await this.$api.get('/api/boroughs');

      // Combine boroughs from api with default Any value
      self.boroughs = [
        { value: null, text: 'Any' },
        ...boroughs.data.map(borough => ({
          value: borough.id,
          text: borough.name
        }))
      ];
    } catch (e) {
      console.log(e);
    }

    this.setData();
  },
  watch: {
    tripDate: function() {
      this.setData();
    },
    pickup: function() {
      this.setData();
    },
    dropoff: function() {
      this.setData();
    }
  }
};
</script>

<style>
#app {
  width: 50%;
}
</style>

<script>
import { Bar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    console.log(this.chartData, this.options);
    this.renderChart(this.chartData, this.options);
  }
};
</script>

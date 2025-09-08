<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleBand } from "d3-scale";
  import { BarChart } from "layerchart";

  let {
    data = [
     { month: "January",  planeada: 186, real: 80 },
     { month: "February", planeada: 305, real: 200 },
     { month: "March", planeada: 237, real: 120 },
     { month: "April", planeada: 73, real: 190 },
     { month: "May", planeada: 209, real: 130 },
     { month: "June", planeada: 214, real: 140 }
    ],
    config = {
     planeada: {
      label: "Planeada",
      color: "#2563eb"
     },
     real: {
      label: "Real",
      color: "#60a5fa"
     }
    } satisfies Chart.ChartConfig
  } = $props();
 </script>
  
 <Chart.Container config={config} class="min-h-[200px] w-full">
  <BarChart
   data={data}
   xScale={scaleBand().padding(0.25)}
   x="month"
   axis="x"
   seriesLayout="group"
   legend
   series={[
    {
     key: "planeada",
     label: config.planeada.label,
     color: config.planeada.color
    },
    {
     key: "real",
     label: config.real.label,
     color: config.real.color
    }
   ]}
  >
  {#snippet tooltip()}
      <Chart.Tooltip />
  {/snippet}
  </BarChart>
 </Chart.Container>
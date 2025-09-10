<script lang="ts">
    import { LineChart } from "layerchart";
    import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
    import { scaleUtc } from "d3-scale";
    import { curveNatural } from "d3-shape";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";

    let {
      data = [
        { date: new Date("2024-01-01"), desktop: 186, mobile: 80 },
        { date: new Date("2024-02-01"), desktop: 305, mobile: 200 },
        { date: new Date("2024-03-01"), desktop: 237, mobile: 120 },
        { date: new Date("2024-04-01"), desktop: 73, mobile: 190 },
        { date: new Date("2024-05-01"), desktop: 209, mobile: 130 },
        { date: new Date("2024-06-01"), desktop: 214, mobile: 140 },
      ],
      seriesKeys = ['desktop', 'mobile'],
      seriesLabels = ['Desktop', 'Mobile'],
      seriesColors = ['var(--chart-1)', 'var(--chart-2)'],
      title = "Line Chart - Multiple",
      description = "Showing total visitors for the last 6 months"
    } = $props();

    const chartConfig = {
      [seriesKeys[0]]: { label: seriesLabels[0], color: seriesColors[0] },
      [seriesKeys[1]]: { label: seriesLabels[1], color: seriesColors[1] },
    } satisfies Chart.ChartConfig;
  </script>
  
  <Card.Root>
    <Card.Header>
      <Card.Title>{title}</Card.Title>
      <Card.Description>{description}</Card.Description>
    </Card.Header>
    <Card.Content class="h-[200px] w-full">
      <Chart.Container config={chartConfig} class="h-full w-full">
        <LineChart
          data={data}
          x="date"
          xScale={scaleUtc()}
          axis="x"
          series={[
            {
              key: seriesKeys[0],
              label: seriesLabels[0],
              color: seriesColors[0],
            },
            {
              key: seriesKeys[1],
              label: seriesLabels[1],
              color: seriesColors[1],
            },
          ]}
          props={{
            spline: { curve: curveNatural, motion: "tween", strokeWidth: 2 },
            xAxis: {
              format: (v: Date) => v.toLocaleDateString("en-US", { month: "short" }),
            },
            highlight: { points: { r: 4 } },
          }}
        >
          {#snippet tooltip()}
            <Chart.Tooltip hideLabel />
          {/snippet}
        </LineChart>
      </Chart.Container>
    </Card.Content>
    <Card.Footer>
      <div class="flex w-full items-start gap-2 text-sm">
        <div class="grid gap-2">
          <div class="flex items-center gap-2 font-medium leading-none">
            Tendencia a la alta de 5.2% este mes <TrendingUpIcon class="size-4" />
          </div>
          <div class="text-muted-foreground flex items-center gap-2 leading-none">
            Enero - Junio 2024
          </div>
        </div>
      </div>
    </Card.Footer>
  </Card.Root>
  
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { Arc, ArcChart, Text } from "layerchart";
    import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
  
    const chartData = [
      // { browser: "other", visitors: 90, color: "var(--color-other)" },
      { browser: "Partidas", visitors: 173, color: "var(--color-edge)" },
      { browser: "Subpartidas", visitors: 187, color: "var(--color-firefox)" },
      { browser: "Conceptos", visitors: 200, color: "var(--color-safari)" },
      { browser: "Subconceptos", visitors: 275, color: "var(--color-chrome)" },
    ];
  
    const chartConfig = {
      visitors: { label: "Visitors" },
      chrome: { label: "Chrome", color: "var(--chart-1)" },
      safari: { label: "Safari", color: "var(--chart-2)" },
      firefox: { label: "Firefox", color: "var(--chart-3)" },
      edge: { label: "Edge", color: "var(--chart-4)" },
      // other: { label: "Other", color: "var(--chart-5)" },
    } satisfies Chart.ChartConfig;
    let {
      title = "Progreso Total",
      description = "Avance total por concepto"
    } = $props();
  </script>

  <Card.Root class="h-[450px] flex flex-col">
    <Card.Header class="items-center flex-shrink-0 h-[70px] overflow-hidden">
      <Card.Title class="text-sm font-medium leading-tight line-clamp-2">{title}</Card.Title>
      <Card.Description class="text-xs leading-tight line-clamp-1">{description}</Card.Description>
    </Card.Header>
    <Card.Content class="flex-1 flex items-center justify-center min-h-0 overflow-hidden h-[350px]">
      <Chart.Container config={chartConfig} class="h-full w-full max-h-[300px] max-w-[300px]">
        <ArcChart
          label="browser"
          value="visitors"
          outerRadius={-17}
          innerRadius={-15}
          padding={30}
          range={[180, -180]}
          maxValue={Math.max(...chartData.map((d) => d.visitors)) + 0}
          series={chartData.map((d) => ({
            key: d.browser,
            color: d.color,
            data: [d],
            label: d.browser,
          }))}
          props={{
            arc: { track: { fill: "var(--muted)" }, motion: "tween" },
            tooltip: { context: { hideDelay: 350 } },
          }}
        >
          {#snippet tooltip()}
            <Chart.Tooltip hideLabel nameKey="browser" />
          {/snippet}
          {#snippet arc({ props, seriesIndex, visibleSeries })}
            <Arc {...props}>
              {#snippet children({ getTrackTextProps })}
                <Text
                  {...getTrackTextProps("middle", { startOffset: "1%" })}
                  class="pointer-events-none select-none capitalize"
                  value={visibleSeries[seriesIndex].label}
                  fill="white"
                />
              {/snippet}
            </Arc>
          {/snippet}
        </ArcChart>
      </Chart.Container>
    </Card.Content>
    <Card.Footer class="flex-col gap-1 text-sm flex-shrink-0 h-[30px]">
      <div class="flex items-center gap-2 font-medium leading-none">
        Trending up by 5.2% this month <TrendingUpIcon class="size-4" />
      </div>
      <div class="text-muted-foreground flex items-center gap-2 leading-none">
        January - June 2024
      </div>
    </Card.Footer>
  </Card.Root>
  
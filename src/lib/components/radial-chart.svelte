<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { ArcChart, Text } from "layerchart";
    import TrendingUpIcon from "@lucide/svelte/icons/trending-up";

    let {
      title = "Radial Chart",
      description = "Showing total visitors for the last 6 months",
      value = 200,
      color = "var(--color-safari)"
    } = $props();

    const chartData = [{ browser: "safari", visitors: value, color }];
    const chartConfig = {
      visitors: { label: "Visitors" },
      safari: { label: "Safari", color: "var(--chart-2)" },
    } satisfies Chart.ChartConfig;
  </script>
  
  <Card.Root class="h-[350px] flex flex-col">
    <Card.Header class="items-center flex-shrink-0 h-[70px] overflow-hidden">
      <Card.Title class="text-sm font-medium leading-tight line-clamp-2">{title}</Card.Title>
      <Card.Description class="text-xs leading-tight line-clamp-1">{description}</Card.Description>
    </Card.Header>
    <Card.Content class="flex-1 flex items-center justify-center min-h-0 overflow-hidden h-[230px]">
      <Chart.Container config={chartConfig} class="h-full w-full max-h-[196px] max-w-[196px]">
        <ArcChart
          label="browser"
          value="visitors"
          outerRadius={75}
          innerRadius={60}
          padding={8}
          range={[90, -270]}
          maxValue={100}
          cornerRadius={8}
          series={chartData.map((d) => ({
            key: d.browser,
            color: d.color,
            data: [d],
          }))}
          props={{
            arc: { track: { fill: "var(--muted)" }, motion: "tween" },
            tooltip: { context: { hideDelay: 350 } },
          }}
          tooltip={false}
        >
          {#snippet belowMarks()}
            <circle cx="0" cy="0" r="0" class="fill-background" />
          {/snippet}
  
          {#snippet aboveMarks()}
            <Text
              value={String(value)+"%"}
              textAnchor="middle"
              verticalAnchor="middle"
              class="fill-foreground text-4xl! font-bold"
              dy={3}
            />
            <Text
              value="Progreso"
              textAnchor="middle"
              verticalAnchor="middle"
              class="fill-muted-foreground!"
              dy={22}
            />
          {/snippet}
        </ArcChart>
      </Chart.Container>
    </Card.Content>
    <Card.Footer class="flex-col gap-1 text-sm flex-shrink-0 h-[30px]">

    </Card.Footer>
  </Card.Root>
  
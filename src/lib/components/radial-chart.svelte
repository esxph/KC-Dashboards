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
  
  <Card.Root>
    <Card.Header class="items-center">
      <Card.Title>{title}</Card.Title>
      <Card.Description>{description}</Card.Description>
    </Card.Header>
    <Card.Content class="flex-1 min-h-[140px] flex items-center justify-center">
      <Chart.Container config={chartConfig} class="h-[140px] w-[140px] sm:h-[168px] sm:w-[168px] md:h-[196px] md:w-[196px]">
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
            <circle cx="0" cy="0" r="25" class="fill-background" />
          {/snippet}
  
          {#snippet aboveMarks()}
            <Text
              value={String(value)}
              textAnchor="middle"
              verticalAnchor="middle"
              class="fill-foreground text-4xl! font-bold"
              dy={3}
            />
            <Text
              value="Progress"
              textAnchor="middle"
              verticalAnchor="middle"
              class="fill-muted-foreground!"
              dy={22}
            />
          {/snippet}
        </ArcChart>
      </Chart.Container>
    </Card.Content>
    <Card.Footer class="flex-col gap-2 text-sm">
      <div class="flex items-center gap-2 font-medium leading-none">
        Progress: {value}% <TrendingUpIcon class="size-4" />
      </div>
      <div class="text-muted-foreground flex items-center gap-2 leading-none">
        Current Status
      </div>
    </Card.Footer>
  </Card.Root>
  
<script lang="ts">
  import { BarChart, Highlight } from 'layerchart';
  import * as Card from '$lib/components/ui/card/index.js';

  type Datum = { date: Date; value: number; baseline: number };

  let { data, color = 'fill-blue-600' }: { data: Datum[]; color?: string } = $props();

  const primaryColor = $derived(
    color === 'fill-blue-600' ? '#2563eb' : color?.startsWith('#') ? color : '#2563eb'
  );
</script>

<Card.Root class="flex flex-col h-full overflow-hidden">
  <Card.Header class="items-center pb-0 flex-shrink-0">
    <Card.Title class="text-xs font-medium leading-tight">Tendencia</Card.Title>
    <Card.Description class="text-xs leading-tight">Serie temporal de avance</Card.Description>
  </Card.Header>
  <Card.Content class="flex-1 p-1 overflow-hidden">
    <div class="h-[300px] p-4 border rounded-sm">
      <BarChart
        data={data}
        x="date"
        y="value"
        series={[
          { key: 'baseline', color: 'var(--color-surface-content)', props: { fillOpacity: 0.2 } },
          { key: 'value', color: primaryColor, props: { insets: { x: 8 } } }
        ]}
        props={{ highlight: { area: false } }}
      />
      {#snippet belowMarks()}
        <Highlight area={{ class: "fill-surface-content/10" }} />
      {/snippet}
    </div>
  </Card.Content>
  
</Card.Root>



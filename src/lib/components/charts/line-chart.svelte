<script lang="ts">
  import { LineChart } from 'layerchart';
  import * as Card from '$lib/components/ui/card/index.js';

  type DataPoint = { date: Date; [key: string]: number | Date };
  type SeriesItem = { key: string; color: string; props?: Record<string, unknown> };

  const defaultSeries: SeriesItem[] = [
    { key: 'apples', color: '#2563eb' },
    { key: 'bananas', color: '#2563eb' },
    { key: 'oranges', color: '#2563eb' } // Change color, its not showing up on screen
  ];

  let {
    data,
    series = defaultSeries,
    onPointClick,
    x = 'date'
  }: {
    data: DataPoint[];
    series?: SeriesItem[];
    onPointClick?: (e: Event, detail: unknown) => void;
    x?: string;
  } = $props();
</script>

<Card.Root class="flex flex-col h-full overflow-hidden">
  <Card.Header class="items-center pb-0 flex-shrink-0">
    <Card.Title class="text-xs font-medium leading-tight">Tendencia</Card.Title>
    <Card.Description class="text-xs leading-tight">Serie temporal comparativa</Card.Description>
  </Card.Header>
  <Card.Content class="flex-1 p-1 overflow-hidden">
    <div class="h-[300px] p-4 border rounded-sm">
      <LineChart {data} {x} {series} {onPointClick} />
    </div>
  </Card.Content>
</Card.Root>



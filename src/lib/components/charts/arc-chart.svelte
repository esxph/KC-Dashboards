<script lang="ts">
	import { Arc, Chart, Svg, Text } from 'layerchart';
	import * as Card from '$lib/components/ui/card/index.js';

	let { title, description, value, color = 'fill-blue-600' } = $props();
</script>

<Card.Root class="flex flex-col h-full overflow-hidden">
	<Card.Header class="items-center pb-0 flex-shrink-0">
		<Card.Title class="text-xs font-medium leading-tight">{title}</Card.Title>
		<Card.Description class="text-xs leading-tight">{description}</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1 flex items-center justify-center p-1 overflow-hidden">
		<div class="w-full h-full flex items-center justify-center">
			<div class="w-full h-full max-w-[160px] max-h-[160px] md:max-w-[200px] md:max-h-[200px]">
				<Chart>
					<Svg center>
						<Arc
							{value}
							domain={[0, 100]}
							range={[-120, 120]}
							innerRadius={60}
							outerRadius={75}
							cornerRadius={8}
							class={color}
							track={{ class: 'fill-muted' }}
						>
							<Text
								value={value + '%'}
								textAnchor="middle"
								verticalAnchor="middle"
								class="fill-foreground text-xl! font-bold md:text-2xl!"
								dy={2}
							/>
						</Arc>
					</Svg>
				</Chart>
			</div>
		</div>
	</Card.Content>
</Card.Root>

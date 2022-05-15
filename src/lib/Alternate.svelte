<script>
	export let color;
	export let saturationAlt, valueAlt;
</script>

<div class="flex flex-col">
	<div class="h-20" style="background-color: {color}" />
	<div class="text-white text-center bg-zinc-700">
		{color}
	</div>
	<div class="text-white text-center bg-zinc-700">
		S: {Math.round(saturationAlt)}
	</div>
	<div class="text-white text-center bg-zinc-700">
		V: {Math.round(valueAlt)}
	</div>
	<!-- <div class="text-white text-center bg-zinc-700">
		{Object.keys(satVal)[0]}
	</div>
	<div class="text-white text-center bg-zinc-700">
		{Object.values(satVal)[0]}
	</div> -->
</div>

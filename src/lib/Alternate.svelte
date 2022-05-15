<script>
	export let color;
	// export let satVal;
</script>

<div class="flex flex-col">
	<div class="h-20" style="background-color: {color}" />
	<div class="text-white text-center bg-zinc-700">
		{color}
	</div>
	<!-- <div class="text-white text-center bg-zinc-700">
		{Object.keys(satVal)[0]}
	</div>
	<div class="text-white text-center bg-zinc-700">
		{Object.values(satVal)[0]}
	</div> -->
</div>

<script>
	import Slider from '$lib/Slider.svelte';
	import Alternate from '$lib/Alternate.svelte';

	let hue = Math.floor(Math.random() * 360);
	let saturation = Math.floor(Math.random() * 100);
	let value = Math.floor(Math.random() * 100);
	let colorText;
	let satIncrement = 5;
	let valIncrement = 5;

	$: randomColor = hslToHex(hue, saturation, value);

	$: saturation0 = hslToHex(hue, 0, value);
	$: saturation100 = hslToHex(hue, 50, value);
	$: value0 = hslToHex(hue, saturation, 10);
	$: value100 = hslToHex(hue, saturation, 90);

	$: saturationAlt = [
		Math.max(0, Math.min(saturation - satIncrement * 3, 100)),
		Math.max(0, Math.min(saturation - satIncrement * 2, 100)),
		Math.max(0, Math.min(saturation - satIncrement * 1, 100)),
		Math.max(0, Math.min(saturation + satIncrement * 1, 100)),
		Math.max(0, Math.min(saturation + satIncrement * 2, 100)),
		Math.max(0, Math.min(saturation + satIncrement * 3, 100))
	];
	$: valueAlt = [
		Math.max(0, Math.min(value + valIncrement * 3, 100)),
		Math.max(0, Math.min(value + valIncrement * 2, 100)),
		Math.max(0, Math.min(value + valIncrement * 1, 100)),
		Math.max(0, Math.min(value - valIncrement * 1, 100)),
		Math.max(0, Math.min(value - valIncrement * 2, 100)),
		Math.max(0, Math.min(value - valIncrement * 3, 100))
	];
	let satVal = {};
	// $: saturationAlt.forEach((key, i) => {
	// 	satVal[key] = valueAlt[i];
	// });

	$: color2 = hslToHex(hue, saturationAlt[0], valueAlt[0]);
	$: color3 = hslToHex(hue, saturationAlt[1], valueAlt[1]);
	$: color4 = hslToHex(hue, saturationAlt[2], valueAlt[2]);
	$: color5 = hslToHex(hue, saturationAlt[3], valueAlt[3]);
	$: color6 = hslToHex(hue, saturationAlt[4], valueAlt[4]);
	$: color7 = hslToHex(hue, saturationAlt[5], valueAlt[5]);
	$: value > 50 ? (colorText = '#000') : (colorText = '#fff');

	function hslToHex(h, s, l) {
		l /= 100;
		let a = (s * Math.min(l, 1 - l)) / 100;
		let f = (n) => {
			let k = (n + h / 30) % 12;
			let color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0'); // convert to Hex and prefix "0" if needed
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}

	function hexToHSL(H) {
		// Convert hex to RGB first
		let r = 0,
			g = 0,
			b = 0;
		if (H.length == 4) {
			r = '0x' + H[1] + H[1];
			g = '0x' + H[2] + H[2];
			b = '0x' + H[3] + H[3];
		} else if (H.length == 7) {
			r = '0x' + H[1] + H[2];
			g = '0x' + H[3] + H[4];
			b = '0x' + H[5] + H[6];
		}
		// Then to HSL
		r /= 255;
		g /= 255;
		b /= 255;
		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;

		h = Math.round(h * 60);

		if (h < 0) h += 360;

		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		hue = h;
		saturation = s;
		value = l;

		return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	}
</script>

<main class=" h-screen w-screen flex bg-zinc-800 items-center justify-center">
	<div class="w-full px-4 rounded-md shadow-xl sm:w-2/3 lg:w-1/2 max-w-4xl">
		<div
			class="top rounded-t-md bg-red-600 p-8 h-80 flex flex-col"
			style="background-color: {randomColor}"
		>
			<div class="grow" />
			<div class="self-end ">
				<input
					type="text"
					class="input-text mt-8 w-24 focus:border-0 focus:ring-0 text-center"
					bind:value={randomColor}
					on:input={() => hexToHSL(randomColor)}
					style="background-color: {color4}; color: {colorText}"
				/>
			</div>
		</div>
		<div class="grid grid-flow-col grid-cols-6 middle">
			<Alternate color={color2} {satVal} />
			<Alternate color={color3} {satVal} />
			<Alternate color={color4} {satVal} />
			<Alternate color={color5} {satVal} />
			<Alternate color={color6} {satVal} />
			<Alternate color={color7} {satVal} />
		</div>
		<div class="bottom rounded-b-md p-8 flex flex-col space-y-2 bg-stone-100">
			<Slider
				bind:data={hue}
				min={0}
				max={360}
				background="background: linear-gradient(to right, #d42b2b 0%, #cdcd32 17%, #54ab54 33%, #55aaaa 50%, #2020df 67%, #ab54ab 83%, #d42b2b 100%);"
			/>
			<Slider
				bind:data={saturation}
				background="background: linear-gradient(to right, {saturation0}, {saturation100});"
			/>
			<Slider
				bind:data={value}
				background="background: linear-gradient(to right, {value0}, {value100});"
			/>
			<div class="md:flex md:space-x-4">
				<Slider
					bind:data={satIncrement}
					background="background: linear-gradient(to right, #e0e0e0, 
#11110d)"
					min={0}
					max={15}
					step={0.1}>Saturation Delta</Slider
				>
				<Slider
					bind:data={valIncrement}
					background="background: linear-gradient(to right, #e0e0e0, 
#11110d)"
					min={0}
					max={10}
					step={0.1}>Value Delta</Slider
				>
			</div>
		</div>
	</div>
</main>

<script>
	import { Motion } from 'svelte-motion';
	import { tweened } from 'svelte/motion';
	import { sineOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	import Slider from '$lib/Slider.svelte';
	import Alternate from '$lib/Alternate.svelte';

	const hue = tweened(Math.floor(Math.random() * 360), {
		duration: 100,
		easing: sineOut
	});

	const saturation = tweened(Math.floor(Math.random() * 100), {
		duration: 100,
		easing: sineOut
	});

	const value = tweened(Math.floor(Math.random() * 100), {
		duration: 100,
		easing: sineOut
	});

	let colorText;
	let satIncrement = 5;
	let valIncrement = 5;
	let hueIncrement = 15;

	$: randomColor = hslToHex($hue, $saturation, $value);

	$: saturation0 = hslToHex($hue, 0, $value);
	$: saturation100 = hslToHex($hue, 50, $value);
	$: value0 = hslToHex($hue, $saturation, 10);
	$: value100 = hslToHex($hue, $saturation, 90);

	let incrementList = [3, 2, 1, -1, -2, -3];
	$: saturationAlt = incrementList.map((increment) => {
		return Math.max(0, Math.min($saturation - increment * satIncrement, 100));
	});
	$: valueAlt = incrementList.map((increment) => {
		return Math.max(0, Math.min($value + increment * valIncrement, 100));
	});
	$: hueAlt = incrementList.map((increment) => {
		return Math.max(0, Math.min($hue - increment * hueIncrement, 360));
	});
	$: newHue = hueAlt.map((hue) => {
		return hslToHex(hue, $saturation, $value);
	});

	$: color2 = hslToHex($hue, saturationAlt[5], valueAlt[5]);
	$: color3 = hslToHex($hue, saturationAlt[4], valueAlt[4]);
	$: color4 = hslToHex($hue, saturationAlt[3], valueAlt[3]);
	$: color5 = hslToHex($hue, saturationAlt[2], valueAlt[2]);
	$: color6 = hslToHex($hue, saturationAlt[1], valueAlt[1]);
	$: color7 = hslToHex($hue, saturationAlt[0], valueAlt[0]);
	$: $value > 50 ? (colorText = '#11110d') : (colorText = '#e0e0e0');
	$: console.log($hue);

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

		hue.set(h);
		saturation.set(s);
		value.set(l);

		return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	}

	async function copy(color) {
		await navigator.clipboard.writeText(color);
	}

	function changeColor(event) {
		hexToHSL(event.detail);
	}

	function random() {
		hue.set(Math.floor(Math.random() * 360));
		saturation.set(Math.floor(Math.random() * 100));
		value.set(Math.floor(Math.random() * 100));
		satIncrement = Math.floor(Math.random() * 10);
		valIncrement = Math.floor(Math.random() * 10);
	}
</script>

<main
	class="h-screen w-screen items-center justify-center flex bg-zinc-800 rounded-lg overflow-y-auto flex-col "
>
	<div
		class="main-card w-full sm:w-2/3 lg:w-5/6 max-w-6xl flex flex-col lg:flex-row lg:space-x-8 shadow-xl lg:shadow-none"
	>
		<div class="color-portion lg:shadow-xl flex flex-col lg:w-1/2">
			<div
				class="main-color rounded-t-md p-8 h-60 md:h-80 flex flex-col"
				style="background-color: {randomColor}"
			>
				<div class="placeholder grow" />
				<div
					class="color-input self-end flex items-center justify-center rounded-md"
					style="background-color: {color4}; color: {colorText}"
				>
					<input
						type="text"
						class="input-text pr-0 w-20 focus:border-0 focus:ring-0 text-center"
						bind:value={randomColor}
						on:change={() => hexToHSL(randomColor)}
						style="background-color: {color4}; color: {colorText}"
					/>
					<div
						class="cursor-pointer pr-1 rounded-r-md"
						on:click={() => {
							copy(randomColor);
						}}
						style="color: {colorText}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div
				class="alternate-colors lg:shadow-xl grid grid-cols-3 sm:grid-cols-6 middle rounded-md bg-zinc-700"
			>
				<Alternate
					on:changeColor={changeColor}
					color={color2}
					saturationAlt={saturationAlt[5]}
					valueAlt={valueAlt[5]}
				/>
				<Alternate
					on:changeColor={changeColor}
					color={color3}
					saturationAlt={saturationAlt[4]}
					valueAlt={valueAlt[4]}
				/>
				<Alternate
					on:changeColor={changeColor}
					color={color4}
					saturationAlt={saturationAlt[3]}
					valueAlt={valueAlt[3]}
				/>
				<Alternate
					on:changeColor={changeColor}
					color={color5}
					saturationAlt={saturationAlt[2]}
					valueAlt={valueAlt[2]}
				/>
				<Alternate
					on:changeColor={changeColor}
					color={color6}
					saturationAlt={saturationAlt[1]}
					valueAlt={valueAlt[1]}
				/>
				<Alternate
					on:changeColor={changeColor}
					color={color7}
					saturationAlt={saturationAlt[0]}
					valueAlt={valueAlt[0]}
				/>
			</div>
		</div>

		<div
			class="sliders rounded-b-md p-8 flex flex-col space-y-2 bg-stone-100 lg:w-1/2 lg:rounded-md lg:shadow-xl"
		>
			<Slider
				bind:data={$hue}
				min={0}
				max={360}
				background="background: linear-gradient(to right, #d42b2b 0%, #cdcd32 17%, #54ab54 33%, #55aaaa 50%, #2020df 67%, #ab54ab 83%, #d42b2b 100%);"
			/>
			<Slider
				bind:data={$saturation}
				background="background: linear-gradient(to right, {saturation0}, {saturation100});"
			/>
			<Slider
				bind:data={$value}
				background="background: linear-gradient(to right, {value0}, {value100});"
			/>
			<div class="md:flex md:space-x-4">
				<Slider
					bind:data={satIncrement}
					background="background: linear-gradient(to right, #e0e0e0, 
#11110d)"
					min={0}
					max={15}
					step={0.1}>Saturation Steps</Slider
				>
				<Slider
					bind:data={valIncrement}
					background="background: linear-gradient(to right, #e0e0e0, 
#11110d)"
					min={0}
					max={10}
					step={0.1}>Value Steps</Slider
				>
			</div>
			<div class="grow" />
			<Motion whileTap={{ scale: 0.99 }} let:motion>
				<button
					use:motion
					class="btn mt-8"
					on:click={random}
					style="--hover-color: {color3}; --text: {colorText}; --color: {color2}">Random</button
				>
			</Motion>
		</div>
	</div>
</main>

<style>
	.btn {
		background-color: var(--color);
		color: var(--text);
	}
	.btn:hover {
		background-color: var(--hover-color);
	}
</style>

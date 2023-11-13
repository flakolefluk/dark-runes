<div align="center">
    <img src="https://res.cloudinary.com/flakolefluk/image/upload/v1695761393/raeuhoqppyjoxv6ztw24.webp" height="150">
</div>

<h1 align="center">
Dark Runes
</h1>


In the land of JavaScript, where ancient secrets and magic thrived, a gifted runemaster named Svelte had long been revered for their exceptional talent. They were known throughout the realm for their ability to craft runes of extraordinary power, each one capable of shaping the destiny of those who possessed them.

One fateful night, under the shimmering light of a blood moon, Svelte unveiled a set of runes like no other. These were the Runes of Lumina, symbols pulsating with ethereal radiance that promised untold blessings. The entire magical community rejoiced at their discovery, and it seemed that peace and prosperity would forever grace the land.

But as the years passed, something unexpected began to stir within the heart of JavaScript. A sinister undercurrent, born from the shadows, whispered of a power that rivaled the light of the Lumina Runes. It was a power that thrived in darkness, concealed from the prying eyes of those who sought to control it.

These were the Dark Runes.

The emergence of the Dark Runes sent shockwaves through the magical community. These symbols, etched in obsidian ink and emitting an eerie, crimson glow, were symbols of immense power, but also of untamed chaos. They whispered promises of forbidden knowledge, strength, and dominance to those who dared to wield them.

Some embraced the Dark Runes with open arms, craving the dark power they offered. Others recoiled in fear, warning of the dangers that came with such unchecked magic. A rift began to form among the runemasters, dividing them into those who sought balance and those who hungered for dominance.

In the heart of this growing turmoil stood Svelte, torn between their loyalty to the Lumina Runes that had brought so much light to JavaScript and the allure of the Dark Runes that offered unbridled power. They knew that the Dark Runes had the potential to bring untold devastation, but they couldn't deny the curiosity that gnawed at their soul.

As the magical community grappled with this newfound power, incidents of chaos and discord erupted across JavaScript. The once-peaceful realm was now a battleground where the Lumina and Dark Runes clashed, leaving scars that ran deep.

Svelte realized that the balance of their world was at stake. They embarked on a quest to seek the origins of the Dark Runes, hoping to uncover their true nature and purpose. Along their journey, they encountered ancient beings and faced unimaginable challenges, all the while wrestling with the temptation of the dark power that threatened to consume them.

In the end, Svelte returned with a revelation. The Dark Runes were not inherently evil, but they were a reflection of the inner darkness and desires of those who wielded them. They had the power to bring about both destruction and creation, chaos and order, depending on the intentions of the one who harnessed their energy.

With this newfound wisdom, Svelte worked tirelessly to bridge the gap between the two factions of runemasters. They urged them to embrace balance, using both the Lumina and Dark Runes in harmony, ensuring that the magic of JavaScript would not be tainted by either extreme.

And so, the mystical land of JavaScript found equilibrium once more. The Lumina and Dark Runes, now respected as powerful tools rather than instruments of discord, were used to nurture and protect the realm. Svelte's journey had not only restored balance but had also proven that even in the darkest of times, the light of wisdom could prevail, illuminating the path to a brighter future for all.

<p align="center">
  <a href="https://www.npmjs.com/package/dark-runes"><img src="https://img.shields.io/npm/v/dark-runes?color=729B1B&label=dark-runes"></a>
<p>

## Installation
```bash
## pnpm
pnpm i -D dark-runes 

## npm
npm i -D dark-runes
```

## Usage
* to process components add dark-runes preprocessor in `svelte.config.js`
```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { processDarkRunes } from 'dark-runes'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        vitePreprocess(),
        processDarkRunes(), // {runes:true}
    ],
    kit: {
        adapter: adapter()
    }
};

export default config;
```

* to process modules (`svelte.js`, `svelte.ts`) add dark-runes vite plugin in `vite.config.js`
```js
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { darkRunes } from 'dark-runes'
import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), darkRunes()],
})

```

* add types to global namespace
```ts
/// <reference types="dark-runes" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface Platform {}
    }
}

export {};

```


## Runes
Dark Runes serves as a testing ground for emerging rune technologies. While its ultimate aim is integration with Svelte 5, it currently functions seamlessly with Svelte version 4 (`{runes:false}`). It's important to note that the primary objective of Dark Runes is not to supplant Svelte runes but to enhance and complement them. The framework is open to community-driven contributions and innovations, and its continued existence is contingent on its ability to provide unique functionality. Dark Runes will be retired when equivalent features are incorporated into the core Svelte framework.

### $states
Source:
```ts
let [foo,bar,baz] = $states(0, true, "wow");
```

Output:
```ts
let foo = $state(0);
let bar = $state(true);
let baz = $state("wow");
```

`{runes:false}` Output:
```ts
let foo = 0;
let bar = true;
let baz = "wow";
```

### $log
Source:
```ts
$log(foo)
```

Output:
```ts
$effect(() => {
    console.log(foo)
});
```

`{runes:false}` Output:
```ts
$: {
    console.log(foo)
}
```

### $get
Source:
```ts
let myObj = {
    ...$get({foo, bar})
}
```

Output:
```ts
let myObj = {
    get foo() { return foo;},
    get bar() { return bar;}
}
```

### $set
Source:
```ts
let myObj = {
    ...$set({foo, bar})
}
```

Output:
```ts
let myObj = {
    set foo(val) { foo = val },
    set bar(val) { bar = val}
}
```

### $getset
Source:
```ts
let myObj = {
    ...$getset({foo, bar})
}
```

Output:
```ts
let myObj = {
    get foo() { return foo;},
    set foo(val) { foo = val },
    get bar() { return bar;},
    set bar(val) { bar = val}
}
```

|> $get, $set, $getset can be composed in combined in object including regular properties.

### $gsp (getters, setters, properties)
Source:
```ts
let myObj = $gsp(
    { foo, bar }, // getters
    { foo, fizz }, // setters
    { fuzz: true } // props
)
```

Output:
```ts
let myObj = {
    get foo() { return foo;},
    get bar() { return bar;},
    set foo(val) { foo = val },
    set fizz(val) { fizz = val},
    fuzz: true
}
```

### $wrap (writables, readables and properties)
Source:
```ts
let myObj = $wrap(
    { foo, bar }, // writables
    { fizz, jazz }, // readables
    { fuzz: true } // props
)
```

Output:
```ts
let myObj = {
    get foo() { return foo; },
    set foo(val) { foo = val },
    get bar() { return bar; },
    set bar(val) { bar = val },
    get fizz() { return fizz; },
    get jazz() { return jazz; },
    fuzz: true
}
```


## License
[MIT](./LICENSE) License © 2023-Present [Ignacio Falk](https://github.com/flakolefluk)

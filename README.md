<p align="center">
   <a href="https://www.npmjs.com/package/modernizr" rel="noopener" target="_blank"><img alt="Modernizr" src="./media/Modernizr-2-Logo-vertical-medium.png" width="250" /></a>
</p>

<div align="center">
  
##### Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.
  
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://github.com/Modernizr/Modernizr/workflows/Testing/badge.svg)](https://github.com/Modernizr/Modernizr/actions)
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)

</div>

- Read this file in Portuguese-BR [here](/README.pt_br.md)
- Read this file in Indonesian [here](/README.id.md)
- Read this file in Spanish [here](/README.sp.md)
- Read this file in Swedish [here](/README.sv.md)
- Read this file in Tamil [here](/README.ta.md)
- Read this file in Kannada [here](/README.ka.md)
- Read this file in Hindi [here](/README.hi.md)

- Our Website is outdated and broken, please DO NOT use it (https://modernizr.com) but rather build your modernizr version from npm.
- [Documentation](https://modernizr.com/docs/)
- [Integration tests](https://modernizr.github.io/Modernizr/test/integration.html)
- [Unit tests](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr tests which native CSS3 and HTML5 features are available in the current UA and makes the results available to you in two ways: as properties on a global `Modernizr` object, and as classes on the `<html>` element. This information allows you to progressively enhance your pages with a granular level of control over the experience.

## Breaking changes with v4

- Dropped support for node versions <= 10, please upgrade to at least version 12

- Following tests got renamed:

  - `class` to `es6class` to keep in line with the rest of the es-tests

- Following tests got moved in subdirectories:

  - `cookies`, `indexeddb`, `indexedblob`, `quota-management-api`, `userdata` moved into the storage subdirectory
  - `audio` moved into the audio subdirectory
  - `battery` moved into the battery subdirectory
  - `canvas`, `canvastext` moved into the canvas subdirectory
  - `customevent`, `eventlistener`, `forcetouch`, `hashchange`, `pointerevents`, `proximity` moved into the event subdirectory
  - `exiforientation` moved into the image subdirectory
  - `capture`, `fileinput`, `fileinputdirectory`, `formatattribute`, `input`, `inputnumber-l10n`, `inputsearchevent`, `inputtypes`, `placeholder`, `requestautocomplete`, `validation` moved into the input subdirectory
  - `svg` moved into the svg subdirectory
  - `webgl` moved into the webgl subdirectory

- Following tests got removed:

  - `touchevents`: [discussion](https://github.com/Modernizr/Modernizr/pull/2432)
  - `unicode`: [discussion](https://github.com/Modernizr/Modernizr/issues/2468)
  - `templatestrings`: duplicate of the es6 detect `stringtemplate`
  - `contains`: duplicate of the es6 detect `es6string`
  - `datalistelem`: A dupe of Modernizr.input.list

## New Asynchronous Event Listeners

Often times people want to know when an asynchronous test is done so they can allow their application to react to it.
In the past, you've had to rely on watching properties or `<html>` classes. Only events on **asynchronous** tests are
supported. Synchronous tests should be handled synchronously to improve speed and to maintain consistency.

The new API looks like this:

```js
// Listen to a test, give it a callback
Modernizr.on("testname", function (result) {
  if (result) {
    console.log("The test passed!");
  } else {
    console.log("The test failed!");
  }
});
```

We guarantee that we'll only invoke your function once (per time that you call `on`). We are currently not exposing
a method for exposing the `trigger` functionality. Instead, if you'd like to have control over async tests, use the
`src/addTest` feature, and any test that you set will automatically expose and trigger the `on` functionality.

## Getting Started

- Clone or download the repository
- Install project dependencies with `npm install`

## Building Modernizr

### From javascript

Modernizr can be used programmatically via npm:

```js
var modernizr = require("modernizr");
```

A `build` method is exposed for generating custom Modernizr builds. Example:

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // the build
});
```

The first parameter takes a JSON object of options and feature-detects to include. See [`lib/config-all.json`](lib/config-all.json) for all available options.

The second parameter is a function invoked on task completion.

### From the command-line

We also provide a command line interface for building modernizr.
To see all available options run:

```shell
./bin/modernizr
```

Or to generate everything in 'config-all.json' run this with npm:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testing Modernizr

To execute the tests using mocha-headless-chrome on the console run:

```shell
npm test
```

You can also run tests in your browser of choice with this command:

```shell
npm run serve-gh-pages
```

and navigate to these two URLs:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Integrating Modernizr with Build Tools

This section provides guidance on how to integrate Modernizr with various build tools and frameworks, making it easier to use in your projects.

### 1. Integrating with Webpack

To integrate Modernizr with Webpack, follow these steps:

1. **Install Modernizr**:
   ```bash
   npm install modernizr --save
   ```

2. **Create a Modernizr Configuration File**:
   Create a file named `modernizr-config.js` in your project root:
   ```javascript
   module.exports = {
     "feature-detects": [
       "test/feature1",
       "test/feature2",
       // Add more feature detects as needed
     ]
   };
   ```

3. **Update Webpack Configuration**:
   Modify your Webpack configuration file (e.g., `webpack.config.js`) to include the Modernizr plugin:
   ```javascript
   const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

   module.exports = {
     // Other configurations...
     plugins: [
       new ModernizrWebpackPlugin({
         "feature-detects": [
           "test/feature1",
           "test/feature2"
         ]
       })
     ]
   };
   ```

4. **Build Your Project**:
   Run your Webpack build process:
   ```bash
   npm run build
   ```

### 2. Integrating with Gulp

If you are using Gulp, you can integrate Modernizr as follows:

1. **Install Modernizr**:
   ```bash
   npm install modernizr --save-dev
   ```

2. **Create a Gulp Task**:
   In your `gulpfile.js`, add a task to build Modernizr:
   ```javascript
   const gulp = require('gulp');
   const modernizr = require('modernizr');

   gulp.task('modernizr', function() {
     return modernizr.build({
       "feature-detects": [
         "test/feature1",
         "test/feature2"
       ]
     }).pipe(gulp.dest('dist/'));
   });
   ```

3. **Run the Gulp Task**:
   Execute the task to generate the Modernizr build:
   ```bash
   gulp modernizr
   ```

### 3. Integrating with Parcel

For projects using Parcel, you can integrate Modernizr as follows:

1. **Install Modernizr**:
   ```bash
   npm install modernizr --save
   ```

2. **Create a Modernizr Configuration File**:
   Similar to the Webpack setup, create a `modernizr-config.js` file:
   ```javascript
   module.exports = {
     "feature-detects": [
       "test/feature1",
       "test/feature2"
     ]
   };
   ```

3. **Update Parcel Configuration**:
   You can use a plugin like `parcel-plugin-modernizr` to integrate Modernizr:
   ```bash
   npm install parcel-plugin-modernizr --save-dev
   ```

4. **Build Your Project**:
   Run Parcel to build your project:
   ```bash
   parcel build index.html
   ```

### Conclusion

Integrating Modernizr with your build tools can enhance your web applications by allowing you to detect and respond to the capabilities of the user's browser. Follow the steps above to set up Modernizr with your preferred build tool.

For more information, refer to the [Modernizr documentation](https://modernizr.com/docs/).

## Code of Conduct

This project adheres to the [Open Code of Conduct](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md).
By participating, you are expected to honor this code.

## License

[MIT License](https://opensource.org/licenses/MIT)


## 🌐 Web Resources & Interactive Index
- [CANDY MAKER DESSERT GAMES](https://thelearnquesters.pages.dev/candy-maker-dessert-games.html)
- [PARKING FURY 3D NIGHT CITY](https://studyquesthub.web.app/parking-fury-3d-night-city.html)
- [DINO SURVIVAL 3D SIMULATOR](https://frskillcrafts.pages.dev/dino-survival-3d-simulator.html)
- [ABOUT A FROG](https://studyplayings.pages.dev/about-a-frog.html)
- [ELLIE AND FRIENDS VENICE CARNIVAL](https://learnquesters.pages.dev/ellie-and-friends-venice-carnival.html)
- [BABY PENGUIN FISHING](https://thelearnquesters.pages.dev/baby-penguin-fishing.html)
- [CATEGORY CASUAL971](https://studyquesthub.web.app/category-casual971.html)
- [WORDS OR DIE](https://studyplayings.web.app/words-or-die.html)
- [OBBY PRISON RUN](https://theskillquest.pages.dev/obby-prison-run.html)
- [ZOMBIE DRIFT 3D](https://studyplayings.web.app/zombie-drift-3d.html)
- [HOTFOOT BASEBALL](https://quizverses.github.io/hotfoot-baseball.html)
- [STICKMAN FIGHT PRO](https://thelearnquesters.pages.dev/stickman-fight-pro.html)
- [SITEMAP](https://cryptotify.netlify.app/sitemap.html)
- [TAP BEAD](https://studyplayings.web.app/tap-bead.html)
- [INDEX26](https://quizverses.github.io/index26.html)
- [GRILL IT ALL](https://learnquesters.pages.dev/grill-it-all.html)
- [SURVIVAL ISLAND EVO](https://theskillquest.pages.dev/survival-island-evo.html)
- [CATEGORY MATCH 3](https://thelearnquesters.pages.dev/category-match-3.html)
- [CATEGORY TOWER DEFENSE118](https://theskillquest.pages.dev/category-tower-defense118.html)
- [MOVE EMOJI](https://thelearnquesters.pages.dev/move-emoji.html)
- [CATEGORY LOVE12](https://theskillquest.pages.dev/category-love12.html)
- [PRIVACY](https://brainquests.vercel.app/privacy.html)
- [STICKMAN DUO ESCAPE THE TOMB](https://theskillquest.pages.dev/stickman-duo-escape-the-tomb.html)
- [CANDY MATCH 4](https://thelearnquesters.pages.dev/candy-match-4.html)
- [HIDDEN OBJECT ROOMS EXPLORATION](https://studyquesthub.web.app/hidden-object-rooms-exploration.html)
- [MERGE FLOWERS](https://studyplayings.web.app/merge-flowers.html)
- [FOOD SORT PUZZLE](https://studyplayings.web.app/food-sort-puzzle.html)
- [DRAW CLIMBER](https://thequizzone.pages.dev/draw-climber.html)
- [SPLIT SHOT BALL ADVENTURE](https://thelearnquesters.pages.dev/split-shot-ball-adventure.html)
- [ONLINE PORTAL](https://cryptotify.netlify.app/)
- [KUZBASS HORROR](https://thelearnquesters.pages.dev/kuzbass-horror.html)
- [CAMERAMAN VS TOILETS PUZZLE](https://learnquesters.pages.dev/cameraman-vs-toilets-puzzle.html)
- [MERGE SHOOTER](https://theskillquest.pages.dev/merge-shooter.html)
- [CLAY CRAFT TYCOON](https://thelearnquesters.pages.dev/clay-craft-tycoon.html)
- [SECRETS OF CHARMLAND](https://studyplaying.github.io/secrets-of-charmland.html)
- [HYPERSPACE   QUANTUM FRACTURE FEZ](https://studyplaying.github.io/hyperspace---quantum-fracture-fez.html)
- [CATEGORY CASUAL 6](https://quizverses.pages.dev/category-casual-6.html)
- [FASHION PRINCESS DRESS UP FOR GIRLS](https://studyplayings.web.app/fashion-princess-dress-up-for-girls.html)
- [MAGIC FINGER PUZZLE 3D](https://learnquesters.pages.dev/magic-finger-puzzle-3d.html)
- [THEO MORINIS MAGICAL RESORT](https://learnquesters.pages.dev/theo-morinis-magical-resort.html)
- [INDEX8](https://quizverses.github.io/index8.html)
- [PYRAMID JEWELS](https://quizverses-9d2f2.web.app/pyramid-jewels.html)
- [PALM ISLAND SOLITAIRE](https://studyplayings.web.app/palm-island-solitaire.html)
- [MOTO ROAD RASH 3D 2](https://studyquesthub.web.app/moto-road-rash-3d-2.html)
- [RESCUE HERO](https://thelearnquesters.pages.dev/rescue-hero.html)
- [CATEGORY FPS](https://quizverses-9d2f2.web.app/category-fps.html)
- [CLAY CRAFT TYCOON](https://themindzone.pages.dev/clay-craft-tycoon.html)
- [RUN FRIENDS](https://studyquests.pages.dev/run-friends.html)
- [ONLINE PORTAL](https://brainquests.netlify.app/)
- [MIRRORS PUZZLE](https://thequizzone.pages.dev/mirrors-puzzle.html)
- [WARFARE 1942 ONLINE SHOOTER](https://thelearnquesters.pages.dev/warfare-1942-online-shooter.html)
- [SITEMAP](https://brainquests.pages.dev/sitemap.html)
- [INSPECTOR CAT](https://studyplayings.web.app/inspector-cat.html)
- [BOYFRIEND FOR HIRE](https://thequizzone.pages.dev/boyfriend-for-hire.html)
- [SAND BLOCK BLAST](https://thequizzone.pages.dev/sand-block-blast.html)
- [FUN IQ PUZZLE](https://studyplayings.web.app/fun-iq-puzzle.html)
- [BILLIARDS 3D RUSSIAN PYRAMID](https://thequizzone.pages.dev/billiards-3d-russian-pyramid.html)
- [CATEGORY POOL](https://quizverses-9d2f2.web.app/category-pool.html)
- [POPPING CANDIES](https://quizverses.github.io/popping-candies.html)
- [CATEGORY BUILDING182](https://thelearnquesters.pages.dev/category-building182.html)
- [PUMPKIN PATCH](https://thelearnquesters.pages.dev/pumpkin-patch.html)
- [CATEGORY PLATFORM](https://theskillquest.pages.dev/category-platform.html)
- [MICROPLASTICS FEEDING](https://thelearnquesters.pages.dev/microplastics-feeding.html)
- [CATEGORY INCREMENTAL388](https://quizverses-9d2f2.web.app/category-incremental388.html)
- [TERMS](https://themindzone.pages.dev/terms.html)
- [EPIC MINE](https://thelearnquester.web.app/epic-mine.html)
- [SCHOOLBOY RUNAWAY ROOM ESCAPE](https://quizverses.github.io/schoolboy-runaway-room-escape.html)
- [CATEGORY PIXEL313](https://quizverses-9d2f2.web.app/category-pixel313.html)
- [BLOCK TNT BLAST](https://thelearnquesters.pages.dev/block-tnt-blast.html)
- [HALLOWEEN CHALLENGE](https://studyplayings.web.app/halloween-challenge.html)
- [DUO FAMILY SANTA](https://studyquesthub.web.app/duo-family-santa.html)
- [CATEGORY CAR 2](https://thelearnquesters.pages.dev/category-car-2.html)
- [CATEGORY SHOOTER 2](https://studyplayings.web.app/category-shooter-2.html)
- [CATEGORY 3D1 371](https://quizverses-9d2f2.web.app/category-3d1-371.html)
- [MASK EVOLUTION 3D](https://studyquesthub.web.app/mask-evolution-3d.html)
- [CATEGORY FOOTBALL](https://studyquests.pages.dev/category-football.html)
- [HOME PIN 1](https://thequizzone.pages.dev/home-pin-1.html)
- [CATEGORY BASKETBALL](https://quizverses-9d2f2.web.app/category-basketball.html)
- [TERMS](https://cryptotify9.onrender.com/terms.html)
- [CATEGORY COLLECT](https://quizverses-9d2f2.web.app/category-collect.html)
- [MR BEAN JUMP](https://studyplayings.web.app/mr-bean-jump.html)
- [SKILLFUL FINGER](https://thelearnquesters.pages.dev/skillful-finger.html)
- [INDEX9](https://quizverses.github.io/index9.html)
- [HAPPY BLOCKS](https://quizverses.github.io/happy-blocks.html)
- [CATEGORY FPS 3](https://iskillquest.pages.dev/category-fps-3.html)
- [CATEGORY GUN241](https://quizverses-9d2f2.web.app/category-gun241.html)
- [BUBBLE CLASSIC](https://thelearnquester.web.app/bubble-classic.html)
- [IDLE BANK](https://studyplayings.web.app/idle-bank.html)
- [DEAD BRAIN](https://studyplayings.web.app/dead-brain.html)
- [INDEX13](https://thequizzone.pages.dev/index13.html)
- [INDEX9](https://quizverses.pages.dev/index9.html)
- [KINGDOM WARS TD](https://studyquesthub.web.app/kingdom-wars-td.html)
- [SITEMAP](https://quizverses.github.io/sitemap.html)
- [POWER LIGHT](https://learnquesters.pages.dev/power-light.html)
- [SOCCER EURO CUP 2025](https://studyquesthub.web.app/soccer-euro-cup-2025.html)
- [TIMEWALKER SURVIVE](https://thequizzone.pages.dev/timewalker-survive.html)
- [ONLINE PORTAL](https://cryptotify9.onrender.com/)
- [CATEGORY LOVE](https://theskillquest.pages.dev/category-love.html)
- [NUMBER MERGE MASTER](https://thequizzone.pages.dev/number-merge-master.html)
- [SPIDER ROPE HERO CITY FIGHT](https://studyquesthub.web.app/spider-rope-hero-city-fight.html)
- [CATEGORY CONTROLLER59](https://quizverses-9d2f2.web.app/category-controller59.html)
- [MONSTER VS ZOMBIE](https://quizverses.github.io/monster-vs-zombie.html)
- [SLIDE BLOCK PUZZLE](https://thelearnquester.web.app/slide-block-puzzle.html)
- [TILE MATCH CAFE](https://themindzone.pages.dev/tile-match-cafe.html)
- [CANDY POP MANIA](https://studyquests.github.io/candy-pop-mania.html)
- [STICKMAN ZOMBIE VS STICKMAN HERO](https://learnquester.github.io/stickman-zombie-vs-stickman-hero.html)
- [PIRATES MAHJONG](https://theskillquest.pages.dev/pirates-mahjong.html)
- [RAINBOW FRIENDS HIDE AND SEEK](https://studyplayings.web.app/rainbow-friends-hide-and-seek.html)
- [SORTING FROGS](https://studyplayings.web.app/sorting-frogs.html)
- [CATEGORY SIMULATION](https://studyplayings.web.app/category-simulation.html)
- [CATEGORY STICKMAN 2](https://studyplayings.web.app/category-stickman-2.html)
- [VIBRANT HEARTS GLAMOUR VS PUNK](https://studyplayings.web.app/vibrant-hearts-glamour-vs-punk.html)
- [NONOGRAM DAILY](https://theskillquest.pages.dev/nonogram-daily.html)
- [SOLITAIRE KLONDIKE](https://studyquests.github.io/solitaire-klondike.html)
- [VARIETY MECHA](https://studyquests.github.io/variety-mecha.html)
- [TERMS](https://cryptotify.github.io/terms.html)
- [CATEGORY EXPLOIT](https://learnquester.pages.dev/category-exploit.html)
- [SPLIT SHOT BALL ADVENTURE](https://studyquests.github.io/split-shot-ball-adventure.html)
- [SUDOKU BRAIN BLOCKS](https://studyquests.github.io/sudoku-brain-blocks.html)
- [CATEGORY SNAKE](https://themindzone.pages.dev/category-snake.html)
- [THREAD MATCH 2](https://thequizzone.pages.dev/thread-match-2.html)
- [CATEGORY LOGIC536](https://iskillquest.pages.dev/category-logic536.html)
- [OBBY PINATA PARTY](https://studyquests.pages.dev/obby-pinata-party.html)
- [CATEGORY MYSTERY45](https://theskillquest.pages.dev/category-mystery45.html)
- [TWILIGHT SOLITAIRE TRIPEAKS](https://learnquester.github.io/twilight-solitaire-tripeaks.html)
- [LOVE COLORS](https://theskillquest.pages.dev/love-colors.html)
- [THE BIG HIT RUN](https://studyquests.github.io/the-big-hit-run.html)
- [IMPOSTOR HOOK MASTER](https://themindzone.pages.dev/impostor-hook-master.html)
- [QUIZ 10 SECONDS MATH](https://studyplayings.web.app/quiz-10-seconds-math.html)
- [THE PRISM CITY DETECTIVES](https://studyplayings.web.app/the-prism-city-detectives.html)

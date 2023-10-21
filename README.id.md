<p align="center">
   <a href="https://www.npmjs.com/package/modernizr" rel="noopener" target="_blank"><img alt="Modernizr" src="./media/Modernizr-2-Logo-vertical-medium.png" width="250" /></a>
</p>

<div align="center">
  
##### Modernizr adalah library JavaScript yang mendeteksi fitur HTML5 dan CSS3 di browser pengguna.
  
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://github.com/Modernizr/Modernizr/workflows/Testing/badge.svg)](https://github.com/Modernizr/Modernizr/actions)
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)

</div>

- Baca file ini dengan bahasa Portuguese-BR [disini](/README.pt_br.md)
- Baca file ini dengan bahasa Indonesia [disini](/README.id.md)
- Baca file ini di kannada [disini](/README.ka.md)
- Baca file ini dalam bahasa hindi [disini](/README.hi.md)

- Situs web kami sudah lama dan rusak, mohon JANGAN menggunakannya (https://modernizr.com) melainkan buat versi modernizr dari npm.
- [Dokumentasi](https://modernizr.com/docs/)
- [Tes integrasi](https://modernizr.github.io/Modernizr/test/integration.html)
- [Tes unit](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr menguji fitur CSS3 dan HTML5 asli mana yang tersedia di UA saat ini dan membuat hasilnya tersedia untuk Anda dalam dua cara: sebagai properti pada objek `Modernizr` global, dan sebagai kelas pada elemen `<html>`. Informasi ini memungkinkan anda untuk meningkatkan halaman Anda secara bertahap dengan tingkat kontrol yang terperinci.

## Melanggar Perubahan Dengan v4

- Menjatuhkan dukungan untuk versi node <= 10, harap tingkatkan ke setidaknya versi 12

- Tes berikut diganti namanya:

  - `class` ke `es6class` agar tetap sejalan dengan es-test lainnya

- Tes berikut dipindahkan di subdirektori:

  - `cookies`, `indexeddb`, `indexedblob`, `quota-management-api`, `userdata` pindahkan ke subdirektori penyimpanan
  - `audio`
  - `battery` pindahkan ke subdirektori audio
  - `canvas`, `canvastext` pindahkan ke subdirektori canvas
  - `customevent`, `eventlistener`, `forcetouch`, `hashchange`, `pointerevents`, `proximity` pindahkan ke subdirektori event
  - `exiforientation` pindahkan ke subdirektori gambar
  - `capture`, `fileinput`, `fileinputdirectory`, `formatattribute`, `input`, `inputnumber-l10n`, `inputsearchevent`, `inputtypes`, `placeholder`, `requestautocomplete`, `validation` pindahkan ke subdirektori input
  - `svg` pindahkan ke subdirektori svg
  - `webgl` pindahkan ke subdirektori webgl

- Tes berikut yang telah dihapus:

  - `touchevents`: [diskusi](https://github.com/Modernizr/Modernizr/pull/2432)
  - `unicode`: [diskusi](https://github.com/Modernizr/Modernizr/issues/2468)
  - `templatestrings`: duplikat dari deteksi es6 `stringtemplate`
  - `contains`: duplikat dari deteksi es6 `es6string`
  - `datalistelem`: memanipulasi dari Modernizr.input.list

## New Asynchronous Event Listeners

Sering kali orang ingin tahu kapan pengujian asynchronous dilakukan sehingga mereka dapat mengizinkan aplikasi mereka untuk bereaksi terhadapnya. Di masa lalu, Anda harus mengandalkan properti menonton atau kelas `<html>`. Hanya peristiwa pada pengujian **asynchronous** yang didukung. Tes sinkron harus ditangani secara sinkron untuk meningkatkan kecepatan dan menjaga konsistensi.

API baru terlihat seperti ini:

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

Kami menjamin bahwa kami hanya akan memanggil fungsi Anda sekali (per kali Anda memanggil `on`). Kami saat ini tidak mengekspos
metode untuk mengekspos fungsionalitas `trigger`. Sebagai gantinya, jika Anda ingin memiliki kontrol atas pengujian async, gunakan fitur `src/addTest`, dan pengujian apa pun yang Anda setel akan secara otomatis mengekspos dan memicu fungsionalitas `on`.

## Getting Started

- Kloning atau unduh repository
- Install dependensi proyek dengan `npm install`

## Membangun Modernizr

### Dari javascript

Modernizr dapat digunakan secara terprogram melalui npm:

```js
var modernizr = require("modernizr");
```

Metode `build` diekspos untuk menghasilkan build Modernizr kustom. Contoh:

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // the build
});
```

Parameter pertama mengambil objek opsi JSON dan deteksi fitur untuk disertakan. Lihat [`lib/config-all.json`](lib/config-all.json) untuk semua opsi yang tersedia.

Parameter kedua adalah fungsi yang dipanggil pada penyelesaian tugas.

### Dari command-line

Kami juga menyediakan antarmuka baris perintah untuk membangun modernizr.
Untuk melihat semua opsi yang tersedia, jalankan:

```shell
./bin/modernizr
```

Atau untuk menghasilkan semua yang ada di 'config-all.json', jalankan ini dengan npm:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testing Modernizr

Untuk menjalankan tes menggunakan mocha-headless-chrome di konsol, jalankan:

```shell
npm test
```

Anda juga dapat menjalankan tes di browser pilihan Anda dengan perintah ini:

```shell
npm run serve-gh-pages
```

dan menavigasi ke dua URL ini:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Code of Conduct

Proyek ini mematuhi [Open Code of Conduct](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md).
Dengan berpertisipasi, anda diharapkan untuk menghormati code ini.

## License

[Lisensi MIT](https://opensource.org/licenses/MIT)

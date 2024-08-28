const mix = require('laravel-mix');

mix.js('public/js/video-call.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css');  // Optional: If you use SASS

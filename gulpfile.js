const gulp = require('gulp');
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync').create();
const imagemin = require("gulp-imagemin");
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminJpegtran = require('imagemin-jpegtran');
const pngquant = require('imagemin-pngquant');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');



gulp.task('serve', function(){
  browserSync.init({
      server: {
          baseDir: "./build"
      }
  })
});


const scripts = [
    "node_modules/jquery/dist/jquery.min.js",
    "src/js/ion.rangeSlider.min.js",
    "src/js/jquery.formstyler.min.js",
    "src/js/jquery.rateyo.min.js",
    "src/js/slick.min.js",
    "src/js/main.js",
  ];


gulp.task('html', function(){
  return gulp.src('src/index.html')
  .pipe(gulp.dest('build/'))
  .pipe(browserSync.reload({stream: true}));
});


const fonts = [
  "src/fonts/**/*.{woff,woff2,ttf}",
];

gulp.task('fonts', ()=>{
  return gulp.src(fonts)
  .pipe(gulp.dest('build/fonts'))
  .pipe(browserSync.reload({stream: true}));
});


gulp.task('images', function(){
  return gulp.src('src/images/**/*.{png,jpg,svg}')
  .pipe(imagemin([
      imageminJpegtran({progressive: true}),
      imageminJpegRecompress({
          loops: 5,
          min: 65,
          max: 70,
          quality: [0.7, 0.8]
      }),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: [0.7, 0.8], speed: 5})
  ]))
  .pipe(gulp.dest('build/img'))
});



gulp.task('allimg', function(){
  return gulp.src('src/images/**/*.{png,jpg,svg}')
  .pipe(gulp.dest('build/images'))
  .pipe(browserSync.reload({stream: true}));
});
gulp.task('css', function () {
  return gulp.src('src/css/*.css')
      .pipe(plumber())
      .pipe(cssmin())
      .pipe(autoprefixer([
          'last 15 versions',
          '> 1%',
          'ie 8', 
          'ie 7'
          ], 
         { 
          cascade: true
       }))
      .pipe(concat(('style.css')))
      .pipe(gulp.dest('build/css'))
      .pipe(browserSync.reload({stream: true})); 
});
gulp.task('js', function(){
  return gulp.src(scripts) 
  .pipe(uglify()) 
  .pipe(concat(('main.js')))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function(){
  gulp.watch('src/index.html', gulp.series('html')),
  gulp.watch(fonts, gulp.series('fonts')),  
  gulp.watch('src/css/*.css', gulp.series("css"), browserSync.reload),
  gulp.watch(scripts, gulp.series('js')),  
  gulp.watch("src/images/**/*.{png,jpg}", gulp.series("images"))
  gulp.watch("src/images/**/*.{png,jpg,svg}", gulp.series("allimg"))
});

gulp.task('default', gulp.series(
  gulp.parallel('html','fonts', 'css', 'js','images', 'allimg'),
  gulp.parallel('watch', 'serve' )
));
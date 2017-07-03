const config = {
  root: {
    dev: './src',
    dist: './public'
  },
  html: {
    dev: 'html',
    dist: './',
    parts: 'templates'
  },
  css: {
    dev: 'sass',
    dist: 'css',
    parts: 'parts',
    extensions: '*.+(css|scss)',
    uncss: false
  },
  js: {
    dev: 'js',
    dist: 'js',
    parts: 'modules',
    'extensions': ['.json', '.js']
  },
  img: {
    dev: 'img/**/*',
    dist: 'assets/img',
    extensions: '*.+(jpg|jpeg|gif|png|svg)'
  },
  svg: {
    dev: 'img/svg',
    dist: 'assets/img'
  },
  fonts: {
    dev: 'fonts',
    dist: 'assets/fonts',
    extensions: '*.+(woff2|woff|eot|ttf|svg)'
  },
  static: {
    dev: 'static',
    dist: 'assets/static'
  },
  deploy: {
    hostname: '',
    username: '',
    path: '/',
    password: ''
  }
}
module.exports = config

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'vendor/jquery-1.11.1.min.js',
      'vendor/jquery.mobile-1.4.5.min.js',
      'src/**/*.js',
      'test/spec/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {},
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    captureTimeout: 10000,
    reportSlowerThan:  500
  });
};
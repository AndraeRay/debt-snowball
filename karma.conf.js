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

    // coverage reporter generates the coverage
    reporters: ['coverage', 'dots'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': ['coverage']
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    captureTimeout: 20000,
    reportSlowerThan:  500,
    browserNoActivityTimeout: 30000
  });
};
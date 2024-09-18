module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'bin/backend.js'
      },
      {
        name: 'router',
        script: 'bin/router.js'
      },
      {
        name: 'rest-temp',
        script: 'bin/rest_temp.js'
      },
      {
        name: 'w-PH',
        script: 'bin/writeToCsv.js',
        args: '-s ph'
      },
      {
        name: 'w-do',
        script: 'bin/writeToCsv.js',
        args: '-s do'
      },
      {
        name: 'w-TEMP',
        script: 'bin/writeToCsv.js',
        args: '-s temp'
      },
      {
        name: 'w-DEBIT',
        script: 'bin/writeToCsv.js',
        args: '-s debit'
      }
      
      
    ]
  };
module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'bin/backend.js'
      },
      {
        name: 'client',
        script: 'bin/client.js',
        args: '-n regenix -l eseo -p pass'
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
        name: 'P-PH',
        script: 'bin/publishToRedis.js',
        args: '-q 0 -a 21 -i 14 -n test999 -d 24-07-2029-09-27-43 -f 1 -c 1'
      },
      {
        name: 'P-DO',
        script: 'bin/publishToRedis.js',
        args: '-q 1 -a 7 -i 4  -n test999 -d 24-07-2029-09-27-43 -f 1 -c 1'
      },
      {
        name: 'P-TEMP',
        script: 'bin/publishToRedis.js',
        args: '-q 2 -a 38 -i 34 -n test999 -d 24-0-2029-09-27-43 -f 1 -c 1'
      },
      {
        name: 'P-DEBIT',
        script: 'bin/publishToRedis.js',
        args: '-q 3 -a 1 -i 2 -n test999 -d 24-0-2029-09-27-43 -f 1 -c 1'
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
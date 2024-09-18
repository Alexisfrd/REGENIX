module.exports = {
    apps: [
      
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
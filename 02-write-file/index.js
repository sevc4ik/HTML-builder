const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');
const process = require('process');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

rl.question('hello:) ', (answer) => {
  
  if(answer === 'exit') {
    rl.close();
  } else {
    fs.writeFile(file, 'hello:) ' + '\n' + answer, function (err) {
      if (err) throw err;
    });
  }
});

rl.on('line', (input) => {
  if(input === 'exit') {
    rl.close();
  } else {
    fs.appendFile(file, '\n'+ input, function (err) {
      if (err) throw err;
    });
  }
});


process.on('beforeExit', () => {
  console.log('Thank you!');
});


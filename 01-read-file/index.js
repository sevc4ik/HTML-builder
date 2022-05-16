const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(file,'utf8');

stream.on('data', function(data){
  console.log(data);
});

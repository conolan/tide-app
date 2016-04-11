var http = require('http');
var str = '';
var dtide;
var tideOut={};
var callback;

readData = function(response) {

  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {

    var tides = str.toString().split(",");
    callback(tides);
  });
}

function addDays(startDate,numberOfDays){
  var returnDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()+numberOfDays);
  returnDate=makeDouble(returnDate.getDate())+"/"+makeDouble(returnDate.getMonth()+1)+"/"+returnDate.getFullYear();
  return returnDate;
}

function makeDouble(d){
  if (String(d).length==1){
    d="0"+d;
  }
  return d
}

module.exports={
  readTide:function (myDate,done){

    var parts = myDate.split('/');
    var sDate = new Date(parts[2]+'-'+parts[1]+'-'+parts[0]);
    var pDate= addDays(sDate,-1);
    var nDate= addDays(sDate,+1);

    var options = {
      host: 'www.realcharts.net',
      path: '/node/getdublintide2.php?thedate='+myDate+'&pdate='+pDate+'&ndate='+nDate
    };

    http.request(options, function(response) {
  str='';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {

  var tideOut = str.toString().split(",");
  done(null, tideOut);
  });
}).end();
}}

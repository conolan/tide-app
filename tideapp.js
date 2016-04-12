"use strict";

var http = require('http');
var fs = require('fs');
// var formidable=require('formidable');
// var _ = require('lodash');
var url = require("url");
var path = require('path');

var redis = require("redis");
var redis_client = redis.createClient();

redis_client.on('connect', function() {
    console.log('redis connected');
});
redis_client.FLUSHALL;

var sCount = 0;
var rCount = 0;//results
var myReturnData="";//used in list of previous searches
var myDate,botide,cotide,dotide,outData;//outData is written to html endpoint
require("./msql_connection.js"); // used for localhost mysql server
var seneca = require('seneca')()
var myProject="Node.js with Seneca plugin, HAPI, jquery, polling, redis and html5 canvas+javascript";
var myExp="Three data sources (JSON file, mySql on localhost, mySql on remote server via php) provide the tide times. As each finishes, the result is displayed";
var firstOutData={Project:myProject,Date:"",Belfast_First_Tide:"<font color=red> ...waiting</font>",Belfast_First_Height:"<font color=red> ...waiting</font>",Cobh_First_Tide:"<font color=red> ...waiting</font>",Cobh_First_Height:"<font color=red> ...waiting</font>",Dublin_First_Tide:"<font color=red> ...waiting</font>",Dublin_First_Height:"<font color=red> ...waiting</font>",Link:""};

const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server();
server.connection({ port: 8000 });

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

server.route([
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'statics'
        }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

      displayForm(true,function(theData){
      reply(theData)
      });
      ;
    }
 },

 {
   method: 'GET',
   path: '/result.html',
   handler: function (request, reply) {
      reply.file(path.join(__dirname + '/result.html'));
     ;
   }
},

 {
     method: 'GET',
     path: '/waiting.html',
     handler: function (request, reply) {
         reply(outData);
     }
  },

{
  method: ['PUT', 'POST'],
      path: '/',
      handler: function (request, reply) {
        outData=firstOutData;
        reply.file('./result.html');
        processForm(request.payload.datepicker);
}}
])});

server.start();

function displayForm(isNew,cb) {
  var calData="";
  // if isNew (shown alone without earlier results) output head and title
      fs.readFile('statics/calendar.html', function (err, data) {
      if (isNew){

        calData=myProject+"<br>"+"<br>"+"<div id=form>";
 }
 calData+=data;
 calData+="</div>";
 cb(calData);
  })
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

var outPutResult=function(theDate,theLoc){
  // formerly used lodash in this function, now using the function to update the outData var as data arrives from the 3 seneca calls
  rCount++;
  if (theLoc=="belfast"){
  var bLink="jstide.html?tidedate="+theDate+"-Belfast"+"&tide1time="+botide.tide1Time+"&tide2time="+botide.tide2Time+"&tide3time="+botide.tide3Time+"&tide4time="+botide.tide4Time+"&tide5time="+botide.tide5Time+"&tide6time="+botide.tide6Time+"&tide1height="+botide.tide1Height+"&tide2height="+botide.tide2Height+"&tide3height="+botide.tide3Height+"&tide4height="+botide.tide4Height+"&tide5height="+botide.tide5Height+"&tide6height="+botide.tide6Height;

  var linkB="<a href="+bLink+" target='_blank'>See Belfast Chart</a>"+"<br>"+"<br>"
  outData.Belfast_First_Tide=botide.tide2Time;
  outData.Belfast_First_Height=botide.tide2Height;
  outData.LinkB=linkB;
}else if (theLoc=="cobh"){
  var cLink="jstide.html?tidedate="+theDate+"-Cork"+"&tide1time="+cotide.tide1Time+"&tide2time="+cotide.tide2Time+"&tide3time="+cotide.tide3Time+"&tide4time="+cotide.tide4Time+"&tide5time="+cotide.tide5Time+"&tide6time="+cotide.tide6Time+"&tide1height="+cotide.tide1Height+"&tide2height="+cotide.tide2Height+"&tide3height="+cotide.tide3Height+"&tide4height="+cotide.tide4Height+"&tide5height="+cotide.tide5Height+"&tide6height="+cotide.tide6Height;
  var linkC="<a href="+cLink+" target='_blank'>See Cobh Chart</a>"+"<br>"+"<br>"
  outData.Cobh_First_Tide=cotide.tide2Time;
  outData.Cobh_First_Height=cotide.tide2Height;
  outData.LinkC=linkC;
}else if (theLoc=="dublin"){
  var parts = theDate.split('/');
  var sDate = new Date(parts[2]+'-'+parts[1]+'-'+parts[0]);
  var pDate= addDays(sDate,-1);
  var nDate= addDays(sDate,+1);
  var dLink="jstide.html?tidedate="+theDate+"-Dublin"+"&tide1time="+dotide[6]+"&tide2time="+dotide[8]+"&tide3time="+dotide[10]+"&tide4time="+dotide[12]+"&tide5time="+dotide[14]+"&tide6time="+dotide[16]+"&tide1height="+dotide[7]+"&tide2height="+dotide[9]+"&tide3height="+dotide[11]+"&tide4height="+dotide[13]+"&tide5height="+dotide[15]+"&tide6height="+dotide[17];
  var linkD="<a href="+dLink+" target='_blank'>See Dublin Chart</a>"+"<br>"+"<br>"

  outData.Dublin_First_Tide=dotide[8];
  outData.Dublin_First_Height=dotide[9];
  outData.LinkD=linkD;
}
outData.Project=myExp;
outData.Date=theDate;
outData.Previous_Search="<br>";
if(rCount==3){

  rCount=0;
  if (sCount>1){
    var i=1;

    for (i = sCount-1; i >=0; i--){

      redis_client.hgetall('date'+i, function(err, object) {

      for (var key in object) {
        myReturnData+=(key + '> ' + object[key]+" - ");

        }
        myReturnData+="<br>";
        outData.Previous_Search+=myReturnData;
        myReturnData="";
      });
    }
  }
  }
};

// seneca plugin
var tidePlugin= function(options){
this.add({role: 'gettide'}, function (msg,done) {
  var tideInfo=require("./"+msg.locFile+".js");
  tideInfo.readTide(msg.date, done);
})
}

function processForm(myDate) {
  sCount++; // increments for each search request
  botide={},cotide={},dotide={};
  var d = new Date();
  var toa = d.toLocaleTimeString(); //used to register time and date of the request
  var doa = d.toLocaleDateString();
  // write to redis with the date requested and the date/time request was made
  redis_client.hmset('date'+sCount, {
      'dateAsked': myDate,
      'timeofAsk': toa,
      'dateofAsk': doa
  },function(err, reply) {
  console.log("OK"+sCount);});

    seneca.use(tidePlugin);
    //outData is the JSON written as HTML endpoint waiting.html
    outData={Project:myProject,Date:"",Belfast_First_Tide:"<font color=red> ...waiting</font>",Belfast_First_Height:"<font color=red> ...waiting</font>",Cobh_First_Tide:"<font color=red> ...waiting</font>",Cobh_First_Height:"<font color=red> ...waiting</font>",Dublin_First_Tide:"<font color=red> ...waiting</font>",Dublin_First_Height:"<font color=red> ...waiting</font>",LinkB:"",LinkC:"",LinkD:"",Previous_Search:""};
    //seneca .act passes gettide function that is contained within the external locFile .js
    seneca.act({role: 'gettide', locFile: 'belfastjson_s', date: myDate},function (err, result) {
      botide=result;
      outPutResult(myDate,"belfast");
    })
    seneca.act({role: 'gettide', locFile: 'cobhmysql_s', date: myDate},function (err, result) {
      cotide=result;
      outPutResult(myDate,"cobh");
    })
    seneca.act({role: 'gettide', locFile: 'dublinphp_s', date: myDate},function (err, result) {
      dotide=result;
      outPutResult(myDate,"dublin");
    })
  }

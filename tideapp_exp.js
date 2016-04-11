"use strict";

var http = require('http');
var fs = require('fs');
var formidable=require('formidable');
var _ = require('lodash');
var url = require("url");
var express = require("express");
var app = express();
app.use(express.static('statics'));
var path = require('path');
var pageDivs="<div id='toppart'></div><div id='bottompart'></div>";

var count = 0;
var myDate, mConnection,botide,cotide,dotide,outData;
require("./msql_connection.js");
var seneca = require('seneca')()
var myProject="Node.js with Seneca plugin, Express, jquery, lodash, formidable and html5 javascript";
var firstOutData={Project:myProject,Belfast_First_Tide:" ...waiting",Belfast_First_Height:" ...waiting",Cobh_First_Tide:" ...waiting",Cobh_First_Height:" ...waiting",Dublin_First_Tide:" ...waiting",Dublin_First_Height:" ...waiting"};

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

function writeWaiting(outData,file){
  fs.writeFile(file, outData,  function(err) {
     if (err) {
         return console.error(err);
     }
})
}

app.get('/waiting.html', function(req, res) {
  res.json(outData);

});
app.get('/calendar.html', function(req, res) {
  res.sendFile(path.join(__dirname + 'statics/calendar.html'));
});

app.get('/jquery.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/jquery.js'));
});

app.get('/images/graph_m.png', function(req, res) {
  res.sendFile(path.join(__dirname + '/images/graph_m.png'));
});

app.get('/', function(req, res) {
  outData=firstOutData;
  //writeWaiting(JSON.stringify(outData),"waiting.html");
  displayForm(true,function(theData){

    res.send(theData);
  });
});

app.post('/',function(req,res){
  outData=firstOutData;
  res.sendFile(path.join(__dirname + '/result.html'));
  processAllFieldsOfTheForm(req, res);
});

app.listen(8001);

var outPutResult;
     _.onceEvery= function(times, func) {
        var orig = times;
        return function() {
          if (--times < 1) {
            times=orig;
            return func.apply(this, arguments);
          }
        };
      };

var tidePlugin= function(options){
this.add({role: 'gettide'}, function (msg,done) {
  var tideInfo=require("./"+msg.locFile+".js");
  tideInfo.readTide(msg.date, done);
})
}

function processAllFieldsOfTheForm(req, res) {
  var form = new formidable.IncomingForm();
  //formidable parses the submitted field (datepicker)
  form.parse(req, function (err, fields) {
    if (fields){
      //lodash .after fires the function after 3 calls to outPutResult
      outPutResult=_.after(3,function(theDate){
      var bLink="jstide.html?tidedate="+myDate+"&tide1time="+botide.tide1Time+"&tide2time="+botide.tide2Time+"&tide3time="+botide.tide3Time+"&tide4time="+botide.tide4Time+"&tide5time="+botide.tide5Time+"&tide6time="+botide.tide6Time+"&tide1height="+botide.tide1Height+"&tide2height="+botide.tide2Height+"&tide3height="+botide.tide3Height+"&tide4height="+botide.tide4Height+"&tide5height="+botide.tide5Height+"&tide6height="+botide.tide6Height;
      //linkB is the link to tide curve
      var linkB="<a href="+bLink+" target='_blank'>See Belfast Chart</a>"+"<br>"+"<br>"
      //outData is the JSON written as HTML endpoint waiting.html
      outData={Project:myProject,Date:theDate,Belfast_First_Tide:botide.tide2Time,Belfast_First_Height:botide.tide2Height,Cobh_First_Tide:cotide.tide1Time,Cobh_First_Height:cotide.tide1Height,Dublin_First_Tide:dotide[0],Dublin_First_Height:dotide[1],link:linkB};
      //botide etc are JSON objects for the tide data
      botide={},cotide={},dotide={};
    });

    myDate=(fields.datepicker);

    seneca.use(tidePlugin);
    //seneca .act passes gettide function that is contained within the external locFile .js
    seneca.act({role: 'gettide', locFile: 'belfastjson_s', date: myDate},function (err, result) {
      botide=result;
      outPutResult(myDate);
    })
    seneca.act({role: 'gettide', locFile: 'cobhmysql_s', date: myDate},function (err, result) {
      cotide=result;
      outPutResult(myDate);
    })
    seneca.act({role: 'gettide', locFile: 'dublinphp_s', date: myDate},function (err, result) {
      dotide=result;
      outPutResult(myDate);
    })
    }
  });
}

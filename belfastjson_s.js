var fs = require('fs');

var tideData;
var tideOut={};
var callback;


module.exports={
  readTide:function (myDate,done){
    fs.readFile('./belfast.JSON', function (err, data) {
      if (err) throw err;
      tideData=JSON.parse(data.toString());
      for(var i in tideData.day) {

          if (tideData.day[i].thedate==myDate){
            tideOut.tide1Time = tideData.day[i-1].tide4time;;
            tideOut.tide1Height = (tideData.day[i-1].tide4height);
            if(tideOut.tide1Time=="99"){
              tideOut.tide1Time = tideData.day[i-1].tide3time;;
              tideOut.tide1Height = (tideData.day[i-1].tide3height);

            }
            tideOut.tide2Time = tideData.day[i].tide1time;;
            tideOut.tide2Height = (tideData.day[i].tide1height);
            tideOut.tide3Time = tideData.day[i].tide2time;;
            tideOut.tide3Height = (tideData.day[i].tide2height);
            tideOut.tide4Time = tideData.day[i].tide3time;;
            tideOut.tide4Height = (tideData.day[i].tide3height);
            tideOut.tide5Time = tideData.day[i].tide4time;;
            tideOut.tide5Height = (tideData.day[i].tide4height);
            tideOut.tide6Time = tideData.day[i++].tide1time;;
            tideOut.tide6Height = (tideData.day[i++].tide1height);
            // console.log(tideOut.tide1Time);

            done(null, tideOut);
        }

          }
    });
}}

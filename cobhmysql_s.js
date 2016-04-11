
var tideData={}
var tideDataP,tideDataN;
var tideOut={};
var callback;

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

    var sql='SELECT * from cobh where thedate="'+pDate+'" or thedate="'+myDate+'" or thedate="'+nDate+'"' ;

    mConnection.query(sql, function(err, rows, fields) {
      if (!err){

          for (var i = 0; i < rows.length; i++) {
          tideData[i]= rows[i];
        }
        tideOut.tide1Time=(tideData[0].tide4time);
        tideOut.tide1Height=(tideData[0].tide4height);

        tideOut.tide2Time=(tideData[1].tide1time);
        tideOut.tide2Height=(tideData[1].tide1height);
        tideOut.tide3Time=(tideData[1].tide2time);
        tideOut.tide3Height=(tideData[1].tide2height);
        tideOut.tide4Time=(tideData[1].tide3time);
        tideOut.tide4Height=(tideData[1].tide3height);
        tideOut.tide5Time=(tideData[1].tide4time);
        tideOut.tide5Height=(tideData[1].tide4height);
        tideOut.tide6Time=(tideData[2].tide1time);
        tideOut.tide6Height=(tideData[2].tide1height);
        done(null, tideOut);
              }
            else
              console.log('Error while performing Query.');
          });
}}

//     var sql='SELECT * from cobh where thedate="'+pDate+'"';
// console.log(sql);
//     mConnection.query(sql, function(err, rows, fields) {
//       if (!err)
//         for (var i = 0; i < rows.length; i++) {
//         tideDataP = rows[i];
//
//         tideOut.tide1Time=(tideDataP.tide4time);
//         tideOut.tide1Height=(tideDataP.tide4height);
//         if (tideDataP.tide4time=="99"){
//           tideOut.tide1Time=(tideDataP.tide3time);
//           tideOut.tide1Height=(tideDataP.tide3height);
//         }
//     }
//       else
//         console.log('Error while performing Query.');
//     });



//connection.end();

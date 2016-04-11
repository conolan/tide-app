# tide-app
Simple tide app demonstrating Node, Seneca and other node.js tech


Tideapp loads tide data from 3 sources and displays them on a web page. The user chooses what date to load via a calendar form module. The first tides of the day from three locations (Belfast, Cobh, Dublin) are shown. There is also a link to a full days tide output for Belfast that’s displayed in a HTML5 canvas.

Full details below.

Conor O’Nolan Tideapp description - 2 30/03/2016

Further description of tideapp node.js app (after adding Seneca and HTML5/Javascript module)

Tideapp loads tide data from 3 sources and displays them on a web page. The user chooses what date to load via a calendar form module. The first tides of the day from three locations (Belfast, Cobh, Dublin) are shown. There is also a link to a full days tide output for Belfast that’s displayed in a HTML5 canvas.

Execution:

The app creates a server and as a first step displays a calendar form. On submitting the form, the result is parsed via ‘formidable’ node module (https://github.com/felixge/node-formidable). The incoming field is check for existence and passed to a variable ‘myDate’. This var is passed as an arg to Seneca instances.

Each of the three functions within the Seneca instances call a function in the relevant external .js file, and pass a callback in addition to the chosen date.

The callbacks (made 3 but could have parcelled them into one) pass the returned data to a var and increment a count var. When count==3, the output function is called and this creates the webpage with the tide data displayed.

The link to the chart opens a separate html file and passes the date, times and heights via a URL GET. Javascript interprets the strings and draws the curve.

Data Sources:

All data originated as xml files created by the author for a mobile project.

Belfast tide data has been converted to JSON and sits at the project root as belfast.JSON. The files is opened and read into a variable. The code steps through the variable until it finds a tidedate field equal to the input date. The first tide time and first tide date are returned. This operation is in belfastjson.js and called from ‘getBelfast’ function. The function returns a JSON object.

Cobh tide data has been imported into a mysql database on localhost. The database was created using Sequel Pro. The database is ‘tideapp’ and the table is ‘cobh’. The query is ('SELECT * from cobh where thedate="'+myDate+'"';) This operation is in cobhmysql.js and called from ‘getCobh’ function. The function returns a JSON object.

Dublin tide data is in a mySql database on an external server and is accessed by http call to a php script. The relevant code in node.js is (http.request(options, function(response).....). The operation is in dublinsql.js and called from getDublin function. The function returns a comma-delimited string variable. The remote php script has a deliberate 2-second delay before executing its query.

Code Sources:

The calendar comes from https://jqueryui.com/datepicker/ and is a simple html file with the form, which has one field - ‘datepicker’. The field is populated by the jquery calendar module which displays one month at a time.

The HTML5/ javascript module is derived from a Tide App on Android and IOS, created by the author. The Lua code has been transposed to javascript in order to draw the curve displayed.

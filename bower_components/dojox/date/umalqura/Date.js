define(["dojo/_base/lang", "dojo/_base/declare", "dojo/date", "../islamic/Date"],
 function(lang, declare, dd){

	var IDate = declare("dojox.date.umalqura.Date", null, {	
	
	// summary:
	//		The component defines the UmAlqura (Hijri) Calendar Object according to Umalqura calculations
    //		This module is similar to the Date() object provided by JavaScript
    // example:
    // |	var date = new dojox.date.umalqura.Date();
    // |	document.writeln(date.getFullYear()+'\'+date.getMonth()+'\'+date.getDate());


    _MONTH_LENGTH: [
    //1400 -1404 
    "010100101011", "011010010011", "010110110101", "001010110110", "101110110010",
    //1405 -1409
    "011010110101", "010101010110", "101010010110", "110101001010", "111010100101",
    //1410 -1414
     "011101010010", "101101101001", "010101110100", "101001101101", "100100110110",
    //1415 -1419
     "110010010110", "110101001010", "111001101001", "011010110100", "101010111010",
    //1420 -1424
    "010010111101", "001000111101", "100100011101", "101010010101", "101101001010",
    //1425 -1429
    "101101011010", "010101101101", "001010110110", "100100111011", "010010011011",
    //1430 -1434
     "011001010101", "011010101001", "011101010100", "101101101010", "010101101100",
    //1435 -1439
    "101010101101", "010101010101", "101100101001", "101110010010", "101110101001",
    //1440 -1444
     "010111010100", "101011011010", "010101011010", "101010101011", "010110010101",
    //1445 -1449
     "011101001001", "011101100100", "101110101010", "010110110101", "001010110110",
    //1450 -1454 
     "101001010110", "110100101010", "111010010101", "011100101010", "011101010101",
    //1455 -1459
     "001101011010", "100101011101", "010010011011", "101001001101", "110100100110",
    //1460 -1464
     "110101010011", "010110101010", "101010101101", "010010110110", "101001010111",
    //1465 -1469
     "010100100111", "101010010101", "101101001010", "101101010101", "001101101100",
    //1470 -1474
     "100110101110", "010010110110", "101010010110", "101101001010", "110110100101",
    //1475 -1479
     "010111010010", "010111011001", "001011011100", "100101101101", "010010101101",
    //1480
     "011001010101"],

    _hijriBegin: 1400,
    _hijriEnd: 1480,
    _date: 0,
    _month: 0,
    _year: 0,
    _hours: 0,
    _minutes: 0,
    _seconds: 0,
    _milliseconds: 0,
    _day: 0,

    constructor: function(){
        // summary:
        //		This function initialize the date object values

        var len = arguments.length;
        if(!len){// use the current date value, added "" to the similarity to date
            this.fromGregorian(new Date());
        }else if(len == 1){
            var arg0 = arguments[0];
            if(typeof arg0 == "number"){ // this is time "valueof"
                arg0 = new Date(arg0);
            }

            if(arg0 instanceof Date){
                this.fromGregorian(arg0);
            }else if(arg0 == ""){
                // date should be invalid.  Dijit relies on this behavior.
                this._date = new Date(""); //TODO: should this be NaN?  _date is not a Date object
            }else{  // this is umalqura.Date object
                this._year = arg0._year;
                this._month = arg0._month;
                this._date = arg0._date;
                this._hours = arg0._hours;
                this._minutes = arg0._minutes;
                this._seconds = arg0._seconds;
                this._milliseconds = arg0._milliseconds;
            }
        }else if(len >= 3){
            // YYYY MM DD arguments passed, month is from 0-12
            this._year += arguments[0];
            this._month += arguments[1];
            this._date += arguments[2];
            this._hours += arguments[3] || 0;
            this._minutes += arguments[4] || 0;
            this._seconds += arguments[5] || 0;
            this._milliseconds += arguments[6] || 0;
        }
    },

    getDate: function(){
        // summary:
        //		This function returns the date value (1 - 30)
        // example:
        // |	var date1 = new dojox.date.umalqura.Date();
        // |
        // |	document.writeln(date1.getDate);
        return this._date;
    },

    getMonth: function(){
        // summary:
        //		This function return the month value ( 0 - 11 )
        // example:
        // |	var date1 = new dojox.date.umalqura.Date();
        // |
        // |	document.writeln(date1.getMonth()+1);

        return this._month;
    },

    getFullYear: function(){
        // summary:
        //		This function return the year value
        // example:
        // |	var date1 = new dojox.date.umalqura.Date();
        // |
        // |	document.writeln(date1.getFullYear());

        return this._year;
    },

    getDay: function(){
        // summary:
        //		This function returns the week day value ( 0 - 6 )
        //		sunday is 0, monday is 1,...etc
        // example:
        // |	var date1 = new dojox.date.umalqura.Date();
        // |
        // |	document.writeln(date1.getDay());
        var d = this.toGregorian();
        var dd = d.getDay();
        return dd;
    },

    getHours: function(){
        // summary:
        //		returns the hour value
        return this._hours;
    },

    getMinutes: function(){
        // summary:
        //		returns the minutes value
        return this._minutes;
    },

    getSeconds: function(){
        // summary:
        //		returns the seconds value
        return this._seconds;
    },

    getMilliseconds: function(){
        // summary:
        //		returns the milliseconds value
        return this._milliseconds;
    },

    setDate: function(/*number*/ date){
        // summary:
        //		This function sets the date
        // example:
        // |	var date1 = new dojox.date.umalqura.Date();
        // |	date1.setDate(2);

        date = parseInt(date);

        if(date > 0 && date <= this.getDaysInIslamicMonth(this._month, this._year)){
            this._date = date;
        }else{
            var mdays;
            if(date > 0){
                for(mdays = this.getDaysInIslamicMonth(this._month, this._year);
					date > mdays;
						date -= mdays, mdays = this.getDaysInIslamicMonth(this._month, this._year)){
                    this._month++;
                    if(this._month >= 12){ this._year++; this._month -= 12; }
                }

                this._date = date;
            }else{
                for(mdays = this.getDaysInIslamicMonth((this._month - 1) >= 0 ? (this._month - 1) : 11, ((this._month - 1) >= 0) ? this._year : this._year - 1);
						date <= 0;
							mdays = this.getDaysInIslamicMonth((this._month - 1) >= 0 ? (this._month - 1) : 11, ((this._month - 1) >= 0) ? this._year : this._year - 1)){
                    this._month--;
                    if(this._month < 0){ this._year--; this._month += 12; }

                    date += mdays;
                }
                this._date = date;
            }
        }
        return this;
    },

    setFullYear: function(/*number*/ year){
        // summary:
        //		This function set Year
        // example:
        // |	var date1 = new dojox.date.umalqura.Date();
        // |	date1.setYear(1429);

        this._year = +year;
    },

    setMonth: function(/*number*/ month){
        // summary:
        //		This function sets the month
        // example:
        // |	var date1 = new dojox.date.umalqura.Date();
        // |	date1.setMonth(2);

        this._year += Math.floor(month / 12);
        if(month > 0){
            this._month = Math.floor(month % 12);
        }else{
            this._month = Math.floor(((month % 12) + 12) % 12);
        }
    },

    setHours: function(){
        // summary:
        //		set the hours
        var hours_arg_no = arguments.length;
        var hours = 0;
        if(hours_arg_no >= 1){
            hours = parseInt(arguments[0]);
        }

        if(hours_arg_no >= 2){
            this._minutes = parseInt(arguments[1]);
        }

        if(hours_arg_no >= 3){
            this._seconds = parseInt(arguments[2]);
        }

        if(hours_arg_no == 4){
            this._milliseconds = parseInt(arguments[3]);
        }

        while (hours >= 24){
            this._date++;
            var mdays = this.getDaysInIslamicMonth(this._month, this._year);
            if(this._date > mdays){
                this._month++;
                if(this._month >= 12){ this._year++; this._month -= 12; }
                this._date -= mdays;
            }
            hours -= 24;
        }
        this._hours = hours;
    },

	_addMinutes: function(/*Number*/ minutes){
		minutes += this._minutes;
		this.setMinutes(minutes);
		this.setHours(this._hours + parseInt(minutes / 60));
		return this;
	},

	_addSeconds: function(/*Number*/ seconds){
		seconds += this._seconds;
		this.setSeconds(seconds);
		this._addMinutes(parseInt(seconds / 60));
		return this;
	},

	_addMilliseconds: function(/*Number*/ milliseconds){
		milliseconds += this._milliseconds;
		this.setMilliseconds(milliseconds);
		this._addSeconds(parseInt(milliseconds / 1000));
		return this;
	},

    setMinutes: function(/*number*/ minutes){
        // summary:
        //		set the minutes

        while (minutes >= 60){
            this._hours++;
            if(this._hours >= 24){
                this._date++;
                this._hours -= 24;
                var mdays = this.getDaysInIslamicMonth(this._month, this._year);
                if(this._date > mdays){
                    this._month++;
                    if(this._month >= 12){ this._year++; this._month -= 12; }
                    this._date -= mdays;
                }
            }
            minutes -= 60;
        }
        this._minutes = minutes;
    },


    setSeconds: function(/*number*/ seconds){
        // summary:
        //		set seconds
        while (seconds >= 60){
            this._minutes++;
            if(this._minutes >= 60){
                this._hours++;
                this._minutes -= 60;
                if(this._hours >= 24){
                    this._date++;
                    this._hours -= 24;
                    var mdays = this.getDaysInIslamicMonth(this._month, this._year);
                    if(this._date > mdays){
                        this._month++;
                        if(this._month >= 12){ this._year++; this._month -= 12; }
                        this._date -= mdays;
                    }
                }
            }
            seconds -= 60;
        }
        this._seconds = seconds;
    },

    setMilliseconds: function(/*number*/ milliseconds){
        // summary:
        //		set the milliseconds
        while (milliseconds >= 1000){
            this.setSeconds++;
            if(this.setSeconds >= 60){
                this._minutes++;
                this.setSeconds -= 60;
                if(this._minutes >= 60){
                    this._hours++;
                    this._minutes -= 60;
                    if(this._hours >= 24){
                        this._date++;
                        this._hours -= 24;
                        var mdays = this.getDaysInIslamicMonth(this._month, this._year);
                        if(this._date > mdays){
                            this._month++;
                            if(this._month >= 12){ this._year++; this._month -= 12; }
                            this._date -= mdays;
                        }
                    }
                }
            }
            milliseconds -= 1000;
        }
        this._milliseconds = milliseconds;
    },


    toString: function(){
        // summary:
        //		This returns a string representation of the date in "DDDD MMMM DD YYYY HH:MM:SS" format
        // example:
        // |		var date1 = new dojox.date.umalqura.Date();
        // |		document.writeln(date1.toString());

        //FIXME: TZ/DST issues?
        var x = new Date();
        x.setHours(this._hours);
        x.setMinutes(this._minutes);
        x.setSeconds(this._seconds);
        x.setMilliseconds(this._milliseconds);
        return this._month + " " + this._date + " " + this._year + " " + x.toTimeString();
    },


    toGregorian: function(){
        // summary:
        //		This returns the equivalent gregorian date value in Date object
        // example:
        // |	var dateIslamic = new dojox.date.umalqura.Date(1429,11,20);
        // |	var dateGregorian = dateIslamic.toGregorian();



        var hYear = this._year;
        var hMonth = this._month;
        var hDate = this._date;
        var gdate = new Date();
        if(hYear >= this._hijriBegin && hYear <= this._hijriEnd){
            var gregorianRef = new Array(17);
            gregorianRef[0] = new Date(1979, 10, 20, 0, 0, 0, 0);
            gregorianRef[1] = new Date(1984, 8, 26, 0, 0, 0, 0);
            gregorianRef[2] = new Date(1989, 7, 3, 0, 0, 0, 0);
            gregorianRef[3] = new Date(1994, 5, 10, 0, 0, 0, 0);
            gregorianRef[4] = new Date(1999, 3, 17, 0, 0, 0, 0);
            gregorianRef[5] = new Date(2004, 1, 21, 0, 0, 0, 0);
            gregorianRef[6] = new Date(2008, 11, 29, 0, 0, 0, 0);
            gregorianRef[7] = new Date(2013, 10, 4, 0, 0, 0, 0);
            gregorianRef[8] = new Date(2018, 8, 11, 0, 0, 0, 0);
            gregorianRef[9] = new Date(2023, 6, 19, 0, 0, 0, 0);
            gregorianRef[10] = new Date(2028, 4, 25, 0, 0, 0, 0);
            gregorianRef[11] = new Date(2033, 3, 1, 0, 0, 0, 0);
            gregorianRef[12] = new Date(2038, 1, 5, 0, 0, 0, 0);
            gregorianRef[13] = new Date(2042, 11, 14, 0, 0, 0, 0);
            gregorianRef[14] = new Date(2047, 9, 20, 0, 0, 0, 0);
            gregorianRef[15] = new Date(2052, 7, 26, 0, 0, 0, 0);
			gregorianRef[16] = new Date(2057, 6, 3, 0, 0, 0, 0);
            var i = (hYear - this._hijriBegin);
            var a = Math.floor(i / 5);
            var b = i % 5;
            var days = 0;
            var m = b;
            var temp = a * 5;
            var l = 0;
            var h = 0;

            if(b == 0){
                for(h = 0; h <= hMonth - 1; h++){
                    if(this._MONTH_LENGTH[i].charAt(h) == '1') days = days + 30;
                    else if(this._MONTH_LENGTH[i].charAt(h) == '0') days = days + 29;
                }
                days = days + (hDate - 1);
            }else{
                for(k = temp; k <= (temp + b); k++){
                    for(l = 0; m > 0 && l < 12; l++){
                        if(this._MONTH_LENGTH[k].charAt(l) == '1') days = days + 30;
                        else if(this._MONTH_LENGTH[k].charAt(l) == '0') days = days + 29;
                    }
                    m--;
                    if(m == 0){
                        for(h = 0; h <= hMonth - 1; h++){
                            if(this._MONTH_LENGTH[i].charAt(h) == '1') days = days + 30;
                            else if(this._MONTH_LENGTH[i].charAt(h) == '0') days = days + 29;
                        }
                    }
                }
                days = days + (hDate - 1);
            }
            var gregRef = new Date(gregorianRef[a]);
            gregRef.setHours(this._hours, this._minutes, this._seconds, this._milliseconds);
            //gdate = dojo.date.add(gregRef, "day", days);
            gdate = dd.add(gregRef, "day", days);
        }

        else{
            var islamicDate = new dojox.date.islamic.Date(this._year, this._month, this._date, this._hours, this._minutes, this._seconds, this._milliseconds);
            gdate = new Date(islamicDate.toGregorian());
        }
        return gdate;
    },

    //TODO: would it make more sense to make this a constructor option? or a static?
    fromGregorian: function(/*Date*/ gdate){
        // summary:
        //		This function returns the equivalent UmAlqura Date value for the Gregorian Date
        // example:
        // |		var dateIslamic = new dojox.date.umalqura.Date();
        // |		var dateGregorian = new Date(2008,10,12);
        // |		dateIslamic.fromGregorian(dateGregorian);


        var date = new Date(gdate);
            date.setHours(0, 0, 0, 0);
        var gYear = date.getFullYear(),
			gMonth = date.getMonth(),
			gDay = date.getDate();

        var gregorianRef = new Array(17);
        gregorianRef[0] = new Date(1979, 10, 20, 0, 0, 0, 0);
        gregorianRef[1] = new Date(1984, 8, 26, 0, 0, 0, 0);
        gregorianRef[2] = new Date(1989, 7, 3, 0, 0, 0, 0);
        gregorianRef[3] = new Date(1994, 5, 10, 0, 0, 0, 0);
        gregorianRef[4] = new Date(1999, 3, 17, 0, 0, 0, 0);
        gregorianRef[5] = new Date(2004, 1, 21, 0, 0, 0, 0);
        gregorianRef[6] = new Date(2008, 11, 29, 0, 0, 0, 0);
        gregorianRef[7] = new Date(2013, 10, 4, 0, 0, 0, 0);
        gregorianRef[8] = new Date(2018, 8, 11, 0, 0, 0, 0);
        gregorianRef[9] = new Date(2023, 6, 19, 0, 0, 0, 0);
        gregorianRef[10] = new Date(2028, 4, 25, 0, 0, 0, 0);
        gregorianRef[11] = new Date(2033, 3, 1, 0, 0, 0, 0);
        gregorianRef[12] = new Date(2038, 1, 5, 0, 0, 0, 0);
        gregorianRef[13] = new Date(2042, 11, 14, 0, 0, 0, 0);
        gregorianRef[14] = new Date(2047, 9, 20, 0, 0, 0, 0);
        gregorianRef[15] = new Date(2052, 7, 26, 0, 0, 0, 0);
		gregorianRef[16] = new Date(2057, 6, 3, 0, 0, 0, 0);
		
		var gregorianLastRef=new Date(2058, 5, 21, 0, 0, 0, 0);

        //if(dojo.date.compare(date, gregorianRef[0]) >= 0 && dojo.date.compare(date, gregorianRef[15]) <= 0){
        //if(dd.compare(date, gregorianRef[0]) >= 0 && dd.compare(date, gregorianRef[16]) <= 0){
		if(dd.compare(date, gregorianRef[0]) >= 0 && dd.compare(date, gregorianLastRef) <= 0){
		var diff;
			if(dd.compare(date, gregorianRef[16]) <= 0){
				var count = 0;
				var pos = 0;
				var isRef=0;
				for(count = 0; count < gregorianRef.length; count++){
					//if(dojo.date.compare(date, gregorianRef[count], "date") == 0){
					if(dd.compare(date, gregorianRef[count], "date") == 0){                	
						pos = count;
						isRef=1;
						break;
					}
					else{

						//if(dojo.date.compare(date, gregorianRef[count], "date") < 0){
						if(dd.compare(date, gregorianRef[count], "date") < 0){
							pos = count - 1; break;
						}
					}
				}
				var j = 0; var flag = 0; var monthL = 0;
				if(isRef==1){
					this._date = 1;
					this._month = 0;
					this._year = this._hijriBegin + pos*5;
					this._hours = gdate.getHours();
					this._minutes = gdate.getMinutes();
					this._seconds = gdate.getSeconds();
					this._milliseconds = gdate.getMilliseconds();
					this._day = gregorianRef[pos].getDay();
				}
				else{
				
					//var diff = dojo.date.difference(gregorianRef[pos], date, "day");
					diff = dd.difference(gregorianRef[pos], date, "day");
					pos = pos * 5;
					for(i = pos; i < pos + 5; i++){
						for(j = 0; j <= 11; j++){
							if(this._MONTH_LENGTH[i].charAt(j) == '1') monthL = 30;
							else if(this._MONTH_LENGTH[i].charAt(j) == '0') monthL = 29;

							if(diff > monthL) diff = diff - monthL;
							else{
								flag = 1;
								break;
							}
						}

						if(flag == 1){
							if(diff == 0){
								diff = 1; 

								if(j == 11){
									j = 1; ++i;
								}
								else ++j;
								break;
							}
							else{
								if(diff==monthL){
									diff=0;
									if(j == 11){
										j = 0;
										++i;
									}
									else ++j;
								}
								diff++;
								break;
							}
						}
					}
					this._date = diff;
					this._month = j;
					this._year = this._hijriBegin + i;
					this._hours = gdate.getHours();
					this._minutes = gdate.getMinutes();
					this._seconds = gdate.getSeconds();
					this._milliseconds = gdate.getMilliseconds();
					this._day = gdate.getDay();
				}
			}
			else{
	//			if((dd.compare(date, gregorianRef[16]) > 0)&& (dd.compare(date,gregorianLastRef)<=0)){
				//Date is in year 1480
				diff=dd.difference(gregorianRef[16],date,"day");
				var x=dd.difference(new Date(2057, 6, 3, 0, 0, 0, 0),new Date(2057, 6, 1, 0, 0, 0, 0),"date");
				//alert (x);
				for( j=0;j<=11;j++){
					if(this._MONTH_LENGTH[80].charAt(j) == '1') monthL = 30;
					else if(this._MONTH_LENGTH[80].charAt(j) == '0') monthL = 29;

					if(diff > monthL) diff = diff - monthL;
					else{
						flag = 1;
						break;
					}
						
				}
					
				if(flag == 1){
					if(diff == 0){
						diff = 1;

							if(j == 11){
								j = 1; ++i;
							}
							else ++j;
							//break;
					}
					else{
						if(diff==monthL){
							diff=0;
							if(j == 11){
								j = 0;
								++i;
							}
							else ++j;
						}
							diff++;
							//break;
					}
				}
				this._date = diff;
				this._month = j;
				this._year = 1480;
				this._hours = gdate.getHours();
				this._minutes = gdate.getMinutes();
				this._seconds = gdate.getSeconds();
				this._milliseconds = gdate.getMilliseconds();
				this._day = gdate.getDay();
					
	//        	}
			}
			
			

		}

        else{
        	
			
            var islamicDate = new dojox.date.islamic.Date(date);
            this._date = islamicDate.getDate();
            this._month = islamicDate.getMonth();
            this._year = islamicDate.getFullYear();
            this._hours = gdate.getHours();
            this._minutes = gdate.getMinutes();
            this._seconds = gdate.getSeconds();
            this._milliseconds = gdate.getMilliseconds();
            this._day = gdate.getDay();
			
        }

        return this;
    },

    valueOf: function(){
        // summary:
        //		This function returns the stored time value in milliseconds
        //		since midnight, January 1, 1970 UTC

        return (this.toGregorian()).valueOf();
    },

    // ported from the Java class com.ibm.icu.util.IslamicCalendar from ICU4J v3.6.1 at http://www.icu-project.org/
    _yearStart: function(/*Number*/year){
        // summary:
        //		return start of Islamic year
        return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0); //1078
    },

    // ported from the Java class com.ibm.icu.util.IslamicCalendar from ICU4J v3.6.1 at http://www.icu-project.org/
    _monthStart: function(/*Number*/year, /*Number*/month){
        // summary:
        //		return the start of Islamic Month
        return Math.ceil(29.5 * month) +
			(year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
    },

    // ported from the Java class com.ibm.icu.util.IslamicCalendar from ICU4J v3.6.1 at http://www.icu-project.org/
    _civilLeapYear: function(/*Number*/year){
        // summary:
        //		return Boolean value if Islamic leap year
        return (14 + 11 * year) % 30 < 11;
    },


    getDaysInIslamicMonth: function(/*Number*/ month, /*Number*/ year){
        // summary:
        //		returns the number of days in the given Islamic month
        if(year >= this._hijriBegin && year <= this._hijriEnd){
            var pos = year - this._hijriBegin;
            var length = 0;
            if(this._MONTH_LENGTH[pos].charAt(month) == 1)
                length = 30;
            else length = 29;
        }else{
            var islamicDate = new dojox.date.islamic.Date();
            length = islamicDate.getDaysInIslamicMonth(month, year);
        }
        return length;
    }
});

//TODOC
IDate.getDaysInIslamicMonth = function(/*dojox.date.umalqura.Date*/month){
	return new IDate().getDaysInIslamicMonth(month.getMonth(),month.getFullYear()); // dojox.date.islamic.Date
};

return IDate;
});


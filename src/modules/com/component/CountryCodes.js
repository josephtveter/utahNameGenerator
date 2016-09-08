// ISO 3166-1 alpha-2
var CountryCodes = function()
{
	var self = this;

	this.list = {
		"AD":{name:"country.AD",A2:"AD",A3:"AND",num:20, dataPhone: 376},
		"AE":{name:"country.AE",A2:"AE",A3:"ARE",num:784},
		"AF":{name:"country.AF",A2:"AF",A3:"AFG",num:4, dataPhone: 93},
		"AG":{name:"country.AG",A2:"AG",A3:"ATG",num:28, dataPhone: 1268},
		"AI":{name:"country.AI",A2:"AI",A3:"AIA",num:660, dataPhone: 1264},
		"AL":{name:"country.AL",A2:"AL",A3:"ALB",num:8, dataPhone: 355},
		"AM":{name:"country.AM",A2:"AM",A3:"ARM",num:51, dataPhone: 374},
		"AO":{name:"country.AO",A2:"AO",A3:"AGO",num:24, dataPhone: 244},
		"AQ":{name:"country.AQ",A2:"AQ",A3:"ATA",num:10, dataPhone: 672},
		"AR":{name:"country.AR",A2:"AR",A3:"ARG",num:32, dataPhone: 54},
		"AS":{name:"country.AS",A2:"AS",A3:"ASM",num:16, dataPhone: 1684},
		"AT":{name:"country.AT",A2:"AT",A3:"AUT",num:40, dataPhone: 43, "currencyCode": "EUR"},
		"AU":{name:"country.AU",A2:"AU",A3:"AUS",num:36, dataPhone: 61},
		"AW":{name:"country.AW",A2:"AW",A3:"ABW",num:533, dataPhone: 297},
		"AX":{name:"country.AX",A2:"AX",A3:"ALA",num:248},
		"AZ":{name:"country.AZ",A2:"AZ",A3:"AZE",num:31, dataPhone: 994},
		"BA":{name:"country.BA",A2:"BA",A3:"BIH",num:70, dataPhone: 387},
		"BB":{name:"country.BB",A2:"BB",A3:"BRB",num:52, dataPhone: 1246},
		"BD":{name:"country.BD",A2:"BD",A3:"BGD",num:50, dataPhone: 880},
		"BE":{name:"country.BE",A2:"BE",A3:"BEL",num:56, dataPhone: 32, "currencyCode": "EUR"},
		"BF":{name:"country.BF",A2:"BF",A3:"BFA",num:854, dataPhone: 226},
		"BG":{name:"country.BG",A2:"BG",A3:"BGR",num:100, dataPhone: 359, "currencyCode": "EUR"},
		"BH":{name:"country.BH",A2:"BH",A3:"BHR",num:48, dataPhone: 973},
		"BI":{name:"country.BI",A2:"BI",A3:"BDI",num:108, dataPhone: 257},
		"BJ":{name:"country.BJ",A2:"BJ",A3:"BEN",num:204, dataPhone: 229},
		"BL":{name:"country.BL",A2:"BL",A3:"BLM",num:625},
		"BM":{name:"country.BM",A2:"BM",A3:"BMU",num:60, dataPhone: 1441},
		"BN":{name:"country.BN",A2:"BN",A3:"BRN",num:96, dataPhone: 673},
		"BO":{name:"country.BO",A2:"BO",A3:"BOL",num:68, dataPhone: 591},
		"BQ":{name:"country.BQ",A2:"BQ",A3:"BES",num:535},
		"BR":{name:"country.BR",A2:"BR",A3:"BRA",num:76, dataPhone: 55},
		"BS":{name:"country.BS",A2:"BS",A3:"BHS",num:44, dataPhone: 1242},
		"BT":{name:"country.BT",A2:"BT",A3:"BTN",num:64, dataPhone: 975},
		"BV":{name:"country.BV",A2:"BV",A3:"BVT",num:74},
		"BW":{name:"country.BW",A2:"BW",A3:"BWA",num:72, dataPhone: 267},
		"BY":{name:"country.BY",A2:"BY",A3:"BLR",num:112, dataPhone: 375},
		"BZ":{name:"country.BZ",A2:"BZ",A3:"BLZ",num:84, dataPhone: 501},
		"CA":{name:"country.CA",A2:"CA",A3:"CAN",num:124, dataPhone: 1},
		"CC":{name:"country.CC",A2:"CC",A3:"CCK",num:166, dataPhone: 61},
		"CD":{name:"country.CD",A2:"CD",A3:"COD",num:180, dataPhone: 242},
		"CF":{name:"country.CF",A2:"CF",A3:"CAF",num:140, dataPhone: 236},
		"CG":{name:"country.CG",A2:"CG",A3:"COG",num:178},
		"CH":{name:"country.CH",A2:"CH",A3:"CHE",num:756},
		"CI":{name:"country.CI",A2:"CI",A3:"CIV",num:384, dataPhone: 225},
		"CK":{name:"country.CK",A2:"CK",A3:"COK",num:184, dataPhone: 682},
		"CL":{name:"country.CL",A2:"CL",A3:"CHL",num:152, dataPhone: 56},
		"CM":{name:"country.CM",A2:"CM",A3:"CMR",num:120, dataPhone: 237},
		"CN":{name:"country.CN",A2:"CN",A3:"CHN",num:156, dataPhone: 86},
		"CO":{name:"country.CO",A2:"CO",A3:"COL",num:170, dataPhone: 57},
		"CR":{name:"country.CR",A2:"CR",A3:"CRI",num:188, dataPhone: 506},
		"CS":{name:"country.CS",A2:"CS",A3:"SRB",num:688},
		"CU":{name:"country.CU",A2:"CU",A3:"CUB",num:192, dataPhone: 53},
		"CV":{name:"country.CV",A2:"CV",A3:"CPV",num:132, dataPhone: 238},
		"CW":{name:"country.CW",A2:"CW",A3:"CUW",num:531},
		"CX":{name:"country.CX",A2:"CX",A3:"CXR",num:162, dataPhone: 61},
		"CY":{name:"country.CY",A2:"CY",A3:"CYP",num:196, dataPhone: 357, "currencyCode": "EUR"},
		"CZ":{name:"country.CZ",A2:"CZ",A3:"CZE",num:203, dataPhone: 420, "currencyCode": "EUR"},
		"DE":{name:"country.DE",A2:"DE",A3:"DEU",num:276, "currencyCode": "EUR"},
		"DJ":{name:"country.DJ",A2:"DJ",A3:"DJI",num:262, dataPhone: 253},
		"DK":{name:"country.DK",A2:"DK",A3:"DNK",num:208, dataPhone: 45, "currencyCode": "EUR"},
		"DM":{name:"country.DM",A2:"DM",A3:"DMA",num:212, dataPhone: 1767},
		"DO":{name:"country.DO",A2:"DO",A3:"DOM",num:214, dataPhone: 1809},
		"DZ":{name:"country.DZ",A2:"DZ",A3:"DZA",num:12, dataPhone: 213},
		"EC":{name:"country.EC",A2:"EC",A3:"ECU",num:218, dataPhone: 593, "currencyCode": "USD"},
		"EE":{name:"country.EE",A2:"EE",A3:"EST",num:233, dataPhone: 372, "currencyCode": "EUR"},
		"EG":{name:"country.EG",A2:"EG",A3:"EGY",num:818, dataPhone: 20},
		"EH":{name:"country.EH",A2:"EH",A3:"ESH",num:732},
		"ER":{name:"country.ER",A2:"ER",A3:"ERI",num:232, dataPhone: 291},
		"ES":{name:"country.ES",A2:"ES",A3:"ESP",num:724, "currencyCode": "EUR"},
		"ET":{name:"country.ET",A2:"ET",A3:"ETH",num:231, dataPhone: 251},
		"FI":{name:"country.FI",A2:"FI",A3:"FIN",num:246, "currencyCode": "EUR"},
		"FJ":{name:"country.FJ",A2:"FJ",A3:"FJI",num:242},
		"FK":{name:"country.FK",A2:"FK",A3:"FLK",num:238},
		"FM":{name:"country.FM",A2:"FM",A3:"FSM",num:583, "currencyCode": "USD"},
		"FO":{name:"country.FO",A2:"FO",A3:"FRO",num:234},
		"FR":{name:"country.FR",A2:"FR",A3:"FRA",num:250, "currencyCode": "EUR"},
		"GA":{name:"country.GA",A2:"GA",A3:"GAB",num:266},
		"GB":{name:"country.GB",A2:"GB",A3:"GBR",num:826, "currencyCode": "GBP"},
		"GD":{name:"country.GD",A2:"GD",A3:"GRD",num:308},
		"GE":{name:"country.GE",A2:"GE",A3:"GEO",num:268},
		"GF":{name:"country.GF",A2:"GF",A3:"GUF",num:254},
		"GG":{name:"country.GG",A2:"GG",A3:"GGY",num:831},
		"GH":{name:"country.GH",A2:"GH",A3:"GHA",num:288},
		"GI":{name:"country.GI",A2:"GI",A3:"GIB",num:292},
		"GL":{name:"country.GL",A2:"GL",A3:"GRL",num:304},
		"GM":{name:"country.GM",A2:"GM",A3:"GMB",num:270},
		"GN":{name:"country.GN",A2:"GN",A3:"GIN",num:324},
		"GP":{name:"country.GP",A2:"GP",A3:"GLP",num:312},
		"GQ":{name:"country.GQ",A2:"GQ",A3:"GNQ",num:226, dataPhone: 240},
		"GR":{name:"country.GR",A2:"GR",A3:"GRC",num:300, "currencyCode": "EUR"},
		"GS":{name:"country.GS",A2:"GS",A3:"SGS",num:239},
		"GT":{name:"country.GT",A2:"GT",A3:"GTM",num:320},
		"GU":{name:"country.GU",A2:"GU",A3:"GUM",num:316},
		"GW":{name:"country.GW",A2:"GW",A3:"GNB",num:624},
		"GY":{name:"country.GY",A2:"GY",A3:"GUY",num:328},
		"HK":{name:"country.HK",A2:"HK",A3:"HKG",num:344},
		"HM":{name:"country.HM",A2:"HM",A3:"HMD",num:334},
		"HN":{name:"country.HN",A2:"HN",A3:"HND",num:340},
		"HR":{name:"country.HR",A2:"HR",A3:"HRV",num:191, dataPhone: 385, "currencyCode": "EUR"},
		"HT":{name:"country.HT",A2:"HT",A3:"HTI",num:332},
		"HU":{name:"country.HU",A2:"HU",A3:"HUN",num:348, "currencyCode": "EUR"},
		"ID":{name:"country.ID",A2:"ID",A3:"IDN",num:360},
		"IE":{name:"country.IE",A2:"IE",A3:"IRL",num:372, "currencyCode": "EUR"},
		"IL":{name:"country.IL",A2:"IL",A3:"ISR",num:376},
		"IM":{name:"country.IM",A2:"IM",A3:"IMN",num:833},
		"IN":{name:"country.IN",A2:"IN",A3:"IND",num:356},
		"IO":{name:"country.IO",A2:"IO",A3:"IOT",num:86, dataPhone: 246},
		"IQ":{name:"country.IQ",A2:"IQ",A3:"IRQ",num:368},
		"IR":{name:"country.IR",A2:"IR",A3:"IRN",num:364},
		"IS":{name:"country.IS",A2:"IS",A3:"ISL",num:352},
		"IT":{name:"country.IT",A2:"IT",A3:"ITA",num:380, "currencyCode": "EUR"},
		"JE":{name:"country.JE",A2:"JE",A3:"JEY",num:832},
		"JM":{name:"country.JM",A2:"JM",A3:"JAM",num:388},
		"JO":{name:"country.JO",A2:"JO",A3:"JOR",num:400},
		"JP":{name:"country.JP",A2:"JP",A3:"JPN",num:392},
		"KE":{name:"country.KE",A2:"KE",A3:"KEN",num:404},
		"KG":{name:"country.KG",A2:"KG",A3:"KGZ",num:417},
		"KH":{name:"country.KH",A2:"KH",A3:"KHM",num:116, dataPhone: 855},
		"KI":{name:"country.KI",A2:"KI",A3:"KIR",num:296},
		"KM":{name:"country.KM",A2:"KM",A3:"COM",num:174, dataPhone: 269},
		"KN":{name:"country.KN",A2:"KN",A3:"KNA",num:659},
		"KP":{name:"country.KP",A2:"KP",A3:"PRK",num:408},
		"KR":{name:"country.KR",A2:"KR",A3:"KOR",num:410},
		"KW":{name:"country.KW",A2:"KW",A3:"KWT",num:414},
		"KY":{name:"country.KY",A2:"KY",A3:"CYM",num:136, dataPhone: 1345},
		"KZ":{name:"country.KZ",A2:"KZ",A3:"KAZ",num:398},
		"LA":{name:"country.LA",A2:"LA",A3:"LAO",num:418},
		"LB":{name:"country.LB",A2:"LB",A3:"LBN",num:422, dataPhone: 961},
		"LC":{name:"country.LC",A2:"LC",A3:"LCA",num:662},
		"LI":{name:"country.LI",A2:"LI",A3:"LIE",num:438},
		"LK":{name:"country.LK",A2:"LK",A3:"LKA",num:144},
		"LR":{name:"country.LR",A2:"LR",A3:"LBR",num:430},
		"LS":{name:"country.LS",A2:"LS",A3:"LSO",num:426},
		"LT":{name:"country.LT",A2:"LT",A3:"LTU",num:440, "currencyCode": "EUR"},
		"LU":{name:"country.LU",A2:"LU",A3:"LUX",num:442, "currencyCode": "EUR"},
		"LV":{name:"country.LV",A2:"LV",A3:"LVA",num:428, "currencyCode": "EUR"},
		"LY":{name:"country.LY",A2:"LY",A3:"LBY",num:434},
		"MA":{name:"country.MA",A2:"MA",A3:"MAR",num:504},
		"MC":{name:"country.MC",A2:"MC",A3:"MCO",num:492},
		"MD":{name:"country.MD",A2:"MD",A3:"MDA",num:498},
		"ME":{name:"country.ME",A2:"ME",A3:"MNE",num:499},
		"MF":{name:"country.MF",A2:"MF",A3:"MAF",num:663},
		"MG":{name:"country.MG",A2:"MG",A3:"MDG",num:450},
		"MH":{name:"country.MH",A2:"MH",A3:"MHL",num:584, "currencyCode": "USD"},
		"MK":{name:"country.MK",A2:"MK",A3:"MKD",num:807},
		"ML":{name:"country.ML",A2:"ML",A3:"MLI",num:466},
		"MM":{name:"country.MM",A2:"MM",A3:"MMR",num:104},
		"MN":{name:"country.MN",A2:"MN",A3:"MNG",num:496},
		"MO":{name:"country.MO",A2:"MO",A3:"MAC",num:446},
		"MP":{name:"country.MP",A2:"MP",A3:"MNP",num:580},
		"MQ":{name:"country.MQ",A2:"MQ",A3:"MTQ",num:474},
		"MR":{name:"country.MR",A2:"MR",A3:"MRT",num:478},
		"MS":{name:"country.MS",A2:"MS",A3:"MSR",num:500},
		"MT":{name:"country.MT",A2:"MT",A3:"MLT",num:470, "currencyCode": "EUR"},
		"MU":{name:"country.MU",A2:"MU",A3:"MUS",num:480},
		"MV":{name:"country.MV",A2:"MV",A3:"MDV",num:462},
		"MW":{name:"country.MW",A2:"MW",A3:"MWI",num:454},
		"MX":{name:"country.MX",A2:"MX",A3:"MEX",num:484},
		"MY":{name:"country.MY",A2:"MY",A3:"MYS",num:458},
		"MZ":{name:"country.MZ",A2:"MZ",A3:"MOZ",num:508},
		"NA":{name:"country.NA",A2:"NA",A3:"NAM",num:516},
		"NC":{name:"country.NC",A2:"NC",A3:"NCL",num:540},
		"NE":{name:"country.NE",A2:"NE",A3:"NER",num:562},
		"NF":{name:"country.NF",A2:"NF",A3:"NFK",num:574},
		"NG":{name:"country.NG",A2:"NG",A3:"NGA",num:566},
		"NI":{name:"country.NI",A2:"NI",A3:"NIC",num:558},
		"NL":{name:"country.NL",A2:"NL",A3:"NLD",num:528, "currencyCode": "EUR"},
		"NO":{name:"country.NO",A2:"NO",A3:"NOR",num:578},
		"NP":{name:"country.NP",A2:"NP",A3:"NPL",num:524},
		"NR":{name:"country.NR",A2:"NR",A3:"NRU",num:520},
		"NU":{name:"country.NU",A2:"NU",A3:"NIU",num:570},
		"NZ":{name:"country.NZ",A2:"NZ",A3:"NZL",num:554},
		"OM":{name:"country.OM",A2:"OM",A3:"OMN",num:512},
		"PA":{name:"country.PA",A2:"PA",A3:"PAN",num:591, "currencyCode": "USD"},
		"PE":{name:"country.PE",A2:"PE",A3:"PER",num:604},
		"PF":{name:"country.PF",A2:"PF",A3:"PYF",num:258},
		"PG":{name:"country.PG",A2:"PG",A3:"PNG",num:598},
		"PH":{name:"country.PH",A2:"PH",A3:"PHL",num:608},
		"PK":{name:"country.PK",A2:"PK",A3:"PAK",num:586},
		"PL":{name:"country.PL",A2:"PL",A3:"POL",num:616, "currencyCode": "EUR"},
		"PM":{name:"country.PM",A2:"PM",A3:"SPM",num:666},
		"PN":{name:"country.PN",A2:"PN",A3:"PCN",num:612},
		"PR":{name:"country.PR",A2:"PR",A3:"PRI",num:630},
		"PS":{name:"country.PS",A2:"PS",A3:"PSE",num:275},
		"PT":{name:"country.PT",A2:"PT",A3:"PRT",num:620, "currencyCode": "EUR"},
		"PW":{name:"country.PW",A2:"PW",A3:"PLW",num:585, "currencyCode": "USD"},
		"PY":{name:"country.PY",A2:"PY",A3:"PRY",num:600},
		"QA":{name:"country.QA",A2:"QA",A3:"QAT",num:634},
		"RE":{name:"country.RE",A2:"RE",A3:"REU",num:638},
		"RO":{name:"country.RO",A2:"RO",A3:"ROU",num:642, "currencyCode": "EUR"},
		"RU":{name:"country.RU",A2:"RU",A3:"RUS",num:643},
		"RW":{name:"country.RW",A2:"RW",A3:"RWA",num:646},
		"SA":{name:"country.SA",A2:"SA",A3:"SAU",num:682},
		"SB":{name:"country.SB",A2:"SB",A3:"SLB",num:90},
		"SC":{name:"country.SC",A2:"SC",A3:"SYC",num:690},
		"SD":{name:"country.SD",A2:"SD",A3:"SDN",num:729},
		"SE":{name:"country.SE",A2:"SE",A3:"SWE",num:752, "currencyCode": "EUR"},
		"SG":{name:"country.SG",A2:"SG",A3:"SGP",num:702},
		"SH":{name:"country.SH",A2:"SH",A3:"SHN",num:654},
		"SI":{name:"country.SI",A2:"SI",A3:"SVN",num:705, "currencyCode": "EUR"},
		"SJ":{name:"country.SJ",A2:"SJ",A3:"SJM",num:744},
		"SK":{name:"country.SK",A2:"SK",A3:"SVK",num:703, "currencyCode": "EUR"},
		"SL":{name:"country.SL",A2:"SL",A3:"SLE",num:694},
		"SM":{name:"country.SM",A2:"SM",A3:"SMR",num:674},
		"SN":{name:"country.SN",A2:"SN",A3:"SEN",num:686},
		"SO":{name:"country.SO",A2:"SO",A3:"SOM",num:706},
		"SR":{name:"country.SR",A2:"SR",A3:"SUR",num:740},
		"SS":{name:"country.SS",A2:"SS",A3:"SSD",num:728},
		"ST":{name:"country.ST",A2:"ST",A3:"STP",num:678},
		"SV":{name:"country.SV",A2:"SV",A3:"SLV",num:222, dataPhone: 503, "currencyCode": "USD"},
		"SX":{name:"country.SX",A2:"SX",A3:"SXM",num:534}, 
		"SY":{name:"country.SY",A2:"SY",A3:"SYR",num:760},
		"SZ":{name:"country.SZ",A2:"SZ",A3:"SWZ",num:748},
		"TC":{name:"country.TC",A2:"TC",A3:"TCA",num:796, "currencyCode": "USD"},
		"TD":{name:"country.TD",A2:"TD",A3:"TCD",num:148, dataPhone: 235},
		"TF":{name:"country.TF",A2:"TF",A3:"ATF",num:260},
		"TG":{name:"country.TG",A2:"TG",A3:"TGO",num:768},
		"TH":{name:"country.TH",A2:"TH",A3:"THA",num:764},
		"TJ":{name:"country.TJ",A2:"TJ",A3:"TJK",num:762},
		"TK":{name:"country.TK",A2:"TK",A3:"TKL",num:772},
		"TL":{name:"country.TL",A2:"TL",A3:"TLS",num:626},
		"TM":{name:"country.TM",A2:"TM",A3:"TKM",num:795},
		"TN":{name:"country.TN",A2:"TN",A3:"TUN",num:788},
		"TO":{name:"country.TO",A2:"TO",A3:"TON",num:776},
		"TR":{name:"country.TR",A2:"TR",A3:"TUR",num:792},
		"TT":{name:"country.TT",A2:"TT",A3:"TTO",num:780},
		"TV":{name:"country.TV",A2:"TV",A3:"TUV",num:798},
		"TW":{name:"country.TW",A2:"TW",A3:"TWN",num:158},
		"TZ":{name:"country.TZ",A2:"TZ",A3:"TZA",num:834},
		"UA":{name:"country.UA",A2:"UA",A3:"UKR",num:804},
		"UG":{name:"country.UG",A2:"UG",A3:"UGA",num:800},
		"UM":{name:"country.UM",A2:"UM",A3:"UMI",num:581, "currencyCode": "USD"},
		"US":{name:"country.US",A2:"US",A3:"USA",num:840, dataPhone: 1, "currencyCode": "USD"},
		"UY":{name:"country.UY",A2:"UY",A3:"URY",num:858},
		"UZ":{name:"country.UZ",A2:"UZ",A3:"UZB",num:860},
		"VA":{name:"country.VA",A2:"VA",A3:"VAT",num:336},
		"VC":{name:"country.VC",A2:"VC",A3:"VCT",num:670},
		"VE":{name:"country.VE",A2:"VE",A3:"VEN",num:862},
		"VG":{name:"country.VG",A2:"VG",A3:"VGB",num:92, "currencyCode": "USD"},
		"VI":{name:"country.VI",A2:"VI",A3:"VIR",num:850},
		"VN":{name:"country.VN",A2:"VN",A3:"VNM",num:704},
		"VU":{name:"country.VU",A2:"VU",A3:"VUT",num:548},
		"WF":{name:"country.WF",A2:"WF",A3:"WLF",num:876},
		"WS":{name:"country.WS",A2:"WS",A3:"WSM",num:882},
		"YE":{name:"country.YE",A2:"YE",A3:"YEM",num:887},
		"YT":{name:"country.YT",A2:"YT",A3:"MYT",num:175},
		"ZA":{name:"country.ZA",A2:"ZA",A3:"ZAF",num:710},
		"ZM":{name:"country.ZM",A2:"ZM",A3:"ZMB",num:894},
		"ZW":{name:"country.ZW",A2:"ZW",A3:"ZWE",num:716},
		"RS":{name:"country.RS",A2:"RS",A3:"SRB",num:381}
	};

	/*
	<option id = "2" value ="2"  data-phone ="93" >Afghanistan</option>
	<option id = "3" value ="3"  data-phone ="None" >Aland Islands</option>
	<option id = "4" value ="4"  data-phone ="355" >Albania</option>
	<option id = "5" value ="5"  data-phone ="213" >Algeria</option>
	<option id = "6" value ="6"  data-phone ="1684" >American Samoa</option>
	<option id = "7" value ="7"  data-phone ="376" >Andorra</option>
	<option id = "8" value ="8"  data-phone ="244" >Angola</option>
	<option id = "9" value ="9"  data-phone ="1264" >Anguilla</option>
	<option id = "10" value ="10"  data-phone ="672" >Antarctica</option>
	<option id = "11" value ="11"  data-phone ="1268" >Antigua and Barbuda</option>
	<option id = "12" value ="12"  data-phone ="54" >Argentina</option>
	<option id = "13" value ="13"  data-phone ="374" >Armenia</option>
	<option id = "14" value ="14"  data-phone ="297" >Aruba</option>
	<option id = "15" value ="15"  data-phone ="61" >Australia</option>
	<option id = "16" value ="16"  data-phone ="43" >Austria</option>
	<option id = "17" value ="17"  data-phone ="994" >Azerbaijan</option>
	<option id = "18" value ="18"  data-phone ="1242" >Bahamas</option>
	<option id = "19" value ="19"  data-phone ="973" >Bahrain</option>
	<option id = "20" value ="20"  data-phone ="880" >Bangladesh</option>
	<option id = "21" value ="21"  data-phone ="1246" >Barbados</option>
	<option id = "22" value ="22"  data-phone ="375" >Belarus</option>
	<option id = "23" value ="23"  data-phone ="32" >Belgium</option>
	<option id = "24" value ="24"  data-phone ="501" >Belize</option>
	<option id = "25" value ="25"  data-phone ="229" >Benin</option>
	<option id = "26" value ="26"  data-phone ="1441" >Bermuda</option>
	<option id = "27" value ="27"  data-phone ="975" >Bhutan</option>
	<option id = "28" value ="28"  data-phone ="591" >Bolivia</option>
	<option id = "30" value ="30"  data-phone ="387" >Bosnia</option>
	<option id = "31" value ="31"  data-phone ="267" >Botswana</option>
	<option id = "33" value ="33"  data-phone ="55" >Brazil</option>
	<option id = "34" value ="34"  data-phone ="246" >British Indian Ocean Territory</option>
	<option id = "35" value ="35"  data-phone ="673" >Brunei Darussalam</option>
	<option id = "36" value ="36"  data-phone ="359" >Bulgaria</option>
	<option id = "37" value ="37"  data-phone ="226" >Burkina Faso</option>
	<option id = "38" value ="38"  data-phone ="257" >Burundi</option>
	<option id = "39" value ="39"  data-phone ="855" >Cambodia</option>
	<option id = "40" value ="40"  data-phone ="237" >Cameroon</option>
	<option id = "41" value ="41"  data-phone ="1" >Canada</option>
	<option id = "42" value ="42"  data-phone ="238" >Cape Verde</option>
	<option id = "43" value ="43"  data-phone ="1345" >Cayman Islands</option>
	<option id = "44" value ="44"  data-phone ="236" >Central African Republic</option>
	<option id = "45" value ="45"  data-phone ="235" >Chad</option>
	<option id = "46" value ="46"  data-phone ="56" >Chile</option>
	<option id = "47" value ="47"  data-phone ="86" >China</option>
	<option id = "48" value ="48"  data-phone ="61" >Christmas Island</option>
	<option id = "49" value ="49"  data-phone ="61" >Cocos</option>
	<option id = "50" value ="50"  data-phone ="57" >Colombia</option>
	<option id = "51" value ="51"  data-phone ="269" >Comoros</option>
	<option id = "52" value ="52"  data-phone ="242" >Congo</option>
	<option id = "54" value ="54"  data-phone ="682" >Cook Islands</option>
	<option id = "55" value ="55"  data-phone ="506" >Costa Rica</option>
	<option id = "56" value ="56"  data-phone ="225" >Cote d&#39;Ivoire</option>
	<option id = "57" value ="57"  data-phone ="385" >Croatia</option>
	<option id = "58" value ="58"  data-phone ="53" >Cuba</option>
	<option id = "60" value ="60"  data-phone ="357" >Cyprus</option>
	<option id = "61" value ="61"  data-phone ="420" >Czech</option>
	<option id = "62" value ="62"  data-phone ="45" >Denmark</option>
	<option id = "63" value ="63"  data-phone ="253" >Djibouti</option>
	<option id = "64" value ="64"  data-phone ="1767" >Dominica</option>
	<option id = "65" value ="65"  data-phone ="1809" >Dominican</option>
	<option id = "66" value ="66"  data-phone ="593" >Ecuador</option>
	<option id = "67" value ="67"  data-phone ="20" >Egypt</option>
	<option id = "68" value ="68"  data-phone ="503" >El Salvador</option>
	<option id = "69" value ="69"  data-phone ="240" >Equatorial Guinea</option>
	<option id = "70" value ="70"  data-phone ="291" >Eritrea</option>
	<option id = "71" value ="71"  data-phone ="372" >Estonia</option>
	<option id = "72" value ="72"  data-phone ="251" >Ethiopia</option>
						
							<option id = "74" value ="74"  data-phone ="298" >
								Faroe Islands
							</option>
						
							<option id = "75" value ="75"  data-phone ="679" >
								Fiji
							</option>
						
							<option id = "76" value ="76"  data-phone ="358" >
								Finland
							</option>
						
							<option id = "77" value ="77"  data-phone ="33" >
								France
							</option>
						
							<option id = "78" value ="78"  data-phone ="None" >
								French Guiana
							</option>
						
							<option id = "79" value ="79"  data-phone ="689" >
								French Polynesia
							</option>
						
							<option id = "80" value ="80"  data-phone ="None" >
								French Southern Territories
							</option>
						
							<option id = "81" value ="81"  data-phone ="241" >
								Gabon
							</option>
						
							<option id = "82" value ="82"  data-phone ="220" >
								Gambia
							</option>
						
							<option id = "83" value ="83"  data-phone ="995" >
								Georgia
							</option>
						
							<option id = "84" value ="84"  data-phone ="49" >
								Germany
							</option>
						
							<option id = "85" value ="85"  data-phone ="233" >
								Ghana
							</option>
						
							<option id = "86" value ="86"  data-phone ="350" >
								Gibraltar
							</option>
						
							<option id = "87" value ="87"  data-phone ="30" >
								Greece
							</option>
						
							<option id = "88" value ="88"  data-phone ="299" >
								Greenland
							</option>
						
							<option id = "89" value ="89"  data-phone ="1473" >
								Grenada
							</option>
						
							<option id = "90" value ="90"  data-phone ="None" >
								Guadeloupe
							</option>
						
							<option id = "91" value ="91"  data-phone ="1671" >
								Guam
							</option>
						
							<option id = "92" value ="92"  data-phone ="502" >
								Guatemala
							</option>
						
							<option id = "93" value ="93"  data-phone ="441481" >
								Guernsey
							</option>
						
							<option id = "94" value ="94"  data-phone ="224" >
								Guinea
							</option>
						
							<option id = "95" value ="95"  data-phone ="245" >
								Guinea-Bissau
							</option>
						
							<option id = "96" value ="96"  data-phone ="592" >
								Guyana
							</option>
						
							<option id = "97" value ="97"  data-phone ="509" >
								Haiti
							</option>
						
							<option id = "99" value ="99"  data-phone ="379" >
								Vatican City
							</option>
						
							<option id = "100" value ="100"  data-phone ="504" >
								Honduras
							</option>
						
							<option id = "101" value ="101"  data-phone ="852" >
								Hong Kong
							</option>
						
							<option id = "102" value ="102"  data-phone ="36" >
								Hungary
							</option>
						
							<option id = "103" value ="103"  data-phone ="354" >
								Iceland
							</option>
						
							<option id = "104" value ="104"  data-phone ="91" >
								India
							</option>
						
							<option id = "105" value ="105"  data-phone ="62" >
								Indonesia
							</option>
						
							<option id = "106" value ="106"  data-phone ="98" >
								Iran
							</option>
						
							<option id = "107" value ="107"  data-phone ="964" >
								Iraq
							</option>
						
							<option id = "108" value ="108"  data-phone ="353" >
								Ireland
							</option>
						
							<option id = "109" value ="109"  data-phone ="441624" >
								Isle of Man
							</option>
						
							<option id = "110" value ="110"  data-phone ="972" >
								Israel
							</option>
						
							<option id = "111" value ="111"  data-phone ="39" >
								Italy
							</option>
						
							<option id = "112" value ="112"  data-phone ="1876" >
								Jamaica
							</option>
						
							<option id = "113" value ="113"  data-phone ="81" >
								Japan
							</option>
						
							<option id = "114" value ="114"  data-phone ="441534" >
								Jersey
							</option>
						
							<option id = "115" value ="115"  data-phone ="962" >
								Jordan
							</option>
						
							<option id = "116" value ="116"  data-phone ="7" >
								Kazakhstan
							</option>
						
							<option id = "117" value ="117"  data-phone ="254" >
								Kenya
							</option>
						
							<option id = "118" value ="118"  data-phone ="686" >
								Kiribati
							</option>
						
							<option id = "119" value ="119"  data-phone ="850" >
								North Korea
							</option>
						
							<option id = "120" value ="120"  data-phone ="82" >
								South Korea
							</option>
						
							<option id = "121" value ="121"  data-phone ="965" >
								Kuwait
							</option>
						
							<option id = "122" value ="122"  data-phone ="996" >
								Kyrgyzstan
							</option>
						
							<option id = "123" value ="123"  data-phone ="856" >
								Laos
							</option>
						
							<option id = "124" value ="124"  data-phone ="371" >
								Latvia
							</option>
						
							<option id = "125" value ="125"  data-phone ="961" >
								Lebanon
							</option>
						
							<option id = "126" value ="126"  data-phone ="266" >
								Lesotho
							</option>
						
							<option id = "127" value ="127"  data-phone ="231" >
								Liberia
							</option>
						
							<option id = "128" value ="128"  data-phone ="218" >
								Libya
							</option>
						
							<option id = "129" value ="129"  data-phone ="423" >
								Liechtenstein
							</option>
						
							<option id = "130" value ="130"  data-phone ="370" >
								Lithuania
							</option>
						
							<option id = "131" value ="131"  data-phone ="352" >
								Luxembourg
							</option>
						
							<option id = "132" value ="132"  data-phone ="853" >
								Macao
							</option>
						
							<option id = "133" value ="133"  data-phone ="389" >
								Macedonia
							</option>
						
							<option id = "134" value ="134"  data-phone ="261" >
								Madagascar
							</option>
						
							<option id = "135" value ="135"  data-phone ="265" >
								Malawi
							</option>
						
							<option id = "136" value ="136"  data-phone ="60" >
								Malaysia
							</option>
						
							<option id = "137" value ="137"  data-phone ="960" >
								Maldives
							</option>
						
							<option id = "138" value ="138"  data-phone ="223" >
								Mali
							</option>
						
							<option id = "139" value ="139"  data-phone ="356" >
								Malta
							</option>
						
							<option id = "140" value ="140"  data-phone ="692" >
								Marshall Islands
							</option>
						
							<option id = "141" value ="141"  data-phone ="None" >
								Martinique
							</option>
						
							<option id = "142" value ="142"  data-phone ="222" >
								Mauritania
							</option>
						
							<option id = "143" value ="143"  data-phone ="230" >
								Mauritius
							</option>
						
							<option id = "144" value ="144"  data-phone ="262" >
								Mayotte
							</option>
						
							<option id = "145" value ="145"  data-phone ="52" >
								Mexico
							</option>
						
							<option id = "146" value ="146"  data-phone ="691" >
								Micronesia
							</option>
						
							<option id = "147" value ="147"  data-phone ="373" >
								Moldova
							</option>
						
							<option id = "148" value ="148"  data-phone ="377" >
								Monaco
							</option>
						
							<option id = "149" value ="149"  data-phone ="976" >
								Mongolia
							</option>
						
							<option id = "150" value ="150"  data-phone ="382" >
								Montenegro
							</option>
						
							<option id = "151" value ="151"  data-phone ="1664" >
								Montserrat
							</option>
						
							<option id = "152" value ="152"  data-phone ="212" >
								Morocco
							</option>
						
							<option id = "153" value ="153"  data-phone ="258" >
								Mozambique
							</option>
						
							<option id = "154" value ="154"  data-phone ="95" >
								Myanmar
							</option>
						
							<option id = "155" value ="155"  data-phone ="264" >
								Namibia
							</option>
						
							<option id = "156" value ="156"  data-phone ="674" >
								Nauru
							</option>
						
							<option id = "157" value ="157"  data-phone ="977" >
								Nepal
							</option>
						
							<option id = "158" value ="158"  data-phone ="31" >
								Netherlands
							</option>
						
							<option id = "159" value ="159"  data-phone ="687" >
								New Caledonia
							</option>
						
							<option id = "160" value ="160"  data-phone ="64" >
								New Zealand
							</option>
						
							<option id = "161" value ="161"  data-phone ="505" >
								Nicaragua
							</option>
						
							<option id = "162" value ="162"  data-phone ="227" >
								Niger
							</option>
						
							<option id = "163" value ="163"  data-phone ="234" >
								Nigeria
							</option>
						
							<option id = "164" value ="164"  data-phone ="683" >
								Niue
							</option>
						
							<option id = "165" value ="165"  data-phone ="None" >
								Norfolk Island
							</option>
						
							<option id = "166" value ="166"  data-phone ="1670" >
								Northern Mariana
							</option>
						
							<option id = "167" value ="167"  data-phone ="47" >
								Norway
							</option>
						
							<option id = "168" value ="168"  data-phone ="968" >
								Oman
							</option>
						
							<option id = "169" value ="169"  data-phone ="92" >
								Pakistan
							</option>
						
							<option id = "170" value ="170"  data-phone ="680" >
								Palau
							</option>
						
							<option id = "171" value ="171"  data-phone ="970" >
								Palestine
							</option>
						
							<option id = "172" value ="172"  data-phone ="507" >
								Panama
							</option>
						
							<option id = "173" value ="173"  data-phone ="675" >
								Papua New Guinea
							</option>
						
							<option id = "174" value ="174"  data-phone ="595" >
								Paraguay
							</option>
						
							<option id = "175" value ="175"  data-phone ="51" >
								Peru
							</option>
						
							<option id = "176" value ="176"  data-phone ="63" >
								Philippines
							</option>
						
							<option id = "177" value ="177"  data-phone ="64" >
								Pitcairn
							</option>
						
							<option id = "178" value ="178"  data-phone ="48" >
								Poland
							</option>
						
							<option id = "179" value ="179"  data-phone ="351" >
								Portugal
							</option>
						
							<option id = "180" value ="180"  data-phone ="1787" >
								Puerto Rico
							</option>
						
							<option id = "181" value ="181"  data-phone ="974" >
								Qatar
							</option>
						
							<option id = "182" value ="182"  data-phone ="262" >
								Reunion
							</option>
						
							<option id = "183" value ="183"  data-phone ="40" >
								Romania
							</option>
						
							<option id = "184" value ="184"  data-phone ="7" >
								Russian Federation
							</option>
						
							<option id = "185" value ="185"  data-phone ="250" >
								Rwanda
							</option>
						
							<option id = "189" value ="189"  data-phone ="1758" >
								Saint Lucia
							</option>
						
							<option id = "190" value ="190"  data-phone ="590" >
								Saint Martin
							</option>
						
							<option id = "193" value ="193"  data-phone ="685" >
								Samoa
							</option>
						
							<option id = "194" value ="194"  data-phone ="378" >
								San Marino
							</option>
						
							<option id = "196" value ="196"  data-phone ="966" >
								Saudi Arabia
							</option>
						
							<option id = "197" value ="197"  data-phone ="221" >
								Senegal
							</option>
						
							<option id = "198" value ="198"  data-phone ="381" >
								Serbia
							</option>
						
							<option id = "199" value ="199"  data-phone ="248" >
								Seychelles
							</option>
						
							<option id = "200" value ="200"  data-phone ="232" >
								Sierra Leone
							</option>
						
							<option id = "201" value ="201"  data-phone ="65" >
								Singapore
							</option>
						
							<option id = "202" value ="202"  data-phone ="1721" >
								Sint Maarten
							</option>
						
							<option id = "203" value ="203"  data-phone ="421" >
								Slovakia
							</option>
						
							<option id = "204" value ="204"  data-phone ="386" >
								Slovenia
							</option>
						
							<option id = "205" value ="205"  data-phone ="677" >
								Solomon Islands
							</option>
						
							<option id = "206" value ="206"  data-phone ="252" >
								Somalia
							</option>
						
							<option id = "207" value ="207"  data-phone ="27" >
								South Africa
							</option>
						
							<option id = "208" value ="208"  data-phone ="None" >
								South Georgia
							</option>
						
							<option id = "209" value ="209"  data-phone ="211" >
								South Sudan
							</option>
						
							<option id = "210" value ="210"  data-phone ="34" >
								Spain
							</option>
						
							<option id = "211" value ="211"  data-phone ="94" >
								Sri Lanka
							</option>
						
							<option id = "212" value ="212"  data-phone ="249" >
								Sudan
							</option>
						
							<option id = "213" value ="213"  data-phone ="597" >
								Suriname
							</option>
						
							<option id = "215" value ="215"  data-phone ="268" >
								Swaziland
							</option>
						
							<option id = "216" value ="216"  data-phone ="46" >
								Sweden
							</option>
						
							<option id = "217" value ="217"  data-phone ="41" >
								Switzerland
							</option>
						
							<option id = "218" value ="218"  data-phone ="963" >
								Syria
							</option>
						
							<option id = "219" value ="219"  data-phone ="886" >
								Taiwan
							</option>
						
							<option id = "220" value ="220"  data-phone ="992" >
								Tajikistan
							</option>
						
							<option id = "221" value ="221"  data-phone ="255" >
								Tanzania
							</option>
						
							<option id = "222" value ="222"  data-phone ="66" >
								Thailand
							</option>
						
							<option id = "223" value ="223"  data-phone ="670" >
								Timor-Leste
							</option>
						
							<option id = "224" value ="224"  data-phone ="228" >
								Togo
							</option>
						
							<option id = "225" value ="225"  data-phone ="690" >
								Tokelau
							</option>
						
							<option id = "226" value ="226"  data-phone ="676" >
								Tonga
							</option>
						
							<option id = "227" value ="227"  data-phone ="1868" >
								Trinidad and Tobago
							</option>
						
							<option id = "228" value ="228"  data-phone ="216" >
								Tunisia
							</option>
						
							<option id = "229" value ="229"  data-phone ="90" >
								Turkey
							</option>
						
							<option id = "230" value ="230"  data-phone ="993" >
								Turkmenistan
							</option>
						
							<option id = "231" value ="231"  data-phone ="1649" >
								Turks and Caicos Islands
							</option>
						
							<option id = "232" value ="232"  data-phone ="688" >
								Tuvalu
							</option>
						
							<option id = "233" value ="233"  data-phone ="256" >
								Uganda
							</option>
						
							<option id = "234" value ="234"  data-phone ="380" >
								Ukraine
							</option>
						
							<option id = "235" value ="235"  data-phone ="971" >
								United Arab Emirates
							</option>
						
							<option id = "236" value ="236"  data-phone ="44" >
								United Kingdom
							</option>
						
							<option id = "237" value ="237"  data-phone ="1" >
								United States
							</option>
						
							<option id = "239" value ="239"  data-phone ="598" >
								Uruguay
							</option>
						
							<option id = "240" value ="240"  data-phone ="998" >
								Uzbekistan
							</option>
						
							<option id = "241" value ="241"  data-phone ="678" >
								Vanuatu
							</option>
						
							<option id = "242" value ="242"  data-phone ="58" >
								Venezuela
							</option>
						
							<option id = "243" value ="243"  data-phone ="84" >
								Viet Nam
							</option>
						
							<option id = "244" value ="244"  data-phone ="1284" >
								Virgin Islands, British
							</option>
						
							<option id = "245" value ="245"  data-phone ="1340" >
								Virgin Islands, U.S.
							</option>
						
							<option id = "246" value ="246"  data-phone ="681" >
								Wallis and Futuna
							</option>
						
							<option id = "247" value ="247"  data-phone ="212" >
								Western Sahara
							</option>
						
							<option id = "248" value ="248"  data-phone ="967" >
								Yemen
							</option>
						
							<option id = "249" value ="249"  data-phone ="260" >
								Zambia
							</option>
						
							<option id = "250" value ="250"  data-phone ="263" >
								Zimbabwe
							</option>

							<option id = "59" value ="59"  data-phone ="599" >
								Curacao
							</option>
						
	*/

	this.getCountryByA2 = function(a2)
	{
		if(self.verifyA2(a2))
		{
			return self.list[a2];
		}
		else
		{
			log.warn("CountryCodes Bad Code: "+a2);
			return self.list["US"];
		}
		
	};

	this.getCountryByA3 = function(a3)
	{
		var rtn;
		for(var code in self.list)
		{
			if(a3 === self.list[code].A3)
			{
				rtn = self.list[code];
				break;
			}
		}
		return rtn;
	};

	this.getCountryByNum = function(num)
	{
		var rtn;
		for(var code in self.list)
		{
			if(num === self.list[code].num)
			{
				rtn = self.list[code];
				break;
			}
		}
		return rtn;
	};

	this.verifyA2 = function(code)
	{
		var rtn, country;
		if(code)
		{
			code = code.toUpperCase();
			if(self.list[code])
			{
				rtn = code;
			}
			else if(country = self.getCountryByA3(code))
			{
				rtn = country[A2];
			}
			else if(country = self.getCountryByNum(code))
			{
				rtn = country[A2];
			}
		}
		return rtn;
	};
};

if ( typeof exports !== "undefined" ) {
    module.exports = CountryCodes;
}
else if ( typeof define === "function" ) {
    define("com.component.CountryCodes", CountryCodes);
}
else {
    window.CountryCodes = CountryCodes;
}
//# sourceURL=/modules/com/component/CountryCodes.js
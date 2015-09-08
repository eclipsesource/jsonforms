define(["doh", "dojo/_base/array", "dojo/_base/Color"], function(doh, array, Color){

	var white  = Color.fromString("white").toRgba();
	var maroon = Color.fromString("maroon").toRgba();
	var verifyColor = function(t, source, expected){
		var color = new Color(source);
		t.is(expected, color.toRgba());
		array.forEach(color.toRgba(), function(n){
			doh.is("number", typeof(n));
		});
	};

	doh.register("tests._base.Color",
		[
			function testColor1(t){ verifyColor(t, "maroon", maroon); },
			function testColor2(t){ verifyColor(t, "white", white); },
			function testColor3(t){ verifyColor(t, "#fff", white); },
			function testColor4(t){ verifyColor(t, "#ffffff", white); },
			function testColor5(t){ verifyColor(t, "rgb(255,255,255)", white); },
			function testColor6(t){ verifyColor(t, "#800000", maroon); },
			function testColor7(t){ verifyColor(t, "rgb(128, 0, 0)", maroon); },
			function testColor8(t){ verifyColor(t, "rgba(128, 0, 0, 0.5)", [128, 0, 0, 0.5]); },
			function testColor9(t){ verifyColor(t, maroon, maroon); },
			function testColor10(t){ verifyColor(t, [1, 2, 3], [1, 2, 3, 1]); },
			function testColor11(t){ verifyColor(t, [1, 2, 3, 0.5], [1, 2, 3, 0.5]); },
			function testColor12(t){ verifyColor(t, Color.blendColors(new Color("black"), new Color("white"), 0.5), [128, 128, 128, 1]); }
		]
	);
});

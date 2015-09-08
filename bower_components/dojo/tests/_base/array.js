define(["doh", "dojo/_base/array", "dojo/_base/lang"], function(doh, array, lang){

	doh.register("tests._base.array", [
		function testIndexOf(t){
			var foo = [128, 256, 512];
			var bar = ["aaa", "bbb", "ccc"];

			t.assertEqual(1, array.indexOf([45, 56, 85], 56));
			t.assertEqual(1, array.indexOf([Number, String, Date], String));
			t.assertEqual(1, array.indexOf(foo, foo[1]));
			t.assertEqual(2, array.indexOf(foo, foo[2]));
			t.assertEqual(1, array.indexOf(bar, bar[1]));
			t.assertEqual(2, array.indexOf(bar, bar[2]));
			t.assertEqual(-1, array.indexOf({a:1}, "a"));

			foo.push(bar);
			t.assertEqual(3, array.indexOf(foo, bar));
		},

		function testIndexOfFromIndex(t){
			var foo = [128, 256, 512];
			var bar = ["aaa", "bbb", "ccc"];

			t.assertEqual(-1, array.indexOf([45, 56, 85], 56, 2));
			t.assertEqual(1, array.indexOf([45, 56, 85], 56, 1));
			t.assertEqual(1, array.indexOf([45, 56, 85], 56, -3));
			// Make sure going out of bounds doesn't throw us in an infinite loop
			t.assertEqual(-1, array.indexOf([45, 56, 85], 56, 3));
		},

		function testLastIndexOf(t){
			var foo = [128, 256, 512];
			var bar = ["aaa", "bbb", "aaa", "ccc"];

			t.assertEqual(1, array.indexOf([45, 56, 85], 56));
			t.assertEqual(1, array.indexOf([Number, String, Date], String));
			t.assertEqual(1, array.lastIndexOf(foo, foo[1]));
			t.assertEqual(2, array.lastIndexOf(foo, foo[2]));
			t.assertEqual(1, array.lastIndexOf(bar, bar[1]));
			t.assertEqual(2, array.lastIndexOf(bar, bar[2]));
			t.assertEqual(2, array.lastIndexOf(bar, bar[0]));
		},

		function testLastIndexOfFromIndex(t){
			t.assertEqual(1, array.lastIndexOf([45, 56, 85], 56, 1));
			t.assertEqual(-1, array.lastIndexOf([45, 56, 85], 85, 1));
			t.assertEqual(-1, array.lastIndexOf([45, 56, 85], 85, -2));
			t.assertEqual(0, array.lastIndexOf([45, 56, 45], 45, 0));
		},

		function testForEach(t){
			var foo = [128, "bbb", 512];
			array.forEach(foo, function(elt, idx, array){
				switch(idx){
					case 0: t.assertEqual(128, elt); break;
					case 1: t.assertEqual("bbb", elt); break;
					case 2: t.assertEqual(512, elt); break;
					default: t.assertTrue(false);
				}
			});

			var noException = true;
			try{
				array.forEach(undefined, function(){});
			}catch(e){
				noException = false;
			}
			t.assertTrue(noException);
		},

		function testForEach_str(t){
			var bar = 'abc';
			array.forEach(bar, function(elt, idx, array){
				switch(idx){
					case 0: t.assertEqual("a", elt); break;
					case 1: t.assertEqual("b", elt); break;
					case 2: t.assertEqual("c", elt); break;
					default: t.assertTrue(false);
				}
			});
		},
		// FIXME: test forEach w/ a NodeList()?

		function testForEach_string_callback(t){
			// Test using strings as callback", which accept the parameters with
			// the names "item", "index" and "array"!
			var foo = [128, "bbb", 512];
			// Test that the variable "item" contains the value of each item.
			var obj = {
				_res: ""
			};
			array.forEach(foo, "this._res += item", obj);
			t.assertEqual(obj._res, "128bbb512");
			// Test that the variable "index" contains each index.
			obj._res = [];
			array.forEach(foo, "this._res.push(index)", obj);
			t.assertEqual(obj._res, [0,1,2]);
			// Test that the variable "array" always contains the entire array.
			obj._res = [];
			array.forEach(foo, "this._res.push(array)", obj);
			t.assertEqual(obj._res, [
				[128, "bbb", 512],
				[128, "bbb", 512],
				[128, "bbb", 512]
			]);
			// Catch undefined variable usage (I used to use "i" :-)).
			var caughtException = false;
			try{
				array.forEach(foo, "this._res += arr[i];", obj);
			}catch(e){
				caughtException = true;
			}
			t.assertTrue(caughtException);
		},

		// FIXME: test forEach w/ a NodeList()?
		function testEvery(t){
			var foo = [128, "bbb", 512];

			t.assertTrue(
				array.every(foo, function(elt, idx, array){
					t.assertEqual(Array, array.constructor);
					t.assertTrue(lang.isArray(array));
					t.assertTrue(typeof idx == "number");
					if(idx == 1){ t.assertEqual("bbb" , elt); }
					return true;
				})
			);

			t.assertTrue(
				array.every(foo, function(elt, idx, array){
					switch(idx){
						case 0: t.assertEqual(128, elt); return true;
						case 1: t.assertEqual("bbb", elt); return true;
						case 2: t.assertEqual(512, elt); return true;
						default: return false;
					}
				})
			);

			t.assertFalse(
				array.every(foo, function(elt, idx, array){
					switch(idx){
						case 0: t.assertEqual(128, elt); return true;
						case 1: t.assertEqual("bbb", elt); return true;
						case 2: t.assertEqual(512, elt); return false;
						default: return true;
					}
				})
			);

		},

		function testEvery_str(t){
			var bar = 'abc';
			t.assertTrue(
				array.every(bar, function(elt, idx, array){
					switch(idx){
						case 0: t.assertEqual("a", elt); return true;
						case 1: t.assertEqual("b", elt); return true;
						case 2: t.assertEqual("c", elt); return true;
						default: return false;
					}
				})
			);

			t.assertFalse(
				array.every(bar, function(elt, idx, array){
					switch(idx){
						case 0: t.assertEqual("a", elt); return true;
						case 1: t.assertEqual("b", elt); return true;
						case 2: t.assertEqual("c", elt); return false;
						default: return true;
					}
				})
			);
		},
		// FIXME: test NodeList for every()?

		function testSome(t){
			var foo = [128, "bbb", 512];
			t.assertTrue(
				array.some(foo, function(elt, idx, array){
					t.assertEqual(3, array.length);
					return true;
				})
			);

			t.assertTrue(
				array.some(foo, function(elt, idx, array){
					return idx < 1;

				})
			);

			t.assertFalse(
				array.some(foo, function(elt, idx, array){
					return false;
				})
			);

			t.assertTrue(
				array.some(foo, function(elt, idx, array){
					t.assertEqual(Array, array.constructor);
					t.assertTrue(lang.isArray(array));
					t.assertTrue(typeof idx == "number");
					if(idx == 1){ t.assertEqual("bbb" , elt); }
					return true;
				})
			);
		},

		function testSome_str(t){
			var bar = 'abc';
			t.assertTrue(
				array.some(bar, function(elt, idx, array){
					t.assertEqual(3, array.length);
					switch(idx){
						case 0: t.assertEqual("a", elt); return true;
						case 1: t.assertEqual("b", elt); return true;
						case 2: t.assertEqual("c", elt); return true;
						default: return false;
					}
				})
			);

			t.assertTrue(
				array.some(bar, function(elt, idx, array){
					switch(idx){
						case 0: t.assertEqual("a", elt); return true;
						case 1: t.assertEqual("b", elt); return true;
						case 2: t.assertEqual("c", elt); return false;
						default: return true;
					}
				})
			);

			t.assertFalse(
				array.some(bar, function(elt, idx, array){
					return false;
				})
			);
		},
		// FIXME: need to add scoping tests for all of these!!!

		function testFilter(t){
			var foo = ["foo", "bar", 10];

			t.assertEqual(["foo"],
				array.filter(foo, function(elt, idx, array){
					return idx < 1;
				})
			);

			t.assertEqual(["foo"],
				array.filter(foo, function(elt, idx, array){
					return elt == "foo";
				})
			);

			t.assertEqual([],
				array.filter(foo, function(elt, idx, array){
					return false;
				})
			);

			t.assertEqual([10],
				array.filter(foo, function(elt, idx, array){
					return typeof elt == "number";
				})
			);
		},

		function testFilter_str(t){
			var foo = "thinger blah blah blah";
			t.assertEqual(["t", "h", "i"],
				array.filter(foo, function(elt, idx, array){
					return idx < 3;
				})
			);

			t.assertEqual([],
				array.filter(foo, function(elt, idx, array){
					return false;
				})
			);
		},

		function testMap(t){
			t.assertEqual([],
				array.map([], function(){ return true; })
			);

			t.assertEqual([1, 2, 3],
				array.map(["cat", "dog", "mouse"], function(elt, idx, array){
					return idx+1;
				})
			);
		}
	]);
});


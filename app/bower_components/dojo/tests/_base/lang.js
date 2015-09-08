define(["doh/main", "dojo/_base/array", "dojo/_base/lang", "dojo/_base/kernel"
], function(doh, array, lang, kernel){

  doh.register("tests._base.lang", [
		function exists(t){
			var test = {
				foo : 0
			};
			t.assertTrue(lang.exists("foo", test), 'lang.exists("foo", test)');
			t.assertFalse(lang.exists("foo.bar", test), 'lang.exists("foo.bar", test)');

			// global tests
			t.assertFalse(lang.exists("_existsTest"), 'lang.exists("_existsTest") #1');
			kernel.global._existsTest = false;
			t.assertTrue(lang.exists("_existsTest"), 'lang.exists("_existsTest") #2');
			t.assertFalse(lang.exists("_existsTest.bar"), 'lang.exists("_existsTest.bar")');

			// scopeMap tests
			t.assertTrue(lang.exists("dojo.dijit"), 'lang.exists("dojo.dijit")');
			t.assertFalse(lang.exists("dojo.foo"), 'lang.exists("dojo.foo")');
		},

		function getObject(t){
			var test = {
				foo : {}
			};
			t.assertEqual(test.foo, lang.getObject("foo", false, test), 'lang.getObject("foo", false, test)');
			t.assertEqual("undefined", typeof lang.getObject("foo.bar", false, test), // don't create
				'typeof lang.getObject("foo.bar", false, test)');
			t.assertEqual({}, lang.getObject("foo.bar", true, test),  // do create
				'lang.getObject("foo.bar", true, test)');
			test.foo.bar.baz = "test";
			t.assertEqual(test.foo.bar, lang.getObject("foo.bar", false, test),
				'lang.getObject("foo.bar", false, test)');

			// global tests
			t.assertEqual("undefined", typeof lang.getObject("_getObjectTest.bar", false),	// don't create
				'typeof lang.getObject("_getObjectTest.bar", false)');
			kernel.global._getObjectTest = {};
			t.assertEqual(kernel.global._getObjectTest, lang.getObject("_getObjectTest", false), // don't create
				'lang.getObject("_getObjectTest", false)');
			t.assertEqual({}, lang.getObject("_getObjectTest.bar", true), 'lang.getObject("_getObjectTest.bar", true)'); // do create

			// strangely, parser does this
			t.assertEqual("undefined", typeof lang.getObject("./TestWidget"), 'typeof lang.getObject("./TestWidget")');

			// empty path should return the same object
			t.assertEqual(test, lang.getObject("", false, test));
			t.assertEqual(kernel.global, lang.getObject(""));
		},

		function setObject(t){
			var test = {
				foo : 0
			};
			t.assertTrue(lang.setObject("foo", {bar : "test"}, test));
			t.assertEqual({bar : "test"}, lang.getObject("foo", false, test));
		},

		function mixin(t){
			t.assertEqual("object", typeof lang.mixin());
			t.assertEqual("object", typeof lang.mixin(undefined));
			t.assertEqual("object", typeof lang.mixin(null));
			var src = {
				foo: function(){
					t.debug("foo");
				},
				bar: "bar"
			};
			var dest = {};
			lang.mixin(dest, src);
			t.assertEqual("function", typeof dest["foo"]);
			t.assertEqual("string", typeof dest["bar"]);
		},

		function extend(t){
			var src = {
				foo: function(){
					t.debug("foo");
				},
				bar: "bar"
			};
			function dest(){}
			lang.extend(dest, src);
			var test = new dest();
			t.assertEqual("function", typeof test["foo"]);
			t.assertEqual("string", typeof test["bar"]);
		},

		function isFunction(t){
			t.assertTrue(lang.isFunction(new Function()));
			t.assertTrue(lang.isFunction(isFunction));
			if(lang.isBrowser){ // test the Safari workaround for NodeList
				t.assertFalse(lang.isFunction(lang.doc.getElementsByName("html")));
				t.assertFalse(lang.isFunction(lang.doc.createElement("object")));
			}
		},

		function isObject(t){
			t.assertFalse(lang.isObject(true));
			t.assertFalse(lang.isObject(false));
			t.assertFalse(lang.isObject("foo"));
			t.assertTrue(lang.isObject(new String("foo")));
			t.assertTrue(lang.isObject(null));
			t.assertTrue(lang.isObject({}));
			t.assertTrue(lang.isObject([]));
			t.assertTrue(lang.isObject(new Array()));
		},

		function isArray(t){
			t.assertTrue(lang.isArray([]));
			t.assertTrue(lang.isArray(new Array()));
			t.assertFalse(lang.isArray({}));
		},

		function isArrayLike(t){
			t.assertFalse(lang.isArrayLike("thinger"));
			t.assertTrue(lang.isArrayLike(new Array()));
			t.assertFalse(lang.isArrayLike({}));
			t.assertTrue(lang.isArrayLike(arguments));
		},

		function isString(t){
			t.assertFalse(lang.isString(true));
			t.assertFalse(lang.isString(false));
			t.assertTrue(lang.isString("foo"));
			t.assertTrue(lang.isString(new String("foo")));
			t.assertFalse(lang.isString(null));
			t.assertFalse(lang.isString({}));
			t.assertFalse(lang.isString([]));
		},

		function partial(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(arg1, arg2){
				return [this.foo, arg1, arg2];
			}
			
			var st1 = lang.partial(thinger);
			t.assertEqual("bar", st1.call(scope)[0]);
			t.assertEqual(undefined, st1()[0]);
			var st2 = lang.partial(thinger, "foo", "bar");
			t.assertEqual("bar", st2()[2]);
			var st3 = lang.partial(thinger, "foo", "bar");
		},

		function nestedPartial(t){
			function thinger(arg1, arg2){
				return [arg1, arg2];
			}
			
			var st1 = lang.partial(thinger, "foo");
			t.assertEqual(undefined, st1()[1]);
			t.assertEqual("bar", st1("bar")[1]);

			// partials can accumulate
			var st2 = lang.partial(st1, "thud");
			t.assertEqual("foo", st2()[0]);
			t.assertEqual("thud", st2()[1]);
		},

		function hitch(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(){
				return [this.foo, arguments.length];
			}
			
			var st1 = lang.hitch(scope, thinger);
			t.assertEqual("bar", st1()[0]);
			t.assertEqual(0, st1()[1]);

			var st2 = lang.hitch(scope2, thinger);
			t.assertEqual("baz", st2()[0]);
			t.assertEqual(0, st1()[1]);
			t.assertEqual(1, st1("blah")[1]);

			// st2 should be "scope proof"
			t.assertEqual("baz", st2.call(scope)[0]);
		},

		function hitchWithArgs(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(){
				return [this.foo, arguments.length];
			}
			
			var st1 = lang.hitch(scope, thinger, "foo", "bar");
			t.assertEqual("bar", st1()[0]);
			t.assertEqual(2, st1()[1]);
			var st2 = lang.hitch(scope2, thinger, "foo", "bar");
			t.assertEqual("baz", st2()[0]);
			t.assertEqual(2, st2()[1]);
		},

		function hitchAsPartial(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(arg1, arg2){
				return [this.foo, arg1, arg2];
			}
			
			var st1 = lang.hitch(null, thinger);
			t.assertEqual("bar", st1.call(scope)[0]);
			t.assertEqual(undefined, st1()[0]);
			var st2 = lang.hitch(null, thinger, "foo", "bar");
			t.assertEqual("bar", st2()[2]);
			var st3 = lang.hitch(null, thinger, "foo", "bar");
		},

		function _toArray(t){
			var obj1 = [ 'foo', 'bar', 'spam', 'ham' ];

			function thinger(){
				return lang._toArray(arguments);
			}
			var obj2 = thinger.apply(this, obj1);
			t.assertEqual(obj1[0], obj2[0]);

			if(lang.isBrowser){
				//test DomCollection
				var div = document.createElement('div');
				div.innerHTML="<a href='#'>link</a>text";
				var r=lang._toArray(div.childNodes);
				t.is(2,r.length);
			}
		},
		
		function clone(t){
			var obj1 = {
				foo: 'bar',
				answer: 42,
				jan102007: new Date(2007, 0, 10),
				baz: {
					a: null,
					b: [1, "b", 2.3, true, false],
					c: {
						d: undefined,
						e: 99,
						f: function(){ console.log(42); return 42; },
						g: /\d+/gm
					}
				},
				toString: function(){ return "meow"; }
			};
			var obj2 = lang.clone(obj1);
			t.assertEqual(obj1.foo, obj2.foo);
			t.assertEqual(obj1.answer, obj2.answer);
			t.assertEqual(obj1.jan102007, obj2.jan102007);
			t.assertEqual(obj1.baz.a, obj2.baz.a);
			for(var i = 0; i < obj1.baz.b.length; ++i){
				t.assertEqual(obj1.baz.b[i], obj2.baz.b[i]);
			}
			t.assertEqual(obj1.baz.c.d, obj2.baz.c.d);
			t.assertEqual(obj1.baz.c.e, obj2.baz.c.e);
			t.assertEqual(obj1.baz.c.f, obj2.baz.c.f);
			t.assertEqual(obj1.baz.c.f(), obj2.baz.c.f());
			t.assertEqual(obj1.baz.c.g, obj2.baz.c.g);
			t.assertEqual(obj1.toString, obj2.toString);
			t.assertEqual(obj1.toString(), obj2.toString());
		},
		
		function delegate(t){
			var a = {
				x: 1,
				y: function(){ return 2; },
				z1: 99
			};
			var b = {
				x: 11,
				y: function(){ return 12; },
				z2: 33,
				toString: function(){ return "bark!"; },
				toLocaleString: function(){ return "le bark-s!"; }
			};
			t.is(1, a.x);
			t.is(2, a.y());
			t.is(99, a.z1);
			var c = lang.delegate(a, b);
			t.is(1, a.x);
			t.is(2, a.y());
			t.is(99, a.z1);
			t.is(11, c.x);
			t.is(12, c.y());
			t.is("bark!", c.toString());
			t.is("le bark-s!", c.toLocaleString());
			t.is(99, c.z1);
			t.is(33, c.z2);
		},

		function replace(t){
			var s1 = lang.replace("Hello, {name.first} {name.last} AKA {nick}!",
				{
					nick: "Bob",
					name: {
						first:  "Robert",
						middle: "X",
						last:   "Cringely"
					}
				});
			t.is("Hello, Robert Cringely AKA Bob!", s1);

			var s2 = lang.replace("Hello, {0} {2}!", ["Robert", "X", "Cringely"]);
			t.is("Hello, Robert Cringely!", s2);

			function sum(a){
				var t = 0;
				array.forEach(a, function(x){ t += x; });
				return t;
			}
			var s3 = lang.replace(
				"{count} payments averaging {avg} USD per payment.",
				lang.hitch(
					{ payments: [11, 16, 12] },
					function(_, key){
						switch(key){
							case "count": return this.payments.length;
							case "min":   return Math.min.apply(Math, this.payments);
							case "max":   return Math.max.apply(Math, this.payments);
							case "sum":   return sum(this.payments);
							case "avg":   return sum(this.payments) / this.payments.length;
						}
						return "";
					}
				));
			t.is("3 payments averaging 13 USD per payment.", s3);

			var s4 = lang.replace("Hello, ${0} ${2}!", ["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
			t.is("Hello, Robert Cringely!", s4);
		}
	]
  );
});
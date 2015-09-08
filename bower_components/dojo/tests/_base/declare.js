// FIXME: this test assumes the existence of the global object "tests"
tests= typeof tests=="undefined" ? {} : tests;

define([
	"doh/main", "dojo/aspect", "dojo/_base/declare", "dojo/_base/kernel", "dojo/_base/lang"
], function(doh, aspect, declare, kernel, lang){
	doh.register("tests._base.declare", [
		function smokeTest(t){
			declare("tests._base.declare.tmp", null);
			var tmp = new tests._base.declare.tmp();
			declare("testsFoo", null);
			tmp = new testsFoo();
		},
		function smokeTest2(t){
			declare("tests._base.declare.foo", null, {
				foo: "thonk"
			});
			var tmp = new tests._base.declare.foo();
			t.is("thonk", tmp.foo);

			declare("testsFoo2", null, {
				foo: "thonk"
			});
			var tmp2 = new testsFoo2();
			t.is("thonk", tmp2.foo);
		},
		function smokeTestWithCtor(t){
			declare("tests._base.declare.fooBar", null, {
				constructor: function(){
					this.foo = "blah";
				},
				foo: "thonk"
			});
			var tmp = new tests._base.declare.fooBar();
			t.is("blah", tmp.foo);
		},
		function smokeTestCompactArgs(t){
			declare("tests._base.declare.fooBar2", null, {
				foo: "thonk"
			});
			var tmp = new tests._base.declare.fooBar2();
			t.is("thonk", tmp.foo);
		},
		function subclass(t){
			declare("tests._base.declare.tmp3", null, {
				foo: "thonk"
			});
			declare("tests._base.declare.tmp4", tests._base.declare.tmp3);
			var tmp = new tests._base.declare.tmp4();
			t.is("thonk", tmp.foo);
		},
		function subclassWithCtor(t){
			declare("tests._base.declare.tmp5", null, {
				constructor: function(){
					this.foo = "blah";
				},
				foo: "thonk"
			});
			declare("tests._base.declare.tmp6", tests._base.declare.tmp5);
			var tmp = new tests._base.declare.tmp6();
			t.is("blah", tmp.foo);
		},
		function mixinSubclass(t){
			declare("tests._base.declare.tmp7", null, {
				foo: "thonk"
			});
			declare("tests._base.declare.tmp8", null, {
				constructor: function(){
					this.foo = "blah";
				}
			});
			var tmp = new tests._base.declare.tmp8();
			t.is("blah", tmp.foo);
			declare("tests._base.declare.tmp9",
				[
					tests._base.declare.tmp7, // prototypal
					tests._base.declare.tmp8  // mixin
				]);
			var tmp2 = new tests._base.declare.tmp9();
			t.is("blah", tmp2.foo);
		},
		function superclassRef(t){
			declare("tests._base.declare.tmp10", null, {
				foo: "thonk"
			});
			declare("tests._base.declare.tmp11", tests._base.declare.tmp10, {
				constructor: function(){
					this.foo = "blah";
				}
			});
			var tmp = new tests._base.declare.tmp11();
			t.is("blah", tmp.foo);
			t.is("thonk", tests._base.declare.tmp11.superclass.foo);
		},
		function inheritedCall(t){
			var foo = "xyzzy";
			declare("tests._base.declare.tmp12", null, {
				foo: "thonk",
				bar: function(arg1, arg2){
					if(arg1){
						this.foo = arg1;
					}
					if(arg2){
						foo = arg2;
					}
				}
			});
			declare("tests._base.declare.tmp13", tests._base.declare.tmp12, {
				constructor: function(){
					this.foo = "blah";
				}
			});
			var tmp = new tests._base.declare.tmp13();
			t.is("blah", tmp.foo);
			t.is("xyzzy", foo);
			tmp.bar("zot");
			t.is("zot", tmp.foo);
			t.is("xyzzy", foo);
			tmp.bar("trousers", "squiggle");
			t.is("trousers", tmp.foo);
			t.is("squiggle", foo);
		},
		function inheritedExplicitCall(t){
			var foo = "xyzzy";
			declare("tests._base.declare.tmp14", null, {
				foo: "thonk",
				bar: function(arg1, arg2){
					if(arg1){
						this.foo = arg1;
					}
					if(arg2){
						foo = arg2;
					}
				}
			});
			declare("tests._base.declare.tmp15", tests._base.declare.tmp14, {
				constructor: function(){
					this.foo = "blah";
				},
				bar: function(arg1, arg2){
					this.inherited("bar", arguments, [arg2, arg1]);
				},
				baz: function(arg1, arg2){
					tests._base.declare.tmp15.superclass.bar.apply(this, arguments);
				}
			});
			var tmp = new tests._base.declare.tmp15();
			t.is("blah", tmp.foo);
			t.is("xyzzy", foo);
			tmp.baz("zot");
			t.is("zot", tmp.foo);
			t.is("xyzzy", foo);
			tmp.bar("trousers", "squiggle");
			t.is("squiggle", tmp.foo);
			t.is("trousers", foo);
		},
		function inheritedMixinCalls(t){
			declare("tests._base.declare.tmp16", null, {
				foo: "",
				bar: function(){
					this.foo += "tmp16";
				}
			});
			declare("tests._base.declare.mixin16", null, {
				bar: function(){
					this.inherited(arguments);
					this.foo += ".mixin16";
				}
			});
			declare("tests._base.declare.mixin17", tests._base.declare.mixin16, {
				bar: function(){
					this.inherited(arguments);
					this.foo += ".mixin17";
				}
			});
			declare("tests._base.declare.tmp17", [tests._base.declare.tmp16, tests._base.declare.mixin17], {
				bar: function(){
					this.inherited(arguments);
					this.foo += ".tmp17";
				}
			});
			var tmp = new tests._base.declare.tmp17();
			tmp.bar();
			t.is("tmp16.mixin16.mixin17.tmp17", tmp.foo);
		},
		function mixinPreamble(t){
			var passed = false;
			declare("tests._base.declare.tmp16", null);
			new tests._base.declare.tmp16({ preamble: function(){ passed = true; } });
			t.t(passed);
		},

		function basicMixin(t){
			// testing if a plain Class-like object can be inherited
			// by declare
			var d = new doh.Deferred;

			var Thing = function(args){
				lang.mixin(this, args);
			};
			Thing.prototype.method = function(){
				t.t(true);
				d.callback(true);
			};

			declare("Thinger", Thing, {
				method: function(){
					this.inherited(arguments);
				}
			});

			var it = new Thinger();
			it.method();

			return d;
		},

		function mutatedMethods(t){
			// testing if methods can be mutated (within a reason)
			declare("tests._base.declare.tmp18", null, {
				constructor: function(){ this.clear(); },
				clear: function(){ this.flag = 0; },
				foo: function(){ ++this.flag; },
				bar: function(){ ++this.flag; },
				baz: function(){ ++this.flag; }
			});
			declare("tests._base.declare.tmp19", tests._base.declare.tmp18, {
				foo: function(){ ++this.flag; this.inherited(arguments); },
				bar: function(){ ++this.flag; this.inherited(arguments); },
				baz: function(){ ++this.flag; this.inherited(arguments); }
			});
			var x = new tests._base.declare.tmp19();
			// smoke tests
			t.is(0, x.flag);
			x.foo();
			t.is(2, x.flag);
			x.clear();
			t.is(0, x.flag);
			var a = 0;
			// aspect.after() on a prototype method
			aspect.after(tests._base.declare.tmp19.prototype, "foo", function(){ a = 1; });
			x.foo();
			t.is(2, x.flag);
			t.is(1, a);
			x.clear();
			a = 0;
			// extra chaining
			var old = tests._base.declare.tmp19.prototype.bar;
			tests._base.declare.tmp19.prototype.bar = function(){
				a = 1;
				++this.flag;
				old.call(this);
			};
			x.bar();
			t.is(3, x.flag);
			t.is(1, a);
			x.clear();
			a = 0;
			// replacement
			tests._base.declare.tmp19.prototype.baz = function(){
				a = 1;
				++this.flag;
				this.inherited("baz", arguments);
			};
			x.baz();
			t.is(2, x.flag);
			t.is(1, a);
		},

		function modifiedInstance(t){
			var stack;
			declare("tests._base.declare.tmp20", null, {
				foo: function(){ stack.push(20); }
			});
			declare("tests._base.declare.tmp21", null, {
				foo: function(){
					this.inherited(arguments);
					stack.push(21);
				}
			});
			declare("tests._base.declare.tmp22", tests._base.declare.tmp20, {
				foo: function(){
					this.inherited(arguments);
					stack.push(22);
				}
			});
			declare("tests._base.declare.tmp23",
						[tests._base.declare.tmp20, tests._base.declare.tmp21], {
				foo: function(){
					this.inherited(arguments);
					stack.push(22);
				}
			});
			var a = new tests._base.declare.tmp22();
			var b = new tests._base.declare.tmp23();
			var c = {
				foo: function(){
					this.inherited("foo", arguments);
					stack.push("INSIDE C");
				}
			};
			stack = [];
			a.foo();
			t.is([20, 22], stack);

			stack = [];
			b.foo();
			t.is([20, 21, 22], stack);

			lang.mixin(a, c);
			lang.mixin(b, c);

			stack = [];
			a.foo();
			t.is([20, 22, "INSIDE C"], stack);

			stack = [];
			b.foo();
			t.is([20, 21, 22, "INSIDE C"], stack);
		},

		function duplicatedBase(t){
			var stack;
			var A = declare(null, {
				constructor: function(){
					stack.push(1);
				}
			});
			var B = declare([A, A, A], {
				constructor: function(){
					stack.push(2);
				}
			});
			stack = [];
			new A;
			t.is([1], stack);
			stack = [];
			new B;
			t.is([1, 2], stack);
		},

		function indirectlyDuplicatedBase(t){
			var stack;
			var A = declare(null, {
				constructor: function(){
					stack.push(1);
				}
			});
			var B = declare(A, {
				constructor: function(){
					stack.push(2);
				}
			});
			var C = declare([A, B], {
				constructor: function(){
					stack.push(3);
				}
			});
			var D = declare([B, A], {
				constructor: function(){
					stack.push(4);
				}
			});
			stack = [];
			new C;
			t.is([1, 2, 3], stack);
			stack = [];
			new D;
			t.is([1, 2, 4], stack);
		},

		function wrongMultipleInheritance(t){
			var stack;
			var A = declare([], {
				constructor: function(){
					stack.push(1);
				}
			});
			var B = declare([A], {
				constructor: function(){
					stack.push(2);
				}
			});
			stack = [];
			new A;
			t.is([1], stack);
			stack = [];
			new B;
			t.is([1, 2], stack);
		},

		function impossibleBases(t){
			var A = declare(null);
			var B = declare(null);
			var C = declare([A, B]);
			var D = declare([B, A]);

			var flag = false;
			try{
				var E = declare([C, D]);
			}catch(e){
				flag = true;
			}
			t.t(flag);
		},

		function noNew(t){
			// all of the classes I create will use this as their
			// pseudo-constructor function
			function noNewConstructor(){
				this.noNew_Value = 'instance value';
			}

			var g = kernel.global;
			// this value will remain unchanged if the code for
			// calling a constructor without 'new' works correctly.
			g.noNew_Value = 'global value';

			// perform the actual test
			function noNewTest(cls){
				// call class function without new
				var obj = cls('instance value');
				t.is(obj.noNew_Value, 'instance value');
				t.is(g.noNew_Value, 'global value');
			}

			// There are three different functions that might be
			// created by declare(), so I need to test all
			// three.

			// 1. Class with manual-chained constructor
			noNewTest(
				declare(null, {
					constructor: noNewConstructor,
					'-chains-': {constructor: 'manual'}
				})
			);

			// 2. Class with no superclasses
			var A = declare(null, {
				constructor: noNewConstructor
			});
			noNewTest(A);

			// 3. Class with at least one superclass
			noNewTest(declare(A));

			// Make sure multiple inheritance call works
			var B = declare(A);
			var C = declare(null, { ctest: function(){return true;} });
			var D = declare([A, B, C], { dtest: function(){return true;} });
			noNewTest(D);
			// make sure I get the test functions from
			// all superclasses
			var d = D();
			t.t(d.ctest());
			t.t(d.dtest());

			// Make sure call through an object works
			var noNewClasses = {
				D: D,
				noNew_Value: 'unchanged'
			};
			var obj = noNewClasses.D();
			t.is(obj.noNew_Value, 'instance value');
			t.is(noNewClasses.noNew_Value, 'unchanged');
		},

		function createSubclass(t){
			var A = dojo.declare(null, {
				foo: "thonk"
			});
			var B = dojo.declare(null, {
			});
			var C = dojo.declare(null, {
				bar: "thonk"
			});

			// Both 'mixins' and 'props' parameters are provided
			var D1 = A.createSubclass([B, C], {
				constructor: function(){
					this.foo = "blah";
				}
			});

			// Only 'mixins' parameters is provided
			var D2 = A.createSubclass([B, C]);

			// The 'props' parameter is provided as first instead of second parameter
			var D3 = A.createSubclass({
			   constructor: function(){
				this.foo = "blah";
				}
			});

			// No arguments at all provided
			var D4 = A.createSubclass();

			// Single Mixin
			var D5 = A.createSubclass(C);

			var d1 = new D1();
			var d2 = new D2();
			var d3 = new D3();
			var d4 = new D4();
			var d5 = new D5();
			t.is("blah", d1.foo);
			t.is("thonk", d2.foo);
			t.is("thonk", d1.bar);
			t.is("thonk", d2.bar);
			t.is("blah", d3.foo);
			t.is("thonk", d4.foo);
			t.is("thonk", d5.bar);
		}

		// FIXME: there are still some permutations to test like:
		//	- ctor arguments
		//	- multi-level inheritance + L/R conflict checks
	]);
});

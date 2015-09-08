define(["doh", "dojo/store/DataStore", "dojo/data/ItemFileReadStore", "dojo/data/ItemFileWriteStore"],
	function(doh, DataStore, ItemFileReadStore, ItemFileWriteStore){

	var two = {id: 2, name: "two", even: true, prime: true},
			four = {id: 4, name: "four", even: true, prime: false};
	
	var dataStore = new ItemFileWriteStore({data:{
		items: [
			{id: 1, name: "one", prime: false},
			{id: 2, name: "two", even: true, prime: true},
			{id: 3, name: "three", prime: true},
			{id: 4, name: "four", even: true, prime: false},
			{id: 5, name: "five", prime: true,
				children:[{_reference:1}, {_reference:2}, {_reference:3}]}
		],
		identifier:"id"
	}});
	dataStore.fetchItemByIdentity({identity:null});
	var store = new DataStore({store:dataStore});
	doh.register("dojo.tests.store.DataStore",
		[
			function testGet(t){
				t.is(store.get(1).name, "one");
				t.is(store.get(4).name, "four");
				t.t(store.get(5).prime);
				t.is(store.get(5).children[1].name, "two");
			},
			function testGetNonExistent(t){
				t.is(store.get(10), undefined);
			},
			function testQuery1(t){
				var d = new doh.Deferred();
				store.query({prime: true}).then(d.getTestCallback(function(results){
					t.is(results.length, 3);
					t.is(results[2].children[2].name, "three");
				}));
				return d;
			},
			function testQuery2(t){
				var d = new doh.Deferred();
				var result = store.query({even: true});
				result.map(d.getTestErrback(function(object){
					for(var i in object){
						t.is(object[i], (object.id == 2 ? two : four)[i], "map of " + i);
					}
				}));
				result.then(d.getTestCallback(function(results){
					t.is("four", results[1].name, "then");
				}));
				return d;
			},
			function testPutUpdate(t){
				var four = store.get(4);
				four.square = true;
				store.put(four);
				four = store.get(4);
				t.t(four.square);
			},
			function testPutNew(t){
				store.put({
					id: 6,
					perfect: true
				});
				t.t(store.get(6).perfect);
			},
			function testAdd(t){
				store.add({
					id: 7,
					name: "seven"
				});
				t.is(store.get(7).name, "seven");
			},
			function testAddExisting(t){
				return store.add({
					id: 7,
					name: "seven"
				}).then(function(){
					t.error("Add existing did not fail");
				}, function(){
					console.log("Add existing failed, as expected");
				});
			},
			function testOverwriteNew(t){
				return store.put({
					id: 8,
					name: "eight"
				}, {
					overwrite: true
				}).then(function(){
					t.error("Updating new did not fail");
				}, function(){
					console.log("Updating new failed, as expected");
				});
			},
			function testRemove(t){
				return store.remove(7).then(function(result){
					t.t(result);
				}).then(function(result){
					// second time should return false
					return store.remove(7);
				}).then(function(result){
					t.f(result);
				});
			},
			function testNoWriteFeature(t){
				var readOnlyStore = new DataStore({store:new ItemFileReadStore({})});
				t.f(readOnlyStore.put);
			}
		]
	);
});

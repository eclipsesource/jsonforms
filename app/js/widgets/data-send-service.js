var module = angular.module('jsonForms.data.send', []);

module.factory('SendData', ['$http', function($http) {
    return {
        sendData: function(url, type, id, data) {

            if (id !== "") {
                data.id = id;
                console.log("post url is " + url + type + "/" + id);
                $http.post(url + type + "/" + id, data).success(function() {
                    alert("Update Data successful");
                }).error(function(){
                    alert("Update Data failed!");
                });
            } else {
                $http.post("/" + type, data).success(function() {
                    alert("Create Data successful");
                }).error(function(){
                    alert("Create Data failed!");
                });
            }
        }
    };
}]);

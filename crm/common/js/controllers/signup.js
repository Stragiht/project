'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state','$sessionStorage','comApi', function ($scope, $http, $state, $sessionStorage,comApi) {
    comApi.post('login/signup',"",function(data){
    });
    $sessionStorage.$reset();
    setTimeout(function(){
        $state.go("system.signin");
    },2000);
}]);
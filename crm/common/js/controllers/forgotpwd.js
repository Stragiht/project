'use strict';

/* Controllers */
// signin controller
app.controller('forgotpwdController', [ '$scope', '$http', '$state',
    '$sessionStorage','comApi', function($scope, $http, $state, $sessionStorage, comApi ) {
        $scope.user = {};
        $scope.authError = null;
        $scope.updatePWD = function() {
            $scope.authError = null;
            var obj = $scope.user;
            obj.name = '1';
            comApi.post('login/updatePWD',obj,function(data){
                if(data.status == "1"){
                    comApi.post('login/signup',"",function(data){
                        $sessionStorage.$reset();
                        setTimeout(function(){
                            $state.go("system.signin");
                        },2000);
                    });
                }else{
                    $scope.authError = "旧密码不正确";
                }
            });
        }
    } ]);

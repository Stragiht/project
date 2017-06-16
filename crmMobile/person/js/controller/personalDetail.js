// 服务器上传路径
var fileServerPath = "";

/**
 * Created by Fupenglu on 2016-3-15. 个人信息画面
 */
app
    .controller(
        'personalDetailCtrl',
        function($scope, $http, $location, $sessionStorage, $ionicPopup,
            $stateParams, $state, $window, comApi, $ionicLoading, $timeout) {

        	var navMenu = comApi.showFooterMenu("");
        	$scope.$emit('navMenu.type', navMenu); 
        	
          // 保存服务器上传路径
          fileServerPath = $sessionStorage.upload;

          // 初始化方法
          $scope.init = function() {

            // 初始化变量
            var stfNum = $stateParams.stfNum;
            // 人员信息详情
            $scope.stfInfo = {};
            // 上级集合
            $scope.superItems = [];
            // 职位集合
            $scope.strItems = [];

            comApi.get('staff/mobileStfInfo/' + stfNum, function(data) {
              if (data.length > 0) {
                $scope.stfInfo = data[0];
                if($scope.stfInfo.figure==null||$scope.stfInfo.figure==""){
              	  $scope.ifXs="1";
                }else{
              	  $scope.ifXs="0";
                }
                // 上级领导做成
                var tempSupers = $scope.stfInfo.superStfNm.split(",");
                if (tempSupers.length > 1) {
                  for (var i = 1; i < tempSupers.length; i++) {
                    var tempArray = tempSupers[i].split(":");
                    if (tempArray.length > 1) {
                      $scope.superItems.push({
                        posNm : tempArray[0],
                        stfNm : tempArray[1]
                      });
                    }
                  }
                }
                // 门店集合做成
                if ($scope.stfInfo.strNm != null && $scope.stfInfo.strNm != ""
                    && $scope.stfInfo.strNm != undefined) {
                  var tempStrs = $scope.stfInfo.strNm.split(",");
                  if (tempStrs.length > 0) {
                    for (var i = 0; i < tempStrs.length; i++) {
                      $scope.strItems.push({
                        strNm : tempStrs[i]
                      });
                    }
                  }
                }
              }
            });
          }

          // 调用页面初始化
          $scope.init();

          $scope.ces = function() {
          };


          $scope.signup = function() {
            window.bdk.resignApp();
            var templateParam = '<div class="tcc_2"><img src="common/images/dui.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
            templateParam = templateParam + '您已成功退出</p></div>';
            $ionicLoading.show({
              template : templateParam,
              duration : 2000,
              hideOnStateChange : true,
              showBackdrop : false
            });
            $sessionStorage.$reset();
            $timeout(function() {
              $state.go("login", {});
            }, 1500);
          }

          // 上传图片
          $scope.uploadPicture = function() {
            var data = '{"token" : "' + $sessionStorage.ustu
                + '", "index" : "", "type" : "userfhotourl"}';
            window.bdk.uploadPicture(data);
          }

            // 上传图片完成
          $window.uploadComplete = function(data) {
               var dataJson = JSON.parse(data);
               if (dataJson.success) {
                   document.getElementById("figurePic").value = dataJson.result.filePath;
                   document.getElementById("figurePicSrc").src = fileServerPath
                       + dataJson.result.filePath;
               } else {
            	  comApi.appCallBackFaultHandle(dataJson, 1);
               }
           }
        });

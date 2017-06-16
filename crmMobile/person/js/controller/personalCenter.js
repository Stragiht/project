/**
 * Created by dxm 个人中心首页 Controller 2016/05/20
 */
app
    .controller(
        'personalCenterCtrl',
        function($scope, $http, $sessionStorage, $state ,comApi) {
        	
        	var navMenu = comApi.showFooterMenu("mainShow","3");
        	$scope.$emit('navMenu.type', navMenu); 

          // 取得登录用户员工编号
          var stfNum = $sessionStorage.userId;
          
          $scope.info = {};
          //取得用户信息
          comApi.get( 'personalCenter/personInfoSelect/'+stfNum,function(data){
              //用户信息
              $scope.info = data;
              if($scope.info.figure==null||$scope.info.figure==""){
            	  $scope.ifXs="1";
              }else{
            	  $scope.ifXs="0";
              }
              //工资卡设置状态
              if($scope.info.bnkCardNum==undefined || $scope.info.bnkCardNum==null || $scope.info.bnkCardNum==""){
                $scope.info.bnkCardSettingStatus = "未设置";
              }
          });

          //跳转到设置工资卡
          $scope.moneyCard = function(){
            $state.go("moneyCard");
          }
          //跳转到修改密码
          $scope.modPwd = function(){
            $state.go("modPwd");
          }
          //跳转到意见反馈
          $scope.feedback = function(){
            $state.go("feedback");
          }
          //跳转到设置
          $scope.setup = function(){
            $state.go("setup");
          }
          
          //跳转到个人详情
          $scope.personalDetail = function(){
            $state.go("personalDetail", {
              stfNum:stfNum
            });
          }
        });
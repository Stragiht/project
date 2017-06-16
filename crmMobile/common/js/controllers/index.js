/**
 * Created by Fupenglu on 2016-3-15.
 */
app.controller('indexCtrl', function ($scope, $http, $location, $sessionStorage, $ionicPopup, $window, $state, comApi) {

	var oIndexPage = document.getElementById("indexPage");
	oIndexPage.style.display = '';

	$scope.msgInfo = {};
	$scope.vm = {mainMenu : 1, stfMenu:1, reportMenu:1, membMenu: 1};
	$scope.mainShow = false;
	$scope.stfShow = false;
	$scope.reportShow = false;
	$scope.membShow = false;
	
    $scope.toggleMain = function (id) {
    	$scope.vm.mainMenu = id;
    };
    
    $scope.toggleStf = function (id) {
    	$scope.vm.stfMenu = id;
    };
    
    $scope.toggleReport = function (id) {
    	$scope.vm.reportMenu = id;
    };

	$scope.toggleMemb = function (id) {
		$scope.vm.membMenu = id;
	};
	
	// 推送回调处理
	$window.pushManagerCallback = function(pushMsgParams){
		if(!pushMsgParams){
    		return;
    	}
    	var param = JSON.parse(pushMsgParams);
		var pushParams = comApi.pushManagementPage(param);
        comApi.changePushMsgStatus(pushParams.callbackParam);
		if(pushParams.havePushMsg){
			$state.go(pushParams.jumpUrl, pushParams.jumpParam, {reload:true});
		}
	}
	
	// 父级接收  
	$scope.$on('navMenu.type', function(event, data) {  
		      var menujosn = angular.fromJson(data);
	          if(menujosn.mainShow){
	        	  $scope.mainShow = true;
	        	  if(menujosn.indexMenu != null && menujosn.indexMenu != "" && menujosn.indexMenu != undefined){
	        		  $scope.toggleMain(menujosn.indexMenu);
	        	  }
	        		//取得登录用户员工编号
	        		var stfNum = $sessionStorage.userId;
	        		if(stfNum != "" && stfNum != null && stfNum != undefined){
	        			//取得未读消息数
	        			comApi.get( 'msgList/mobileFooterSelect/'+stfNum,function(data){
	        				$scope.msgInfo.unreadMessageAmt = data;
	        			});
	        			
	        			//是否绑定银行卡
	        			comApi.get( 'msgList/mobileFooterCard/'+stfNum,function(data){
	        				$scope.msgInfo.isHaveCard = data.isHaveCard;
	        			});
	        		}
	          }else{
	        	  $scope.mainShow = false;
	          }
	          if(menujosn.stfShow){
	        		$scope.stfShow = true;
		        	  if(menujosn.indexMenu != null && menujosn.indexMenu != "" && menujosn.indexMenu != undefined){
		        		  $scope.toggleStf(menujosn.indexMenu);
		        	  }
	          }else{
	        		$scope.stfShow = false;
	          }
	          if(menujosn.reportShow){
	        		$scope.reportShow = true;
		        	  if(menujosn.indexMenu != null && menujosn.indexMenu != "" && menujosn.indexMenu != undefined){
		        		  $scope.toggleReport(menujosn.indexMenu);
		        	  }
	          }else{
	        		$scope.reportShow = false;
	          }
			if(menujosn.membShow){
				$scope.membShow = true;
				if(menujosn.indexMenu != null && menujosn.indexMenu != "" && menujosn.indexMenu != undefined){
					$scope.toggleMemb(menujosn.indexMenu);
				}
			}else{
				$scope.membShow = false;
			}

	        });
});
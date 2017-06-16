/**
 * Created by Fupenglu on 2016-3-15.
 */
app.controller('homeCtrl', function ($scope, $ionicScrollDelegate, $http, $location, $sessionStorage, $ionicPopup, $rootScope, $state, comApi) {
    window.loading.hide();
	var baseImgAddress = 'common/images/';
	var frequentlyUsedOperationsCnt = 6; //允许表示常用操作的个数（定义）
	//常用操作key定义
	var frequentlyUsedOperationsBase = {
		FUO001 : {
			key: 'FUO001',
			name: '提交销售报表',
			clickEv: {
				type: 1,//1:ng-click 2:ui-sref
				func: 'changeSubmitReportHomeFlg()',
				url: '',
			},
			userPower:{
				type: 3,//0:常显示 1:功能模块权限 2:功能点权限 3:功能点详细权限
				functionNum: "MREP01004002"
			},
			img: baseImgAddress + 'tb1.png',
			extend: {
				wwc: baseImgAddress + 'wwc.png'
			}
		},
		FUO002 : {
			key: 'FUO002',
			name: '新增会员信息',
			clickEv: {
				type: 1,
				func: 'changeMembHomeFlg()',
				url: '',
			},
			userPower:{
				type: 2,
				functionNum: "MMEM01002"
			},
			img: baseImgAddress + 'tb2.png'
		},
		FUO003 : {
			key: 'FUO003',
			name: '新增回访记录',
			clickEv: {
				type: 2,
				func: '',
				url: 'membRevisitRecInsert2',
			},
			userPower:{
				type: 3,
				functionNum: "MMEM01003002"
			},
			img: baseImgAddress + 'tb3.png'
		},
		FUO004 : {
			key: 'FUO004',
			name: 'BA回访任务',
			clickEv: {
				type: 1,
				func: 'changeMembRtHomeFlg()',
				url: '',
			},
			userPower:{
				type: 2,
				functionNum: "MMEM01003"
			},
			img: baseImgAddress + 'tb4.png'
		},
		FUO005 : {
			key: 'FUO005',
			name: 'BA回访记录',
			clickEv: {
				type: 1,
				func: 'changeMembRecHomeFlg()',
				url: '',
			},
			userPower:{
				type: 2,
				functionNum: "MMEM01004"
			},
			img: baseImgAddress + 'tb5.png'
		},
		FUO006 : {
			key: 'FUO006',
			name: '查看销售概况',
			clickEv: {
				type: 2,
				func: '',
				url: 'saleSummary',
			},
			userPower:{
				type: 2,
				functionNum: "MREP01001"
			},
			img: baseImgAddress + 'tb6.png'
		},
	};
	//页面初始化数据
	$scope.homeInfo = {};
	$scope.frequentlyUsedOperations = [];
	var keepGo = true;
	
	//取得登录用户员工编号
	var stfNum = $sessionStorage.userId;
	
	//取得主页信息
	comApi.get( 'mobileHome/mobileHome/'+stfNum,function(data){
		var works = angular.element(document.querySelector("#work-area li"));
	    if(works && works.length > 0) {
			angular.element(document.querySelector("#work-area")).css("display","block");
	    } else {
			angular.element(document.querySelector("#work-area")).css("display","none");
	    }
		//主页信息
		$scope.homeInfo = data;
		$scope.homeInfo.operationCnt = frequentlyUsedOperationsCnt;//允许表示常用操作的个数
		$scope.homeInfo.works = false;
		$scope.frequentlyUsedOperations = [];
		$scope.homeInfo.frequentlyUsedWork = true;
		var cnt = 0;//有效常用操作的个数
		angular.forEach(data.frequentlyUsedOperations, function(key, idx){
			if(keepGo && cnt == frequentlyUsedOperationsCnt) {
				//有效常用操作的个数等于可以表示的常用操作总个数时
				//不再向常用操作集合中添加数据
				keepGo = false;
			}
			if(frequentlyUsedOperationsBase[key] && keepGo) {
				$scope.frequentlyUsedOperations[cnt++] = frequentlyUsedOperationsBase[key];
			}
		});
		$scope.homeInfo.operationCnt = cnt;//当前用户可表示常用操作的个数
		
		// 首页footer事件触发
		var navMenu = comApi.showFooterMenu("mainShow","1");
		$scope.$emit('navMenu.type', navMenu); 
	});
	
    $scope.shouyeslidedian = true;

    $scope.shouyeslide = function(num){
        if(num == 0){
            $scope.shouyeslidedian = true;
        }else{
            $scope.shouyeslidedian = false;
        }
        
        var imgid = "#img" + num;
        angular.element(document.querySelectorAll(".xuanzhuan-anima")).removeClass("xuanzhuan-anima");
        angular.element(document.querySelector(imgid)).addClass("xuanzhuan-anima");
    };

	//清空缓存
	$scope.clearStorage = function() {
		var confirmPopup = $ionicPopup.confirm({
			title : '提示',
			template : '确定清空缓存吗？',
			okText : '确定',
			cancelText : '取消'

		});
		/*
		 * $state.go("entryApplInfo", {
		 entApplNum : $stateParams.entApplNum
		 });
		 * */
		confirmPopup.then(function(res) {
			if (res) {
				/*$state.go("memInfo", {
					memIndex : $stateParams.memIndex  //memInfo({memIndex:curMemIndex})
				});*/

			   //手动清空缓存
				$sessionStorage.selectChnlInfoALL='';
				$sessionStorage.dic = '';
				$sessionStorage.selectAddressALL = '';
				$sessionStorage.userId = '';
				$sessionStorage.memInfoDetail = '';

			}
		});
	};

    $scope.changeSubmitReportHomeFlg = function() {
      // 验证是否存在没有提交销售报表的门店
      comApi.get("saleData/checkMobileStoresNoData", function(data) {
        $rootScope.SUBMIT_REPORT_FLG = true;
        $state.go('baReportSubmit');
      });
    };
	    
	$scope.changeMembHomeFlg = function() {
		$rootScope.ADDMEMB_FLG = true;
		$state.go('membBasInsert');
	};

	$scope.changeMembRtHomeFlg = function() {
		$rootScope.REVTSK_FLG = true;
		$state.go('membRevisitTsk');
	};

	$scope.changeMembRecHomeFlg = function() {
		$rootScope.REVREC_FLG = true;
		$state.go('membRevisitRec');
	};

	$scope.jumbIntoDetailWorkPage = function(menuKey) {
		menuPermissionList = $sessionStorage.mobileMenu;
		$state.go(menuPermissionList[menuKey].jump);
	};
	
	$scope.onScroll = function() {
		var mainScroll = $ionicScrollDelegate.$getByHandle('mainScroll');
		var headerImg = document.getElementById("headerImg");
		var headerImgBar = document.getElementById("headerImgBar");
		var homeContent = document.getElementById("homeContent");
		var scrollTop = mainScroll.getScrollPosition().top;
		var headerImgTop = 48 - scrollTop - 1;
		var headerImgHeight = headerImg.offsetHeight;
		headerImg.style.top = headerImgTop + "px";
		if (scrollTop <= 0) {
			headerImgBar.style.backgroundColor = "rgba(83,56,254,1.0)";
		} else if (scrollTop >= headerImgHeight) {
			headerImgBar.style.backgroundColor = "rgba(83,56,254,1.0)";
		} else {
			var headerAlpha = 0.1 + 0.9 * (scrollTop / headerImgHeight);
			headerImgBar.style.backgroundColor = "rgba(83,56,254," + headerAlpha + ")";
		}
		if (scrollTop < 0) {
			var backImgHeight = 100 + Math.abs(scrollTop);
			homeContent.style.backgroundSize = "100% " + backImgHeight + "px";
		} else {
			homeContent.style.backgroundSize = "100% 100px";
		}
	}
});
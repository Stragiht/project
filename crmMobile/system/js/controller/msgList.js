/**
 * Created by Fupenglu on 2016-3-15.
 * 消息中心画面
 */
app.controller('msgListCtrl', function ($scope, $http, $location,$sessionStorage,$ionicPopup,$window,$ionicScrollDelegate,comApi,ionicDatePicker,$timeout,$filter) {
	$scope.stylebottom = "bottom: 50px;";
	$scope.pageNum = 0; // 第几页
	$scope.pageSize = 15; // 每页显示件数
	$scope.moredata = true; // 上拉加载是否可用
	$scope.msgList = [];
	
	var navMenu = comApi.showFooterMenu("mainShow","2");
	$scope.$emit('navMenu.type', navMenu); 
	
    //初始化方法
	$scope.init = function(){
		
		//初始化变量
		var stfNum = $sessionStorage.userId;
		$scope.msgInfo = {
				isEdit:false,
				checkallm:false,
				unreadMessageAmt :0
		};
		//取得未读消息数
		comApi.get( 'msgList/mobileFooterSelect/'+stfNum,function(data){
			$scope.msgInfo.unreadMessageAmt = data;
		});
		
		//是否绑定银行卡
		comApi.get( 'msgList/mobileFooterCard/'+stfNum,function(data){
			$scope.msgInfo.isHaveCard = data.isHaveCard;
		});
		
	}
	
	//调用页面初始化
	$scope.init();
	
    // 下拉刷新
    $scope.doRefresh = function() {
  	 stfNum = $sessionStorage.userId;
      $scope.pageNum = 0; // 还原第几页
      // 设定查询条件
      var searchParam = {
              pageSize : $scope.pageSize,
              pageNum : $scope.pageNum + 1, // 下一页
              params : {
                  stfNum : stfNum
              }
      }
  
		//取得消息列表
		comApi.post( 'msgList/mobileMsgListSelect',searchParam,function(data){
				$scope.msgList= data.data;
		        $scope.moredata = data.currnetPage < data.totalPage
		        $scope.pageNum = data.pageNum;
				$scope.msgInfo.checkallm = false;
		        $scope.$broadcast("scroll.refreshComplete");
		});	
    };
    
    // 上拉加载
    $scope.loadMore = function() {
  	  stfNum = $sessionStorage.userId;
  	  
      comApi.post('msgList/mobileMsgListSelect', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
            stfNum : stfNum
        }
      }, function(data) {
        Array.prototype.push.apply($scope.msgList, data.data); // 拼接结果集
        $scope.moredata = data.currnetPage < data.totalPage;
        $scope.pageNum = data.pageNum;
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    };
	
    //点击编辑按钮
	$scope.goEdit = function(){
		if($scope.msgInfo.isEdit){
			$scope.msgInfo.isEdit = false;
			// 回到顶部
		    $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
			$scope.stylebottom = "bottom: 50px;"
		}else{
			$scope.msgInfo.isEdit = true;
			// 回到顶部
		    $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
			$scope.stylebottom = "bottom: 98px;"
		}
	}
	
	//显示详细信息
	$scope.showDetail = function(msg,sendTm,msgType,msgStatus,msgId,msgIndex){
		var showtime = $filter("dateFormat")(sendTm) + " " + $filter("date")(sendTm,"HH:mm:ss");
	     //弹出消息内容
		 var alertPopup = $ionicPopup.alert({
		     title: '<div class="rzlc_img"><div  class="rzlc_div" >'+msgType+'</div></div></br>',
		     cssClass: 'view-pop-header',
		     template: '<div class="xiaoxi_tcc_text">'+msg+'</div></br><p class="xiaoxi_tcc_p">'+showtime+'</p>',
		     okText:'我知道了'
	      });
		 if(msgStatus != '3'){
				//更新阅读状态
				comApi.get( 'msgList/updateMsgListStatus/'+msgId,function(data){
					$scope.msgList[msgIndex].status = '3';
				  	var navMenu = comApi.showFooterMenu("mainShow","2");
					$scope.$emit('navMenu.type', navMenu); 
				});
		 }
		//取得未读消息数
			comApi.get( 'msgList/mobileFooterSelect/'+stfNum,function(data){
				$scope.msgInfo.unreadMessageAmt = data;
			});
		 
	}
	
    //点击全选按钮
	$scope.checkAll = function(){
		if($scope.msgInfo.checkallm){
			for(var i=0;i<$scope.msgList.length;i++){
				$scope.msgList[i].checked = true;
			}
		}else{
			for(var i=0;i<$scope.msgList.length;i++){
				$scope.msgList[i].checked = false;
			}
		}
	}
	
    //点击选择按钮
	$scope.checkItem = function(){
		var j = 0
		for(var i=0;i<$scope.msgList.length;i++){
			if($scope.msgList[i].checked){
				j++;
			}
		}
		if(j == $scope.msgList.length){
			$scope.msgInfo.checkallm = true;
		}else{
			$scope.msgInfo.checkallm = false;
		}
	}
	
    $scope.openDatePickerTwo = function (val) {
        var ipObj1 = {
          callback: function (val) {  //Mandatory
            console.log('Return value from the datepicker modal is : ' + val, new Date(val));
            $scope.selectedDate2 = new Date(val);
          },
          inputDate: new Date()
        };
        ionicDatePicker.openDatePicker(ipObj1);
    }
    
    $scope.deleteAll = function(){
    	var deleteArray = new Array;
		for(var i=0;i<$scope.msgList.length;i++){
			if($scope.msgList[i].checked){
				deleteArray.push($scope.msgList[i].oId);
		    }
		}
		if(deleteArray.length == 0){
			comApi.showMessage([ "error", "删除" ], "msg.common.10005", 3000);
		}else{
			//删除消息
			comApi.post('msgList/msgListDeleteAll/', deleteArray, function(data){
				comApi.showMessage("success", "msg.common.10024", 3000);
				$timeout(function() {
					$scope.msgInfo.checkallm = false;//初始化变量
					var stfNum = $sessionStorage.userId;
				    $scope.pageNum = 0;
				    // 设定查询条件
				    var searchParam = {
			            pageSize : $scope.pageSize,
			            pageNum : $scope.pageNum + 1, // 下一页
			            params : {
			                stfNum : stfNum
			            }
				    }
				  
					//取得消息列表
				    comApi.post( 'msgList/mobileMsgListSelect', searchParam, function(data){
				    	$scope.msgList= data.data;
					    $scope.moredata = data.currnetPage < data.totalPage;
					    $scope.pageNum = data.pageNum;
					    $scope.$broadcast("scroll.refreshComplete");
				    });
				    
				  	var navMenu = comApi.showFooterMenu("mainShow","2");
					$scope.$emit('navMenu.type', navMenu); 
                }, 3000);
			});
		}
    }
    
    
});
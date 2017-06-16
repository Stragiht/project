/**
 * Created by 朱艳春 on 2016-05-03.
 * BA借调编辑
 */
app.controller('stfTempTransUpdateController', ['$scope','$ionicPopup','comApi','$sessionStorage','$timeout','ionicDatePicker','$filter','$state','$stateParams',function ($scope, $ionicPopup,comApi,$sessionStorage,$timeout,ionicDatePicker,$filter,$state,$stateParams) {
	
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.stfTempInfo = {};//借调信息
	$scope.subStore={};
	var undStflist = [];
	var stfNumMobile;
	$scope.stfFormShow = true; //借调信息表单是否显示
	$scope.infoShow = false;// 提示信息是否显示
	$scope.reasonSelectShow = false; // 借调事由页面是否显示
    $scope.subStoreSelectShow = false; // 所属门店选择页面是否显示
    $scope.supvrStfSelectShow = false; // 借调BA选择页面是否显示
    //初始化方法
	$scope.init = function(){
		// 取得借调事由列表
        comApi.getSelectBoxDic("C015", 0).then(function(data) {
          $scope.dicList = data;
        });
     // 取得门店列表
        comApi.post( 'StfTempTrans/getCtrlMstInfoM',
            {
             applicant : $sessionStorage.userId
            },
            function(data){
              $scope.chnlList = data.chnlList;
              var chnlWidth = 100 / Number($scope.chnlList.length);
              $scope.chnlWidth = chnlWidth + "%";
              if ($scope.chnlList.length > 0) {
                $scope.selectedChnl = $scope.chnlList[0].chnlNum;
              }
        });
        //取得属于该借调id的借调信息 
        comApi.post( 'StfTempTrans/stfTempTransUpdateMobileSelect',{applNum:$stateParams.applNum},function(data){
			if(data.length>0){
//				$scope.chnlList[0].subStoreList.checked = data[0].secStrNum;

			    $scope.subStore.strNum = data[0].secStrNum;
			    $scope.subStore.checked = data[0].secStrNum;
				$scope.stfTempInfo.supvrStfDis = data[0].secStfNum;
				$scope.stfTempInfo.startTime = data[0].secStartTm;
				$scope.stfTempInfo.endTime = data[0].secEndTm;
				$scope.stfTempInfo.subStoreDis = data[0].secStrNm;
				$scope.stfTempInfo.reason = data[0].reason;
				$scope.stfTempInfo.updtTm = data[0].updtTm;
				$scope.stfTempInfo.supvrStfEntDt = data[0].secStfEntDt;
			}
			
		    // 借调BA
	        comApi.get( 'StfTempTrans/getUnderlingStfList/'+ $sessionStorage.userId,
	            function(data){
	              for (var i = 0; i < data.length; i ++) {
	                undStflist.push({key:data[i].stfNum, text:data[i].stfNm,isCheck:false,stfEntDt:data[i].stfEntDt});
	              }
	              $scope.undStfList = undStflist;
	              if ($scope.stfTempInfo.supvrStfDis) {
	                for (var i = 0; i < $scope.undStfList.length; i++) {
	                    if ($scope.stfTempInfo.supvrStfDis.indexOf($scope.undStfList[i].text) >= 0) {
	                      $scope.undStfList[i].isCheck = true;
	                    }
	                }
	              }
	        });
		});
        
	}
	//调用页面初始化
	$scope.init();
	/**
     * 借调事由
     */
	
    // 显示借调事由选择页面
    $scope.reasonSelect = function() {
      $scope.stfFormShow = false;
      $scope.reasonSelectShow = true;
      $scope.subStoreSelectShow = false;
      $scope.supvrStfSelectShow = false;
    };
    // 选定借调事由
    $scope.clickReason = function(dic) {
      $scope.stfTempInfo.reason = dic.text;
      $scope.stfTempInfo.reasonNum = dic.key;
      $scope.goBack();
    };
    // 返回
    $scope.goBack = function() {
      $scope.stfFormShow = true;
      $scope.reasonSelectShow = false;
      $scope.subStoreSelectShow = false;
      $scope.supvrStfSelectShow = false;
    };
    /**
     * 所属门店
     */
    // 显示所属门店选择页面
    $scope.subStoreSelect = function() {
    	var isEnd = false;
    	
    	var i = 0, j = 0;
    	while(!isEnd && i<$scope.chnlList.length) {
    		while(!isEnd && j<$scope.chnlList[i].subStoreList.length) {
    			if($scope.subStore.checked == $scope.chnlList[i].subStoreList[j].subStrNum){
    		    	$scope.selectedChnl = $scope.chnlList[i].chnlNum;
    		    	isEnd = true;
    			}
    			j++;
    		}
    		i++;
    		j = 0;
    	}

      $scope.stfFormShow = false;
      $scope.reasonSelectShow = false;
      $scope.subStoreSelectShow = true;
      $scope.supvrStfSelectShow = false;
      //$scope.infoShow = false;
    };
    // 选定渠道
    $scope.clickChnl = function(chnlNum) {
      $scope.selectedChnl = chnlNum;
    };
    // 选定门店
    $scope.clickSubStore = function(subStore) {
      $scope.stfTempInfo.subStoreDis = subStore.strNm;
      $scope.subStore.strNum = subStore.subStrNum;
      $scope.subStore.checked = subStore.subStrNum;
      $scope.goBack();
    };
    /**
     * 借调BA
     */
    // 显示借调BA选择页面
    $scope.supvrStfSelect = function() {
      $scope.stfFormShow = false;
      $scope.reasonSelectShow = false;
      $scope.subStoreSelectShow = false;
      $scope.supvrStfSelectShow = true;

      $scope.infoShow = true;
      $timeout(function() {
        $scope.infoShow = false;
      }, 3000);
    };
    // 选定借调BA
    $scope.clickSupvrStf = function() {
    	$scope.stfTempInfo.supvrStfDis = "";
    	$scope.stfTempInfo.supvrStfNum = "";
    	$scope.stfTempInfo.supvrStfEntDt = "";
    	var text = [];
    	var key = [];
    	var stfEntDt = [];
    	for(var i = 0,j=$scope.undStfList.length;i<j;i++){
    		if($scope.undStfList[i].isCheck == true){
    			text.push($scope.undStfList[i].text);
    			key.push($scope.undStfList[i].key);
    			stfEntDt.push($scope.undStfList[i].stfEntDt);
    		}
    	}
    	
    	$scope.stfTempInfo.supvrStfDis = text.join(",");
    	$scope.stfTempInfo.supvrStfNum = key.join(",");
    	$scope.stfTempInfo.supvrStfEntDt = stfEntDt.join(",");
    };
    $scope.openStartTime = function (val) {
        var ipObj1 = {
          callback: function (val) {  //Mandatory
        	//借调开始时间处理
            $scope.stfTempInfo.startTime = new Date(val);
            var time = $filter("date")($scope.stfTempInfo.startTime,'yyyy-MM-dd');
            $scope.stfTempInfo.startTime = time;
          },
          inputDate: new Date()
        };
        ionicDatePicker.openDatePicker(ipObj1);
      }
    $scope.openEndTime = function (val) {
        var ipObj1 = {
          callback: function (val) {  //Mandatory
            //借调结束时间处理
            $scope.stfTempInfo.endTime = new Date(val);
            var timeTwo = $filter("date")($scope.stfTempInfo.endTime,'yyyy-MM-dd');
            $scope.stfTempInfo.endTime = timeTwo;
          },
          inputDate: new Date()
        };
        ionicDatePicker.openDatePicker(ipObj1);
      }
    	$scope.fanhui = function(){
    	  var confirmPopup = $ionicPopup.confirm({
            title : '提示',
            template : '确定要放弃此次编辑？',
            okText : '确定',
            cancelText : '取消'

          });
    	  confirmPopup.then(function(res) {
            if (res) {
              $state.go("stfTempTransDetails", {
                applNum:$stateParams.applNum
              });
            }
          });
    	}
		
    $scope.saveStfTem = function(){
    	if($filter("date")($scope.stfTempInfo.startTime,'yyyy-MM-dd')>$filter("date")($scope.stfTempInfo.endTime,'yyyy-MM-dd')){
    		// 弹出消息
            comApi.showMessage(["error", "开始日期", "结束日期"], "msg.common.10007", 3000);
            return;
    	}
    	// 借调时间check
        if($scope.stfTempInfo.supvrStfNum != ''){
            var stfNm = $scope.stfTempInfo.supvrStfDis.split(',');
            var stfEntDt = $scope.stfTempInfo.supvrStfEntDt.split(',');
            for(var i=0; i<stfNm.length; i++){
                if($filter("date")($scope.stfTempInfo.startTime,'yyyy-MM-dd')<$filter("date")(stfEntDt[i],'yyyy-MM-dd')){
                    // 弹出消息
                    comApi.showMessage([ "error", "开始时间"], "msg.common.10019", 3000);
                    return;
                }
            }
        }
    	//保存方法
    	comApi.post('StfTempTrans/updateStfTempTransMobile', {
			 applNum:$stateParams.applNum,
			 secStartTm:$scope.stfTempInfo.startTime,
			 secEndTm:$scope.stfTempInfo.endTime,
			 reason:$scope.stfTempInfo.reasonNum,
			 updtTm1:$scope.stfTempInfo.updtTm,
			 stfNumMobile: $scope.stfTempInfo.supvrStfNum,
			 secStrNum:$scope.subStore.strNum,
			 applicant:$sessionStorage.userId},
			 function(data) {
  			   $scope.stfFormShow = true; //借调信息表单是否显示
                 $scope.infoShow = true;// 提示信息是否显示
                 $scope.reasonSelectShow = false; // 借调事由页面是否显示
                 $scope.subStoreSelectShow = false; // 所属门店选择页面是否显示
                 $scope.supvrStfSelectShow = false; // 借调BA选择页面是否显示
                 comApi.showMessage("success", "msg.common.10001", 3000);
                 setTimeout(function(){
                   $state.go("stfTempTransSelect");leaveApplInfo
               },"1000");
					
			});
    }
}]);
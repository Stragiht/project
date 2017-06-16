/**
 * 晋升申请
 */
app.controller('persActInsertController', function($scope, comApi, $location, $sessionStorage, $filter, 
    $ionicPopup, $stateParams, $state, $timeout, comApi) {
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	var undStflist = [];
  var posLists = [];
  $scope.subStore={};
  $scope.persActInfo= {};//晋升信息
  $scope.persActFormShow = true; //晋升信息表单是否显示
  $scope.supvrStfSelectShow = false;//晋升人员
  $scope.posSelectShow = false;//职位等级
  $scope.supvrStfNumShow = false;//晋升之后直属主管
  $scope.supvrStfNmMSelectShow = false;//晋升之后管理人员
  $scope.infoShow = false;
  $scope.subStoreSelectShow = false;//晋升之后管理门店 
  
  //初始化方法
  $scope.init = function(){
    // 借调BA
    comApi.get( "BaPromote/getUnderlingStfList/" + $sessionStorage.userId,
        function(data){
          for (var i = 0; i < data.length; i ++) {
            undStflist.push({key:data[i].stfNum, text:data[i].stfNm});
          }
          $scope.undStfList = undStflist;
    });
    // 职位等级
    comApi.get( 'BaPromote/getPosList',
        function(data){
      for (var i = 0; i < data.length; i ++) {
        posLists.push({key:data[i].posGrdNum, text:data[i].posGrdNm});
      }
      $scope.posList = posLists;
    });
  }
  $scope.init();
  // 显示职位等级 选择页面
  $scope.posSelect = function() {
    $scope.persActFormShow = false;
    $scope.supvrStfSelectShow = false;
    $scope.posSelectShow = true;
    $scope.supvrStfNumShow = false;
    $scope.supvrStfNmMSelectShow = false;//晋升之后管理人员
    //$scope.infoShow = false;
    $scope.subStoreSelectShow = false;//晋升之后管理门店 
  };
  // 选定职位等级 
  $scope.clickPos = function(undPos) {
      $scope.persActInfo.posNm = ">"+undPos.text;
      $scope.persActInfo.posNum = undPos.key;
      $scope.goBack();
  };
  // 显示晋升人员选择页面
  $scope.supvrStfSelect = function() {
    $scope.persActFormShow = false;
    $scope.supvrStfSelectShow = true;
    $scope.posSelectShow = false;
    $scope.supvrStfNumShow = false;
    $scope.supvrStfNmMSelectShow = false;//晋升之后管理人员
    //$scope.infoShow = false;
    $scope.subStoreSelectShow = false;//晋升之后管理门店 
  };
//选定晋升人员
  $scope.clickSupvrStf = function(undStf) {
	  var flag="0";
      $scope.persActInfo.supvrStfDis = undStf.text;
      $scope.persActInfo.posChgStf = undStf.key;
      // 取得直属主管人员列表
      comApi.getSelectBoxUndStf($sessionStorage.userId, 0,0).then(
          function(data) {
        	  for(var i=0;i<data.length;i++){
            	  if((data[i].key==$scope.persActInfo.posChgStf)){
            		  flag="1";
            		  if((data[i].key==$scope.persActInfo.posChgStf)&&flag=="1"){
                		  data.splice(i,"1");
                	  }
            	  }else{
            		  flag="0";
            	  }
              }
            $scope.supvrStfNumList = data;
          });
      // 取得管理人员列表
      comApi.getSelectBoxUndStf($scope.persActInfo.supvrStfNum, 0,1).then(
          function(data) {
        	  for(var i=0;i<data.length;i++){
            	  if((data[i].key==$scope.persActInfo.posChgStf)){
            		  flag="1";
            		  if((data[i].key==$scope.persActInfo.posChgStf)&&flag=="1"){
                		  data.splice(i,"1");
                	  }
            	  }else{
            		  flag="0";
            	  }
              }
            $scope.supvrStfNmMList = data;
          });
      
      $scope.goBack();
  };
  // 显示晋升之后直属主管选择页面
  $scope.supvrStfNumSelect = function() {
	  if($scope.persActInfo.supvrStfDis==null|| $scope.persActInfo.supvrStfDis==undefined || $scope.persActInfo.supvrStfDis==''){
	      // 弹出消息
	      comApi.showMessage([ "error", "晋升人员" ], "msg.common.100055", 3000);
	      return;
	    }
    $scope.persActFormShow = false;
    $scope.supvrStfSelectShow = false;
    $scope.posSelectShow = false;
    $scope.supvrStfNumShow = true;
    $scope.supvrStfNmMSelectShow = false;//晋升之后管理人员
    //$scope.infoShow = false;
    $scope.subStoreSelectShow = false;//晋升之后管理门店 
  };
  // 选定晋升之后直属主管
  $scope.clickSupvrStfNum = function(undSupvrStfNum) {
      $scope.persActInfo.supvrStfNm = undSupvrStfNum.text;
      $scope.persActInfo.supvrStfNum = undSupvrStfNum.key;
      $scope.persActInfo.supvrStfNmM = "";
      $scope.persActInfo.subStoreDisplay = "";
      // 管理人员取得列表
      comApi.getSelectBoxUndStf($scope.persActInfo.supvrStfNum, 0,1).then(
          function(data) {
        	  for(var i=0;i<data.length;i++){
            	  if((data[i].key==$scope.persActInfo.supvrStfNum)){
            		  flag="1";
            		  if((data[i].key==$scope.persActInfo.supvrStfNum)&&flag=="1"){
                		  data.splice(i,"1");
                	  }
            	  }else{
            		  flag="0";
            	  }
            	  if((data[i].key==$scope.persActInfo.posChgStf)){
            		  flag="1";
            		  if((data[i].key==$scope.persActInfo.posChgStf)&&flag=="1"){
                		  data.splice(i,"1");
                	  }
            	  }else{
            		  flag="0";
            	  }
              }
            $scope.supvrStfNmMList = data;
          });
   // 取得门店列表
      comApi.post( 'BaPromote/getCtrlMstInfoM',
          {
           applicant : $scope.persActInfo.supvrStfNum
          },
          function(data){
            $scope.chnlList = data.chnlList;
            var chnlWidth = 100 / Number($scope.chnlList.length);
            $scope.chnlWidth = chnlWidth + "%";
            if ($scope.chnlList.length > 0) {
              $scope.selectedChnl = $scope.chnlList[0].chnlNum;
            }
      });
      $scope.goBack();
  };
  
//显示晋升之后管理人员选择页面
  $scope.supvrStfNmMSelect = function() {
	  if($scope.persActInfo.supvrStfNm==null|| $scope.persActInfo.supvrStfNm==undefined || $scope.persActInfo.supvrStfNm==''){
	      // 弹出消息
	      comApi.showMessage([ "error", "晋升后直属主管" ], "msg.common.100055", 3000);
	      return;
	    }
    $scope.persActFormShow = false;
    $scope.supvrStfSelectShow = false;
    $scope.posSelectShow = false;
    $scope.supvrStfNumShow = false;
    $scope.supvrStfNmMSelectShow = true;//晋升之后管理人员
    $scope.infoShow = true;
    $scope.subStoreSelectShow = false;//晋升之后管理门店 
    $timeout(function() {
      $scope.infoShow = false;
    }, 3000);
  };
  // 选定晋升之后管理人员
  $scope.clickSupvrStfNmM = function() {
      $scope.persActInfo.supvrStfNmM = "";
      $scope.persActInfo.supvrStfNumM = "";
      var text = [];
      var key = [];
      for(var i = 0,j=$scope.supvrStfNmMList.length;i<j;i++){
          if($scope.supvrStfNmMList[i].checked == true){
              text.push($scope.supvrStfNmMList[i].text);
              key.push($scope.supvrStfNmMList[i].key);
          }
      }
      
      $scope.persActInfo.supvrStfNmM = text.join(",");
      $scope.persActInfo.supvrStfNumM = key.join(",");
     
      if (text.length > 0) {
        for(var k=0;k<text.lengt;k++){
          $scope.persActInfo.supvrStfNmM = $scope.persActInfo.supvrStfNmM+text[k];
        }
      } else {
        $scope.persActInfo.supvrStfNmM = "";
      }
  };
  
//显示晋升之后管理门店 选择页面
  $scope.subStoreSelect = function() {
	  if($scope.persActInfo.supvrStfNm==null|| $scope.persActInfo.supvrStfNm==undefined || $scope.persActInfo.supvrStfNm==''){
	      // 弹出消息
	      comApi.showMessage([ "error", "晋升后直属主管" ], "msg.common.100055", 3000);
	      return;
	    }
    $scope.persActFormShow = false;
    $scope.supvrStfSelectShow = false;
    $scope.posSelectShow = false;
    $scope.supvrStfNumShow = false;
    $scope.supvrStfNmMSelectShow = false;//晋升之后管理人员
    $scope.infoShow = true;
    $scope.subStoreSelectShow = true;//晋升之后管理门店 
    $timeout(function() {
      $scope.infoShow = false;
    }, 3000);
  };
  
  //选定渠道
  $scope.clickChnl = function(chnlNum) {
    $scope.selectedChnl = chnlNum;
  };
  //选定晋升之后管理门店 
  $scope.clickSubStore = function(subStore) {
    var strs = [];
    var strNms = [];
    for (var i = 0; i < $scope.chnlList.length; i++) {
      var storeDataList = $scope.chnlList[i].subStoreList;
      for (var j = 0; j < storeDataList.length; j++) {
        if (storeDataList[j].isCheck) {
          strs.push(storeDataList[j].subStrNum);
          strNms.push(storeDataList[j].strNm);
        }
      }
    }
    $scope.persActInfo.subStore = strs.join(",");
    $scope.persActInfo.subStoreNm = strNms.join(",");
    if (strNms.length > 0) {
      $scope.persActInfo.subStoreDisplay = strNms[0];
      if (strNms.length > 1) {
        $scope.persActInfo.subStoreDisplay = strNms[0] + "...";
      }
    } else {
      $scope.persActInfo.subStoreDisplay = "";
    }
  };
  $scope.fanhui = function(){
    var confirmPopup = $ionicPopup.confirm({
      title : '提示',
      template : '确定要放弃此次编辑？',
      okText : '确定',
      cancelText : '取消'

    });
    confirmPopup.then(function(res) {
      if (res) {
        $state.go("persActSelect");
      }
    });
  }
  
  //返回
  $scope.goBack = function() {
    $scope.persActFormShow = true;
    $scope.supvrStfSelectShow = false;
    $scope.posSelectShow = false;
    $scope.supvrStfNumShow = false;
    $scope.supvrStfNmMSelectShow = false;//晋升之后管理人员
    //$scope.infoShow = false;
    $scope.subStoreSelectShow = false;//晋升之后管理门店 
  };
  //保存
  $scope.save=function(){
    if($scope.persActInfo.supvrStfDis==null|| $scope.persActInfo.supvrStfDis==undefined || $scope.persActInfo.supvrStfDis==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升人员" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.posNum==null||$scope.persActInfo.posNum==undefined ||$scope.persActInfo.posNum==''){
      // 弹出消息
      comApi.showMessage([ "error", "职位等级" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.supvrStfNm==null|| $scope.persActInfo.supvrStfNm==undefined || $scope.persActInfo.supvrStfNm==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升后直属主管" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.subStore==null|| $scope.persActInfo.subStore==undefined || $scope.persActInfo.subStore==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升后管理门店" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.supvrStfNmM==null|| $scope.persActInfo.supvrStfNmM==undefined || $scope.persActInfo.supvrStfNmM==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升后管理人员" ], "msg.common.10002", 3000);
      return;
    }
    comApi.post("BaPromote/saveBaPromoteInsert",
        {
          posChgStf:$scope.persActInfo.posChgStf,
          mngStf:$scope.persActInfo.supvrStfNumM,
          mngStr:$scope.persActInfo.subStore,
          posGrdNum:$scope.persActInfo.posNum,
          supvrStfNum:$scope.persActInfo.supvrStfNum
        }, 
        function(data) {
          comApi.showMessage("success", "msg.common.10001", 3000);
          setTimeout(function(){
            $state.go("persActSelect");
        },"1000");
    },true);
  }
  //提交
  $scope.submitPersAct=function(){
    if($scope.persActInfo.supvrStfDis==null|| $scope.persActInfo.supvrStfDis==undefined || $scope.persActInfo.supvrStfDis==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升人员" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.posNum==null||$scope.persActInfo.posNum==undefined ||$scope.persActInfo.posNum==''){
      // 弹出消息
      comApi.showMessage([ "error", "职位等级" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.supvrStfNm==null|| $scope.persActInfo.supvrStfNm==undefined || $scope.persActInfo.supvrStfNm==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升后直属主管" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.subStore==null|| $scope.persActInfo.subStore==undefined || $scope.persActInfo.subStore==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升后管理门店" ], "msg.common.10002", 3000);
      return;
    }
    if($scope.persActInfo.supvrStfNumM==null|| $scope.persActInfo.supvrStfNumM ==undefined|| $scope.persActInfo.supvrStfNumM==''){
      // 弹出消息
      comApi.showMessage([ "error", "晋升后管理人员" ], "msg.common.10002", 3000);
      return;
    }
    comApi.post("BaPromote/submitBaPromoteInsert", 
        {
            posChgStf:$scope.persActInfo.posChgStf,
            mngStf:$scope.persActInfo.supvrStfNumM,
            mngStr:$scope.persActInfo.subStore,
            posGrdNum:$scope.persActInfo.posNum,
            supvrStfNum:$scope.persActInfo.supvrStfNum
        }, 
        function(data) {
            comApi.showMessage("success", "msg.common.10001", 3000);
            setTimeout(function(){
              $state.go("persActSelect");
            },"1000");
        },true);
  }
});
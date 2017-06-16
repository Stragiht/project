/**
 * 新增入职流程
 */
app.controller('baPromoteUpdateController', function($scope, $stateParams,
        $state, $modal, NgTableParams, comApi, toaster) {
  $scope.oneAtATime = true;
  $scope.status = {
    entBaseInfoOpen : true,
    entInfoOpen : true,
    supvrStfInfoDisabled : false
  };
  //定义获取职位等级
  $scope.baPromoteInfo = {};
  $scope.storeList = [];
  $scope.datas =[];

  // 职位变更重新取得职位等级列表
  $scope.changePosition = function(position) {
    var posLvlDataList = comApi.getSelectBoxPosLvl(position, "0");
    $scope.positionLevelList = posLvlDataList;
    if (posLvlDataList.length > 0) {
      $scope.baPromoteInfo.posGrdNum = posLvlDataList[0].key;
    } else {
      $scope.baPromoteInfo.posGrdNum = "";
    }
  };
  
  // 保存操作
  $scope.saveBaPromote = function() {
    //拼接人员
      var strNum="";
      for(var h=0;h<$scope.datas.length;h++){
          strNum+=$scope.datas[h].stfNum+",";
      }
      if(strNum!=""){
          $scope.baPromoteInfo.mngStf=strNum.substring(0,strNum.length-1);
      }else{
          $scope.baPromoteInfo.mngStf="";
      }
    comApi.post("BaPromote/saveBaPromoteUpdate",$scope.baPromoteInfo,function(
        data) {
        
      toaster.pop('success', '提示', "保存BA晋升督导流程信息成功。", 3000, 'trustedHtml',
          function() {
          });
      // 跳转到入职流程页面
      $state.go("app.staff.baPromote");
    });
  };
  // 提交操作
  $scope.submitBaPromote = function() {
    comApi.post("BaPromote/submitBaPromoteUpdate", $scope.baPromoteInfo, function(
        data) {
      toaster.pop('success', '提示', "提交BA晋升督导流程信息成功。", 3000, 'trustedHtml',
          function() {
          });
      // 跳转到入职流程页面
      $state.go("app.staff.baPromote");
    });
  };
  // 初始化
  function initBaPromoteApplUpdate() {
    comApi.post("BaPromote/getBaPromoteApplInfoForUpdatePage", {
      applNum : $stateParams.applNum,
      updtTm : $stateParams.updtTm
    }, function(data) {
      
        $scope.baPromoteInfo = data.baPromoteApplInfo;
        //晋升人员
        $scope.supvrStfNumDisplay1 = data.baPromoteApplInfo.posChgStf+"."+data.posChgStfNm;
        // 直属主管个人信息
        $scope.supvrStfNumDisplay = data.baPromoteApplInfo.supvrStfNum + "."
            + data.supvrStfNm;
         // 门店列表数据
            $scope.storeList = data.storeList;
         //人员数据列表
            $scope.datas =data.stfList;
        // 审批历史
        if (data.approvalList.length > 0) {
          $scope.status.apprHisDisplay = true;
        }
        $scope.tableParams = new NgTableParams({
          // 显示的第几页
          page : 1,
          // 一页显示多少条
          count : 20
        }, {
          // 把data数据集绑定前台
          dataset : data.approvalList,
          // 可以点击的显示自己想要一页显示多少条
          counts : [ 20, 50, 100, 200 ]
        });
        
     // 职位：BA、督导
        var posCtrlMstList = data.posCtrlMstList;
        var posDataList = comApi.getSelectBoxJob("0");
        var newPosDataList = [];
        for (var i = 0; i < posCtrlMstList.length; i++) {
          var posNum = posCtrlMstList[i];
          for (var j = 0; j < posDataList.length; j++) {
            if (posDataList[j].key == posNum) {
              newPosDataList.push(posDataList[j]);
              break;
            }
          }
        }
      
        // 设置下拉列表选项数据   职位
        $scope.positionList = newPosDataList;
        $scope.baPromoteInfo.newPos=data.posCtrlMstList[0];
       
        // 取得下拉列表数据
        var posLvlDataList = comApi.getSelectBoxPosLvl($scope.baPromoteInfo.newPos, "0");
        //设置下拉列表选项数据   职位等级
        $scope.positionLevelList = posLvlDataList;
        if (posLvlDataList.length > 0) {
          $scope.baPromoteInfo.posGrdNum = data.baPromoteApplInfo.posGrdNum;
        } else {
          $scope.baPromoteInfo.posGrdNum = "";
        }
        
    });
    
  }
  // 执行初始化
  initBaPromoteApplUpdate();
  // 晋升人员
  $scope.openStf1 = function(size) {
    var modalInstance = $modal.open({
      templateUrl : 'radiostaff.html',
      controller : 'radioStaffController',
      size : size,
      resolve : {
        // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          return 1;
        },
        // 配置需要注入JS
        deps : [ '$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([ 'common/js/controllers/radiostaff.js' ]);
        } ]
      }
    });
    // 父子传递参数(晋升人员)
    modalInstance.result.then(function(selectedItem) {
      if (selectedItem.length > 0) {
        var stfNum = selectedItem[0].stfNum;
        var stfNm = selectedItem[0].stfNm;
        $scope.baPromoteInfo.posChgStf = stfNum;
        $scope.supvrStfNumDisplay1 = stfNum + "." + stfNm;
        
        //选择人员之后自动获取人员所属的门店信息
        comApi.get("BaPromote/multiSelectStoreSelect/"+ $scope.baPromoteInfo.posChgStf,function(
                data){
            $scope.storeList=data;
        });
        
      }
      
    });
  };

  // 直属主管浏览
  $scope.openStf = function(size) {
    var modalInstance = $modal.open({
      templateUrl : 'radiostaff.html',
      controller : 'radioStaffController',
      size : size,
      resolve : {
        // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          return 1;
        },
        // 配置需要注入JS
        deps : [ '$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([ 'common/js/controllers/radiostaff.js' ]);
        } ]
      }
    });
    // 父子传递参数
    modalInstance.result.then(function(selectedItem) {
      if (selectedItem.length > 0) {
        var stfNum = selectedItem[0].stfNum;
        var stfNm = selectedItem[0].stfNm;
        $scope.baPromoteInfo.supvrStfNum = stfNum;
        $scope.supvrStfNumDisplay = stfNum + "." + stfNm;
      }
    });
  };
  
//晋升之后的管理人员
  $scope.openStfs = function(size) {
      
      var modalInstance = $modal.open({
          templateUrl : 'multiselectstaff.html',
          controller : 'multiSelectStaffController',
          size : size,
          resolve : {
            //配置需要注入JS
            deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/multiselectstaff.js']);}]
          }
      
      });
      //父子传递参数
      modalInstance.result.then(function(selectedItem) {
          
          var commState = 0;
          

          if(typeof($scope.datas) != "undefined"){
              
              for(var i=0;i<$scope.datas.length;i++){
                  for(var z=0;z<selectedItem.length;i++){
                      commState = selectedItem[z].stfNum== $scope.datas[i].stfNum?1:0;
                      break;
                  }
                  if(commState != 0){
                      alert("该人员已经存在!");
                      break;
                  }
                  selectedItem.push($scope.datas[i]);
              }
              
          }
       

          if(commState == 0){
              $scope.datas = selectedItem;
          }
      });
  };
  // 所属门店浏览
  $scope.openDep = function(size) {
    var modalInstance = $modal.open({
      templateUrl : 'multiselectstore.html',
      controller : 'multiSelectStoreController',
      size : size,
      resolve : {
        // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          return 1;
        },
        // 配置需要注入JS
        deps : [
            '$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad
                  .load([ 'common/js/controllers/multiselectstore.js' ]);
            } ]
      }
    });
    // 父子传递参数
    modalInstance.result.then(function(selectedItem) {
      for (var i = 0; i < selectedItem.length; i++) {
        var strNum = selectedItem[i].strNum;
        var exist = false;
        for (var j = 0; j < $scope.storeList.length; j++) {
          if (strNum == $scope.storeList[j].strNum) {
            exist = true;
            break;
          }
        }
        if (!exist) {
          $scope.storeList.push(selectedItem[i]);
        }
      }
      var subStoreStr = "";
      for (var i = 0; i < $scope.storeList.length; i++) {
        if (i == 0) {
          subStoreStr = $scope.storeList[i].strNum;
        } else {
          subStoreStr = subStoreStr + "," + $scope.storeList[i].strNum;
        }
      }
      $scope.baPromoteInfo.mngStr = subStoreStr;
    });
  };
  // 所属门店删除
  $scope.delStore = function(index) {
    $scope.storeList.splice(index, 1);
    var subStoreStr = "";
    for (var i = 0; i < $scope.storeList.length; i++) {
      if (i == 0) {
        subStoreStr = $scope.storeList[i].strNum;
      } else {
        subStoreStr = subStoreStr + "," + $scope.storeList[i].strNum;
      }
    }
    $scope.baPromoteInfo.mngStr = subStoreStr;
  };
});
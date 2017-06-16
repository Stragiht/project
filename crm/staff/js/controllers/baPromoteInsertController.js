/**
 * 新增入职流程
 */
app.controller('baPromoteInsertController', function($scope, $state, $modal,
    comApi, toaster) {
  $scope.oneAtATime = true;
  $scope.status = {
    entBaseInfoOpen : true,
    entInfoOpen : true,
    supvrStfInfoDisabled : false
  };
  //定义获取职位等级
  $scope.baPromoteInfo = {};
  $scope.storeList = [];

  // 保存操作
  $scope.saveBaPromote = function() {
    comApi.post("BaPromote/saveBaPromoteInsert", $scope.baPromoteInfo, function(
        data) {
      toaster.pop('success', '提示', "保存BA晋升督导信息成功。", 3000, 'trustedHtml',
          function() {
          });
      $state.go("app.staff.baPromote");
    });
  };
  // 提交操作
  $scope.submitBaPromote = function() {
    comApi.post("BaPromote/submitBaPromoteInsert", $scope.baPromoteInfo, function(
        data) {
      toaster.pop('success', '提示', "提交BA晋升督导信息成功。", 3000, 'trustedHtml',
          function() {
          });
      $state.go("app.staff.baPromote");
    });
  };
  // 初始化
  function initBaPromoteInsert() {
    comApi.get("entryAppl/getCtrlMstInfo", function(data) {
      var posCtrlMstList = data.posCtrlMstList;

      // 晋升职位职位列表取得
      var posDataList = comApi.getSelectBoxJob("0");
      var newPosDataList = [];
        var posNum = posCtrlMstList[1];
        for (var j = 0; j < posDataList.length; j++) {
          if (posDataList[j].key == posNum) {
            newPosDataList.push(posDataList[j]);
            break;
          }
        }
      $scope.positionList = newPosDataList;
      if (newPosDataList.length > 0) {
        $scope.baPromoteInfo.newPos = newPosDataList[0].key;
      }
      // 职位等级
      var posLvlDataList = [];
      if (newPosDataList.length > 0) {
        posLvlDataList = comApi.getSelectBoxPosLvl(newPosDataList[0].key, "0");
      }
      $scope.positionLevelList = posLvlDataList;
      if (posLvlDataList.length > 0) {
        $scope.baPromoteInfo.posGrdNum = posLvlDataList[0].key;
      }
   
    });
  }
  // 执行初始化
  initBaPromoteInsert();
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
            for (var i = 0; i < $scope.storeList.length; i++) {
                if (i == 0) {
                  subStoreStr = $scope.storeList[i].strNum;
                } else {
                  subStoreStr = subStoreStr + "," + $scope.storeList[i].strNum;
                }
              }
              $scope.baPromoteInfo.mngStr = subStoreStr;
        });
        
      }else{
    	  $scope.supvrStfNumDisplay1="";
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
      }else{
        $scope.baPromoteInfo.supvrStfNum = "";
        $scope.supvrStfNumDisplay = "";
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
          //拼接人员
          var strNum="";
          for(var h=0;h<selectedItem.length;h++){
              strNum+=selectedItem[h].stfNum+",";
          }
          if(strNum!=""){
              $scope.baPromoteInfo.mngStf=strNum.substring(0,strNum.length-1);
          }else{
              $scope.baPromoteInfo.mngStf="";
          }
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
  // 管理人员删除
  $scope.delStaff = function(index) {
    $scope.datas.splice(index, 1);
    var subStaffStr = "";
    for (var i = 0; i < $scope.datas.length; i++) {
      if (i == 0) {
        subStaffStr = $scope.datas[i].stfNum;
      } else {
        subStaffStr = subStaffStr + "," + $scope.datas[i].stfNum;
      }
    }
    $scope.baPromoteInfo.mngStf = subStaffStr;
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
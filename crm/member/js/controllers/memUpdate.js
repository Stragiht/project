app.controller('memUpdateCtrl', ['$scope','comApi', '$stateParams', '$sessionStorage', '$modal', '$state', '$filter', 'fileUploadApi', function($scope,comApi,$stateParams,$sessionStorage,$modal,$state,$filter, fileUploadApi) {
    $scope.oneAtATime = true;
    $scope.status = {
        jbxxopen: true,
        //bankopen:true,
        skinopen:true
    };
    $scope.membUpd = {};
    var membNum = $stateParams.membNum;
    var singleImgUpload = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.MEM_THUM);
    $scope.membUpd.membFigure = singleImgUpload;

    //编辑会员信息
    $scope.updateMembInfo = function(){
        comApi.get('membBas/selectByMembNum/'+membNum, function(data){
            $scope.membUpd = data; //$sessionStorage.upload
            //单图片代码
            if($scope.membUpd.membFigure !=null && $scope.membUpd.membFigure != '') {
                fileUploadApi.insertUploadSuccFile(singleImgUpload, $scope.membUpd.membFigure);
                $scope.$broadcast("myCroppedImage", singleImgUpload.fileArray[0].basePath+ angular.copy($scope.membUpd.membFigure));
            }
            $scope.membUpd.membFigure = singleImgUpload;
            $scope.locProv = comApi.getSelectBoxPCV("1", "3", true); //0

            //默认显示第一个省
            // $scope.insert.locProv=$scope.locProv[0].key;
            //下拉框所属市
            $scope.locCity = comApi.getSelectBoxPCV($scope.membUpd.locProv, "4", true); //0

            $scope.locPref = comApi.getSelectBoxPCV($scope.membUpd.locCity, "5");

            //肌肤类型
            $scope.skinTypes = comApi.getSelectSkin("C025",0);

            //肌肤问题
            $scope.skinProbs = comApi.getSelectSkin("C026",0);

            //护肤品需求
            $scope.skinDemands  = comApi.getSelectSkin("C027",0);

            //日常护肤需求
            $scope.skinDailyDemands = comApi.getSelectSkin("C028",0);

            $scope.selectedSkinProb = valueJud($scope.membUpd.membSkinCareNeed.C026);  //肌肤类型
            $scope.selectedSkinDem = valueJud($scope.membUpd.membSkinCareNeed.C027);   //护肤品需求
            $scope.selectedSkinDaily = valueJud($scope.membUpd.membSkinCareNeed.C028); //日常护肤需求

            //创建人员
            $scope.membUpd.crtdStfNumNm = $scope.membUpd.crtdStfNum == null || $scope.membUpd.crtdStfNum == "" ? "" 
            							: angular.copy($scope.membUpd.crtdStfNum) + '.' + angular.copy($scope.membUpd.crtdStfNm);

            //格式化时间串
            $scope.membUpd.registTm = $filter("date")($scope.membUpd.registTm,'yyyy-MM-dd');
            $scope.membUpd.birtyday = $filter("date")($scope.membUpd.birtyday,'yyyy-MM-dd');

        })
    };

    //初始化
    $scope.updateMembInfo();


    //数据判断
    function valueJud(value) {
        if (value == undefined || value == '' || value == null) {
            value = [];
        } else {
            value = value.split(",");
        }
        return value;
    }


    $scope.insert = {};

    // 家庭住址省
    $scope.homeAddrProv = comApi.getSelectBoxPCV("1", "3", true);
    // 家庭住址市
    $scope.selectAddrCity = function() {
        $scope.locCity = comApi.getSelectBoxPCV(
            $scope.membUpd.locProv, "4", true);
        if($scope.locCity && $scope.locCity != null && $scope.locCity.length > 0) {
            $scope.membUpd.locCity = $scope.locCity[0].key;
            $scope.locPref = comApi.getSelectBoxPCV(
                $scope.membUpd.locCity, "5");
            if($scope.locPref && $scope.locPref != null && $scope.locPref.length > 0){
                $scope.membUpd.locPref = $scope.locPref[0].key;
            }
        }else{
            $scope.locPref = [];
        }
    }
    // 家庭住址县
    $scope.selectAddrPref = function() {
        $scope.locPref = comApi.getSelectBoxPCV(
            $scope.membUpd.locCity, "5");
        if($scope.locPref && $scope.locPref != null && $scope.locPref.length > 0){
            $scope.membUpd.locPref = $scope.locPref[0].key;
        }

    };


    // 下拉菜单_来源渠道
    $scope.channels = comApi.getChnlList('IFCOMW0210001', 0);//0
    //下拉菜单_会员组别、
    $scope.membGrps = comApi.stoMembGrp(0);//0

    ///下拉框所属省


    //复选框选中事件   定义选中的复选框的数据存储
    $scope.selectedSkinProb = [];  //肌肤类型
    $scope.selectedSkinDem = [];   //护肤品需求
    $scope.selectedSkinDaily = []; //日常护肤需求

    var updateSelected = function(action,id,selectObj){
        if(action == 'add' && selectObj.indexOf(id) == -1){
            selectObj.push(id);
        }
        if(action == 'remove' && selectObj.indexOf(id)!=-1){
            var idx = selectObj.indexOf(id);
            selectObj.splice(idx,1);
        }
    }

    $scope.updateSelection = function($event, id, selectObj){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action,id, selectObj);
    }

    $scope.isSelected = function(id, selectObj){
        return selectObj.indexOf(id)>=0;
    };

    //直属主管弹窗
    $scope.openMemUpd = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'radiostaff.html',
            controller: 'radioStaffController',
            size: size,
            resolve: {
                //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                flag: function () {
                    return 2;
                },
                //配置需要注入JS
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);
                }]
            }

        });

        //父子传递参数
        modalInstance.result.then(function (selectedItem) {
        	if(selectedItem && selectedItem.length > 0 && selectedItem[0] != null){
        		//给text窗口赋显示格式的值
        		$scope.membUpd.crtdStfNumNm = selectedItem[0].stfNum + "." + selectedItem[0].stfNm;
        		$scope.membUpd.crtdStfNum = selectedItem[0].stfNum;
        	}else{
        		$scope.membUpd.crtdStfNumNm = "";
        		$scope.membUpd.crtdStfNum = null;
        	}
        });
    };
    //提交保存(编辑)
    $scope.updateMem = function() {
        //数据备份
        $scope.membUpdCopy = angular.copy($scope.membUpd);
        $scope.membUpdCopy.membFigure = fileUploadApi.getUploadSuccFileUrl($scope.membUpdCopy.membFigure);
        //编辑后的肌肤现状、护肤品需求、日常护肤需求
        $scope.membUpdCopy.membSkinCareNeed.C026 = $scope.selectedSkinProb.join(',');
        $scope.membUpdCopy.membSkinCareNeed.C027 = $scope.selectedSkinDem.join(',');   //护肤品需求
        $scope.membUpdCopy.membSkinCareNeed.C028 = $scope.selectedSkinDaily.join(','); //日常护肤需求

        comApi.myConsoleLog(angular.toJson($scope.membUpdCopy));

        $scope.membUpdCopy.registTm = comApi.dateToTimeStamp($scope.membUpdCopy.registTm);

        comApi.post("membBas/updateMembBas", $scope.membUpdCopy, function(data){

        	comApi.successMessage('msg.member.10016');
            setTimeout(function() {
                $state.go('app.member.memBas');
            },1000);
        })
    }
}]);

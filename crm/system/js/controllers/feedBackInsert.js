/**
 * Created by 单颖 on 2016-3-13.
 */

app.controller('feedBackInsert', function($scope, comApi, $http,toaster) {
    $scope.insert={};
    $scope.stf={};
    //下拉框引用字典表里的数据
    $scope.problems = comApi.getSelectBoxDic("C043",1);
    $scope.problemsorts = comApi.getSelectBoxDic("C044",1);
    $scope.stf.dicNm = $scope.problems[1].key;
    $scope.stf.dicNms = $scope.problemsorts[1].key;
    // 遍历nav.Json
    var userPowerData = null;
    $scope.resumeInfoEditor = null;
    // 读取nav.json里的data
    $http.get('jsonData/nav.json').success(
            function(data, status, headers, config) {
                $scope.resumeInfoEditor = MyEditor.createEditor("feedBackResumeInfo", {"height":"340px"});
                // 转化成table
                userPowerData = TAFFY(data);
                // 取出功能模块所有数据
                userPowerData().each(function(obj) {
                    $scope.scopeModules = obj.CRMNAV;
                    // 初始化功能模块默认选中第一项。
                    $scope.scopeModuleSelect = $scope.scopeModules[0].TEXT;
                    // 触发功能模块事件时，让功能组模块初始化默认值。
                    $scope.scopeModule();
                    $scope.scopeGroupSelect = "";
                    // 触发功能组模块时，让功能点模块初始化默认值。
                    $scope.scopeGroup();
                    $scope.scopeFunctionSelect = "";
                });
            }).error(function(data, status, headers, config) {
        console.log('执行失败 错误消息: ' + data);
    });
    // 显示功能模块下拉列表里的值,对应联动出功能组里的值。
    $scope.scopeModule = function() {
        // 当重新选择功能模块时，将功能点里的值清空。
        $scope.scopeFunctions = "";
        userPowerData().each(function(obj) {
            var a = TAFFY(obj.CRMNAV);
            a({
                TEXT : $scope.scopeModuleSelect
            }).each(function(obj) {
                try {
                    $scope.scopeGroups = obj.VALUE;
                    $scope.scopeGroupSelect = "";
                    $scope.scopeGroup();
                    $scope.scopeFunctionSelect = "";
                } catch (e) {
                }
            });
        });
    };
    // 选择功能组里的值，对应联动出功能点的值。
    $scope.scopeGroup = function() {
        userPowerData().each(function(obj) {
            var a = TAFFY(obj.CRMNAV);
            a({
                TEXT : $scope.scopeModuleSelect
            }).each(function(obj) {
                var b = TAFFY(obj.VALUE);
                b({
                    TEXT : $scope.scopeGroupSelect
                }).each(function(obj) {
                    $scope.scopeFunctions = obj.VALUE;
                    //默认选中第一项
                    $scope.scopeFunctionSelect = "";
                });
            });
        });
    };
    

    $scope.saveFbk = function() {
    	$scope.isSubmitted=true;
        //取得反馈内容
        $scope.insert.resumeInfo = MyEditor.getHtmlVal($scope.resumeInfoEditor);
    	if($scope.scopeModuleSelect==null || $scope.scopeModuleSelect==undefined || $scope.scopeModuleSelect==''){
 		   comApi.HintMessage( ["error","影响栏目"], "错误", "msg.common.00014",0, "");
            return;
 		 }
    	if($scope.stf.dicNm==null || $scope.stf.dicNm==undefined || $scope.stf.dicNm==''){
 		   comApi.HintMessage( ["error","问题严重程度"], "错误", "msg.common.00014",0, "");
            return;
 		 }
    	if($scope.stf.dicNms==null || $scope.stf.dicNms==undefined || $scope.stf.dicNms==''){
 		   comApi.HintMessage( ["error","问题分类"], "错误", "msg.common.00014",0, "");
            return;
 		 }
        //提交保存方法
        comApi.post("FbkInfo/insertFbkInfo", {
            
            title:$scope.title,scopeModule:$scope.scopeModuleSelect,scopeGroup:$scope.scopeGroupSelect,scopeFunction:$scope.scopeFunctionSelect,level:$scope.stf.dicNm,type:$scope.stf.dicNms,fbkInfo:$scope.insert.resumeInfo
        }, function(data) {
            $scope.datas=[{}];
            toaster.pop('success', '',
                    '意见反馈保存成功', 3000,
                    'trustedHtml',
                    function() {
                    });
    });
    }
});
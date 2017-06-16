/**
 * Created by 单颖 on 2016-3-13.
 */
app.controller('fbkInfoUpdateController',function ($scope,$stateParams,comApi,toaster,$state) {
    //初始化默认打开状态
    $scope.oneAtATime = true;
    $scope.status = {
        jbxxopen : true,
        wtxxopen : true,
        wtclopen : true  
    };
    //alert($stateParams.oid);
    //下拉框引用字典表里的数据
    $scope.problems = comApi.getSelectBoxDic("C043",1);
    $scope.problemsorts = comApi.getSelectBoxDic("C044",1);
    $scope.actionFlgs = comApi.getSelectBoxDic("C046",1);
    //定义下方resumeInfo
    $scope.insert={};
    //定义datas与stf
    $scope.datas = [];
    $scope.stf = [];
    $scope.solutionUpdtEditor = null;
    $scope.resumeInfoEditor = null;
    //意见反馈查询出来的数据赋值给页面上面的ng-bind
    comApi.post("FbkInfo/fbkInfoByOid", {
        oid:$stateParams.oid
        },function(data) {
                $scope.resumeInfoEditor = MyEditor.createEditor("feedBackResumeInfo", {"height":"340px"});
                $scope.solutionUpdtEditor = MyEditor.createEditor("solutionUpdt", {"height":"340px"});     
                $scope.crtdTm = data.crtdTm;
                $scope.crtdUsr = data.crtdUsr;
                $scope.actionFlg = data.actionFlg;
                $scope.title = data.title;
                $scope.level = data.level;
                $scope.type = data.type;
                $scope.fbkInfo = data.fbkInfo;
                $scope.stf.dicNm = data.level;
                $scope.stf.dicNms = data.type;
                $scope.stf.dicNmz = data.actionFlg;
                $scope.solution = data.solution;
                MyEditor.setData($scope.resumeInfoEditor, $scope.fbkInfo);
                MyEditor.setData($scope.solutionUpdtEditor, $scope.solution);
    });
    
    //提交保存方法
    $scope.savefbkInfo = function(){
        //取得反馈内容
//        $scope.insert.solution = $("#resumeInfo").html();
        $scope.insert.solution = MyEditor.getHtmlVal($scope.solutionUpdtEditor);
        //提交保存方法
        comApi.post("FbkInfo/updateFbkInfo", {
            oid:$stateParams.oid,title:$scope.title,level:$scope.stf.dicNm,type:$scope.stf.dicNms,actionFlg:$scope.stf.dicNmz,solution:$scope.insert.solution
        }, function(data) {
            $scope.datas=[{}];
            toaster.pop('success', '',
                    '意见反馈处理成功', 3000,
                    'trustedHtml',function(){});
                $state.go("app.interactive.fbkInfoSelect");
            });    
    }
});
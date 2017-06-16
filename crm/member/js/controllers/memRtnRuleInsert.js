app.controller('memRtnRuleInsertCtrl', ['$scope', 'comApi','$state',function($scope,comApi,$state) {

    //获取所有回访事项
    $scope.allMembRtnRuleRtn  = comApi.getAllMembRtnRuleRtn(0);

    $scope.memRtnRuleInsert = {
        "gdsAndTskTmList": [
            {
                "gdsSpecList": [
                    /*{
                        "chnlNumList": [
                            ""
                        ],
                        "gdsSpecDtlNm": "",
                        "gdsSpecDtlNum": ""
                    }
*/
                ],
                "rtnTskTmList": [
                    {
                        "fbkTimes": '',
                        "rtnInterval": '',
                        "rtnItem": $scope.allMembRtnRuleRtn[0].text
                    }
                ]
            }
        ],
        "posNumList": [
        ],
        "rntRuleNm": "",
        "ruleEnableFlg": "D001"
    }

    //获取所有的职位信息
    $scope.jobPosAll = comApi.getSelectBoxJob(1);

    //初始化职位数据
    $scope.posNumListCopy = [{a:'POS0001'}];

    $scope.add1=function(){
        var obj = {a:'POS0001'};
        $scope.posNumListCopy.push(obj);
    }

    $scope.del1=function(idx){
        $scope.posNumListCopy.splice(idx,1);
    }

    //获取所有的职位信息
    $scope.jobPosAll = comApi.getSelectBoxJob(0);

    //获取所有回访事项
   // $scope.allMembRtnRuleRtn  = comApi.getAllMembRtnRuleRtn(0);

    $scope.add=function(){
        var obj = {
            "gdsSpecList": [
                /*{
                    "chnlNumList": [
                        ""
                    ],
                    "gdsSpecDtlNm": "",
                    "gdsSpecDtlNum": ""
                }*/
            ],
            "rtnTskTmList": [
                {
                    "fbkTimes": '',
                    "rtnInterval": '',
                    "rtnItem": $scope.allMembRtnRuleRtn[0].text
                }
            ]
        }
        $scope.memRtnRuleInsert.gdsAndTskTmList.push(obj);
    }

    $scope.del=function(idx){
        $scope.memRtnRuleInsert.gdsAndTskTmList.splice(idx,1);
    }

    //相关商品
    $scope.add2=function(rowlist){
        //var obj={a:'',b:''};
        var obj = {
            "chnlNumList": [
                ""
            ],
            "gdsSpecDtlNm": "",
            "gdsSpecDtlNum": ""
        };
        rowlist.push(obj);
    }

    $scope.dell2=function(rowlist, idx){
        rowlist.splice(idx,1);
    }

    //回访详情
    $scope.add3=function(infor){
        var obj={
            "fbkTimes": '',
            "rtnInterval": '',
            "rtnItem": ""
        };
        infor.push(obj);
    }

    $scope.testTxt = '是否使用咨询';

    $scope.dell=function(infor, idx){
        infor.splice(idx,1);
    }

    $scope.memRtnRuleInsertSub = function() {
        var obj = [];
        for (var j=0;j<$scope.posNumListCopy.length; j++) {
            obj[j] = $scope.posNumListCopy[j].a;
        }
        $scope.membRtnRuleInsertCopy = angular.copy($scope.memRtnRuleInsert);
        $scope.membRtnRuleInsertCopy.posNumList = obj;

        comApi.post('membRtnRule/insertMembRtnRule', $scope.membRtnRuleInsertCopy, function (data) {
        	comApi.successMessage('msg.member.10014');
            setTimeout(function() {
                $state.go('app.member.memRtnRule');
            },1000);
        })
    }

    $scope.add2=function(rowlist){
        var obj = {
            "chnlNumList": [
                ""
            ],
            "gdsSpecDtlNm": "",
            "gdsSpecDtlNum": ""
        };
        rowlist.push(obj);
    }
    //选择商品模态窗口
    $scope.openGdsMultiSelec= function(size, gdsSpecLs){
        comApi.openGdsMultiSelect(size, 1, function(selectedItem) {
            //获取选择的商品
            if(selectedItem && selectedItem.length > 0) {
                for(var i = 0; i < selectedItem.length; i++){
                    //定义添加的对象  //gdsSpecDtlChnlVoList
                    var obj = {
                        "chnlNumList": [
                            ''
                        ],
                        "gdsSpecDtlNm": selectedItem[i].gdsSpecDtlNm,
                        "gdsSpecDtlNum": selectedItem[i].gdsSpecDtlNum
                    };
                    gdsSpecLs.push(obj);
                }

            }
        });
    }

}]);
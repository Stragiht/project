app.controller('memInsertCtrl', ['$scope', 'NgTableParams', 'comApi', '$filter', '$stateParams', '$state', '$modal', 'fileUploadApi',
    function ($scope, NgTableParams, comApi, $filter, $stateParams, $state, $modal, fileUploadApi) {
        $scope.oneAtATime = true;
        $scope.status = {
            jbxxopen: true,
            //bankopen:true,
            skinopen: true
        };

        //新增会员传递的参数
        $scope.membInsert = {
            addrDtl:'',
            bindWctAcct:'',
            birtyday:'',
            crtdStfNum:'',
            email:'',
            grpId:'',
            locCity:'',
            locPref:'',
            locProv:'',
            membFigure:fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.MEM_THUM),
            membNm:'',
            membSkinCareNeed: {
                C025:'',
                C026:'',
                C027:'',
                C028:''
            }
            ,
            phone:'',
            provChnl:'',
            registTm:'',
            remark:'',
            sex:''
        };
        //默认性别显示女
        $scope.membInsert.sex = '2';



        $scope.insert = {};

        // 所在地区-省
        $scope.homeAddrProv = comApi.getSelectBoxPCV("1", "3", true);  //homeAddrProv
        // 所在地区-市
        $scope.selectAddrCity = function() {
            $scope.locCity = comApi.getSelectBoxPCV(
                $scope.membInsert.locProv, "4", true);
            $scope.locPref = [];
            $scope.membInsert.locCity=$scope.locCity[0].key;
            $scope.locPref = comApi.getSelectBoxPCV(
                $scope.membInsert.locCity, "5");
            //默认选中第一个县
            $scope.membInsert.locPref=$scope.locPref[0].key;
        };
        // 所在地区-区/县
        $scope.selectAddrPref = function() {
            $scope.locPref = comApi.getSelectBoxPCV(
                $scope.membInsert.locCity, "5");
            //默认选中第一个县
            $scope.membInsert.locPref=$scope.locPref[0].key;

        };

        // 下拉菜单_来源渠道
        $scope.channels = comApi.getChnlList('IFCOMW0210001', 0);//0
        //下拉菜单_会员组别、
        $scope.membGrps = comApi.stoMembGrp(0);//0

        //肌肤类型
        $scope.skinTypes = comApi.getSelectSkin("C025",1);

        //肌肤问题
        $scope.skinProbs = comApi.getSelectSkin("C026",0);

        //护肤品需求
        $scope.skinDemands  = comApi.getSelectSkin("C027",0);

        //日常护肤需求
        $scope.skinDailyDemands = comApi.getSelectSkin("C028",0);

        //默认显示第一个渠道
        $scope.membInsert.provChnl = $scope.channels[0].key;
        //默认显示第一个组别
        $scope.membInsert.grpId = $scope.membGrps[0].key;
        //默认显示第一种肌肤类型
        $scope.membInsert.membSkinCareNeed.C025 = $scope.skinTypes[0].key;

        ///下拉框所属省
        $scope.locProv = comApi.getSelectBoxPCV("1", "3", true); //0
        // console.log("所有省份=="+angular.toJson($scope.locProv))
        //默认显示第一个省======
        //$scope.insert.locProv=$scope.locProv[0].key;
        $scope.membInsert.locProv=$scope.locProv[0].key;
        //console.log("所有ee省份=="+angular.toJson($scope.membInsert))
        //下拉框所属市
        $scope.locCity = comApi.getSelectBoxPCV($scope.locProv[0].key, "4", true); //0
        //默认显示第一个市======
        // $scope.insert.locCity=$scope.locCity[0].key;  //locPref
        $scope.membInsert.locCity=$scope.locCity[0].key;

        //下拉框所属县
        $scope.locPref = comApi.getSelectBoxPCV($scope.locCity[0].key, "5"); //0
        //默认显示第一个市======
        // $scope.insert.locCity=$scope.locCity[0].key;  //locPref
        $scope.membInsert.locPref=$scope.locPref[0].key;

        //省改变事件
        $scope.selectc = function() {
            $scope.locCity = comApi.getSelectBoxPCV(
                $scope.insert.locProv, "6");
        };

        //提交保存
        $scope.insertMem = function(){
            //数据备份
            $scope.membInsertCopy = angular.copy($scope.membInsert);
            //$scope.membInsertCopy.membFigure = $scope.membInsertCopy.membFigure == '' ? null : $scope.membInsertCopy.membFigure;
            $scope.membInsertCopy.membFigure = fileUploadApi.getUploadSuccFileUrl($scope.membInsertCopy.membFigure);
            $scope.membInsertCopy.registTm = timeToTimestamp(angularDateFor($scope.membInsertCopy.registTm));  //1451577600000
            $scope.membInsertCopy.birtyday = timeToTimestamp(angularDateFor($scope.membInsertCopy.birtyday));  //1451577600000
            $scope.membInsertCopy.membSkinCareNeed.C026 = $scope.selectedSkinProb.join(',');
            $scope.membInsertCopy.membSkinCareNeed.C027 = $scope.selectedSkinDem.join(',');
            $scope.membInsertCopy.membSkinCareNeed.C028 = $scope.selectedSkinDaily.join(',');
            comApi.post('membBas/insertMembBas', $scope.membInsertCopy, function(data){
                //消息提示
                comApi.successMessage('msg.member.10009');
                setTimeout(function() {
                    $state.go('app.member.memBas');
                },1000);
            })

        }

        //日期转换成时间戳
        function timeToTimestamp(dateStr) {
            if (dateStr == null || dateStr == '' || dateStr == undefined) {
                return '';
            } else {
                //只能识别xxxx/02/01这种形式
                var date = dateStr.replace(/-/g,'/');
                return new Date(date).getTime();
            }
        }

        //angular中日期格式化
        function angularDateFor(date){
            return $filter('date')(date,'yyyy-MM-dd');
        }

        //选择事件
        //$scope.changeChannel = function(index){  //channels  $scope.channels
        //    console.log($scope.insert.channel);
        //};

        //直属主管弹窗
        $scope.openStaff = function (size) {
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
                //给text窗口赋显示格式的值
                if(selectedItem && selectedItem.length > 0){
                    $scope.membInsert.crtdStfNumNm = selectedItem[0].stfNum + "." + selectedItem[0].stfNm;
                    $scope.membInsert.crtdStfNum = selectedItem[0].stfNum;
                }else{
                    $scope.membInsert.crtdStfNumNm = null;
                    $scope.membInsert.crtdStfNum = null;
                }
            });
        };


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
        }
    }]);
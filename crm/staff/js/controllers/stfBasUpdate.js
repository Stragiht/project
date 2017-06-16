/**
 * 此方法是人员基本信息插入的方法
 * by 江风成 2016-4-14
 */
app.controller('stfBasUpdate', ['$scope', 'NgTableParams', 'Upload', 'comApi', '$filter', 'toaster', '$stateParams', '$state', '$modal', 'fileUploadApi',
    function ($scope, NgTableParams, Upload, comApi, $filter, toaster, $stateParams, $state, $modal, fileUploadApi) {
        $scope.oneAtATime = true;
        //初始化手風琴展開效果
        $scope.status = {
            jbxxopen: true,
            gwzzxxopen: true,
            gzkxxopen: true,
            zjdzsmxxopen: true,
            grjlxxopen: true,
            ldhtxxopen: true,
            ssmdopen: true,
            sbxxopen: true,
            gjjxxopen: true,
            zhxxopen: true
        };
        //初始化变量
        $scope.updateStfBas = {};
        var bnkCardPic = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.BNK_THUM);
        var idCardPosPic = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.IDC_THUM);
        var idCardOppPic = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.IDC_THUM);
        var healthCertPic = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.IDC_THUM);
        var resumeFileNm = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.ATT_THUM);

        // 上传文件标志
        $scope.uploadFlag = fileUploadApi.uploadFlag;

        //工作经验校验提示消息
        $scope.workExpMsg = comApi.getMessageStr("msg.staff.10002");

        $scope.submit = {};
        $scope.submit.flag = false;
        $scope.iiij = 0;
        //定义变量判断是否显示所属门店
        $scope.marknum = "1";
        //婚姻状况/*lg*/
        $scope.maritalStatuss = comApi.getSelectBoxDic("C049", 1);
        //学历下拉框
        $scope.degree = comApi.getSelectBoxDic("C009", "1");
        //银行卡下拉框
        $scope.bnkCardBnkNm = comApi.getSelectBoxDic("C010", "1");
        //劳动合同类型类型下拉框
        $scope.laborContractType = comApi.getSelectBoxDic("C011", "1");

        //社保卡省下拉框
        $scope.ssPruProv = comApi.getSelectBoxPCV("1", "1");

        //下拉框社保卡发放状态
        $scope.ssCardStat = comApi.getSelectBoxDic("C012", "1");

        //下拉框公积金卡发放状态
        $scope.accumFundCardStat = comApi.getSelectBoxDic("C012", "1");

        //公积金省下拉框
        $scope.accumFundProv = comApi.getSelectBoxPCV("1", "1");

        //下拉框部门
        $scope.departments = comApi.getSelectBoxDepartment(0);

        //所在城市---省
        $scope.locProv = comApi.getSelectBoxPCV("1", 0);

        // 下拉框职位
        $scope.jobs = comApi.getSelectBoxJob(0);

        //富文本框（个人简历信息）
        $scope.resumeInfoUpdEditor = null;

        comApi.get(
            "/staff/getStfBasInfo/" + $stateParams.stfNum,
            function (data) {

                var resumeInfo = "";
                $scope.resumeInfoUpdEditor = MyEditor.createEditor("resumeInfoUpd", {"height": "340px"});
                $scope.updateStfBas = data;

                /*if( typeof ($scope.updateStfBas.dtOfBirth+0) != "number"){
                 $scope.updateStfBas.dtOfBirth = $scope.updateStfBas.dtOfBirth.getTime();
                 }*/

                resumeInfo = data.resumeInfo;
                MyEditor.setData($scope.resumeInfoUpdEditor, resumeInfo);

//						$scope.updateStfBas.filefuj = data.resumeFileNm;
                $scope.updateStfBas.sysPw = null;
                $scope.posGrdNum = comApi.getSelectBoxPosLvl($scope.updateStfBas.posNum, 1);
                $scope.curPoslvl = comApi.getSelectBoxPosLvl($scope.updateStfBas.posNum, 0);
                $scope.upldFileNm = "";
                if ($scope.posGrdNum.length == "1") {
                    $scope.posGrdNums = false;
                } else {
                    $scope.posGrdNums = true;
                    $scope.updateStfBas.posGrdNum = data.posGrdNum;
                }

                //性别
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.sex)) {
                    $scope.updateStfBas.sex = "2";
                }

                //所在城市--->省
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.locProv)) {
                    $scope.updateStfBas.locProv = $scope.locProv[0].key;
                }

                $scope.locCity = comApi.getSelectBoxPCV($scope.updateStfBas.locProv, 0);

                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.locCity)) {
                    $scope.updateStfBas.locCity = $scope.locCity[0].key;
                }

                // 籍贯--省
                $scope.homeAddrProv = comApi.getSelectBoxPCV("1", "1");

                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.homeAddrProv)) {
                    $scope.updateStfBas.homeAddrProv = $scope.homeAddrProv[0].key;
                }

                $scope.homeAddrCity = comApi.getSelectBoxPCV($scope.updateStfBas.homeAddrProv, "1");

                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.homeAddrCity)) {
                    $scope.updateStfBas.homeAddrCity = $scope.homeAddrCity[0].key;
                }

                /*$scope.homeAddrProv = comApi.getSelectBoxPCV("1", "1");
                $scope.locCity = comApi.getSelectBoxPCV($scope.updateStfBas.locProv, 0);
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.homeAddrCity)) {
                    $scope.updateStfBas.homeAddrCity = $scope.locCity[0].key;
                }
                $scope.homeAddrCity = comApi.getSelectBoxPCV($scope.updateStfBas.homeAddrProv, "1");
*/

                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.homeAddrProv)) {
                    $scope.updateStfBas.homeAddrProv = $scope.homeAddrProv[0].key;
                    $scope.updateStfBas.homeAddrCity = $scope.homeAddrCity[0].key;
                }

                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.maritalStatus)) {
                    $scope.updateStfBas.maritalStatus = $scope.maritalStatuss[0].key;
                }


                //学历
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.degree)) {
                    $scope.updateStfBas.degree = $scope.degree[0].key;
                }

                //部门
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.subDep)) {
                    $scope.updateStfBas.subDep = $scope.departments[0].key;
                }

                //职位
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.posNum)) {
                    $scope.updateStfBas.posNum = $scope.jobs[0].key;
                }

                //银行卡名称
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.bnkCardBnkNm)) {
                    $scope.updateStfBas.bnkCardBnkNm = $scope.bnkCardBnkNm[0].key;
                }

                //劳动合同
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.laborContractType)) {
                    $scope.updateStfBas.laborContractType = $scope.laborContractType[0].key;
                }

                //社保购买地-->省
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.ssPruProv)) {
                    $scope.updateStfBas.ssPruProv = $scope.ssPruProv[0].key;
                }
                //------------->市
                $scope.ssPruCity = comApi.getSelectBoxPCV(
                    $scope.updateStfBas.ssPruProv, "1");
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.ssPruCity)) {
                    $scope.updateStfBas.ssPruCity = $scope.ssPruCity[0].key;

                }

                //社保卡发放状态
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.ssCardStat)) {
                    $scope.updateStfBas.ssCardStat = $scope.ssCardStat[0].key;
                }

                //公积金购买地-->省
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.accumFundProv)) {
                    $scope.updateStfBas.accumFundProv = $scope.accumFundProv[0].key;
                }
                //------------->市
                $scope.accumFundCity = comApi.getSelectBoxPCV($scope.updateStfBas.accumFundProv, "1");
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.accumFundCity)) {
                    $scope.updateStfBas.accumFundCity = $scope.accumFundCity[0].key;
                }

                //公积金发放状态
                if (!comApi.isNotNullAndUndefined($scope.updateStfBas.accumFundCardStat)) {
                    $scope.updateStfBas.accumFundCardStat = $scope.accumFundCardStat[0].key;
                }

                //$scope.homeAddrPref = comApi.getSelectBoxPCV($scope.updateStfBas.homeAddrCity, "1");
                // 设置身份证图片路径
                var figure = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.MEM_THUM);
                if ($scope.updateStfBas.figure != null && $scope.updateStfBas.figure != '') {
                    $scope.updateStfBas.beforeFigure = $scope.updateStfBas.figure;
                    fileUploadApi.insertUploadSuccFile(figure, $scope.updateStfBas.figure);
                    $scope.$broadcast("myCroppedImage", figure.fileArray[0].basePath + angular.copy($scope.updateStfBas.figure));
                }
                $scope.updateStfBas.figure = figure;
                if ($scope.updateStfBas.bnkCardPic != null && $scope.updateStfBas.bnkCardPic != '') {
                    fileUploadApi.insertUploadSuccFile(bnkCardPic, $scope.updateStfBas.bnkCardPic);
                }
                $scope.updateStfBas.bnkCardPic = bnkCardPic;

                if ($scope.updateStfBas.idCardPosPic != null && $scope.updateStfBas.idCardPosPic != '') {
                    fileUploadApi.insertUploadSuccFile(idCardPosPic, $scope.updateStfBas.idCardPosPic);
                }
                $scope.updateStfBas.idCardPosPic = idCardPosPic;

                if ($scope.updateStfBas.idCardOppPic != null && $scope.updateStfBas.idCardOppPic != '') {
                    fileUploadApi.insertUploadSuccFile(idCardOppPic, $scope.updateStfBas.idCardOppPic);
                }
                $scope.updateStfBas.idCardOppPic = idCardOppPic;

                if ($scope.updateStfBas.healthCertPic != null && $scope.updateStfBas.healthCertPic != '') {
                    fileUploadApi.insertUploadSuccFile(healthCertPic, $scope.updateStfBas.healthCertPic);
                }
                $scope.updateStfBas.healthCertPic = healthCertPic;

                if ($scope.updateStfBas.resumeFileNm != null && $scope.updateStfBas.resumeFileNm != '') {
                    $scope.requestData = {"genFileNm": $scope.updateStfBas.resumeFileNm};
                    comApi.getUpldFileNm($scope.requestData, function (upldFileNm) {
                        $scope.upldFileNm = upldFileNm
                    });
                    fileUploadApi.insertUploadSuccFile(resumeFileNm, $scope.updateStfBas.resumeFileNm);
                }
                $scope.updateStfBas.resumeFileNm = resumeFileNm;
                //判断是否是主管
                if ($scope.updateStfBas.hasDirSupFlg == "1") {
                    //等于true的时候是主管
                    $scope.updateStfBas.hasDirSupFlg = "true";
                } else {
                    //不是主管
                    $scope.updateStfBas.hasDirSupFlg = "false";
                }
                //时间处理
                //出生日期
                $scope.updateStfBas.dtOfBirth = $filter("date")($scope.updateStfBas.dtOfBirth, 'yyyy-MM-dd');
                //入职时间
                $scope.updateStfBas.stfEntDt = $filter("date")($scope.updateStfBas.stfEntDt, 'yyyy-MM-dd');
                //转正时间
                $scope.updateStfBas.regularStfDt = $filter("date")($scope.updateStfBas.regularStfDt, 'yyyy-MM-dd');
                //离职时间
                $scope.updateStfBas.dimiDt = $filter("date")($scope.updateStfBas.dimiDt, 'yyyy-MM-dd');
                //签订劳动合同起始时间
                $scope.updateStfBas.laborConrtactStartTm = $filter("date")($scope.updateStfBas.laborConrtactStartTm, 'yyyy-MM-dd');
                //劳动合同终止时间
                $scope.updateStfBas.laborContractEndTm = $filter("date")($scope.updateStfBas.laborContractEndTm, 'yyyy-MM-dd');
                //购买日期
                $scope.updateStfBas.ssPruDt = $filter("date")($scope.updateStfBas.ssPruDt, 'yyyy-MM-dd');
                //停止购买日期
                $scope.updateStfBas.stopSSDt = $filter("date")($scope.updateStfBas.stopSSDt, 'yyyy-MM-dd');
                //购买日期
                $scope.updateStfBas.accumFundDt = $filter("date")($scope.updateStfBas.accumFundDt, 'yyyy-MM-dd');
                //停止购买日期
                $scope.updateStfBas.stopBuyDt = $filter("date")($scope.updateStfBas.stopBuyDt, 'yyyy-MM-dd');
                $scope.posGrdNum = comApi.getSelectBoxPosLvl($scope.updateStfBas.posNum, 1);
                $scope.posgd = function (posNum) {
                    /*$scope.posGrdNum = comApi.getSelectBoxPosLvl($scope.updateStfBas.posNum,1);
                     if($scope.posGrdNum.length=="1"){
                     $scope.posGrdNums=false;
                     }else{
                     $scope.posGrdNums=true;
                     $scope.updateStfBas.posGrdNum=$scope.posGrdNum[0].key;
                     }*/
                    comApi.get("/staff/stfbasmaknum/" + posNum, function (data) {
                        $scope.marknum = data == true ? "0" : "1";
                    });
                };

                //社保卡市下拉框
                //$scope.ssPruCity = comApi.getSelectBoxPCV($scope.updateStfBas.ssPruProv, "0");
                //公积金
                //$scope.accumFundCity = comApi.getSelectBoxPCV($scope.updateStfBas.accumFundProv, "0");

                $scope.updateStfBasCopy = angular.copy($scope.updateStfBas);
                $scope.updateStfBasCopy.figure = "";
                $scope.updateStfBasCopy.bnkCardPic = "";
                $scope.updateStfBasCopy.idCardPosPic = "";
                $scope.updateStfBasCopy.idCardOppPic = "";
                $scope.updateStfBasCopy.healthCertPic = "";
                $scope.updateStfBasCopy.resumeFileNm = "";
                comApi.post("/staff/getSelectStoreList", $scope.updateStfBasCopy, function (data) {
                    $scope.updateStfBas.stfStrRel = data;

                    // ng-table的实现绑定
                    $scope.mdtableParams = new NgTableParams({
                        // 显示的第几页
                        page: 1,
                        // 一页显示多少条
                        count: 999999
                    }, {
                        // 把data数据集绑定前台
                        dataset: $scope.updateStfBas.stfStrRel,
                        // 可以点击的显示自己想要一页显示多少条
                        counts: [20, 50, 100, 200]
                    });

                    if ($scope.updateStfBas.stfStrRel.length == 0) {
                        $scope.submit.flag = true;
                    }
                });

                $scope.updateStfBasCopy = angular.copy($scope.updateStfBas);
                $scope.updateStfBasCopy.figure = "";
                $scope.updateStfBasCopy.bnkCardPic = "";
                $scope.updateStfBasCopy.idCardPosPic = "";
                $scope.updateStfBasCopy.idCardOppPic = "";
                $scope.updateStfBasCopy.healthCertPic = "";
                $scope.updateStfBasCopy.resumeFileNm = "";
                comApi.post("/staff/selectChnlInfo", $scope.updateStfBasCopy,
                    function (data) {
                        if (data[0] != null) {
                            $scope.chnlNm = data[0].chnlNm;
                        }
                    });

                // 获取是否是销售部
                comApi.get("/staff/stfbasmaknum/" + $scope.updateStfBas.posNum, function (data) {
                    $scope.marknum = data == true ? "0" : $scope.marknum;
                });

                $scope.status.supvrStfInfoDisabled = false;
                $scope.supvrStfPosNum = "";
                $scope.supvrStfList = {};
                if (data.supvrStfNum != null && data.supvrStfNum != undefined && data.supvrStfNum != "") {
                    comApi.get("/staff/getSupvrStfInfo/" + data.supvrStfNum,
                        function (data) {
                            if (data.supvrStfPosNum != "") {
                                $scope.status.supvrStfInfoDisabled = true;
                                $scope.supvrStfPosNum = data.supvrStfPosNum;
                                $scope.supvrStfList = data.supvrStfList;
                            }
                        });
                    comApi.get("/staff/getStfBasInfo/" + data.supvrStfNum, function (data) {
                        if (data != null) {
                            $scope.updateStfBas.supvrStfNums = data.stfNum + "." + data.stfNm;
                        }
                    });
                }


            });
        comApi.get("/staff/getStfBasHistory/"
            + $stateParams.stfNum, function (data) {
            // ng-table的实现绑定
            $scope.tableParams = new NgTableParams({
                // 显示的第几页
                page: 1,
                // 一页显示多少条
                count: 20
            }, {
                // 把data数据集绑定前台
                dataset: data,
                // 可以点击的显示自己想要一页显示多少条
                counts: [20, 50, 100, 200]
            });
        });


        $scope.isSubmit = false;
        //初始化默认等级显示
        $scope.posGrdNums = true;
        //直属主管弹窗
        $scope.openStaff = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'radiostaff.html',
                controller: 'radioStaffController',
                size: size,
                resolve: {
                    //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                    flag: function () {
                        return $scope.updateStfBas.stfNum;
                    },

                    //配置需要注入JS
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);
                    }]
                }

            });

            //父子传递参数
            modalInstance.result.then(function (selectedItem) {

                if (selectedItem.length > 0) {
                    if ($scope.updateStfBas.stfNum == selectedItem[0].stfNum) {
                        comApi.HintMessage("error", "", "msg.common.00046", 0, "");
                        return;
                    }
                    //给text窗口赋显示格式的值
                    $scope.updateStfBas.supvrStfNums = selectedItem[0].stfNum + "." + selectedItem[0].stfNm;
                    //向变量中赋主管的编号
                    $scope.updateStfBas.supvrStfNum = selectedItem[0].stfNum;
                    //查询是否是主管的信息
                    comApi.get("/staff/getSupvrStfInfo/" + selectedItem[0].stfNum,
                        function (data) {
                            if (data.supvrStfPosNum != "") {
                                $scope.status.supvrStfInfoDisabled = true;
                                $scope.supvrStfPosNum = data.supvrStfPosNum;
                                $scope.supvrStfList = data.supvrStfList;
                            } else {
                                $scope.status.supvrStfInfoDisabled = false;
                                $scope.supvrStfPosNum = "";
                                $scope.supvrStfList = {};
                            }
                        });
                } else {
                    $scope.updateStfBas.supvrStfNums = null;
                    $scope.updateStfBas.supvrStfNum = "";
                    $scope.status.supvrStfInfoDisabled = false;
                    $scope.supvrStfPosNum = "";
                    $scope.supvrStfList = {};
                }
            });
        };
        // 所属门店浏览
        $scope.openDep = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'multiselectstore.html',
                controller: 'multiSelectStoreController',
                size: size,
                resolve: {
                    // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                    flag: function () {
                        return 1;
                    },
                    // 配置需要注入JS
                    deps: [
                        '$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad
                                .load(['common/js/controllers/multiselectstore.js']);
                        }]
                }
            });
            // 父子传递参数
            modalInstance.result.then(function (selectedItem) {
                $scope.submit.flag = false;
                $scope.updateStfBas.stfStrRel = $scope.unique($scope.updateStfBas.stfStrRel.concat(selectedItem));
                //接收传过来的门店参数放入变量中
                $scope.mdtableParams = new NgTableParams(
                    {	// 显示的第几页
                        page: 1,
                        // 一页显示多少条
                        count: 999999
                    }, {
                        // 把data数据集绑定前台
                        dataset: $scope.updateStfBas.stfStrRel,
                        // 可以点击的显示自己想要一页显示多少条
                        counts: [20,
                            50,
                            100,
                            200]
                    });
            });
        };
        $scope.unique = function (data) {
            var a = data;
            var b = data;
            for (var i = 0; i < a.length; i++) {
                var num = 0;
                for (var j = 0; j < b.length; j++)
                    if (a[i].strNum == b[j].strNum) {
                        num++;
                        if (num == 2) {
                            data.splice(j, 1);
                        }
                    }
            }
            return data;
        };

        //根据职位获取职位等级/*lg*/
        $scope.getPosLvls = function (posNum) {
            $scope.curPoslvl = comApi.getSelectBoxPosLvl(posNum, 0);
            //职位等级默认选中第一个
            if (comApi.isNotEmptyObject($scope.curPoslvl)) {
                $scope.updateStfBas.posGrdNum = $scope.curPoslvl[0].key;
            }

            $scope.posgd(posNum);
        };


        //下拉框部门
        //$scope.departments = comApi.getSelectBoxDepartment(0);
        //默认显示部门第一个
        //$scope.updateStfBas.subDep = $scope.departments[0].key;
        //默认显示职位第一个
        //$scope.updateStfBas.posNum = $scope.jobs[0].key;
        //初始化默认选中性别
        //$scope.updateStfBas.sex = "2";
        //下拉框所属省
        //$scope.locProv = comApi.getSelectBoxPCV("1", 0);
        //默认显示第一个省
        //$scope.updateStfBas.locProv = $scope.locProv[0].key;
        //省改变事件
        $scope.selectc = function () {
            $scope.locCity = comApi.getSelectBoxPCV($scope.updateStfBas.locProv, 0);
            $scope.updateStfBas.locCity = $scope.locCity[0].key;
        };
        //$scope.selectc();

        //在岗状态下拉框
        $scope.workStat = comApi.getSelectBoxDic("C001", 0);
        //初始化默认显示在岗状态
        $scope.updateStfBas.workStat = $scope.workStat[0].key;
        //初始化是否计算工资
        $scope.updateStfBas.calcSalFlg = "1";
        //初始化是否启用账号
        $scope.updateStfBas.crtAcctFlg = "1";
        //显示部门
        $scope.updateStfBas.subDeps = $scope.updateStfBas.subDep;
        //显示职位
        $scope.updateStfBas.posNums = $scope.updateStfBas.posNum;

        //社保卡市下拉框
        $scope.selectgjj = function () {
            $scope.ssPruCity = comApi.getSelectBoxPCV(
                $scope.updateStfBas.ssPruProv, "1");
            $scope.updateStfBas.ssPruCity = $scope.ssPruCity[0].key;
        };

        //公积金市下拉框
        $scope.selectgmd = function () {
            $scope.accumFundCity = comApi.getSelectBoxPCV(
                $scope.updateStfBas.accumFundProv, "1");
            $scope.updateStfBas.accumFundCity = $scope.accumFundCity[0].key;
        };

        // 籍贯--市（联动）
        $scope.selectAddrCity = function () {
            $scope.homeAddrCity = comApi.getSelectBoxPCV(
                $scope.updateStfBas.homeAddrProv, "1");
            $scope.updateStfBas.homeAddrCity = $scope.homeAddrCity[0].key;
        };
        // 家庭住址县
        /*$scope.selectAddrPref = function() {
         $scope.homeAddrPref = comApi.getSelectBoxPCV(
         $scope.updateStfBas.homeAddrCity, "1");
         $scope.updateStfBas.homeAddrPref = $scope.homeAddrPref[0].key;
         }*/
        //银行卡图片上传回调路径
        $scope.$on("bnkCardPic", function (event, msg) {

            $scope.updateStfBas.bnkCardPic = msg;

        })
        //身份证正面图片上传回调路径
        $scope.$on("idCardPosPic", function (event, msg) {

            $scope.updateStfBas.idCardPosPic = msg;

        })
        //身份证反面图片上传回调路径
        $scope.$on("idCardOppPic", function (event, msg) {

            $scope.updateStfBas.idCardOppPic = msg;

        })
        //头像图片上传回调路径
        $scope.$on("figure", function (event, msg) {
            $scope.updateStfBas.figure = msg;

        })
        //健康证图片上传回调路径
        $scope.$on("healthCertPic", function (event, msg) {
            $scope.updateStfBas.healthCertPic = msg;

        })
        //附件上传回调路径
        $scope.$on("resumeFileNm", function (event, msg) {
            $scope.updateStfBas.resumeFileNm = msg;
        })
        $scope.delect = function (id) {

            $scope.updateStfBas.stfStrRel.splice(id, 1);
            // ng-table的实现绑定
            $scope.mdtableParams = new NgTableParams({
                // 显示的第几页
                page: 1,
                // 一页显示多少条
                count: 999999
            }, {
                // 把data数据集绑定前台
                dataset: $scope.updateStfBas.stfStrRel,
                // 可以点击的显示自己想要一页显示多少条
                counts: [20, 50, 100, 200]
            });
            if ($scope.updateStfBas.stfStrRel.length == 0) {
                $scope.submit.flag = true;
            }
        }

        /*
         * 插入人员信息
         */
        $scope.inserter = function () {
            if ($scope.posGrdNums == true) {
                if ($scope.updateStfBas.posGrdNum == '0000') {
                    comApi.HintMessage(["error", "职位等级"], "", "msg.common.00014", 0, "");
                    return;
                }
            }
            if ($scope.updateStfBas.hasDirSupFlg == "false") {
                $scope.updateStfBas.supvrStfNum = "";
            }

//			$scope.insertCopy =  angular.copy($scope.insert);
//			if($scope.insert.figure.fileArray[0].flag == $scope.uploadFlag.UPLOAD_SUCC || $scope.insert.figure.fileArray[0].flag == $scope.uploadFlag.UN_SEL){
//			  $scope.insertCopy.figure = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.figure);
//			}else{
//			  $scope.insertCopy.figure = $scope.insert.beforeFigure;
//			}
//			
//            $scope.insertCopy.bnkCardPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.bnkCardPic);
//            $scope.insertCopy.idCardPosPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.idCardPosPic);
//            $scope.insertCopy.idCardOppPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.idCardOppPic);
//            $scope.insertCopy.healthCertPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.healthCertPic);

            /*comApi.post("/staff/stfupdatebasrepeat",$scope.updateStfBasCopy, function(data) {
             if(data==0){*/
            //劳动合时间验证
            if ($scope.updateStfBas.laborContractEndTm != null && $scope.updateStfBas.laborContractEndTm != '' && $filter("date")($scope.updateStfBas.laborContractEndTm, 'yyyy-MM-dd') < $filter("date")($scope.updateStfBas.laborConrtactStartTm, 'yyyy-MM-dd')) {
                comApi.HintMessage(["error", "劳动合时间"], "", "msg.common.00012", 0, "");
                $scope.isSubmit = false;
                return;
                //社保时间验证
            } else if ($scope.updateStfBas.stopSSDt != null && $scope.updateStfBas.stopSSDt != '' && $filter("date")($scope.updateStfBas.stopSSDt, 'yyyy-MM-dd') < $filter("date")($scope.updateStfBas.ssPruDt, 'yyyy-MM-dd')) {
                comApi.HintMessage(["error", "社保时间"], "", "msg.common.00012", 0, "");
                $scope.isSubmit = false;
                return;
                //公积金时间验证
            } else if ($scope.updateStfBas.stopBuyDt != null && $scope.updateStfBas.stopBuyDt != '' && $filter("date")($scope.updateStfBas.stopBuyDt, 'yyyy-MM-dd') < $filter("date")($scope.updateStfBas.accumFundDt, 'yyyy-MM-dd')) {
                comApi.HintMessage(["error", "公积金时间"], "", "msg.common.00012", 0, "");
                $scope.isSubmit = false;
                return;
            }
            if ($scope.marknum == "0" && $scope.updateStfBas.stfStrRel == null) {
                $scope.isSubmit = false;
                $scope.ssmdno = true;
                return;
            }
            //$scope.updateStfBas.resumeInfo = $("#resumeInfo").html();
            $scope.updateStfBas.resumeInfo = MyEditor.getHtmlVal($scope.resumeInfoUpdEditor);
            //$scope.updateStfBas.resumeInfo = $("#word-display").html();
            $scope.updateStfBas.stfEntDt = $filter('date')(
                $scope.updateStfBas.stfEntDt, 'yyyy-MM-dd');
            $scope.updateStfBasCopy = angular.copy($scope.updateStfBas);
            if ($scope.updateStfBas.figure.fileArray[0].flag == $scope.uploadFlag.UPLOAD_SUCC || $scope.updateStfBas.figure.fileArray[0].flag == $scope.uploadFlag.UN_SEL) {
                $scope.updateStfBasCopy.figure = fileUploadApi.getUploadSuccFileUrl($scope.updateStfBasCopy.figure);
            } else {
                $scope.updateStfBasCopy.figure = $scope.updateStfBas.beforeFigure;
            }

            $scope.updateStfBasCopy.bnkCardPic = fileUploadApi.getUploadSuccFileUrl($scope.updateStfBasCopy.bnkCardPic);
            $scope.updateStfBasCopy.idCardPosPic = fileUploadApi.getUploadSuccFileUrl($scope.updateStfBasCopy.idCardPosPic);
            $scope.updateStfBasCopy.idCardOppPic = fileUploadApi.getUploadSuccFileUrl($scope.updateStfBasCopy.idCardOppPic);
            $scope.updateStfBasCopy.healthCertPic = fileUploadApi.getUploadSuccFileUrl($scope.updateStfBasCopy.healthCertPic);
            $scope.updateStfBasCopy.resumeFileNm = fileUploadApi.getUploadSuccFileUrl($scope.updateStfBasCopy.resumeFileNm);
            //判断是否是主管
            if ($scope.updateStfBasCopy.hasDirSupFlg == "true") {
                //等于true的时候是主管
                $scope.updateStfBasCopy.hasDirSupFlg = "1";
            } else {
                //不是主管
                $scope.updateStfBasCopy.hasDirSupFlg = "0"
            }

            if ($scope.marknum != 0) {
                delete $scope.updateStfBasCopy["stfStrRel"];
            }

            $scope.updateStfBasCopy.dtOfBirth = comApi.dateToTimeStamp($scope.updateStfBasCopy.dtOfBirth);
            $scope.updateStfBasCopy.stfEntDt = comApi.dateToTimeStamp($scope.updateStfBasCopy.stfEntDt);
            $scope.updateStfBasCopy.regularStfDt = comApi.dateToTimeStamp($scope.updateStfBasCopy.regularStfDt);
            $scope.updateStfBasCopy.dimiDt = comApi.dateToTimeStamp($scope.updateStfBasCopy.dimiDt);
            $scope.updateStfBasCopy.laborConrtactStartTm = comApi.dateToTimeStamp($scope.updateStfBasCopy.laborConrtactStartTm);
            $scope.updateStfBasCopy.laborContractEndTm = comApi.dateToTimeStamp($scope.updateStfBasCopy.laborContractEndTm);
            $scope.updateStfBasCopy.ssPruDt = comApi.dateToTimeStamp($scope.updateStfBasCopy.ssPruDt);
            $scope.updateStfBasCopy.stopSSDt = comApi.dateToTimeStamp($scope.updateStfBasCopy.stopSSDt);
            $scope.updateStfBasCopy.accumFundDt = comApi.dateToTimeStamp($scope.updateStfBasCopy.accumFundDt);
            $scope.updateStfBasCopy.stopBuyDt = comApi.dateToTimeStamp($scope.updateStfBasCopy.stopBuyDt);

            // 更新方法
            comApi.post("/staff/stfbasUpdate",
                $scope.updateStfBasCopy, function (data) {

                    comApi.searchUnReadMessage($scope);

                    if (data == 1) {
                        comApi.HintMessage(["success", "人员信息"], "", "msg.common.00023", 3000, "");
                        setTimeout(function () {
                            $state.go("app.staff.stfBas");
                        }, "1000");

                    } else {
                        $scope.isSubmit = true;
                        comApi.HintMessage(["error", "该人员信息"], "", "msg.common.00019", 0, "");
                    }
                });
            /*}else{
             comApi.HintMessage( ["error",$scope.updateStfBas.stfIdNum,$filter("stfBasPosNum")($scope.updateStfBas.posNum)], "","msg.common.00043",0, "");
             }
             });*/
        };
        $scope.ngchange = function (dateOfBirth) {
            var dateBirth = $filter("date")(dateOfBirth, 'yyyy-MM-dd');
            var date = $filter("date")(new Date(), 'yyyy-MM-dd');
            if (dateBirth != null) {
                if (dateBirth > date) {
                    comApi.HintMessage(["error", "出生日期", "当前系统时间"], "", "msg.common.00052", 0, "");
                    $scope.updateStfBas.dtOfBirth = "";
                    $scope.updateStfBas.ages = 0;
                } else {
                    $scope.updateStfBas.ages = $filter("date")(new Date(), 'yyyy') - $filter("date")(dateOfBirth, 'yyyy');
                }
            } else {
                $scope.updateStfBas.ages = 0;
            }
        }

        // 选择图片
        $scope.selectImg = function (evt, imgData) {
            fileUploadApi.selectFile(evt, imgData, fileUploadApi.checkImgFileFormat,
                fileUploadApi, $scope, comApi);
        };

        // 删除图片
        $scope.delImgItem = function (imgData, imgItem) {
            fileUploadApi.delFileItem(imgData, imgItem, $scope);
        };

        // 上传图片
        $scope.uploadImg = function (imgData) {
            fileUploadApi.uploadFile(imgData, fileUploadApi);
        };


        $scope.updateStfBas.healthCertPic = "";
        //选择附件
        $scope.selectFile = function (evt, fileData) {
            fileUploadApi.selectFile(evt, fileData, '', fileUploadApi, $scope, comApi);
        }
        //上传附件
        $scope.uploadFile = function (fileData) {
            fileUploadApi.uploadFile(fileData, fileUploadApi);
        }

//      $scope.handleFileSelect = function(evt) {		
//    	  evt.target.value = "";
//    	  angular.element(evt.target).unbind('change');
//    	  angular.element(evt.target).one('change', function (evt) {
//    		  $scope.resumeFileNms = "";
//    		  $scope.resumeFileNmd = "";
//    		  var file = evt.currentTarget.files[0];
//    		  if (file) {
//    			  $scope.filefuj = file;
//    			  $scope.updateStfBas.filefuj=file.name;
//    			  $scope.$apply();
//    		  }
//    	 });
//      };
//      
//      
//      $scope.fileup = function() {
//          if ($scope.filefuj) {
//              $scope.upload($scope.filefuj);
//          }
//      };

        // upload on file select or drop

//      $scope.upload = function(file) {
//          Upload.upload({
//              url : '/CrmWeb/api/upload/files',
//              data : {
//                  file : file,
//                  type : "attachment"
//              }
//          }).then(function(resp) {
//              $scope.resumeFileNms= "上传附件成功！";
//              $scope.$emit("resumeFileNm",resp.data.data[0]);
//              $scope.updateStfBas.resumeFileNm = resp.data.data[0];
//  
//          }, function(resp) {
//              $scope.resumeFileNmd = "上传附件失败！";
//          });
//      };

//      angular.element(document.querySelector('#filefuj')).on('change',handleFileSelect);
    }
]);

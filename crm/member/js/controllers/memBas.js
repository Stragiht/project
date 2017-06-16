
    app.controller('MemBasCtrl',['$scope','$http','NgTableParams','$element','comApi','$filter','$timeout', '$stateParams', '$sessionStorage', function($scope,$http,NgTableParams,element,comApi,$filter,$timeout,$stateParams,$sessionStorage){
        $scope.oneAtATime = true;
        $scope.status = {

            open: true
            //checkopen:true
        };

        var counts = comApi.getPageCounts();
        var pageNum = 1;
        var pageSize = counts[0];
        var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);

        //日期格式化
        Date.prototype.Format = function(fmt)
        { //author: meizz
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        };
        comApi.selectMemGrp(function(){
            $scope.allMembGrp = comApi.getMembGrp(2);
        });

        //根据画面id查询所有的来源渠道(本地查找)
        $scope.allChannel = comApi.getChnlList('IFCOMW0210001',2);

        //肌肤类型
        $scope.skinTypes = comApi.getSelectSkin("C025",2);

        //肌肤问题
        $scope.skinProbs = comApi.getSelectSkin("C026",2);

        //护肤品需求
        $scope.skinDemands  = comApi.getSelectSkin("C027",2);

        //日常护肤需求
        $scope.skinDailyDemands = comApi.getSelectSkin("C028",2);

        //定义查询会员列表传递的参数
        $scope.selectMembList = {
            "pageNum": '1',
            "pageSize": '',
            "params": {
                "C025": "",
                "C026": "",
                "C027": "",
                "C028": "",
                "crtdStfNm": "",
                "endTime": '',  //"endTime": '2016-01-01',
                "grpId": "",    //组别id
                "membNm": "",
                "membNum": "",
                "phone": "",
                "provChnl": "",  //渠道
                "startTime": ''  // "startTime": '2016-01-01'
            }
        }
        

        var self = this;

        //设置$scope.gydst的默认值为0
        $scope.gydst = 0;

        //定义样式数组
        $scope.memChannelStyle = [];
        $scope.memGrpStyle = [];
        $scope.memSkinTypeStyle = [];
        $scope.memSinProbStyle = [];
        $scope.memSkinDemandStyle = [];
        $scope.memSkinDaDemandStyle = [];

        if (isBack == true) {
            $scope.memChannelStyle = angular.copy($sessionStorage.memChannelStyleCopy);
            $scope.memGrpStyle = angular.copy($sessionStorage.memGrpStyleCopy);
            $scope.memSkinTypeStyle = angular.copy($sessionStorage.memSkinTypeStyleCopy);
            $scope.memSinProbStyle = angular.copy($sessionStorage.memSinProbStyleCopy);
            $scope.memSkinDemandStyle = angular.copy($sessionStorage.memSkinDemandStyleCopy);
            $scope.memSkinDaDemandStyle = angular.copy($sessionStorage.memSkinDaDemandStyleCopy);
        } else {
            //初始化
            $scope.memChannelStyle[0] = 'current';
            $scope.memGrpStyle[0] = 'current';
            $scope.memSkinTypeStyle[0] = 'current';
            $scope.memSinProbStyle[0] = 'current';
            $scope.memSkinDemandStyle[0] = 'current';
            $scope.memSkinDaDemandStyle[0] = 'current';
        }
        
        //搜索
        $scope.searchMemblist = function(value, flag, index){
            self.checkboxes = {
                checked : false,
                items : {}
            };
            angular.element(".select-all").prop("indeterminate",false);
            pageSize = $sessionStorage.selectMembListPageSizeCopy > 0 ? angular.copy($sessionStorage.selectMembListPageSizeCopy) : pageSize;//全局保存此页面设置的每页记录数
            if(isBack == true){
            	$scope.selectMembList = angular.copy($sessionStorage.selectMembListCopy);
            	$scope.gydst = angular.copy($sessionStorage.selectMembListDataLengthCopy);
            	$scope.list= angular.copy($sessionStorage.selectMembListDataCopy);
            	pageNum = $sessionStorage.selectMembListPageNumCopy > 0 ? angular.copy($sessionStorage.selectMembListPageNumCopy) : pageNum;
            	$scope.tableParams = getTableParams(pageNum, pageSize, $scope.list, counts);
            	isBack = false;
            }else{
            	pageNum = 1;
            	$scope.selectMembList.params.startTime = comApi.dateToTimeStamp($scope.selectMembList.params.startTime);  //1451577600000
            	$scope.selectMembList.params.endTime = comApi.dateToTimeStamp($scope.selectMembList.params.endTime); //1461945600000
            	membGrade(value, flag, index);
            	$sessionStorage.selectMembListCopy = angular.copy($scope.selectMembList);
	            comApi.post('membBas/selectMembBas', $scope.selectMembList, function(data){
	                data = data.data;
	                $scope.gydst=data.length;
	                $scope.list=data;
	                $scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
	                $sessionStorage.selectMembListDataLengthCopy = angular.copy($scope.gydst);
	                $sessionStorage.selectMembListDataCopy = angular.copy($scope.list);

                    //存储筛选的条件
                    $sessionStorage.memChannelStyleCopy = angular.copy($scope.memChannelStyle);
                    $sessionStorage.memGrpStyleCopy = angular.copy($scope.memGrpStyle);
                    $sessionStorage.memSkinTypeStyleCopy = angular.copy($scope.memSkinTypeStyle);
                    $sessionStorage.memSinProbStyleCopy = angular.copy($scope.memSinProbStyle);
                    $sessionStorage.memSkinDemandStyleCopy = angular.copy($scope.memSkinDemandStyle);
                    $sessionStorage.memSkinDaDemandStyleCopy = angular.copy($scope.memSkinDaDemandStyle);
                });
            }
        };

        
        function getTableParams(pageNum, pageSize, data, counts){
        	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            	pageNum = pageIndex;
    	        pageSize = pageCount;
    	        $sessionStorage.selectMembListPageNumCopy = angular.copy(pageIndex);
    	        $sessionStorage.selectMembListPageSizeCopy = angular.copy(pageCount);
            });
        	var tableParams = new NgTableParams(arr[0], arr[1]);
        	return tableParams;
        }
        
        
        if(isBack == true){
        	var url = window.location.href;
        	url = url.indexOf("?") == -1 ? url : url.substring(0, url.indexOf('?'));
        	window.history.pushState({}, "", url); 
        	$scope.searchMemblist();
        }
        
        self.checkboxes = {
            checked : false,
            items : {}
        };

        
        //根据时间戳计算年龄
        function getAge(timeStamp) {
        	if(!timeStamp || timeStamp == 0){
        		return;
        	}
            var now = new Date().getTime();
            var hours = (now - timeStamp)/1000/60/60;
            return  Math.floor(hours / (24 * 30 * 12));
        }
        
        
        //导出数据格式化方法
        $scope.formDCMeth = function(obj) {
            $scope.forD.a = obj.membNum;
            $scope.forD.b = obj.membNm;
            $scope.forD.c = obj.phone;
            $scope.forD.d = $filter("dicNameFilter")(obj.sex, "C003");
            $scope.forD.e = $filter('chnlInfoFilter')(obj.provChnl);
            $scope.forD.f = $filter('membGrpFilter')(obj.grpId);
            $scope.forD.g = obj.crtdStfNm;
            $scope.forD.h = $filter("date")(obj.registTm, "yyyy-MM-dd HH:mm:ss");
            $scope.forD.i = $filter("date")(obj.birtyday, "yyyy-MM-dd");
            $scope.forD.j = obj.email;
            $scope.forD.k = getAge(obj.birtyday);
            $scope.forD.l = obj.bindWctAcct;
            $scope.forD.m = $filter('stfBasPCV')(obj.locProv);
            $scope.forD.n = $filter('stfBasPCV')(obj.locCity);
            $scope.forD.o = $filter('stfBasPCV')(obj.locPref);
            $scope.forD.p = obj.addrDtl;
            $scope.forD.q = toSkinStr(obj.c025, "C025");
            $scope.forD.r = toSkinStr(obj.c026, "C026");
            $scope.forD.s = toSkinStr(obj.c027, "C027");
            $scope.forD.t = toSkinStr(obj.c028, "C028");
            $scope.forD.u = obj.remark;
            return $scope.forD;
        };
        
        
      //数据判断
        function valueJud(value) {
            if (value == undefined || value == '' || value == null) {
                value = [];
            }
            else {
                value = value.split(',');
            }
            return value;
        }
        
        function toSkinStr(value, code){
        	var arr = valueJud(value);
        	var result = "";
        	var isAppend = false;
        	for(var i = 0; i < arr.length; i++){
        		var str = $filter("dicNameFilter")(arr[i], code);
        		if(str && str != ""){
        			if(isAppend){
        				result += ",";
        			}else{
        				isAppend = true;
        			}
        			result += str;
        		}
        	}
        	return result;
        }

        //当前日期
        var currentDate = new Date().Format("yyyyMMdd");

        // 导出方法
        $scope.outPutMemb = function () {
        	var isEmptySelect = true;
            $scope.outMemb = [{
                "a": "会员编号",
                "b": "姓名",
                "c": "联系电话",
                "d": "性别",
                "e": "来源渠道",
                "f": "会员组别",
                "g": "创建人员",
                "h": "加入时间",
                "i": "出生日期",
                "j": "电子邮件",
                "k": "年龄",
                "l": "微信账号",
                "m": "所在省份",
                "n": "所在城市",
                "o": "所在区域",
                "p": "详细地址",
                "q": "肌肤类型",
                "r": "肌肤问题",
                "s": "护肤品需求",
                "t": "日常护肤需求",
                "u": "备注"
            }];

            var stnum = "";

            angular.forEach($scope.list, function (item) {
                if (self.checkboxes.items[item.membNum] == true) {
                	isEmptySelect = false;
                    $scope.forD = {
                        "a": "",
                        "b": "",
                        "c": "",
                        "d": "",
                        "e": "",
                        "f": "",
                        "g": "",
                        "h": "",
                        "i": "",
                        "j": "",
                        "k": "",
                        "l": "",
                        "m": "",
                        "n": "",
                        "o": "",
                        "p": "",
                        "q": "",
                        "r": "",
                        "s": "",
                        "t": "",
                        "u": ""
                    }
                    $scope.outMemb.push($scope.formDCMeth(item));
                    stnum += '"'
                        + item.membNum
                        + '"' + ",";
                }
            });

            if(isEmptySelect){
            	comApi.HintMessage("error", "错误", "msg.member.10001", 0, "");
        		return;
        	}
            $scope.filename = "会员信息_" + currentDate + ".csv";

            $scope.getArray = $scope.outMemb;
            $timeout(
                function () {
                    angular
                        .element(
                        document
                            .querySelector('#outMembs'))
                        .triggerHandler(
                        'click');
                }, 1000);
        };

        // 点击全选 的事件
        $scope.checkAll = function() {
            // angular 循环的方法
            angular
                .forEach(
                $scope.list,
                function(item) {
                    self.checkboxes.items[item.membNum] = self.checkboxes.checked;
                });
        };

        // 單選 的事件
        $scope.checkItem = function() {
            var checked = 0, unchecked = 0, total = $scope.gydst;
            angular
                .forEach(
                $scope.list,
                function(item) {
                    checked += (self.checkboxes.items[item.membNum]) || 0;
                    unchecked += (!self.checkboxes.items[item.membNum]) || 0;
                });

            if ((unchecked == 0) || (checked == 0)) {
                self.checkboxes.checked = (checked == total);
            }
            /*if (unchecked > 0) {
                self.checkboxes.checked = false;
            }*/

            angular.element(".select-all").prop(
                "indeterminate",
                (checked != 0 && unchecked != 0));
        };

        //标号
        function membGrade(value, flag, index) {
            if (flag == 1) {
                $scope.memChannelStyle = [];
                $scope.memChannelStyle[index] = 'current';
                $scope.selectMembList.params.provChnl = value;//"来源渠道"
            } else if(flag == 2){
                $scope.memGrpStyle = [];
                $scope.memGrpStyle[index] = 'current';
                $scope.selectMembList.params.grpId = value;//"会员组别"
            } else if(flag == 3)
            {
                $scope.memSkinTypeStyle = [];
                $scope.memSkinTypeStyle[index] = 'current';
                $scope.selectMembList.params.C025 = value;//"肌肤类型"
            } else if(flag == 4) {
                $scope.memSinProbStyle = [];
                $scope.memSinProbStyle[index] = 'current';
                $scope.selectMembList.params.C026 = value;// "肌肤问题"
            } else if(flag == 5) {
                $scope.memSkinDemandStyle = [];
                $scope.memSkinDemandStyle[index] = 'current';
                $scope.selectMembList.params.C027 = value;// "护肤品需求"
            } else if(flag == 6) {
                $scope.memSkinDaDemandStyle = [];
                $scope.memSkinDaDemandStyle[index] = 'current';
                $scope.selectMembList.params.C028 = value;//"日常护肤需求"
            }
        }

    }]);

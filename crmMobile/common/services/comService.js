
/**
 * Created by 张玉良 on 2016-3-27.
 */
'use strict';
/**
 * 共通用service
 */
app.service("comApi", function ($http, $sessionStorage, $ionicPopup, $q, $ionicLoading, $filter, $rootScope, userPowerFactory) {
    //定义每页的数据size
    $rootScope.PAGE_SIZE = 15;
    //页面的初始值
    $rootScope.PAGE_NUM = 0;

    //定义新增会员页面跳转的标志
    $rootScope.ADDMEMB_FLG = false;
    $rootScope.REVTSK_FLG = false;
    $rootScope.REVREC_FLG = false;
    $rootScope.REVRECDET_FLG = false;
    //定义提交销售报表页面跳转标志
    $rootScope.SUBMIT_REPORT_FLG = false;

    //临时保存登录界面用户输入的用户名
    $rootScope.USERNAME = "";

	this.isAndroid = ionic.Platform.isAndroid();
	this.isIOS = ionic.Platform.isIOS();
	this.isIPad = ionic.Platform.isIPad();

    var keyAll = "0000";
    var urlCom = "/CrmWeb/api/";
    //var serverUrl = "http://192.168.1.18:8080";
    //var serverUrl = "http://114.55.32.224";
    /*var projectNm = "/CrmWeb";
    var apiBase = "/api/";
    var urlCom = serverUrl + projectNm + apiBase;*/
    /**
    /**
     * 共通用GET方法
     *
     * @param url 地址+参数
     * @param fun 方法
     */
    this.get = function (url, fun, showloading) {
    	if(showloading){
        	$ionicLoading.show({
                template: '<div class="loadStyle"><ion-spinner icon="ios"></ion-spinner></div>'
      	    });
    	}
        $http({
            method: 'GET',
            url: urlCom + url
            // data: data
            // dataType: 'text'
        }).success(
            function (data, status, headers, config) {
                if (showloading) {
            	    $ionicLoading.hide();
                }
                if (data) {
                    var messageString = "";
                    if (!data.meta.success) {
                        $ionicLoading.hide();
                    	window.loading.hide();
                        if (data.meta.message) {
                            messageString = data.meta.message + "<br />";
                        }

                        if (data.validateErrorList && data.validateErrorList.length > 0) {
                            for (var i in data.validateErrorList) {
                                messageString += data.validateErrorList[i].validateMessage
                                    + "<br />";
                            }
                        }
                        //弹出错误消息
                        var alertPopup = $ionicPopup.alert({
                            title: '<span class="popheader"><i class="fa fa-times-circle-o"></i>系统错误 </span>',
                            template: messageString,
                            okText: '我知道了'
                        });

                        //用户点击“我知道了”按钮后的操作
                        alertPopup.then(function (res) {
                        });
                    } else {
                        fun(data.data);
                    }
                }
            }).error(
            function (data, status, headers, config) {
                $ionicLoading.hide();
                /*if (showloading) {
            	    $ionicLoading.hide();
                }*/
                window.loading.hide();
                var messageString = "";
                if (!data.meta.success) {
                    if (data.meta.message) {
                        messageString = data.meta.message + "<br />";
                    }

                    if (data.validateErrorList && data.validateErrorList.length > 0) {
                        for (var i in data.validateErrorList) {
                            messageString += data.validateErrorList[i].validateMessage
                                + "<br />";
                        }
                    }
                    //弹出错误消息
                    var alertPopup = $ionicPopup.alert({
                        title: '<span class="popheader"><i class="fa fa-times-circle-o"></i>系统错误 </span>',
                        template: messageString,
                        okText: '我知道了'
                    });

                    //用户点击“我知道了”按钮后的操作
                    alertPopup.then(function (res) {
                    });
                }
            });
    };
    /**
     * 共通用POST方法
     *
     * @param url 地址
     * @param data 参数
     * @param fun 方法
     */
    this.post = function (url, data, fun,showloading) {
    	if(showloading){
        	$ionicLoading.show({
      	      //template: '<div style="width: 200px;    border-radius: 5px;    margin: 0 auto 0 auto;    text-align: center;" ><p style="font-size: 16px;color: #fff;margin-top: 10px;">数据处理中...</p></div>'
                //template: '<ion-spinner icon="ios"></ion-spinner><div style="font-size:14px;">加载中...</div>'
                template: '<div class="loadStyle"><ion-spinner icon="ios"></ion-spinner></div>'
      	    });

    	}
        $http({
            method: 'POST',
            url: urlCom + url,
            data: data
            // dataType: 'text'
        }).success(
            function (data, status, headers, config) {
                if (showloading) {
            	    $ionicLoading.hide();
                }
                if (data) {
                    var messageString = "";
                    if (!data.meta.success) {
                        $ionicLoading.hide();
                        if (data.meta.message) {
                            messageString = data.meta.message + "<br />";
                        }
                        window.loading.hide();

                        if (data.validateErrorList && data.validateErrorList.length > 0) {
                            for (var i in data.validateErrorList) {
                                messageString += data.validateErrorList[i].validateMessage
                                    + "<br />";
                            }
                        }
                        //弹出错误消息
                        var alertPopup = $ionicPopup.alert({
                            title: '<span class="popheader"><i class="fa fa-times-circle-o"></i>系统错误 </span>',
                            template: messageString,
                            okText: '我知道了'
                        });

                        //用户点击“我知道了”按钮后的操作
                        alertPopup.then(function (res) {
                        });
                    } else {
                        fun(data.data);
                    }
                }
            }).error(
            function (data, status, headers, config) {
                $ionicLoading.hide();
                /*if (showloading) {
            	    $ionicLoading.hide();
                }*/
                window.loading.hide();
                var messageString = "";
                if (!data.meta.success) {
                    if (data.meta.message) {
                        messageString = data.meta.message + "<br />";
                    }

                    if (data.validateErrorList && data.validateErrorList.length > 0) {
                        for (var i in data.validateErrorList) {
                            messageString += data.validateErrorList[i].validateMessage
                                + "<br />";
                        }
                    }
                    //弹出错误消息
                    var alertPopup = $ionicPopup.alert({
                        title: '<span class="popheader"><i class="fa fa-times-circle-o"></i>系统错误 </span>',
                        template: messageString,
                        okText: '我知道了'
                    });

                    //用户点击“我知道了”按钮后的操作
                    alertPopup.then(function (res) {
                    });
                }
            });
    };
    /**
     * 底部菜单栏显示控制
     * 
     * @param type 显示底部菜单key
     */
    this.showFooterMenu = function(type, id) {
    	var navMenu = {
    			mainShow : false,
    			stfShow:false,
    			reportShow:false,
                membShow:false,
                indexMenu:""
    	};
    	
    	if(id != null && id != "" && id != undefined){
    		navMenu.indexMenu = id;
    	}
    	
    	if(type == "mainShow"){
    		navMenu.mainShow = true;
    	}else if(type == "stfShow"){
    		navMenu.stfShow = true;
    	}else if(type == "reportShow"){
    		navMenu.reportShow = true;
    	}else if (type == 'membShow') {
            navMenu.membShow = true;
        }
    	
    	return navMenu;
    };

    /**
     * 共通用传参
     *
     * @type {Array}
     */
    this.parameterList = [];
    this.setParameters = function (key, value) {
        for (var i in this.parameterList) {
            if (this.parameterList[i].key == key) {
                this.parameterList[i].value = value;
                return;
            }
        }
        var obj = {};
        obj.key = key;
        obj.value = value;
        this.parameterList.unshift(obj);
    };
    this.getParameters = function (key) {
        for (var i in this.parameterList) {
            if (this.parameterList[i].key == key) {
                return this.parameterList[i].value;
            }
        }
        return null;
    };
    this.clearParameters = function (key) {
        for (var i in this.parameterList) {
            if (this.parameterList[i].key == key) {
                return this.parameterList.splice(i, 1);
            }
        }
    };

    // 下拉框字典集调用 参数 :name 分类编号
    this.getSelectBoxDic = function(cateNum, flg) {
      var deferred = $q.defer(); // 声明承诺
      var dics = [];
      if (flg == 1) {
        dics.push({key:keyAll, text:""});
      } else if (flg == 2) {
        dics.push({key:keyAll, text:"全部"});
      } else if (flg == 3) {
        dics.push({key:keyAll, text:"无"});
      }
      this.get("commonDataController/selectDicByCateNum/" + cateNum, function(data) {
        for (var i = 0; i < data.length; i ++) {
          dics.push({key:data[i].dtlNum, text:data[i].dicNm});
        }
        deferred.resolve(dics); // 请求成功
      });
      return deferred.promise; // 返回承诺
    };

    // 下拉框省市调用 superRgnNum
    this.getSelectBoxPCV = function(superRgnNum, flg) {
      var deferred = $q.defer(); // 声明承诺
      var pcvlist = [];
      if (flg == 1) {
        pcvlist.push({key:keyAll, text:""});
      } else if (flg == 2) {
        pcvlist.push({key:keyAll, text:"全部"});
      }
      this.get("commonDataController/selectAddressBySuperRgnNum/" + superRgnNum, function(data) {
        for (var i = 0; i < data.length; i ++) {
          pcvlist.push({key:data[i].rgnNum, text:data[i].rgnNm});
        }
        deferred.resolve(pcvlist); // 请求成功
      });
      return deferred.promise; // 返回承诺
    };
    // 下拉框职位等级调用 posNum
    this.getSelectBoxPosLvl = function(posNum, flg) {
      var deferred = $q.defer(); // 声明承诺
      var psoLvllist = [];
      if (flg == 1) {
        psoLvllist.push({key:keyAll, text:""});
      } else if (flg == 2) {
        psoLvllist.push({key:keyAll, text:"全部"});
      }
      this.get("commonDataController/selectPosLvlByPosNum/" + posNum, function(data) {
        for (var i = 0; i < data.length; i ++) {
          psoLvllist.push({key:data[i].posGrdNum, text:data[i].posGrdNm});
        }
        deferred.resolve(psoLvllist); // 请求成功
      });
      return deferred.promise; // 返回承诺
    };

    // 下拉框下属人员调用 stfNum
    this.getSelectBoxUndStf = function(stfNum, flg, myselfFlg) {
      var deferred = $q.defer(); // 声明承诺
      var undStflist = [];
      if (flg == 1) {
        undStflist.push({key:keyAll, text:"", myself:"0"});
      } else if (flg == 2) {
        undStflist.push({key:keyAll, text:"全部", myself:"0"});
      }
      this.get("commonDataController/getUnderlingStfList/" + stfNum + "/" + myselfFlg, function(data) {
        for (var i = 0; i < data.length; i ++) {
        	undStflist.push({key:data[i].stfNum, text:data[i].stfNm, myself:data[i].myself});
        }
        deferred.resolve(undStflist); // 请求成功
      });
      return deferred.promise; // 返回承诺
    };

    //console.log控制台打印消息
    this.myConsoleLog = function(before, msg, after) {
        //console.log(before+angular.toJson(msg)+after);
    };

    //console.log控制台打印消息  未经过转换
    this.consoleLog = function(messages) {
        //console.log(messages);
    };

    // 渠道配置表.
    // 渠道信息.
    this.selectChnlInfoALL = function(fun) {
        this.get("commonDataController/selectChnlInfoALL", function(
            data) {
            $sessionStorage.selectChnlInfoALL = data;
           // fun();
        });
    };

    this.getAllChnList = function(flg){
        var chnlList = [];
        if (flg == 1) {
            chnlList.push({
                key : keyAll,
                text : ""
            });
        } else if (flg == 2) {
            chnlList.push({
                key : keyAll,
                text : "全部"
            });
        }

        for (var i = 0; i < $sessionStorage.selectChnlInfoALL.length; i++) {
            var c = {
                key : $sessionStorage.selectChnlInfoALL[i].chnlNum,
                text : $sessionStorage.selectChnlInfoALL[i].chnlNm
            };
            chnlList.push(c);
        }

        return chnlList;

    };

    // 取得画面可以显示的销售渠道
    this.getChnlList = function(pageId, flg) {
        var chnlList = [];
        if (flg == 1) {
            chnlList.push({
                key : keyAll,
                text : ""
            });
        } else if (flg == 2) {
            chnlList.push({
                key : keyAll,
                text : "全部"
            });
        }
        var chnlNums = {};
        var flg = false;
        for (var i = 0; i < $sessionStorage.selectChnlConfigALL.length; i++) {
            // 根据画面ID，取得该画面可以显示的销售渠道编号
            if ($sessionStorage.selectChnlConfigALL[i].pageID == pageId) {
                chnlNums[$sessionStorage.selectChnlConfigALL[i].chnlNum] = true;
                flg = true;
            }
        }
        if (!flg) {
            // 如果【渠道配置表】里没有设定该画面的销售渠道，返回【渠道信息】表中的所有渠道
            for (var i = 0; i < $sessionStorage.selectChnlInfoALL.length; i++) {
                var c = {
                    key : $sessionStorage.selectChnlInfoALL[i].chnlNum,
                    text : $sessionStorage.selectChnlInfoALL[i].chnlNm
                };
                chnlList.push(c);
            }
        } else {
            // 如果【渠道配置表】里设定了该画面的销售渠道，只返回【渠道配置表】中设定的渠道
            for (var j = 0; j < $sessionStorage.selectChnlInfoALL.length; j++) {
                if (chnlNums[$sessionStorage.selectChnlInfoALL[j].chnlNum]) {
                    // 追加【全部】的选项
                    var c = {
                        key : $sessionStorage.selectChnlInfoALL[j].chnlNum,
                        text : $sessionStorage.selectChnlInfoALL[j].chnlNm
                    };
                    chnlList.push(c);
                }
            }
        }

        return chnlList;
    };

    // 肌肤  Skin type
    this.getSelectSkin = function(name, flg) {
        var dics = [];
        if (flg == 1) {
            var map = new Map();
            map.put("key", keyAll);
            map.put("text", "");
            dics.push(map.entrySet);
        } else if (flg == 2) {
            var map = new Map();
            map.put("key", keyAll);
            map.put("text", "全部");
            dics.push(map.entrySet);
        }
        for (var i = 0; i < $sessionStorage.dic.length; i++) {
            if ($sessionStorage.dic[i].key == name) {
                for (var j = 0; j < $sessionStorage.dic[i].value.length; j++) {
                    if ($sessionStorage.dic[i].value[j].delFlg == "0") {
                        var map = new Map();
                        map.put("key", $sessionStorage.dic[i].value[j].key);
                        map.put("text", $sessionStorage.dic[i].value[j].text);
                        dics.push(map.entrySet);
                    }
                }
            }
        }

        return dics;
    };



    // 登陆成功后获取字典表.
    this.selectDicALL = function() {
        this.get("commonDataController/selectDicALL", function(data) {
            for ( var i = 0,j=data.length;i<j;i++) {
                data[i].value = JSON.parse(data[i].value);
            }
            $sessionStorage.dic = data;
        });
    };

    // 地址信息.
    this.selectAddressALL = function() {
        this.get("commonDataController/selectAddressALL",
            function(data) {
                $sessionStorage.selectAddressALL = data;
            });
    };

    //根据key值从数据字典中查询对应的value
    // 下拉框字典集调用 参数 :name 分类编号
    this.dicKeyToValue = function(name, flg) {
        var dics = [];
        if (flg == 1) {
            var map = new Map();
            map.put("key", keyAll);
            map.put("text", "");
            dics.push(map.entrySet);
        } else if (flg == 2) {
            var map = new Map();
            map.put("key", keyAll);
            map.put("text", "全部");
            dics.push(map.entrySet);
        }  else if (flg == 3) {
            var map = new Map();
            map.put("key", '');
            map.put("text", "全部");
            dics.push(map.entrySet);
        }
        for (var i = 0; i < $sessionStorage.dic.length; i++) {
            if ($sessionStorage.dic[i].key == name) {
                for (var j = 0; j < $sessionStorage.dic[i].value.length; j++) {
                    if ($sessionStorage.dic[i].value[j].delFlg == "0") {
                        var map = new Map();
                        map.put("key", $sessionStorage.dic[i].value[j].key);
                        map.put("text", $sessionStorage.dic[i].value[j].text);
                        dics.push(map.entrySet);
                    }
                }
            }
        }

        return dics;
    };


    /*
    * 时间格式化 2016-05-10 00:00:00.0
    * */
    /*this.timeToFormat = function(date) {
        var tempDate = date.split(' ')[0].split('-');
        var curDate = new Date();
        //当前日期
        var dateArr = (curDate.toLocaleDateString()).split('/');

        if (tempDate == dateArr) {
            return '今天';
        } else {
            return tempDate[1]+"-"+tempDate[2];
        }
       /!* for (var i=0; i<dateArr.length; i++) {}*!/


    };*/

    //时间转成时间戳
    this.dateTimeTotamp = function(date){
        var tempDate = new Date(date);
        return tempDate.getTime();
    };

    //判断非空
    this.isNotNullAndUndefined = function(variable) {
        if (variable != undefined && variable != null && ((variable+"").replace(/(^\s+)|(\s+$)/g, "")) != '') {
            return true;
        } else {
            return false;
        }
    };

    //判断非空对象
    this.isNotEmptyObject = function(obj){
        var t;
        for (t in obj)
            return true;
        return false;
    };

    //数组转字符串
    this.arrToStr = function(sessSto, flg){
        var tempArr = [];
        var i = 0;
        angular.forEach(sessSto, function(data){
            if (data.checked == true) {
                tempArr[i] = data.key;
                i++;
            }
        });

        if (flg == 1) {
            return tempArr.join(',');
        } else  if (flg == 2) {
            return tempArr;
        }
    };

    //数组
    this.converToStr = function(arr) {
        if (arr != undefined && arr != '') {
            return arr.join(',');
        }
    };

// 用户全部权限
    this.selectUserPower = function(fun) {
      this.get("commonDataController/selectUserPower/M",
          function(data) {
            fun(data);
          });
    };
    
    //获取文件服务器路径
    this.getFileServerUrl = function() {
  	this.get("upload/getFileServerUrl",function(data){
  		$sessionStorage.upload = data;
  	});  
    }; 
    //缓存中读取文件服务器路径
    this.getFileServerPath = function() {
  	return $sessionStorage.upload;
    };
    
    // 登陆成功后获取消息提示
    this.selectMessageALL = function() {
      $http({
        method : 'GET',
        url : "jsonData/messages.json"
      }).success(function(data) {
        $sessionStorage.Message = data;
      }).error(function(data) {
        toaster.pop('error', '错误', "提示消息数据不存在", 0, 'trustedHtml', function() {
        });
      });
    };
    
    /**
     * 显示提示消息
     * 
     * @param messageType 消息类型（success：成功消息；error：校验失败的错误消息）
     * @param messageId 消息ID
     * @param time 消息消息时间
     */
    this.showMessage = function(messageType, messageId, time) {
        var message = "";

        // 取得消息内容
        for (var i = 0; i < $sessionStorage.Message.length; i++) {
            for (var key in $sessionStorage.Message[i]) {
                if (key == messageId) {
                    if (typeof(messageType) != "string"){
                        message =$sessionStorage.Message[i][key];
                        for(var i = 1; i < messageType.length; i++){
                            var str1 = "{*}";
                            var s = message.indexOf(str1);
                            var j = message.substring(0, s + 3);
                            var k = j.replace("{*}",messageType[i]);
                            var l = message.substring(s + 3, message.length);
                            message = k + l;
                        }
                        break;
                    }else{
                      message = $sessionStorage.Message[i][key];
                      break;
                    }
                }
            }
            if (message != "") {
                break;
            }
        }
        
        var img = "";
        var pStyle = "";
        // 设置显示的图片
        if (messageType == "success") {
            img = '<img src="common/images/dui.png" width="40" class="mt_40">';
        }else if (messageType == "clear") {
            img = '<img src="common/images/shuazi.png" width="40" class="mt_40">';
        } else {
            img = '<img src="common/images/error.png" width="30" class="mt_40">';
        }
        // 设置P标签的样式
        if (message !=undefined && message != null && message != "" && message.length > 6) {
            pStyle = 'style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;"';
        }
        $ionicLoading.show({
            template: '<div class="tcc_2" >' + img +'<p ' + pStyle + '>' + $filter("characters")(message, 17) +'</p></div>',
            duration : time,
            hideOnStateChange: true,
            showBackdrop: false
        });

    };


    this.showErrorMessage = function(messageId, messageType){
        if(typeof(messageType) != "undefined") {
            this.showMessage(messagetype, messageId, 3000);
        }else{
            this.showMessage("error", messageId, 3000);
        }
    };

    this.showSuccessMessage = function(messageId, messageType){

        if(typeof(messageType) != "undefined") {
            this.showMessage(messageType, messageId, 3000);
        }else{
            this.showMessage("success", messageId, 3000);
        }
    };

    /*
    * 根据会员编号查询会员信息  /membBas/selectByMembNum/{membNum}

     * */

    /*this.selectInfoAccMembNum = function(num) {
        for (var i=0; i<$sessionStorage.membInfoList.length; i++) {
            if (num == $sessionStorage.membInfoList[i].membNum) {
                return $sessionStorage.membInfoList[i];
            }
        }
    };
*/
    /*
    * 根据会员编号获取会员详细信息
    * */
    /*this.selectInfoAccMembNum = function(membNum) {
        this.get("membBas/selectByMembNum/"+membNum, function(data) {
            console.log(angular.toJson(data)+"=mmm=="+membNum);
            $sessionStorage.curMembInfoSto = data;
        });
    };
*/

    /*
    * 获取下属人员
    * */
    this.selectMySubStfList = function() {
        this.get('commonDataController/selectMySubStfList',function(data){
            $sessionStorage.mySubStfListSto = data;
        })
    };

    //缓存中取当前用户的下属人员
    this.getMySubStfList = function(){
        return $sessionStorage.mySubStfListSto;
    };

    /*
    * 日期转换
    * */

    this.getDay = function(today, day){

        var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;

        today = new Date(targetday_milliseconds); //注意，这行是关键代码

        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear+"-"+tMonth+"-"+tDate;
    };

    this.doHandleMonth = function(month){
        var m = month;
        if(month.toString().length == 1){
            m = "0" + month;
        }
        return m;
    };

    //yyyyMMdd HH:mm:ss.xxx 字符串转时间戳 
    this.timeToTimestamp = function(dateStr) {
        if (dateStr == undefined || dateStr == null || dateStr == '') {
            return '';
        } else {
            if ((dateStr+'').indexOf('-') != -1){
                dateStr = dateStr.replace(/-/g, '');
            }

            if ((dateStr+'').indexOf(' ') != -1) {
                var dateArr = dateStr.split(' ');
                dateArr[0] = dateArr[0].substring(0,4) + '/' + dateArr[0].substring(4,6) + '/' + dateArr[0].substring(6,8);
                dateStr = dateArr[0] + ' '+ dateArr[1].split('.')[0];
            } else {
                dateStr = dateStr.substring(0,4) + '/' + dateStr.substring(4,6) + '/' + dateStr.substring(6,8);
            }

            return (new Date(dateStr)).getTime();
        }
    };

    //图片压缩
    //others/images/20160729/100_100^a4180211-2f0f-4637-8764-3c79b84ade26.jpg
    this.pictureCompression = function(imgUrl, width, height) {
        if (this.isNotNullAndUndefined(imgUrl)) {
            return imgUrl.split("/",3).join("/") + '/' + width + '_' + height + '^' + imgUrl.split("/")[3];
        } else {
            return "";
        }
    };
    
    this.powerRefresh = function() {
    	userPowerFactory.userPowerRefresh();
    };

    
    // 登陆成功后取得数据菜单数据
    this.selectMobileMenuPowerALL = function(fun) {
      $http({
        method : 'GET',
        url : "jsonData/mobileMenuPower.json"
      }).success(function(data) {
    	  //编辑菜单显示状况
    	  editMobileMenuStatus(data);
      }).error(function(data) {
        toaster.pop('error', '错误', "提示菜单数据不存在", 0, 'trustedHtml', function() {
        });
      });
    };

    this.showLoading = function() {
        $ionicLoading.show({
            template: '<div class="loadStyle"><ion-spinner icon="ios"></ion-spinner></div>'
        });
    };

    this.hideLoading = function() {
        $ionicLoading.hide();
    };

    this.mobileInputUserName =function() {
    	return {
            get: function() {
                return $rootScope.USERNAME;
            },
            save: function(inputUserName) {
                $rootScope.USERNAME = inputUserName;
            }
        }
    };

    
    /**
     * 用户点击通知后，将站内通知设定为已读。
     * 
     * @param param 推送的扩展信息
     */
    this.changePushMsgStatus = function(callbackParam) {
    	this.post('messageCallback/updatePushMsgStatusByHaveRead',callbackParam, function(data) {});
    }
    
    
    /**
     * 用户点击通知时，跳转至对应的业务画面。
     * 
     * @param param 推送的扩展信息
     */
    this.pushManagementPage = function(param) {
        var goUrl = "";
        var goParam = {};
        var havePushMsgFlg = false;
        var jumpFlg = param.jumpFlg == null ? "" : param.jumpFlg;
        var pushMsgId = param.pushMsgId == null ? "" : param.pushMsgId;
        var tmMsgConfigId = param.tmMsgConfigId == null ? "" : param.tmMsgConfigId;
        var callbackParam = {"jumpFlg":jumpFlg,"pushMsgId":pushMsgId,"tmMsgConfigId":tmMsgConfigId};
        
        // 跳转页面
        if (jumpFlg == "0001") {
        	goUrl = "membRevisitTsk";
        	havePushMsgFlg = true;
        } else if(jumpFlg == "0002") {
			goUrl = "entryApplInfo";
			if (param.entryApplId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.entryApplId};
			}
		} else if (jumpFlg == "0003") {
			goUrl = "dimiApplInfo";
			if (param.dimiApplId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.dimiApplId};
			}
		} else if (jumpFlg == "0004") {
			goUrl = "persActInfo";
			if (param.persActId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.persActId};
			}
		} else if (jumpFlg == "0005") {
			goUrl = "baShiftMngApplInfo";
			if (param.baShiftMngApplId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.baShiftMngApplId};
			}
		} else if (jumpFlg == "0006") {
			goUrl = "leaveApplInfo";
			if (param.leaveApplId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.leaveApplId};
			}
		} else if (jumpFlg == "0007") {
			goUrl = "appAttendReportInfo";
			if (param.appAttendReportId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.appAttendReportId};
			}
		} else if (jumpFlg == "0008") {
			goUrl = "reportApprovalDetails";
			if (param.reportApprovalDetailsId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.reportApprovalDetailsId};
			}
		} else if (jumpFlg == "0009") {
			goUrl = "approvalDetails";
			if (param.approvalDetailsId) {
				havePushMsgFlg = true;
				goParam = {"applNum":param.approvalDetailsId};
			}
		}
		return {"jumpUrl":goUrl,"jumpParam":goParam,"havePushMsg":havePushMsgFlg,"callbackParam":callbackParam};
    }

    this.appFaultNotice = function(content, callback) {
    	var notice;
    	var title, template, okText;
    	title = content.title ? content.title : '提示';
    	template = content.template ? content.template : '系统错误';
    	okText = content.okText ? content.okText : '我知道了';
    	notice = $ionicPopup.alert({
            title : title,
            template : template,
            okText : okText
          });
    }

    /**
     * 调用原生错误时，显示提示消息
     * 
     * @param extrasJson 原生代码错误时，返回的信息
     * @param type 处理类型（1:图片上传相关处理）
     */
    this.appCallBackFaultHandle = function(extrasJson, type) {
    	var errMsg = "";
    	switch(type) {
    	    case 1:
    	    	//图片上传
    	    	errMsg = this.picCallBackFaultHandle(extrasJson);
    	    	break;
    	    case 2:
    	    	//语音上传
    	    	errMsg = this.voiceFaultHandle(extrasJson);
    	    	break;
    	    case 3:
    	    	//定位
    	    	errMsg = this.locationFaultHandle(extrasJson);
    	    	break;
    	}
    	return errMsg;
    }

    this.voiceFaultHandle = function(extrasJson) {
        var extrasMsg = "";
        var faultJson = extrasJson.fault;

        var title = '无法录音';
        var template = '录音失败';
        var okText = '我知道了';
        switch(faultJson.errorcode) {
            case 1:
                if(this.isIOS || this.isIPad) {
                    template = '请在iPhone的“设置-隐私-麦克风”选项中，允许应用访问你的手机麦克风';
                } else {
                    template = '请检查是否允许应用访问你的手机麦克风';
                }
                this.appFaultNotice({"title": title, "template": template, "okText": okText});
                break;
            case 2:
                //录音时间太短
                this.showErrorMessage("msg.member.10025");
                break;
            case 3:
                //发送上传录音文件请求失败
                this.showErrorMessage("msg.member.10014");
                break;
            case 4:
                //上传成功，回调服务器图片路径请求失败
                this.showErrorMessage("msg.member.10014");
                break;
        }
        return extrasMsg;
    }


    this.locationFaultHandle = function(extrasJson) {
    	var faultJson = extrasJson.fault;

        var title = '无法定位';
        var template = '定位失败';
        var okText = '我知道了';

        switch(faultJson.errorcode) {
            case 1:
                //ios未开启定位服务
                if(this.isIOS || this.isIPad) {
                    template = '请在iPhone的“设置-隐私-定位”选项中，允许应用访问你的手机定位服务';
                } else {
                    template = '请检查是否允许应用访问你的手机定位服务';
                }
                break;
            case 2:
                //ios位置服务不可用（gps，网络信号问题）
                template = "当前位置服务不可用，请稍后再试。";
                break;
            case 3:
                //定位服务内部错误。faultJson.errorcontent内可查看具体的错误信息。如果没有详细内容，表明是程序内部错误
                template = "定位失败。";
                break;
        }
        this.appFaultNotice({"title": title, "template": template, "okText": okText});
        return template;
    }

    /**
     * 图片上传，调用原生错误时，显示提示消息
     * 
     * @param faultJson 原生代码错误时，返回的错误信息
     */
    this.picCallBackFaultHandle = function(extrasJson) {
        var faultJson = extrasJson.fault;

        var title = '上传失败';
        var template = '上传图片失败';
        var okText = '我知道了';
        switch(faultJson.errorcode) {
            case 1:
                //相册禁用
                if(this.isIOS || this.isIPad) {
                    template = '请在iPhone的“设置-隐私-相册”选项中，允许应用访问你的相册';
                } else {
                    template = '请检查是否开启相册权限';
                }
                break;
            case 2:
                //相机禁用
                if(this.isIOS || this.isIPad) {
                    template = '请在iPhone的“设置-隐私-相机”选项中，允许应用访问你的相机';
                } else {
                    template = '请检查是否开启摄像头权限';
                }
                break;
            case 3:
                //上传失败
                template = "连接服务器失败，请稍后再试";
                break;
            case 4:
                //上传成功，回调服务器图片路径请求失败
                template = "连接服务器失败，请稍后再试";
                break;
        }
        this.appFaultNotice({"title": title, "template": template, "okText": okText});
        return template;
    }

    /**
     * 编辑App各个页面菜单状态
     * 
     * @param data 菜单信息
     */
    var editMobileMenuStatus = function(data) {
        var mobileMenus = {};
        var mobileMenu = {};
        var isShow = false;
        var thisUrl = "";
        angular.forEach(data, function(item, idx) {
            isShow = false;
            thisUrl = ""
            mobileMenu = {};
            mobileMenu.key = item.key;
            mobileMenu.name = item.name;
            switch(item.userPower.type) {
                case 0:
                    isShow = true;
                    mobileMenu.show = isShow;
                    mobileMenus[item.key] = mobileMenu;
                    break;
                case 1:
                    isShow = userPowerFactory.userPowerFm(item.userPower.powerId);
                    break;
                case 2:
                    isShow = userPowerFactory.userPowerFp(item.userPower.powerId);
                    break;
                case 3:
                    isShow = userPowerFactory.userPower(item.userPower.powerId);
                    break;
                case 4:
                    break;
            }

            if(item.subMenu && item.subMenu.length > 0) {
//                var subMenus = editMobileSubMenuStatus(item.subMenu, isShow);
//                mobileMenus.push(subMenus);
//                angular.extend(mobileMenus, subMenus);

                var obj = editMobileSubMenuStatus(item)
                var subMenus = obj.subMenu();
                isShow = obj.parentIsShow();
                thisUrl = obj.parentUrl();
                angular.extend(mobileMenus, subMenus);
            }

            mobileMenu.show = isShow;
            if(item.hasDefualtUrl) {
                mobileMenu.jump = thisUrl;
            }
            mobileMenus[item.key] = mobileMenu;
        });
        $sessionStorage.mobileMenu = mobileMenus;
        userPowerFactory.menuPowerRefresh();
    };


    /**
     * 编辑App各个页面次级菜单状态
     * 
     * @param parent 父级菜单
     */
    var editMobileSubMenuStatus = function(parent) {
        var parentIsShow = false;
        var parentUrl = "";
        var isShow = false;
        var thisUrl = "";
        var mobileMenu = {};
        var subMenus = {};
        var rtnObj = {
            parentIsShow: function() {
                return parentIsShow;
            },
            subMenu: function() {
                return subMenus;
            },
            parentUrl: function() {
                return parentUrl;
            }
        }
        angular.forEach(parent.subMenu, function(item, idx) {
            isShow = false;
            thisUrl = ""
            mobileMenu = {};
            mobileMenu.key = item.key;
            mobileMenu.name = item.name;

            switch(item.userPower.type) {
                case 0:
                    isShow = true;
                    break;
                case 1:
                    isShow = userPowerFactory.userPowerFm(item.userPower.powerId);
                    break;
                case 2:
                    isShow = userPowerFactory.userPowerFp(item.userPower.powerId);
                    break;
                case 3:
                    isShow = userPowerFactory.userPower(item.userPower.powerId);
                    break;
                case 4:
                    break;
            }

            if(item.subMenu && item.subMenu.length > 0) {
                var obj = editMobileSubMenuStatus(item)
                var subsMenus = obj.subMenu();
                isShow = obj.parentIsShow();
                thisUrl = obj.parentUrl();
//                mobileMenus.push(subMenus);
                angular.extend(subMenus, subsMenus);
            }

            if(isShow) {
                parentIsShow = true;
                if(!parentUrl) {
                    parentUrl = item.url?item.url:undefined;
                }
            }
            mobileMenu.show = isShow;
            if(item.hasDefualtUrl) {
                mobileMenu.jump = thisUrl;
            }
            subMenus[item.key] = mobileMenu;
        });
        return rtnObj;
    };


    /**
     * 比较版本号大小,返回结果：[1：v1大；  0：一样大；  -1：v2大]
     * @param v1 版本1
     * @param v2 版本2
     * @return  返回结果：[1：v1大；  0：一样大；  -1：v2大]
     */
    this.versionCompare = function(v1, v2) {
      v1 = v1 == null ? "" : v1.replace(" ", "");
      v2 = v2 == null ? "" : v2.replace(" ", "");
      if(v1 == v2){
          return 0;
      }

      var arr1 = v1.split(".");
      var arr2 = v2.split(".");

      var c1,c2;
      for(var i=0;i<(arr1.length > arr2.length ? arr2.length : arr1.length);i++) {
      	c1 = arr1[i];
      	c2 = arr2[i];
      	
      	if(c1.length > c2.length){
  			return 1;
  		} else if(c2.length < c1.length) {
  			return -1;
  		}
      	for(var j = 0; j < c1.length; j ++){
  			if(c1.charAt(j) > c2.charAt(j)){
  				return 1;
  			} else if(c1.charAt(j) < c2.charAt(j)) {
  				return -1;
  			}
  		}
      }
      if(arr1.length > arr2.length) {
  		return 1;
      } else if(arr1.length < arr2.length) {
  		return -1;
      }
      return 0;
    }

    window.isLoading = false;
    window.loading = {
        show: function() {
        	window.isLoading = true;
            $ionicLoading.show({
                template: '<div class="loadStyle"><ion-spinner icon="ios"></ion-spinner></div>'
          	});
        },
        hide: function() {
        	if(window.isLoading) {
        		window.isLoading = false;
                $ionicLoading.hide();
        	}
        }
    }
});

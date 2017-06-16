/**
 * Created by 张玉良 on 2016-3-27.
 */
'use strict';
/**
 * 共通用service
 */
app.service("comApi", function($http, toaster, $sessionStorage, $filter, $modal, $timeout) {
	var keyAll = "0000";
	
	var pathName = window.location.pathname.substring(1);   
	var webName = pathName == "" ? "" : pathName.substring(0, pathName.indexOf("/"));
	var urlCom = webName == "" ? "/api/" : "/" + webName + "/api/";
//	var urlCom = "/CrmWeb/api/";
		
	var defaultPageCounts = [20, 50, 100, 200];
	
	this.getUrlCom = function(){
		return urlCom;
	}
	
	function getPageNum(pageNum, pageSize, totalSize){
		if(!pageSize || !totalSize || pageSize <= 0 || totalSize <= 0){
			if(!pageNum || pageNum <= 0){
				return 1;
			}
			return pageNum;
		}
		var totalPage = totalSize % pageSize == 0 ? totalSize / pageSize : totalSize / pageSize + 1;
		return pageNum > totalPage ? totalPage : pageNum;
	}
	
	/**
	 * 分页页面记录数
	 */
	this.getPageCounts = function(){
		return defaultPageCounts;
	};
	
	/**
	 * 计算分页页码，当页面删除数据时，如果数据是页面唯一一条记录，删除后页码减少了，则把当前页码算到最后一页
	 */
	this.buildPageNum = function(pageNum, pageSize, totalSize){
		return getPageNum(pageNum, pageSize, totalSize);
	}
	
	
	/**
	 * 构建分页table参数，由于这里引入不了NgTableParams,故这里不执行实例化,由调用的controller去实例化
	 */
	this.buildTableParams = function(pageNum, pageSize, data, counts, callback){
		counts = !counts || counts == null || counts.length == 0 ? defaultPageCounts : counts;
		pageSize = !pageSize || pageSize <= 0 || counts.indexOf(pageSize) == -1 ? counts[0] : pageSize;
		data = !data || data == null ? [] : data;
		pageNum = getPageNum(pageNum, pageSize, data.length);
        var tableParams = [
					            {
							    	page: pageNum, // show first page
							        count: pageSize // count per page
							    }, 
							    {
							        dataset: data,
							        counts: counts,
							        total: data.length,
							        getData:function($defer, params){
							        	 $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							             // 当前所在页
							             var pageIndex = params.page();
							             // 每页显示条数
							             var pageCount = params.count();
							             // 当前页数据条数
							             var count = data.slice((params.page() - 1) * params.count(), params.page() * params.count()).length;
							             pageNum = pageIndex;
							             pageSize = pageCount;
							             callback(pageIndex, pageCount);
							        }
							    }
						    ]
        return tableParams;
	}
	
	
	/**
	 * 通过url下载文件
	 */
	this.downloadFile = function(url){
		var iframe = document.createElement("iframe");
		iframe.src = url;
		document.body.appendChild(iframe);
		$timeout(function(){document.body.removeChild(iframe);}, 1000);// 延时1S再关闭iframe，不然过快关闭火狐还没来得及提醒保存就被关闭了。
	}
	
	
  /**
   * 共通用GET方法
   *
   * @param url 地址+参数
   * @param fun 方法
   */
  this.get = function(url, fun) {
    $http({
      method : 'GET',
      url : urlCom+url
    // data: data
    // dataType: 'text'
    }).success(
        function(data, status, headers, config) {
          if (data) {
            var messageString = "";
            if (!data.meta.success) {
              if (data.meta.message) {
                messageString = data.meta.message + "<br />";
              }

              if (data.validateErrorList && data.validateErrorList.length > 0) {
                for ( var i in data.validateErrorList) {
                  messageString += data.validateErrorList[i].validateMessage
                      + "<br />";
                }
              }
              toaster.pop('error', '错误', messageString, 0, 'trustedHtml',
                  function() {
                  });
            } else {
              fun(data.data);
            }
          }
        }).error(
        function(data, status, headers, config) {
          var messageString = "";
          if (!data.meta.success) {
            if (data.meta.message) {
              messageString = data.meta.message + "<br />";
            }

            if (data.validateErrorList && data.validateErrorList.length > 0) {
              for ( var i in data.validateErrorList) {
                messageString += data.validateErrorList[i].validateMessage
                    + "<br />";
              }
            }
            toaster.pop('error', '错误', messageString, 0, 'trustedHtml',
                function() {
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
  this.post = function(url, data, fun) {
    $http({
      method : 'POST',
      url : urlCom+url,
      data : data
    // dataType: 'text'
    }).success(
        function(data, status, headers, config) {
          if (data) {
            var messageString = "";
            if (!data.meta.success) {
              if (data.meta.message) {
                messageString = data.meta.message + "<br />";
              }

              if (data.validateErrorList && data.validateErrorList.length > 0) {
                for ( var i in data.validateErrorList) {
                  messageString += data.validateErrorList[i].validateMessage
                      + "<br />";
                }
              }
              toaster.pop('error', '错误', messageString, 0, 'trustedHtml',
                  function() {
                  });
            } else {
              fun(data.data);
            }
          }
        }).error(
        function(data, status, headers, config) {
          var messageString = "";
          if (!data.meta.success) {
            if (data.meta.message) {
              messageString = data.meta.message + "<br />";
            }

            if (data.validateErrorList && data.validateErrorList.length > 0) {
              for ( var i in data.validateErrorList) {
                messageString += data.validateErrorList[i].validateMessage
                    + "<br />";
              }
            }
            // (type, title, body, timeout,
            // bodyOutputType, clickHandler)
            toaster.pop('error', '错误', messageString, 0, 'trustedHtml',
                function() {
                });
          }
        });
  };

  /**
   * 共通用传参
   *
   * @type {Array}
   */
  this.parameterList = [];
  this.setParameters = function(key, value) {
    for ( var i in this.parameterList) {
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
  this.getParameters = function(key) {
    for ( var i in this.parameterList) {
      if (this.parameterList[i].key == key) {
        return this.parameterList[i].value;
      }
    }
    return null;
  };
  this.clearParameters = function(key) {
    for ( var i in this.parameterList) {
      if (this.parameterList[i].key == key) {
        return this.parameterList.splice(i, 1);
      }
    }
  };

  //获取角色权限数据长度
  this.getRolePowerLen = function(funcModuleNum, funcPointNum, flg) {
    if (flg == 'W') {
      for (var i=0; i<$sessionStorage.webRoleSto.length; i++) {
        if (funcModuleNum == $sessionStorage.webRoleSto[i].funcModuleNum) {
          for (var j=0; j<$sessionStorage.webRoleSto[i].funcPointList.length; j++){
            if (funcPointNum == $sessionStorage.webRoleSto[i].funcPointList[j].funcPointNum) {
              return $sessionStorage.webRoleSto[i].funcPointList[j].funcPointDetailList.length;
            }
          }
        }
      }
    } else if (flg == 'M'){
      for (var i=0; i<$sessionStorage.appRoleSto.length; i++) {
        if (funcModuleNum == $sessionStorage.appRoleSto[i].funcModuleNum) {
          for (var j=0; j<$sessionStorage.appRoleSto[i].funcPointList.length; j++){
            if (funcPointNum == $sessionStorage.appRoleSto[i].funcPointList[j].funcPointNum) {
              return $sessionStorage.appRoleSto[i].funcPointList[j].funcPointDetailList.length;
            }
          }
        }
      }
    }

  };

  // 用户全部权限
  this.selectUserPower = function(fun) {
    this.get("commonDataController/selectUserPower/W",
        function(data) {
          fun(data);
        });
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

  // 部门信息.
  this.selectDepartmentALL = function() {
    this.get("commonDataController/selectDepartmentALL", function(
        data) {
      $sessionStorage.selectDepartmentALL = data;
    });
  };

  // 职位信息.
  this.selectJobPosALL = function() {
    this.get("commonDataController/selectJobPosALL",
        function(data) {
          $sessionStorage.selectJobPosALL = data;
        });
  };

  // 职位和职位等级关联关系.
  this.selectPosRelPosLvlALL = function() {
    this.get("commonDataController/selectPosRelPosLvlALL",
        function(data) {
          $sessionStorage.selectPosRelPosLvlALL = data;
        });
  };

  // 渠道信息.
  this.selectChnlInfoALL = function(fun) {
    this.get("commonDataController/selectChnlInfoALL", function(
        data) {
      $sessionStorage.selectChnlInfoALL = data;
        fun();
    });
  };

  // 渠道配置表.
  this.selectChnlConfigALL = function() {
    this.get("commonDataController/selectChnlConfigALL", function(
        data) {
      $sessionStorage.selectChnlConfigALL = data;
    });
  };

  // 大区信息.
  this.selectMajRegALL = function() {
    this.get("commonDataController/selectMajRegALL",
        function(data) {
          $sessionStorage.selectMajRegALL = data;
        });
  };

  // 大区城市关联关系.
  this.selectMajRegCityReALL = function() {
    this.get("commonDataController/selectMajRegCityReALL",
        function(data) {
          $sessionStorage.selectMajRegCityReALL = data;
        });
  };

  // 地址信息.
  this.selectAddressALL = function() {
    this.get("commonDataController/selectAddressALL",
        function(data) {
          $sessionStorage.selectAddressALL = data;
        });
  };

  // 城市区分信息.
  this.selectUrbDistricALL = function() {
    this.get("commonDataController/selectUrbDistricALL", function(
        data) {
      $sessionStorage.selectUrbDistricALL = data;
    });
  };

  // 销售门店信息.
  this.selectStoresALL = function() {
    this.get("commonDataController/selectStoresALL",
        function(data) {
          $sessionStorage.selectStoresALL = data;
        });
  };

  // 档期.
  this.selectphaALL = function() {
    this.get("commonDataController/selectphaALL", function(data) {
      for ( var i = 0,j=data.length;i<j;i++) {
        data[i].phaseMng = JSON.parse(data[i].phaseMng);
      }
      $sessionStorage.selectphaALL = data;
    });
  };

  // 下拉框字典集调用 参数 :name 分类编号

  this.getSelectBoxDic = function(name, flg) {
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
    }else if(flg == 3){
      var map = new Map();
      map.put("key", "");
      map.put("text", "无");
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
  // 省市区 省城市 县 superRgnNum
  this.getSelectBoxPCV = function(superRgnNum, flg, isNotPutFirstKey) {

	var retumlist = [];
	var map = new Map();
	if(!isNotPutFirstKey || isNotPutFirstKey == false){
	    map.put("key", keyAll);
    }
    if (flg == 1) {
      map.put("text", "");
      retumlist.push(map.entrySet);
    } else if (flg == 2) {
      map.put("text", "全部");
      retumlist.push(map.entrySet);
    } else if (flg == 3) {
      map.put("text", "--选择省--");
      retumlist.push(map.entrySet);
    } else if (flg == 4) {
      map.put("text", "--选择市--");
      retumlist.push(map.entrySet);
    } else if (flg == 5) {
      map.put("text", "--选择县--");
      retumlist.push(map.entrySet);
    }
    
    for (var i = 0; i < $sessionStorage.selectAddressALL.length; i++) {
      if ($sessionStorage.selectAddressALL[i].superRgnNum == superRgnNum
          && $sessionStorage.selectAddressALL[i].delFlg == "0") {
        var map = new Map();
        map.put("key", $sessionStorage.selectAddressALL[i].rgnNum);
        map.put("text", $sessionStorage.selectAddressALL[i].rgnNm);
        retumlist.push(map.entrySet);
      }
    }
    return retumlist;
  };
  // 部門
  this.getSelectBoxDepartment = function(flg) {
    var retumlist = [];
    if (flg == 1) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "");
      retumlist.push(map.entrySet);
    } else if (flg == 2) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "全部");
      retumlist.push(map.entrySet);
    }

    for (var i = 0; i < $sessionStorage.selectDepartmentALL.length; i++) {
      if ($sessionStorage.selectDepartmentALL[i].delFlg == "0") {
        var map = new Map();
        map.put("key", $sessionStorage.selectDepartmentALL[i].depNum);
        map.put("text", $sessionStorage.selectDepartmentALL[i].depNm);
        retumlist.push(map.entrySet);
      }
    }
    return retumlist;

  };
  // 职位
  this.getSelectBoxJob = function(flg) {

    var retumlist = [];
    if (flg == 1) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "");
      retumlist.push(map.entrySet);
    } else if (flg == 2) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "全部");
      retumlist.push(map.entrySet);
    }
    for (var i = 0; i < $sessionStorage.selectJobPosALL.length; i++) {
      if ($sessionStorage.selectJobPosALL[i].delFlg == "0") {
        var map = new Map();
        map.put("key", $sessionStorage.selectJobPosALL[i].posNum);
        map.put("text", $sessionStorage.selectJobPosALL[i].posNm);
        retumlist.push(map.entrySet);
      }
    }
    return retumlist;

  };

  // 职位等级/*lg*/
  this.getSelectAllPos = function(flg) {

    var retumlist = [];
    if (flg == 1) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("posKey", keyAll);
      map.put("text", "");
      retumlist.push(map.entrySet);
    } else if (flg == 2) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("posKey", keyAll);
      map.put("text", "全部");
      retumlist.push(map.entrySet);
    }
    for (var i = 0; i < $sessionStorage.selectPosRelPosLvlALL.length; i++) {
      if ($sessionStorage.selectPosRelPosLvlALL[i].delFlg == "0") {
        var map = new Map();
        map.put("key", $sessionStorage.selectPosRelPosLvlALL[i].posGrdNum);
        map.put("posKey", $sessionStorage.selectPosRelPosLvlALL[i].posNum);
        map.put("text", $sessionStorage.selectPosRelPosLvlALL[i].posGrdNm);
        retumlist.push(map.entrySet);
      }
    }
    return retumlist;

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

  // 职位等级
  this.getSelectBoxPosLvl = function(posNum, flg) {
    var retumlist = [];
    if (flg == 1) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "");
      retumlist.push(map.entrySet);
    } else if (flg == 2) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "全部");
      retumlist.push(map.entrySet);
    }
    for (var i = 0; i < $sessionStorage.selectPosRelPosLvlALL.length; i++) {
      if ($sessionStorage.selectPosRelPosLvlALL[i].delFlg == "0"
          && $sessionStorage.selectPosRelPosLvlALL[i].posNum == posNum) {
        var map = new Map();
        map.put("key", $sessionStorage.selectPosRelPosLvlALL[i].posGrdNum);
        map.put("text", $sessionStorage.selectPosRelPosLvlALL[i].posGrdNm);
        retumlist.push(map.entrySet);
      }
    }
    return retumlist;

  };
  // 档期组
  this.getSelectBoxPhaGrp = function(flg) {
    var retumlist = [];
    if (flg == 1) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "");
      retumlist.push(map.entrySet);
    } else if (flg == 2) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "全部");
      retumlist.push(map.entrySet);
    }
    for (var i = 0; i < $sessionStorage.selectphaALL.length; i++) {
      if ($sessionStorage.selectphaALL[i].delFlg == "0") {
        var map = new Map();
        map.put("key", $sessionStorage.selectphaALL[i].oId);
        map.put("text", $sessionStorage.selectphaALL[i].phaGrpNm);
        retumlist.push(map.entrySet);
      }
    }
    return retumlist;
  };
  // 档期
  this.getSelectBoxPhase = function(phaGrp, flg) {
    var retumlist = [];
    if (flg == 1) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "");
      retumlist.push(map.entrySet);
    } else if (flg == 2) {
      var map = new Map();
      map.put("key", keyAll);
      map.put("text", "全部");
      retumlist.push(map.entrySet);
    }
    for (var i = 0; i < $sessionStorage.selectphaALL.length; i++) {
      if ($sessionStorage.selectphaALL[i].delFlg == "0"
          && $sessionStorage.selectphaALL[i].oId == phaGrp) {
        var phaseList = $sessionStorage.selectphaALL[i].phaseMng;
        for (var j = 0; j < phaseList.length; j++) {
          if (phaseList[j].delFlg == "0") {
            var map = new Map();
            map.put("key", phaseList[j].oId);
            map.put("text", phaseList[j].phaNm);
	    map.put("phaStartTm", phaseList[j].phaStartTm);
            retumlist.push(map.entrySet);
          }
        }
        break;
      }
    }
    return retumlist;
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

  // 取得销售大区
  this.getMajRgnList = function(chnlNum, flg) {
    var list = [];
    if (flg == 1) {
      list.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        key : keyAll,
        text : "全部"
      });
    }
    for (var i = 0; i < $sessionStorage.selectMajRegALL.length; i++) {
      // 根据销售渠道所属的销售大区
      if ($sessionStorage.selectMajRegALL[i].delFlg == "0"
          && $sessionStorage.selectMajRegALL[i].subChnl == chnlNum) {
        var c = {
          key : $sessionStorage.selectMajRegALL[i].majRgnNum,
          text : $sessionStorage.selectMajRegALL[i].majRgnNm
        };
        list.push(c);
      }
    }

    return list;
  };

  // 取得省份（通过销售渠道，销售大区联动取得）
  this.getProList = function(chnlNum, majRgnNum, flg) {
    var list = [];
    if (flg == 1) {
      list.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        key : keyAll,
        text : "全部"
      });
    }
    var proList = {};
    for (var i = 0; i < $sessionStorage.selectMajRegCityReALL.length; i++) {
      if ($sessionStorage.selectMajRegCityReALL[i].subChnl == chnlNum
          && $sessionStorage.selectMajRegCityReALL[i].majRgnNum == majRgnNum) {
        if (!proList[$sessionStorage.selectMajRegCityReALL[i].proNum]) {
          proList[$sessionStorage.selectMajRegCityReALL[i].proNum] = true;
          var c = {
            key : $sessionStorage.selectMajRegCityReALL[i].proNum,
            text : $sessionStorage.selectMajRegCityReALL[i].proNm
          };
          list.push(c);
        }
      }
    }

    return list;
  };

  // 取得城市（通过销售渠道，销售大区，省份联动取得）
  this.getCityList = function(chnlNum, majRgnNum, proNum, flg) {
    var list = [];
    if (flg == 1) {
      list.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        key : keyAll,
        text : "全部"
      });
    }
    for (var i = 0; i < $sessionStorage.selectMajRegCityReALL.length; i++) {
      if ($sessionStorage.selectMajRegCityReALL[i].subChnl == chnlNum
          && $sessionStorage.selectMajRegCityReALL[i].majRgnNum == majRgnNum
          && $sessionStorage.selectMajRegCityReALL[i].proNum == proNum) {
        var c = {
          key : $sessionStorage.selectMajRegCityReALL[i].cityNum,
          text : $sessionStorage.selectMajRegCityReALL[i].cityNm
        };
        list.push(c);
      }
    }

    return list;
  };

  // 取得城市分区（通过销售渠道，城市联动取得）
  this.getPartiList = function(chnlNum, cityNum, flg) {
    var list = [];
    if (flg == 1) {
      list.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        key : keyAll,
        text : "全部"
      });
    }
    for (var i = 0; i < $sessionStorage.selectUrbDistricALL.length; i++) {
      if ($sessionStorage.selectUrbDistricALL[i].delFlg == "0"
          && $sessionStorage.selectUrbDistricALL[i].subChnl == chnlNum
          && $sessionStorage.selectUrbDistricALL[i].city == cityNum) {
        var c = {
          key : $sessionStorage.selectUrbDistricALL[i].partiNum,
          text : $sessionStorage.selectUrbDistricALL[i].partiNm
        };
        list.push(c);
      }
    }

    return list;
  };

  // 取得门店（通过城市分区联动取得）
  this.getStoresList = function(partiNum, flg) {
    var list = [];
    if (flg == 1) {
      list.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        key : keyAll,
        text : "全部"
      });
    }
    for (var i = 0; i < $sessionStorage.selectStoresALL.length; i++) {
      if ($sessionStorage.selectStoresALL[i].delFlg == "0"
          && $sessionStorage.selectStoresALL[i].subPartiNum == partiNum) {
        var c = {
          key : $sessionStorage.selectStoresALL[i].strNum,
          text : $sessionStorage.selectStoresALL[i].strNm
        };
        list.push(c);
      }
    }

    return list;
  }
  this.selectMemGrp = function(func){
    this.get("membGrp/selectAllMembGrp", function(data){
      $sessionStorage.membGrp = data;
      if(func && func != null && typeof func == 'function'){
        func(data);
      }
    });
  };
  //会员组别
  this.getMembGrp = function(flg) {
    var membList = [];
    if (flg == 1) {
      membList.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      membList.push({
        key : keyAll,
        text : "全部"
      });
    }
    for (var i = 0; i < $sessionStorage.membGrp.length; i++) {
      if ($sessionStorage.membGrp[i].grpNm && $sessionStorage.membGrp[i].grpNm != null && $sessionStorage.membGrp[i].grpNm != "") {
        var c = {
          key : $sessionStorage.membGrp[i].oId,
          text : $sessionStorage.membGrp[i].grpNm
        };
        membList.push(c);
      }
    }
    return membList;
  }

  //缓存中取会员组别
  this.stoMembGrp = function(flg) {
    var membList = [];
    if (flg == 1) {
      membList.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      membList.push({
        key : keyAll,
        text : "全部"
      });
    }

    for (var i = 0; i < $sessionStorage.membGrp.length; i++) {
      if ($sessionStorage.membGrp[i].grpNm && $sessionStorage.membGrp[i].grpNm != null && $sessionStorage.membGrp[i].grpNm != "") {
        var c = {
          key : $sessionStorage.membGrp[i].oId,
          text : $sessionStorage.membGrp[i].grpNm
        };
        membList.push(c);
      }
    }
    return membList;
  };
          // 登陆成功后获取消息提示
          this.selectMessageALL = function() {
            $http({
              method : 'GET',
              url : "jsonData/messages.json"
            }).success(function(data) {
              $sessionStorage.Message = data;
            }).error(
                function(data) {
                  toaster.pop('error', '错误', "提示消息数据不存在", 0, 'trustedHtml',
                      function() {
                      });
                });
          };
          /**
           * type 类型 error 红, success 绿, info 蓝 title 标题 messageid 信息的 key值 time 停留时间
           * fun 点击关闭后的回调方法 模板格式的"我爱你{*}是不可能的{*}哼哼";
           */

  this.HintMessage = function(type, title, messageid, time, fun) {
    for (var i = 0; i < $sessionStorage.Message.length; i++) {
      for ( var key in $sessionStorage.Message[i]) {
        if (key == messageid) {
		if (typeof (type) != "string") {
                    var messages = $sessionStorage.Message[i][key];
                    for (var i = 1; i < type.length; i++) {
                      var str1 = "{*}"
                      var s = messages.indexOf(str1);
                      var j = messages.substring(0, s + 3);
                      var k = j.replace("{*}", type[i]);
                      var l = messages.substring(s + 3, messages.length);
                      messages = k + l;
                    }
                    if(type[0]=='error'){
                      title='错误';
                    }else{
                      title='提示';
                    }
                    toaster.pop(type[0], title, messages, time, 'trustedHtml',
                        fun);
                  } else {
                    if(type=='error'){
                      title='错误';
                    }else{
                      title='提示';
                    }
                    toaster.pop(type, title, $sessionStorage.Message[i][key],
                        time, 'trustedHtml', fun);
                  }
          return;
        }
      }
    }
    toaster.pop(type, title, '未知消息ID：'+messageid, time, 'trustedHtml', fun);

  };

  //根据消息id获取消息
  this.getMessageStr = function(messageId) {
    for (var i = 0; i < $sessionStorage.Message.length; i++) {
      for (var key in $sessionStorage.Message[i]) {
        if (key == messageId) {
          return $sessionStorage.Message[i][key];
        }
      }

    }
  };


  //错误消息
  this.errorMessage = function(messageid, fun) {
    this.HintMessage("error", "错误", messageid, 0, fun);
  };

  //成功消息
  this.successMessage = function(messageid, fun) {
    this.HintMessage("success", "成功", messageid, 3000, fun);
  };

  //提示消息
  this.infoMessage = function(messageid, fun) {
    this.HintMessage("info", "提示", messageid, 3000, fun);
  };


  // 商品分类.
  this.selectAllGdsCls = function() {
    this.get("gdsCls/selectAllGdsCls", function (data) {
      $sessionStorage.gdsCls = data;
    });
  };

  //读取商品分类列表
  this.GetGdsClsList = function(supeClsId,text,flg){
    var list = [];
    if (flg == 1) {
      list.push({
        key : keyAll,
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        key : keyAll,
        text : "全部"
      });
    } else if (flg == 3){
      list.push({
        key : keyAll,
        text : text
      });
    } else if (flg == 4) {
      list.push({
        key : "",
        text : "全部"
      });
    } else if(flg == 5){
      list.push({
        key : keyAll,
        text : text
      });
      return list;
    } else if(flg == 6){
      list.push({
        key : keyAll,
        text : '全部'
      });
      return list;
    }

    for (var i = 0; i < $sessionStorage.gdsCls.length; i++) {
      if (($sessionStorage.gdsCls[i].supeClsId == null && supeClsId=="") || $sessionStorage.gdsCls[i].supeClsId == supeClsId) {
        var c = {
          key : $sessionStorage.gdsCls[i].oId,
          text : $sessionStorage.gdsCls[i].cateNm
        };
        list.push(c);
      }
    }

    return list;
  };

  /*
  *
  * 日期转换
  * */
  //日期转换成时间戳
  this.timeToTimestamp = function(dateStr) {
    if (dateStr == undefined || dateStr == null || dateStr == '') {
      return '';
    } else {
      //只能识别xxxx/02/01这种形式
      var date = dateStr.replace(/-/g,'/');
      return new Date(date).getTime();
    }
  };

  //angular中日期格式化
  this.angularDateFor = function(date){
    return $filter('date')(date,'yyyy-MM-dd');
  };

  this.dateToTimeStamp = function(curData) {
    if (this.isNotNullAndUndefined(curData)) {
      if ((curData+"").indexOf("-") != -1) {
        return this.timeToTimestamp(curData);
      } else if( typeof (curData+0) != "number"){
        return curData.getTime();
      }
    }

    return curData;
  };

  // 获取文件服务器路径  /upload/getFileServerUrl
  this.getFileServerUrl = function() {
    this.get("upload/getFileServerUrl", function (data) { ///gdsCls/selectAllGdsCls
      $sessionStorage.upload = data;
    });
  };

  //缓存中取文件服务器路径
  this.getFileServerPath = function(){
    return $sessionStorage.upload;
  };


// 打开确认删除窗口
  this.openDelWindow = function(callback,flag) {
    var modalInstance = $modal.open({
      templateUrl : 'delete.html',
      controller : 'deleteController',
      resolve : {   
    	  //flag 传递flag 0：默认删除  非0 放入回收站
    	  flag : function() {
          if(flag){
              return flag;
            }else{
              return 0;
            }
          },
        //配置需要注入JS
        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/delete.js']);}]
      }
    });

    //父子传递参数
    modalInstance.result.then(function () {
      if(typeof callback == 'function'){
        callback();
      }
    });
  };

  // 打开确认还原窗口
  this.openRestoreWindow = function(callback) {
    var modalInstance = $modal.open({
      templateUrl : 'restore.html',
      controller : 'restoreController',
      resolve : {
        //配置需要注入JS
        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/restore.js']);}]
      }
    });

    //父子传递参数
    modalInstance.result.then(function () {
      if(typeof callback == 'function'){
        callback();
      }
    });
  };

  // 打开确认取消流程窗口
  this.openCancelWindow = function(callback) {
    var modalInstance = $modal.open({
      templateUrl : 'cancel.html',
      controller : 'cancelController',
      resolve : {
        //配置需要注入JS
        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/cancel.js']);}]
      }
    });

    //父子传递参数
    modalInstance.result.then(function () {
      if(typeof callback == 'function'){
        callback();
      }
    });
  };

  //打开选择人员窗口
  this.openRadioStaff = function(size, flag, callback){
    var modalInstance = $modal.open({
      templateUrl : 'radiostaff.html',
      controller :'radioStaffController',
      size : size,
      resolve : {
        //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          if(flag){
            return flag;
          }else{
            return 1;
          }
        },
        //配置需要注入JS
        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);}]
      }

    });
    //父子传递参数
    modalInstance.result.then(function(selectedItem) {
      //给text窗口赋显示格式的值
      if(typeof callback == 'function'){
        callback(selectedItem);
      }

    });
  };

  //打开选择会员窗口
  this.openMemRadioSelect = function(size, flag, callback) {
    var modalInstance = $modal.open({
      templateUrl : 'memRadioSelect.html',
      controller : 'memRadioSelectController',
      size : size,
      resolve : {
        //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          if(flag){
            return flag;
          }else{
            return 1;
          }
        },
        //配置需要注入JS
        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/memRadioSelect.js']);}]
      }

    });



    //父子传递参数
    modalInstance.result.then(function(selectedItem) {
      if(typeof callback == 'function'){
        callback(selectedItem);
      }
    });
  };

  //打开选择商品(多选)窗口
  this.openGdsMultiSelect = function(size, flag, callback){
    var modalInstance = $modal.open({
      templateUrl : 'gdsMultiSelect.html',
      controller :'gdsMultiSelectController',
      size : size,
      resolve : {
        //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          if(flag){
            return flag;
          }else{
            return 1;
          }
        },
        //配置需要注入JS
        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/gdsMultiSelect.js']);}]
      }

    });
    //父子传递参数
    modalInstance.result.then(function(selectedItem) {
      //给text窗口赋显示格式的值
      if(typeof callback == 'function'){
        callback(selectedItem);
      }

    });
  };

  //打开选择商品(单选)窗口
  this.openGdsRadioSelect = function(size, flag, callback){
    var modalInstance = $modal.open({
      templateUrl : 'gdsRadioSelect.html',
      controller :'gdsRadioSelectController',
      size : size,
      resolve : {
        //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          if(flag){
            return flag;
          }else{
            return 1;
          }
        },
        //配置需要注入JS
        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/gdsRadioSelect.js']);}]
      }

    });
    //父子传递参数
    modalInstance.result.then(function(selectedItem) {
      //给text窗口赋显示格式的值
      if(typeof callback == 'function'){
        callback(selectedItem);
      }

    });
  };

  //根据stfNum ,rtnTm,membNum查看会员回访列表
  this.memRevSea = function(stfNum , rtnTm, membNum) {
    var memRevList = [];
    for (var i=0; i<$sessionStorage.memRevData.length; i++) {
      if ($sessionStorage.memRevData[i].stfNum == stfNum &&  $sessionStorage.memRevData[i].rtnTm == rtnTm && $sessionStorage.memRevData[i].membNum == membNum) {

        memRevList = $sessionStorage.memRevData[i];
      }

    }

    return memRevList;
  };

  //判断非空对象
  this.isNotEmptyObject = function(obj){
    var t;
    for (t in obj)
      return true;
    return false;
  };

  //判断非空/*lg*/
  this.isNotNullAndUndefined = function(variable) {
    if (variable != undefined && variable != null && ((variable+"").replace(/(^\s+)|(\s+$)/g, "")) != '') {
      return true;
    } else {
      return false;
    }
  };

  /*
   * lg查询未读消息
   * */
  this.searchUnReadMessage = function($scope) {
    var findUnReadPara = {
      "pageNum": 1,
      "pageSize": 0,
      "params":{
        "status": "1"
      }
    };
    this.post('msgList/msgListSelect', findUnReadPara, function(data){
      $scope.$emit('unReadMsgNum', data.currentSize);
    });

  };

  //encodeURIComponent url 编码
  this.myEncodeURIComponent = function(params) {
      return encodeURIComponent(params);
  };

  //根据oId查看会员回访列表
  this.memRevRecSea = function(oId) {
    var memRevRecList = [];
    for (var i=0; i<$sessionStorage.memRevRecData.length; i++) {
      if ($sessionStorage.memRevRecData[i].oId == oId) {

        memRevRecList = $sessionStorage.memRevRecData[i];
      }

    }

    return memRevRecList;
  };

//商品品牌
  this.getGdsBrd = function(flg) {
    var gdsBrdList = [];
      if (flg == 1) {
        gdsBrdList.push({
          key : keyAll,
          text : ""
        });
      } else if (flg == 2) {
        gdsBrdList.push({
          key : keyAll,
          text : "全部"
        });
      }
      for (var i = 0; i < $sessionStorage.gdsBrd.length; i++) {
        if ($sessionStorage.gdsBrd[i].brdNm && $sessionStorage.gdsBrd[i].brdNm != null && $sessionStorage.gdsBrd[i].brdNm != "") {
          var c = {
            key : $sessionStorage.gdsBrd[i].oId,
            text : $sessionStorage.gdsBrd[i].brdNm
          };
          gdsBrdList.push(c);
        }
      }
    return gdsBrdList;
  }

  //回访事项
  this.selectAllMembRtnRuleRtn = function() {
    this.get("membRtnRule/selectAllMembRtnRuleRtnCont", function (data) {
      $sessionStorage.membRtnRule = data;
    });
  }

  //获取回访事项
  this.getAllMembRtnRuleRtn = function(flg) {
    var list = [];
    if (flg == 1) {
      list.push({
        key:keyAll,
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        key:keyAll,
        text : "全部"
      });
    }
    for (var i = 0; i < $sessionStorage.membRtnRule.length; i++) {
      if (($sessionStorage.membRtnRule[i] != null )) {
        var c = {
          key:'memRule00'+i,
          text : $sessionStorage.membRtnRule[i]
        };
        list.push(c);
      }
    }

    return list;
  }

  //商品规格
  this.gdsSpecUnit = function(flg) {
    var list = [];
    if (flg == 1) {
      list.push({
        text : ""
      });
    } else if (flg == 2) {
      list.push({
        text : "全部"
      });
    }
    for (var i = 0; i < $sessionStorage.membRtnRule.length; i++) {
      if (($sessionStorage.membRtnRule[i] != null )) {
        var c = {
          text : $sessionStorage.membRtnRule[i]
        };
        list.push(c);
      }
    }
  };


  //获取商品属性
//获取商品属性组
  this.selectGdsPropGrps = function(){
    this.get("gdsProp/selectAllGdsPropGrp",function(data){
      $sessionStorage.gdsProp = data;

    })
  }

//根据oId找对应的属性组
  this.findPropArrByOid = function(oId) {
    //防止sessionStorage数据被更改
    var sessGdsPropCopy = angular.copy($sessionStorage.gdsProp);
    for (var i=0; i<sessGdsPropCopy.length; i++) {
      if (sessGdsPropCopy[i].oId == oId) {
        return sessGdsPropCopy[i];
      }
    }
  };



  //根据属性组id找对应的组的标号
  this.findIndexByOid = function(thisAttrArr, oId) {
    //防止sessionStorage数据被更改
    var thisAttrArrCopy = angular.copy(thisAttrArr);
    for (var i=0; i<thisAttrArrCopy.gdsPropList.length; i++) {
      if (thisAttrArrCopy.gdsPropList[i].oId == oId) {
        //return thisAttrArrCopy[i];
        return i;
      }
    }
  };




  //根据oId找对应的属性组的名称
  this.findPropArrNameByOid = function(oId) {
    //防止sessionStorage数据被更改
    var sessGdsPropCopy = angular.copy($sessionStorage.gdsProp);
    for (var i=0; i<sessGdsPropCopy.length; i++) {
      if (sessGdsPropCopy[i].oId == oId) {
        return sessGdsPropCopy[i].gdsPropGrpNm;
      }
    }
  }

  //key  value 拼接数据 key  value  0手工录入
  this.gdsPropKeyVal = function(gdsPrIdArr,gdsPropCp) {
    var list = {};

    for(var i=0; i<gdsPropCp.length; i++) {
      if (gdsPrIdArr[i] != null) {

        list[gdsPropCp[i].oId] = gdsPrIdArr[i];
      }
    }

    return list;
  }

  //图片上传提示
  this.imgPop = function() {
    toaster.pop('error', '错误', '请选择图片再上传', 2000, 'trustedHtml', function() {});
  }

  //console.log控制台打印消息
  this.myConsoleLog = function(msg) {
    //console.log(msg);
  };
  
  this.str2Arr = function(str, deleteEmpty, regex){
	  var split = regex && regex != null && "" != regex ? regex : ",";
	  var isDeleteEmpty  = deleteEmpty && deleteEmpty != null && deleteEmpty == true;
	  var arr = [];
	  var result = [];
	  if(str && str != null && str.length > 0){
		  arr = str.split(split);
		  if(deleteEmpty){
			  for(var i=0; i<arr.length; i++){
				  if(arr[i] != null && arr[i].trim() != ''){
					  result.push(arr[i]);
				  }
			  }
		  }else{
			  result = arr;
		  }
	  }
	  return result;
  };
  
  this.getUpldFileNm = function(requestData, callbackFunction){
	    this.post("commonDataController/getUploadFileInfo", requestData, function(data){
	    	callbackFunction(data.upldFileNm);
	    });
  }

});

////下载文件
//this.downloadFile=function(fileName, content){
//  var aLink = document.createElement('a');
//  var evt = document.createEvent("HTMLEvents");
//  evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
//  aLink.download = fileName;
//  aLink.href = content;
//  aLink.dispatchEvent(evt);
//}
//
//
////导入接口封装
//this.importFile=function(file, url, successMsg, errorFileName, func){
//
//  if(file==undefined || file==null|| file==""){
//    this.HintMessage("error","错误","msg.common.20006",3000,function () {});
//    return;
//  }
//  Upload.upload({
//    url : url,
//    data : {
//      file:file
//    }
//  }).then(function(resp) {
//    if (resp.data) {
//      var messageString = "";
//      if (resp.data.meta.success) {//导入成功
//        func();
//      }else if(resp.data.data == null || resp.data.data == ''){//文件非法
//        if (data.meta.message) {
//          messageString = data.meta.message + "<br />";
//        }
//
//        if (resp.data.validateErrorList && resp.data.validateErrorList.length > 0) {
//          for ( var i in data.validateErrorList) {
//            messageString += data.validateErrorList[i].validateMessage
//                + "<br />";
//          }
//        }
//        toaster.pop('error', '错误', messageString, 0, 'trustedHtml',
//            function() {
//            });
//      } else {//导入数据出错
//        this.downloadFile(errorFileName,"/CrmWeb/api/upload/delLogs/"+resp.data.data)
//      }
//    }
//
//  }, function(resp) {
//    //导入失败
//  });
//
//}

app.service("fileUploadApi", function($http, toaster, $sessionStorage,$filter,$modal,comApi) {
  //吕晓亮整理文件共通代码
  //上传标志
  this.uploadFlag = {
    "UN_SEL": "0",       //未选中文件
    "UN_UPLOAD": "1",        //未上传文件
    "UPLOAD_SUCC": "2",     //已成功上传文件
    "UPLOAD_FAILED": "3"       //上传失败
  };

  //文件业务类型
  this.fileType = {
    "GDS_THUM": "goodsImages",  //商品缩略图
    "MEM_THUM": "userfhotourl", //会员缩略图
    "IDC_THUM": "idcardpospic", // 身份证
    "BNK_THUM": "bankfhotourl",  // 银行卡
    "ATT_THUM":"attachment"  //附件
  };

  //创建文件对象
  this.newFileItem = function () {
    return {
      "basePath": "",
      "fileUrl": "",                                //图片url
      "flag": this.uploadFlag.UN_SEL,         //上传标志
      "file": ""                                   //文件对象
    };
  };

  //清除图片
  this.clearFileItem = function (imgItem) {
    imgItem.fileUrl = " ";
    imgItem.flag = this.uploadFlag.UN_SEL;
    imgItem.file = "";
    imgItem.basePath = "";
  };

  //创建文件上传对象
  this.newFileUpload = function (type) {

    return {"fullFlag":"0", "maxFile": "1", "fileType": type, "fileArray": [this.newFileItem()]};
  };

  //创建单文件上传对象
  this.newSingleFileUpload = function (type) {
    var singleFile = this.newFileUpload(type);
    singleFile.maxFile = 1;
    return singleFile;
  };

  //创建多文件上传对象
  this.newMultiFileUpload = function (type, maxFile) {
    var multiFile = this.newFileUpload(type);
    if (maxFile && maxFile > 0) {
      multiFile.maxFile = maxFile;
    } else {
      multiFile.maxFile = 8;
    }
    return multiFile;
  };

  //检查图片文件格式
  this.checkImgFileFormat = function (file, $scope) {
    if (parseInt(file.size) > 2097152) {
      $scope.$apply(function ($scope) {
        comApi.errorMessage("msg.common.10004");
      });
      return false;
    } else if (!/\.(jpg|png|JPG|PNG)$/.test(file.name)) {
      $scope.$apply(function ($scope) {
        comApi.errorMessage("msg.common.10003");
      });
      return false;
    }
    return true;
  };

  //获取上文件对象中选择一个空位置
  this.getFreeFileIndex = function (fileData) {
    var i;

    //单选图片，可直接替换文件
    if(fileData.maxFile == 1){
      return 0;
    }
    //在当前图片中查找未使用的图片对象
    for (i = 0; i < fileData.fileArray.length; i++) {
      if (fileData.fileArray[i].flag == this.uploadFlag.UN_SEL) {//未选择图片
        return i;
      }
    }
    //未找到空闲，并且还可再上传文件
    if (i < fileData.maxFile) {
      fileData.fileArray.push(this.newFileItem());
      return i;
    }

    //未找到空闲的文件对象
    return -1;
  };

  this.selectFile = function (evt, fileData, checkFunc, fileUpldApi, $scope, comApi) {

    evt.target.value = "";
   angular.element(evt.target).unbind('change');
   angular.element(evt.target).one('change', function (evt) {
      for (var i = 0; i < evt.target.files.length; i++) {
        var file = evt.target.files[i];
        if(checkFunc && typeof checkFunc == 'function') {
          if (checkFunc(file,$scope) == false){
            return;
          }
        }
        var freeIndex = fileUpldApi.getFreeFileIndex(fileData);
        if (freeIndex < 0) {
          $scope.$apply(function ($scope) {
            comApi.errorMessage("msg.common.21001");
          });
          break;
        }
        var reader = new FileReader();
        reader.freeIndex = freeIndex;
        reader.onload = function (evt) {
          $scope.$apply(function ($scope) {
            fileData.fileArray[evt.target.freeIndex].basePath = "";
            fileData.fileArray[evt.target.freeIndex].fileUrl = evt.target.result;
            $scope.$emit("selectFile", fileData);
          });
        };
        //文件
        fileData.fileArray[freeIndex].file = file;
        fileData.fileArray[freeIndex].flag = fileUpldApi.uploadFlag.UN_UPLOAD;
        reader.readAsDataURL(file);
      }
    });
  };

  //删除图片
 this.delFileItem = function (fileData, fileItem, $scope) {
    if (fileData.fileArray.length > 1) {
      for (var i = 0; i < fileData.fileArray.length; i++) {
        if (fileItem == fileData.fileArray[i]) {
          fileData.fileArray.splice(i, 1);
        }
      }
    } else if (fileData.fileArray.length == 1) {
      this.clearFileItem(fileItem);
    }
    $scope.$emit("delFile", fileData);
  };
  //上传64图片
  this.uploadBase64Images = function (fileData, fileUpldApi) {
    var files = [];
    var fileIndex = [];
    for (var i = 0; i < fileData.fileArray.length; i++) {
      if (fileData.fileArray[i].flag == fileUpldApi.uploadFlag.UN_UPLOAD
          || fileData.fileArray[i].flag == fileUpldApi.uploadFlag.UPLOAD_FAILED) {
        files.push(fileData.fileArray[i].file);
        fileIndex.push(i);
      }
    }

    if(files.length <= 0){
      comApi.errorMessage("msg.common.21005");
      return;
    }
    var requestData = {"type":fileData.fileType, base64Images:files};
    comApi.post("upload/base64Images", requestData, function(data){
      for (var j = 0; j < data.length; j++) {
        fileData.fileArray[fileIndex[j]].basePath = comApi.getFileServerPath();
        fileData.fileArray[fileIndex[j]].fileUrl = data[j];
        if (!data[j] || data[j] == "") {//上传失败
          fileData.fileArray[fileIndex[j]].flag = fileUpldApi.uploadFlag.UPLOAD_FAILED;
          comApi.errorMessage("msg.common.21003");
        } else {
          fileData.fileArray[fileIndex[j]].flag = fileUpldApi.uploadFlag.UPLOAD_SUCC;
          comApi.successMessage("msg.common.21002");
        }
      }
    });
  };
  //上传图片
  this.uploadFile = function (fileData, fileUpldApi) {

    var files = [];
    var fileIndex = [];
    for (var i = 0; i < fileData.fileArray.length; i++) {
      if (fileData.fileArray[i].flag == fileUpldApi.uploadFlag.UN_UPLOAD
          || fileData.fileArray[i].flag == fileUpldApi.uploadFlag.UPLOAD_FAILED) {
        files.push(fileData.fileArray[i].file);
        fileIndex.push(i);
      }
    }

    if(files.length <= 0){
    	if(fileData.fileType == "attachment"){
    		comApi.errorMessage("msg.common.20008");
    	}else{
    		comApi.errorMessage("msg.common.21005");
    	}   
      return;
    }

    $http({
      method: "POST",
      url: "/CrmWeb/api/upload/files",
      headers: {
        "Content-Type": undefined
      },
      transformRequest: function (data) {
        var formData = new FormData();
        formData.append("type", data.type);
        for (var i = 0; i < files.length; i++) {
          formData.append("file", files[i]);
        }
        return formData;
      },
      data: {
        type: fileData.fileType,
        file: files
      }
    }).success(function (data) {
      //请求成功
      for (var j = 0; j < data.data.length; j++) {
        fileData.fileArray[fileIndex[j]].basePath = comApi.getFileServerPath();
        fileData.fileArray[fileIndex[j]].fileUrl = data.data[j];
        if (!data.data[j] || data.data[j] == "") {//上传失败
          fileData.fileArray[fileIndex[j]].flag = fileUpldApi.uploadFlag.UPLOAD_FAILED;
          if(fileData.fileType == "attachment"){
              comApi.errorMessage("msg.common.20002");
          }else{
              comApi.errorMessage("msg.common.21003");}
        } else {
          fileData.fileArray[fileIndex[j]].flag = fileUpldApi.uploadFlag.UPLOAD_SUCC;
          if(fileData.fileType == "attachment"){
        	  comApi.successMessage("msg.common.20001"); 
          }else{
        	  comApi.successMessage("msg.common.21002");  
          }
        }
      }
    }).error(function () {
    	if(fileData.fileType == "attachment"){
    		comApi.errorMessage("msg.common.20009");
    	}else{
    	    comApi.errorMessage('msg.common.21004');	
    	}
    });
  };

  //获取上传成功的文件URL列表
  this.getUploadSuccFileUrlList = function(fileData){
    var list = [];
    for(var j = 0; j < fileData.fileArray.length; j++) {
      if(fileData.fileArray[j].flag == this.uploadFlag.UPLOAD_SUCC) {
        list.push(fileData.fileArray[j].fileUrl);
      }
    }
    return list;
  };

    this.getUploadSuccFileUrl = function(fileData){
    var url = "";
    if(fileData.fileArray[0].flag == this.uploadFlag.UPLOAD_SUCC) {
      url=fileData.fileArray[0].fileUrl;
    }

    return url;
  };

  //添加已经上传至服务器的文件
  this.insertUploadSuccFile = function(fileData, fileUrl) {
    var freeIndex = this.getFreeFileIndex(fileData);
    if(freeIndex < 0){
      comApi.errorMessage("msg.common.21001");
      return false;
    }

    fileData.fileArray[freeIndex].fileUrl = fileUrl;
    fileData.fileArray[freeIndex].basePath = comApi.getFileServerPath();
    fileData.fileArray[freeIndex].flag = this.uploadFlag.UPLOAD_SUCC;

    return true;
  };

  //添加
  this.insertNewFile = function(fileData) {
    var freeIndex = this.getFreeFileIndex(fileData);
    if(freeIndex < 0){
      comApi.errorMessage("msg.common.21001");
      return false;
    }
    return true;
  };

});
/**
 * . Created by 王健 on 2016-4-5.
 */
'use strict';
/**
 * 共通用filter
 */
app.filter("dicNameFilter", function($sessionStorage) {
	return function(input, cateNum){
		var name = "";
		var dic = [];
		// 取得分类编号对应的所有明细
		for (var i = 0; i < $sessionStorage.dic.length; i++) {
			if ($sessionStorage.dic[i].key == cateNum) {
				dic = $sessionStorage.dic[i].value
				break;
			}
		}
        // 取得明细编号对应的名称
        for (var i = 0 ; i < dic.length; i++) {
        	if (dic[i].key == input) {
        		name = dic[i].text;
        	}
        }
        return name;
    }
});
//来源渠道
app.filter("chnlInfoFilter", function($sessionStorage) {  // $sessionStorage.selectChnlInfoALL
	return function(input){
		// 取得分类编号对应的所有明细
		for (var i = 0; i < $sessionStorage.selectChnlInfoALL.length; i++) {
			if ($sessionStorage.selectChnlInfoALL[i].chnlNum == input) {
				return $sessionStorage.selectChnlInfoALL[i].chnlNm;
			}
		}
	}
});

//会员组别(根据组别id找对应的组别名称)
app.filter("membGrpFilter", function($sessionStorage) {  // $sessionStorage.selectChnlInfoALL
	return function(input){
		// 取得分类编号对应的所有明细
		for (var i = 0; i < $sessionStorage.membGrp.length; i++) {
			if ($sessionStorage.membGrp[i].oId == input) {
				return $sessionStorage.membGrp[i].grpNm;
			}
		}
	}
});


//职位过滤
app.filter('stfBasPosNum', function(comApi) {
	return function(input) {
		for (var i = 0; i < comApi.getSelectBoxJob(0).length; i++) {
			if (comApi.getSelectBoxJob(0)[i].key == input) {
				return comApi.getSelectBoxJob(0)[i].text;
			}

		}
	};
});
// 职位等級
app.filter('stfBasPosGrdNum', function(comApi) {
  return function(input, posnum) {
    for (var i = 0; i < comApi.getSelectBoxPosLvl(input, 0).length; i++) {
      if (comApi.getSelectBoxPosLvl(input, 0)[i].key == posnum) {
        return comApi.getSelectBoxPosLvl(input, 0)[i].text;
      }

    }
  };
});

//根据等级编号查询等级名称/*lg*/
app.filter('stfBasPosLvlFilter', function($sessionStorage){
  return function(input) {
    for (var i=0; i<$sessionStorage.selectPosRelPosLvlALL.length; i++) {
      if ($sessionStorage.selectPosRelPosLvlALL[i].posGrdNum == input) {
        return $sessionStorage.selectPosRelPosLvlALL[i].posGrdNm;
      }
    }
  }
});

// 考勤规则日期设置
app.filter('attendRule', function() {
  return function(input) {

    if(input.length==0){
      return;
    }
    var b = "";
    for (var a1 = 0; a1 < input.length; a1++) {
      if (input[a1] != "-") {
        b += input[a1];
      }
    }
    var unsorted = [];
    for (var b1 = 0; b1 < b.split(",").length; b1++) {
      unsorted[b1] = parseInt(b.split(",")[b1]);
    }
    unsorted.sort()
    console.log(unsorted);
    var kbhd = 0;
    var zhi = "";
    for (var i = 0; i < unsorted.length; i++) {
      if (i == 0) {
        kbhd = unsorted[i].toString().substring(0, 6);
        zhi += unsorted[i].toString().substring(0, 4) + "-"
            + unsorted[i].toString().substring(4, 6) + "-"
            + unsorted[i].toString().substring(6, 8) + "|";
      } else {
        if (kbhd == unsorted[i].toString().substring(0, 6)) {

          zhi += unsorted[i].toString().substring(6, 8).toString() + "|";
          kbhd = unsorted[i].toString().substring(0, 6);
        } else {

          if (kbhd.substring(0, 4) == unsorted[i].toString().substring(0, 4)) {

            zhi = zhi.substring(0, zhi.length - 1);
            zhi += "," + unsorted[i].toString().substring(4, 6) + "-"
                + unsorted[i].toString().substring(6, 8) + "|";

          } else {
            zhi = zhi.substring(0, zhi.length - 1);
            zhi += "," + unsorted[i].toString().substring(0, 4) + "-"
                + unsorted[i].toString().substring(4, 6) + "-"
                + unsorted[i].toString().substring(6, 8) + "|";

          }

          kbhd = unsorted[i].toString().substring(0, 6);

        }

      }
    }
    return zhi.substring(0, zhi.length - 1);
  };
});

// 金额格式化
app
    .filter('fromMoney',
        function(comApi) {
          return function(input) {
            if (input == "0") {
              return "0";
            }
            input = parseFloat((input + "").replace(/[^\d\.-]/g, ""))
                .toFixed(2)
                + "";
            var l = input.split(".")[0].split("").reverse(), r = input
                .split(".")[1], t = "";
            for (var i = 0; i < l.length; i++) {
              t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
          };
        });

// 照片路径
app.filter('imgpath', function(comApi) {
  return function(input) {
    if (input !== null && input !== undefined && input !== '') {
      return comApi.getFileServerPath() + input;
    } else {
      return "";
    }
  };
});
// 部門状态过滤
app.filter('stfBasSubDep', function(comApi) {
  return function(input) {
    for (var i = 0; i < comApi.getSelectBoxDepartment(0).length; i++) {
      if (comApi.getSelectBoxDepartment(0)[i].key == input) {
        return comApi.getSelectBoxDepartment(0)[i].text;
      }

    }
  };
});
// 省市区 省城市 县 superRgnNum
app.filter('stfBasPCV', function(comApi, $sessionStorage) {
  return function(input) {
    for (var i = 0; i < $sessionStorage.selectAddressALL.length; i++) {
      if ($sessionStorage.selectAddressALL[i].rgnNum == input
          && $sessionStorage.selectAddressALL[i].delFlg == "0") {
        return $sessionStorage.selectAddressALL[i].rgnNm

      }
    }
  }

});

//回访规则
app.filter('rtnRuleFilter', function($sessionStorage){
  return function(input) {
    for (var i=0; i<$sessionStorage.membRtnRule.length; i++) {
      if (input == $sessionStorage.membRtnRule[i]) {
        return true;
      }
    }

    return false;
  }
});


//回访规则中没有的选项,但查询出来接口中有的回访规则
app.filter('rtnRuleDelFilter', function(comApi, $sessionStorage){
  return function(input) {
    var allMembRtnRule = angular.copy(comApi.getAllMembRtnRuleRtn(0));
    if (comApi.isNotNullAndUndefined(input)) {
      var c = {
        key:'memRule00'+$sessionStorage.membRtnRule.length,
        text : input
      };
      allMembRtnRule.push(c);
    }

    return allMembRtnRule;
  }
});

app.filter('trustHtml', function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  }
});

//getSelectSkinType  肌肤类型
/*
app.filter('skinType', function(comApi) {
	return function(input) {
		for (var i = 0; i < comApi.getSelectSkinType('C025',1).length; i++) {
			if (comApi.getSelectSkinType('C025',1)[i].key == input) {
				return comApi.getSelectSkinType(0)[i].text;
			}

		}
	};
});*/

//缩略显示
app.filter("textAbbr", function() {
	return function(input, maxLen){
		var text = "";
		if(input && input != null && input.length > (maxLen+1)){
			text = input.substr(0, maxLen);
			text += "...";
		}else{
			text = input;
		}
		return text;
	}
});

app.filter('customCurrency', function($filter) {
  return function(amount, currencySymbol) {
    var currency = $filter('currency');

    if (amount < 0) {
      return currency(amount, currencySymbol).replace("(" + currencySymbol,
          currencySymbol + "-").replace(")", "");
    }

    return currency(amount, currencySymbol);
  };
  });

//非空过滤器
app.filter("isNotNullFilter", function() {  // $sessionStorage.selectChnlInfoALL
  return function(input) {
    if (input != undefined && input != null && ((input+"").replace(/(^\s+)|(\s+$)/g, "")) != '') {
      return true;
    } else {
      return false;
    }
  }
});

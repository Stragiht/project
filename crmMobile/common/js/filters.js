'use strict';

/* Filters */

var appFilter = angular.module('appFilters', []);

appFilter.filter('defaultFigure', function(comApi) {
  return function(input) {
    if (input !== null && input !== undefined && input !== '') {
      return comApi.getFileServerPath()+input;
    }else{
      return "common/images/touxiang.png";
    }
  }
});

//照片路径
app.filter('imgpath', function(comApi) {
  return function(input) {
    if (input !== null && input !== undefined && input !== '') {
      return comApi.getFileServerPath()+input;
    } else {
      return "";
    }
  };
});

//图片压缩显示
app.filter('pictureCompression', function(comApi){
    return function(input, width, height) {
        if (input !== null && input !== undefined && input !== '') {
            return comApi.getFileServerPath() + input.split("/",3).join("/") + '/' + width + '_' + height + '^' + input.split("/")[3];
        } else {
            return "";
        }
    }
});

//星期天
appFilter.filter('days', function() {
	return function(input) {
		if(input=="Sun"){
			return  "周日";
		}else if(input=="Mon"){
			return  "周一";
		}else if(input=="Tue"){
			return  "周二";
		}else if(input=="Wed"){
			return  "周三";
		}else if(input=="Thu"){
			return  "周四";
		}else if(input=="Fri"){
			return  "周五";
		}else if(input=="Sat"){
			return  "周六";
		}
		return  input;
	};
});
//人员列表-姓名截取后两位
appFilter.filter('stfNmLast2', function() {
	  return function(input) {
	    if (input !== null && input !== undefined && input !== '') {
	    	var newLength = 0;
	    	var newStr = "";
	    	var temp=new Array();
	    	var chineseRegex = /[^\x00-\xff]/g;
	    	var singleChar = "";
	    	var strLength = input.replace(chineseRegex,"**").length;
	    	for(var i = strLength - 1 ; i >= 0 ; i--)
	    	{
	    	        singleChar = input.charAt(i).toString();
	    	        if( singleChar != null && singleChar != "" && singleChar != undefined ){
	    		    	        if(singleChar.match(chineseRegex) != null)
	    			    	        {
	    			    	            newLength += 2;
	    			    	            if(newLength > 4)
	    				    	           {
	    				    	            break;
	    				    	           }
	    			    	        }    
	    			    	        else
	    			    	        {
	    			    	            newLength++;
	    			    	            if(newLength > 2)
	    				    	           {
	    				    	            break;
	    				    	           }
	    			    	
	    			    	        }

	    		    	        temp.push(singleChar);
	    	        }
	    	    }
	    	newStr = newStr + temp.pop();
	    	newStr = newStr + temp.pop();
	    	return newStr;
	    }else{
	      return "";
	    }
	  }
	});
//列表页--城市显示前两个字
appFilter.filter('cityLast2', function() {
  return function(input) {
    if (input !== null && input !== undefined && input !== '') {
      var newLength = 0;
      var newStr = "";
      var temp=new Array();
      var chineseRegex = /[^\x00-\xff]/g;
      var singleChar = "";
      for(var i = 1 ; i >= 0 ; i--)
      {
                singleChar = input.charAt(i).toString();
        if( singleChar != null && singleChar != "" && singleChar != undefined ){
                  if(singleChar.match(chineseRegex) != null)
                    {
                        newLength += 2;
                        if(newLength > 4)
                         {
                          break;
                         }
                    }    
                    else
                      {
                          newLength++;
                          if(newLength > 2)
                           {
                            break;
                           }
              
                      }
          
                  temp.push(singleChar);
        }
            }
      newStr = newStr + temp.pop();
      newStr = newStr + temp.pop();
      return newStr;
    }else{
      return "";
    }
  }
});
//超过位数时截取转换成...
appFilter.filter('characters', function () {
    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length >  (chars+1)) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            }else{
                while(input.charAt(input.length-1) === ' '){
                    input = input.substr(0, input.length -1);
                }
            }
            return input + '…';
        }
        return input;
    };
});
app.factory('MyhttpFilters', function($sessionStorage,$location) {
    var sessionInjector = {
        request: function(config) {
            //请求之前
            //if($sessionStorage.ustu){
            //    config.headers['b-us-up-biduke'] = $sessionStorage.ustu;
            //}
            return config;
        },
        response: function(config,header,header1,header2) {
            //请求成功之后
            //if(config.headers("b-us-dw-biduke")){
            //    $location.path(config.headers("b-us-dw-biduke"));
            //}
            return config;
        },
        requestError : function(config) {
            //请求之前错误
            return config;
        },
        responseError: function(config) {
            //请求之后错误
            return config;
        }
    };
    return sessionInjector;
});

//日期编辑Filter
appFilter.filter('dateEditFilter', function($filter) {
      return function(input) {
        if (input !== null && input !== undefined && input !== '') {
            var inputDate = new Date($filter("date")(input, 'yyyy/MM/dd') + " 00:00:00");
            var today = new Date();
            var times = today.getTime() - inputDate.getTime();
            var days = parseInt(times / (1000 * 60 * 60 * 24));
            if (days < 1) {
              return "今天";
            } else if (days < 2) {
              return "昨天";
            } else {
              return $filter("date")(input, 'yyyy-MM-dd');
            }
        }else{
          return "";
        }
      }
    });
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('MyhttpFilters');
}]);
//
app.filter('customCurrency', function ($filter) {
  return function(amount, currencySymbol){
    var currency = $filter('currency');         

    if(amount < 0){
        return currency(amount, currencySymbol).replace("(" + currencySymbol, currencySymbol + "-").replace(")", ""); 
    }

    return currency(amount, currencySymbol);
};
});




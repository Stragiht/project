'use strict';

/* directives */

var appDirective = angular.module('appDirectives', []);

appDirective.directive('rjPositionMiddle', ['$window', function($window){
    return{
        replace: false,
        link: function(scope, iElm, iAttrs, controller){
            var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
            if (height >= 0) {
                iElm[0].style.top = (height / 2 + 44) + 'px';
            }else{
                iElm[0].style.top = 44 + 'px';
            }
        }
    }
}]).directive('userPower',['userPowerFactory',function(userPowerFactory) {
  // 功能点详细
  return {
    link: function(scope, element, attrs) {
        if(!angular.isString(attrs.userPower))
            throw "出现异常";
        var value = attrs.userPower.trim();
        var notPermissionFlag = value[0] === '!';
        if(notPermissionFlag) {
            value = value.slice(1).trim();
        }

        function toggleVisibilityBasedOnPermissionMO() {
            var userPower = userPowerFactory.userPower(value);
            if(userPower && !notPermissionFlag || !userPower && notPermissionFlag){
                // element.show();
            }else{
                element.remove();
            }
        }
        toggleVisibilityBasedOnPermissionMO();
        scope.$on('permissionsChanged', toggleVisibilityBasedOnPermissionMO);
    }
};
}]).directive('userPowerFm',['userPowerFactory',function(userPowerFactory) {
  // 功能模块
  return {
    link: function(scope, element, attrs) {
        if(!angular.isString(attrs.userPowerFm))
            throw "出现异常";
        var value = attrs.userPowerFm.trim();
        var notPermissionFlag = value[0] === '!';
        if(notPermissionFlag) {
            value = value.slice(1).trim();
        }

        function toggleVisibilityBasedOnPermissionMO() {
            var userPower = userPowerFactory.userPowerFm(value);
            if(userPower && !notPermissionFlag || !userPower && notPermissionFlag){
                // element.show();
            }else{
                element.remove();
            }
        }
        toggleVisibilityBasedOnPermissionMO();
        scope.$on('permissionsChanged', toggleVisibilityBasedOnPermissionMO);
    }
};
}]).directive('userPowerFp',['userPowerFactory',function(userPowerFactory) {
  // 功能点
  return {
    link: function(scope, element, attrs) {
        if(!angular.isString(attrs.userPowerFp))
            throw "出现异常";
        var value = attrs.userPowerFp.trim();
        var notPermissionFlag = value[0] === '!';
        if(notPermissionFlag) {
            value = value.slice(1).trim();
        }

        function toggleVisibilityBasedOnPermissionMO() {
            var userPower = userPowerFactory.userPowerFp(value);
            if(userPower && !notPermissionFlag || !userPower && notPermissionFlag){
                // element.show();
            }else{
                element.remove();
            }
        }
        toggleVisibilityBasedOnPermissionMO();
        scope.$on('permissionsChanged', toggleVisibilityBasedOnPermissionMO);
    }
};
}]).directive('errSrc',['$window',function() {
	return {
	    link: function(scope, element, attrs) {
	      element.bind('error', function() {
	        if (attrs.src != attrs.errSrc) {
	          attrs.$set('src', attrs.errSrc);
	        }
	      });
	    }
	}
}]).directive('onFinishTabWithIndex', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            scope.$emit('ionTabFinished');
        }
    };
}).directive( 'whenActive', function ( $location ) {
    return {
        scope: true,
        link: function ( scope, element, attrs ) {
            //console.log(element);
            element[0].focus;
            //alert(element[0].placeholder+"==33");
            //element[0].placeholder = '我是冷雨';
            /*scope.$on( '$routeChangeSuccess', function () {
                if ( $location.path() == element.attr( 'href' ) ) {
                    element.addClass( 'active' );
                }
                else {
                    element.removeClass( 'active' );
                }
            });*/
        }
    };
}).directive('operationVerify', ['userPowerFactory', '$sessionStorage', function(userPowerFactory, $sessionStorage) {
	//常用操作权限判定
    return {
        link: function(scope, element, attrs) {
            if(!attrs.userPowerType)
                throw "出现异常";
            if(!angular.isString(attrs.functionNum))
                throw "出现异常";

            var value = attrs.functionNum.trim();
            var notPermissionFlag = value[0] === '!';
            if(notPermissionFlag) {
                value = value.slice(1).trim();
            }
            var type = attrs.userPowerType;

            function toggleVisibilityBasedOnPermissionMO() {
                var userPower = "";
                switch(type) {
                    case "0":
                    	notPermissionFlag = false;
                    	userPower = true;
                    	break;
                    case "1":
                        userPower = userPowerFactory.userPowerFm(value);
                    	break;
                    case "2":
                        userPower = userPowerFactory.userPowerFp(value);
                    	break;
                    case "3":
                        userPower = userPowerFactory.userPower(value);
                    	break;
                    default:
                    	notPermissionFlag = false;
                	    userPower = false;
                    	
                }
                if(userPower && !notPermissionFlag || !userPower && notPermissionFlag){
                    // element.show();
                }else{
                    element.remove();
                    //没有权限时，当前用户允许表示常用操作的个数随之减少
                    scope.homeInfo.operationCnt--;
                }
            }
            toggleVisibilityBasedOnPermissionMO();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermissionMO);
        }
    }
}]).directive('menuVerify', ['userPowerFactory', function(userPowerFactory) {
	//常用操作权限判定
    return {
        link: function(scope, element, attrs) {
            var value = attrs.menuVerify.trim();

            function toggleVisibilityBasedOnPermissionMO() {
                var menuPower = userPowerFactory.menuPower(value);
                if(menuPower){
                    // element.show();
                }else{
                    element.remove();
                }
            }
            toggleVisibilityBasedOnPermissionMO();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermissionMO);
        }
    }
}]).directive('myNodataShow', ['$animate', function($animate) {
	  return {
		    restrict: 'A',
		    multiElement: true,
		    link: function(scope, element, attr) {
		      var ionContent,parentElement;
		      parentElement = element.parent();
		      while (parentElement.prop("tagName") && parentElement.prop("tagName") != "ION-CONTENT" && parentElement.prop("tagName") != "BODY") {
		        parentElement = parentElement.parent();
		      }
		      if (parentElement.prop("tagName") == "ION-CONTENT") {
		        ionContent = parentElement;
		      }
		      scope.$watch(attr.myNodataShow, function myNodataWatchAction(value) {
		        if (ionContent) {
		          if (value) {
		            if (!ionContent.hasClass("full_height")) {
		              ionContent.addClass("full_height");
		            }
		          } else {
		            if (ionContent.hasClass("full_height")) {
		              ionContent.removeClass("full_height");
		            }
		          }
		        }
		        $animate[value ? 'removeClass' : 'addClass'](element, 'ng-hide', {
		          tempClasses: 'ng-hide-animate'
		        });
		      });
		    }
		  };
		}]);

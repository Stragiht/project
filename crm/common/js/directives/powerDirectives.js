/**
 * Created by 张玉良 on 2016-4-6.
 */
app.directive('userPower',['userPowerFactory',function(userPowerFactory) {
    return {
        link: function(scope, element, attrs) {
            if(!angular.isString(attrs.userPower))
                throw "出现异常";
            var value = attrs.userPower.trim();
            var notPermissionFlag = value[0] === '!';
            if(notPermissionFlag) {
                value = value.slice(1).trim();
            }

            function toggleVisibilityBasedOnPermission() {
                var userPower = userPowerFactory.userPower(value);
                if(userPower && !notPermissionFlag || !userPower && notPermissionFlag){
                    element.show();
                }else{
                    element.remove();
                }
            }
            toggleVisibilityBasedOnPermission();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
}])
    .directive('userPowerMo',['userPowerFactory',function(userPowerFactory) {
        return {
            link: function(scope, element, attrs) {
                if(!angular.isString(attrs.userPowerMo))
                    throw "出现异常";
                var value = attrs.userPowerMo.trim();
                var notPermissionFlag = value[0] === '!';
                if(notPermissionFlag) {
                    value = value.slice(1).trim();
                }

                function toggleVisibilityBasedOnPermissionMO() {
                    var userPowerMo = userPowerFactory.userPowerMo(value);
                    if(userPowerMo && !notPermissionFlag || !userPowerMo && notPermissionFlag){
                        element.show();
                    }else{
                        element.remove();
                    }
                }
                toggleVisibilityBasedOnPermissionMO();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermissionMO);
            }
        };
    }]).directive('onFinishRenderFilters',[function(){
        return {
            restrict:'A',
            link:function ($scope, element, attrs, controller) {

                var max_width = 0;

                var ulMaxWidth = parseFloat($('#ulIdWidth').css('max-width'));

                $('#ulIdWidth li').each(function(index){
                    max_width += $(this).width();
                    if (max_width > ulMaxWidth) {
                        $('#ulIdWidth li').eq(index).addClass("goto-nav");
                    }
                });

                if (max_width < ulMaxWidth) {
                    $(".dropdown_nav").css('display','none');
                } else {
                    $('.goto-nav').css('display','none');
                }

            }
        };
    }]);
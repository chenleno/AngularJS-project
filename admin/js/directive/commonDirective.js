/**
 * Created by chenqi1 on 2017/6/19.
 */
angular.module('app')
    //loading框的指令
    .directive('ctrlLoading', [function () {
        return {
            restrict: 'E',
            templateUrl: 'admin/blocks/loading.html',
            replace: true,

        };
    }])

    //成功框的指令
    .directive('ctrlSuccess', [function () {
        return {
            restrict: 'E',
            templateUrl: 'admin/blocks/success.html',
            replace: true,

        };
    }])

    //失败框的指令
    .directive('ctrlError', [function () {
        return {
            restrict: 'E',
            templateUrl: 'admin/blocks/error.html',
            replace: true,

        };
    }])


    //新建文件夹默认选中输入框文本
    .directive('createFocus', ['$resource', '$timeout', 'checkBtnService','mediaService', function ($resource, $timeout, checkBtnService , mediaService) {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {

                ele.on('click', function () {

                    if(mediaService.checkRename('.listTr')){
                        checkBtnService.check('/api/mps-filemanager/file?op=create', 'post').then(function () {
                            scope.addDirBool = true
                        })
                    }
                })

                //使用$watch监听模型变化，根据变化绑定dom
                scope.$watch('addDirBool', function (newVal, oldVal) {
                    if (newVal) {
                        var focusAll = angular.element('.createInput')
                        $timeout(function () {
                            focusAll.focus().select()
                        })
                    }
                })
            }
        }
    }])


    //重命名文件默认选中输入框文本
    .directive('renameFocus', ['$resource', '$timeout', 'checkBtnService','mediaService' , function ( $resource, $timeout, checkBtnService , mediaService) {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {

                ele.on('click', function () {

                    //重命名时不可新建，新建时不可重命名

                    if(mediaService.checkRename('.listTr') && !scope.addDirBool){
                        checkBtnService.check('/api/mps-filemanager/file', 'put').then(function () {
                            scope.editDirBool = true
                            scope.data.newName = scope.data.name
                        })
                    }
                })

                scope.$watch('editDirBool', function (newVal, oldVal) {
                    if (newVal) {
                        var focusEle = ele.closest('.operateBtn').siblings('.dirName').find('.dirInput')
                        $timeout(function () {
                            focusEle.focus().select()
                        })
                    }
                })
            }
        }
    }])

    //新建节目默认选中输入框文本
    .directive('proFocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {


                scope.$watch('addProModel', function (newVal, oldVal) {
                    if (newVal) {
                        var focusEle = angular.element('.createPro')
                        $timeout(function () {
                            focusEle.focus().select()
                        })
                    }
                })

            }
        }
    }])


    .directive('onFinish', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {
                if (scope.$last == true)[
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished')
                    })
                ]
            }
        }
    }])

//仅能输入数字
    app.directive('fdcFilter',[function(){
        return {
            require: "ngModel",
            link: function(scope,element,attrs,ngModel){

                //var attr = attrs.fdcFilter;
                //console.log(attr);
                //console.log(attrs);
                //
                //if(attr){
                //
                //    var dataType = {
                //        //只能输入数字！
                //        "num":/\D/g
                //    }
                //
                //    var regex = dataType[attr];
                //}
                element.bind('keyup',function(value){
                    this.value = this.value.replace(/[^0-9]/g,'');
                });
            }
        }
    }])
    //各个页面的高度指令
    .directive('bodyHeight', [function () {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {

                var attrs = attr.bodyHeight;
                var id = attrs.split(' ')[0];
                var height =parseInt(attrs.split(' ')[1])
                $('#'+id).css('height',$(window).height()-height)
                $(window).resize(function() {
                    $('#'+id).css('height',$(window).height()-height)
                });
            }
        }
    }])
    //新建发送页的宽度设置
    .directive('bodyWidth', [function () {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {
                setTimeout(function(){
                    $('.list2').css('width',$('#addSendTAsk').width() - 640 )
                    $(window).resize(function() {
                        $('.list2').css('width',$('#addSendTAsk').width() - 640 )
                    });
                },0)

            }
        }
    }])
    //的宽度设置
    .directive('bodyWidthpre', [function () {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {
                setTimeout(function(){

                    //setTimeout(function(){
                        $('.infoLeft').css('width',$('#examineDesc').width() - 403 )
                    //},10000)
                    $(window).resize(function() {
                        $('.infoLeft').css('width',$('#examineDesc').width() - 420 )
                    });
                },0)

            }
        }
    }])
    //滚动条高度
    .directive('scrollHeight', [function () {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {

                var attrs = attr.scrollHeight;
                var id = attrs.split(' ')[0];
                var height =parseInt(attrs.split(' ')[1])
                $('#'+id).css('height',$(window).height()-height)
                $(window).resize(function() {
                    $('#'+id).css('height',$(window).height()-height)
                });
                setTimeout(function(){
                    var scroll = new Optiscroll(document.getElementById(id));
                    ////滚动底部的时候触发
                    //$('#scroll').on('scrollreachbottom', function (ev) {
                    //
                    //});
                },100)
            }
        }
    }])
    //登录页获取当前屏幕高度指令
    .directive('bgHeight', [function () {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {
                var screenHeight = ($(window).height())
                $('.loginBg').css('height', screenHeight)
                $(window).resize(function () {
                    var screenHeight = ($(window).height())
                    $('.loginBg').css('height', screenHeight)
                });
            }
        }
    }])

    //记住密码操作相关指令
    .directive('remberPwd', ['$timeout', 'cookieService', function ($timeout, cookieService) {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {
                var name = cookieService.getCookie('name');
                var password = cookieService.getCookie('password');
                $timeout(function () {
                    $('#password').focus();
                    $('#password').blur()
                })
                if (name && password) {
                    scope.data = {'email': name, 'password': password};
                    scope.rememberPassword = true;
                    // $scope.login2();
                }
            }
        }
    }])

    //.表格宽度随屏幕改变自适应指令
    .directive('adaptiveTable', ['$timeout',function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {

                function copyWidth() {
                    $('#td1').width($('.td1').width());
                    $('#td2').width($('.td2').width());
                    $('#td3').width($('.td3').width());
                    $('#td4').width($('.td4').width());
                    $('#td5').width($('.td5').width());
                    $('#td6').width($('.td6').width());
                    $('#td7').width($('.td7').width());
                    $('#td8').width($('.td8').width());
                    $('#td9').width($('.td9').width());
                    $('#td10').width($('.td10').width());
                    $('#td11').width($('.td11').width());
                    $('#td12').width($('.td12').width());
                    $('#td13').width($('.td13').width());
                    $('#td14').width($('.td14').width());
                }
                $(window).resize(function () {
                    copyWidth()
                });

                //$(window).onload(function(){
                //    copyWidth()
                //
                //})

                //$timeout(function(){
                //    copyWidth()
                //})
            }
        }
    }])

    //滚动条指令
    .directive('listScroll' , [function(){
        return {
            restrict : 'A',
            link : function(scope , ele , attr){
                $('#scroll').css('height',$(window).height()-330)
                $(window).resize(function() {

                    $('#scroll').css('height',$(window).height()-330)

                });
                setTimeout(function(){
                    var scroll = new Optiscroll(document.getElementById('scroll'));
                    //滚动底部的时候触发
                    $('#scroll').on('scrollreachbottom', function (ev) {

                    });
                },100)
            }
        }
    }])

    //fileManager鼠标移入移出指令
    .directive('showCheckbox',[function(){
        return {
            restrct : 'A',
            link : function(scope , ele , attr){
                ele.on('mouseenter' , function(){
                    $("." + scope.item.userId).show();
                    $("#" + scope.item.userId).find('label i').css('visibility', 'visible');
                })
                ele.on('mouseleave' , function(){
                    var checked = $("#" + scope.item.userId).find('label input').attr('checked');
                    if (checked) {
                        return;
                    } else {
                        $("." + scope.item.userId).hide();
                        $("#" + scope.item.userId).find('label i').css('visibility', 'hidden');
                    }
                })
            }
        }
    }])

    //时间插件样式修改指令
        .directive('datepickerStyle',[function(){
            return {
                restrict : 'A',
                link : function (scope , ele , attr){
                    ele.on('click' , function(){
                        ele.siblings('.bootstrap-datetimepicker-widget').css({left:"-111px"})
                        ele.siblings('.bootstrap-datetimepicker-widget').addClass('change')
                    })

                }
            }
        }])
    //院线选择设备动态添加样式指令
        .directive('addpointStyle',[function(){
            return {
                restrict : 'C',
                link : function (scope , ele , attr){
                    //ele.on('click' , function(){
                    //    ele.siblings('.bootstrap-datetimepicker-widget').css({left:"-111px"})
                    //    ele.siblings('.bootstrap-datetimepicker-widget').addClass('change')
                    //})
                    console.log(scope)
                    console.log(ele)
                    console.log(attr)
                    if(scope.data.deviceScreenType > 0){
                        ele.addClass('disabled')
                    }
                }
            }
        }])




angular.module('app')
    //文件列表的指令
    .directive('treeView', [function () {
        return {
            restrict: 'E',
            templateUrl: 'treeView.html',
            scope: {
                treeData: '='
            },
            controller: function ($scope, $rootScope) {
                $scope.isLeaf = function (item) {
                    return !item.children || !item.children.length;
                };
                $scope.toggleExpandStatus = function (item) {
                    console.log(item);
                    item.isExpand = !item.isExpand;
                    $rootScope.titleName = item.name;
                };
            }
        };
    }
    ])


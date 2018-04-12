/**
 * Created by chenqi1 on 2017/7/18.
 */
angular.module('app')
    //自定义输入时间指令
    .directive('inputTime' , ['checkTimeService','commonService','dataAccess' ,'$timeout',function(checkTimeService , commonService , dataAccess , $timeout){
        return {
            require : '?ngModel',
            restrict : 'A',
            scope : {
                myModel : '=ngModel'
            },
            templateUrl : './admin/blocks/timeInput.html',
            link : function (scope , ele ,attr , ngModel) {

                var active
                var timeModel

                var watch = scope.$watch('myModel',function(newVal , oldVal){
                    //获取该指令的model值
                    if(newVal && newVal != undefined){
                        timeModel = newVal

                        scope.hourTen = timeModel.charAt(0)
                        scope.hourOne = timeModel.charAt(1)
                        scope.minTen = timeModel.charAt(2)
                        scope.minOne = timeModel.charAt(3)
                        active = 1

                    }else {
                        active = 0
                    }

                })

                $timeout(function(){
                    watch()

                },500)

                ////如果有model值，赋值
                //if(timeModel != undefined){
                //    console.log(timeModel)
                //    scope.hourTen = timeModel.charAt(0)
                //    scope.hourOne = timeModel.charAt(1)
                //    scope.minTen = timeModel.charAt(2)
                //    scope.minOne = timeModel.charAt(3)
                //    active = 1
                //}else {
                //    active = 0
                //}


                //获取控件所在元素选择器，区分获取
                var className = '.' + attr.info
                //active为当前光标所在输入框的计数器
                var time = '',
                    //获取输入框组
                    inputBtn = angular.element( className + ' .timeInput');

                ////遍历输入框组，给每项添加点击事件
                angular.forEach(inputBtn , function(data , index , array){
                    $(data).on('click' , function(){
                        //active != 0 时，为编辑该项
                        if( active != 0){
                            $(this).focus().select()
                            active = index
                        }
                        //否则必须从第一项开始输入
                        else {
                            array[0].focus()
                        }
                    })

                    //添加focus事件，监听按键,执行回调
                    $(data).on('focus' , function(){
                       this.addEventListener('keyup' , listenKeyUp , false)
                    })

                    //失去焦点时，移除监听，检测输入值是否符合时间规范
                    $(data).on('blur' , function(){
                       this.removeEventListener('keyup' , listenKeyUp , false)
                        //错误输入标识
                        scope.hError = checkTimeService.checkHour(time)
                        scope.mError = checkTimeService.checkMinute(time)
                        if(scope.hError || scope.mError){
                            commonService.ctrlError('操作','时间格式有误')
                        }
                    })

                })

                ngModel.$render = function(){
                    scope.time = ngModel.$viewValue
                }

                ////按键监听回调函数
                function listenKeyUp() {
                    //将当前时间清空
                    time = ''
                    //将当前输入框中的非法字符过滤，只能输入数字
                    this.value=this.value.replace(/\D/g,'');
                    if (!isNaN(this.value) && this.value.length != 0) {
                        //计数器小于输入框个数，计数器+1，光标后移
                        if (active < 3) {
                            active += 1;
                        }
                        $(inputBtn[active]).focus().select()
                    }
                    else if (this.value.length == 0) {
                        if (active > 0) {
                            active -= 1;
                        }
                        $(inputBtn[active]).focus().select()
                    }

                    //每次按键时计算当前time
                    time = scope.hourTen + scope.hourOne + scope.minTen + scope.minOne

                    //绑定time至model
                    scope.$apply(read(time))
                }

                function read(newVal){
                    ngModel.$setViewValue(newVal)
                }
                read()



















                ////获取控件所在元素选择器，区分获取
                //var className = '.' + attr.info
                ////active为当前光标所在输入框的计数器
                //var active = 0,
                //    time = '',
                //    //获取输入框组
                //    inputBtn = angular.element( className + ' .timeInput');
                //
                ////遍历输入框组，给每项添加点击事件
                //angular.forEach(inputBtn , function(data , index , array){
                //    $(data).on('click' , function(){
                //        //active != 0 时，为编辑该项
                //        if( active != 0){
                //            $(this).focus()
                //            active = index
                //        }
                //        //否则必须从第一项开始输入
                //        else {
                //            array[0].focus()
                //        }
                //    })
                //
                //    //添加focus事件，监听按键,执行回调
                //    $(data).on('focus' , function(){
                //       this.addEventListener('keyup' , listenKeyUp , false)
                //    })
                //
                //    //失去焦点时，移除监听，检测输入值是否符合时间规范
                //    $(data).on('blur' , function(){
                //       this.removeEventListener('keyup' , listenKeyUp , false)
                //        //错误输入标识
                //        scope.hError = checkTimeService.checkHour(time)
                //        scope.mError = checkTimeService.checkMinute(time)
                //        if(scope.hError || scope.mError){
                //            commonService.ctrlError('操作','时间格式有误')
                //        }
                //    })
                //
                //})
                //
                //
                //ngModel.$render = function(){
                //    scope.time = ngModel.$viewValue
                //}
                //
                ////按键监听回调函数
                //function listenKeyUp() {
                //    //将当前时间清空
                //    time = ''
                //    //将当前输入框中的非法字符过滤，只能输入数字
                //    this.value=this.value.replace(/\D/g,'');
                //    if (!isNaN(this.value) && this.value.length != 0) {
                //        //计数器小于输入框个数，计数器+1，光标后移
                //        if (active < 3) {
                //            active += 1;
                //        }
                //        inputBtn[active].focus()
                //    }
                //    else if (this.value.length == 0) {
                //        if (active > 0) {
                //            active -= 1;
                //        }
                //        inputBtn[active].focus()
                //    }
                //
                //    //每次按键时计算当前time
                //    angular.forEach(inputBtn , function(item){
                //        time += item.value
                //    })
                //    //绑定time至model
                //    scope.$apply(read(time))
                //}
                //
                //function read(newVal){
                //    ngModel.$setViewValue(newVal)
                //}
                //read()
            }

        }
    }])

    //额外时段指令
    .directive('extraTimeline' , ['$rootScope', 'staticData','formatDateService',
        function($rootScope , staticData,formatDateService){
            return {
                require:'?ngModel',
                restrict:'A',
                scope:{
                    myModel : '=ngModel',
                    cond:'='
                },
                replace : true,
                templateUrl : './admin/blocks/extraTimeLine.html',
                link:function(scope , ele , attr , ngModel){

                    //删除当前条件
                    scope.remove = function(){

                        delete $rootScope.extra_condition[scope.cond]

                        ele.remove()

                        $rootScope.i--

                    }

                    scope.myChange = function(){
                        if(scope.finishTime){
                            scope.myModel = formatDateService.formatTime(scope.fromTime["_d"]) + '-' + formatDateService.formatTime(scope.finishTime["_d"])
                            //scope.$apply(read(scope.myModel))
                            console.log(scope.myModel)
                        }
                    }

                    var selectGroup = angular.element('.timeLine')

                    angular.forEach(selectGroup , function(item){
                        //$(item).on('click' , function(){
                        //    this.addEventListener('change' , listenChange , false)
                        //})

                        $(item).on('click' , function(){
                            this.addEventListener('keyup' , listenChange , false)
                        })

                        $(item).on('blur' , function(){
                            this.removeEventListener('change' , listenChange , false)
                            this.removeEventListener('keyup' , listenChange , false)
                        })
                    })

                    function listenChange(){
                        scope.myModel = scope.fromTime + '-' + scope.finishTime
                        scope.$apply(read(scope.myModel))

                    }
                    ngModel.$render = function(){
                        scope.myModel = ngModel.$viewValue
                    }

                    function read(newVal){
                        ngModel.$setViewValue(newVal)
                    }
                    read()
                }
            }
        }
    ])
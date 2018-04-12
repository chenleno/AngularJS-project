angular.module('app')
    //额外条件指令
    .directive('triggerCondition' , ['$rootScope','staticData',
        function($rootScope,staticData){
        return {
            require : '?ngModel',
            restrict : 'A',
            scope : {
                myModel : '=ngModel',
                //获取变量名
                alias : '=',
                cond : '='

            },
            replace : true,
            templateUrl : './admin/blocks/extraCondition.html',
            link : function(scope , ele , attr , ngModel){

                //获取当前变量名
                var alias = scope.alias
                console.log('alias=' + alias)

                //绑定逻辑门与比较符,默认选中第一项
                scope.logicalGate = staticData.logicalGate
                scope.alermCond_logicGate = staticData.logicalGate[0].id
                scope.compareType = staticData.compareType
                scope.alermCond_compare = staticData.compareType[0].id


                //获取该指令的model值
                if(scope.myModel){
                    var scopeModel = scope.myModel

                    //绑定逻辑符
                    scope.alermCond_logicGate = scope.myModel.substr(0 , 2)

                    //获取比较符
                    //先去除逻辑符
                    var comPareModel = scopeModel.substring(2 , scopeModel.length)

                    //先判断字符串中是否有'='符

                    switch(comPareModel.indexOf('=')){
                        case -1:
                            scope.alermCond_compare = comPareModel.substring(0,1)
                            scope.alermCond_text = comPareModel.substring(1 , comPareModel.length)
                            break
                        case 0:
                            scope.alermCond_compare = comPareModel.substring(0,2)
                            scope.alermCond_text = comPareModel.substring(2 , comPareModel.length)
                            break
                        case 1:
                            scope.alermCond_compare = comPareModel.substring(0,2)
                            scope.alermCond_text = comPareModel.substring(2 , comPareModel.length)
                            break
                    }

                    //数据绑定完后重新为model赋提交格式的值，加入变量名
                    scope.myModel = scope.alermCond_logicGate + alias + scope.alermCond_compare + scope.alermCond_text

                }

                //删除当前条件
                scope.remove = function(){

                    delete $rootScope.extra_condition[scope.cond]

                    ele.remove()

                }

                var selectGroup = angular.element('.csSelect')

                angular.forEach(selectGroup , function(item){
                    $(item).on('click' , function(){
                        this.addEventListener('change' , listenChange , false)
                    })

                    $(item).on('click' , function(){
                        this.addEventListener('keyup' , listenChange , false)
                    })

                    $(item).on('blur' , function(){
                        this.removeEventListener('change' , listenChange , false)
                        this.removeEventListener('keyup' , listenChange , false)
                    })
                })

                function listenChange(){

                    scope.myModel = scope.alermCond_logicGate + alias + scope.alermCond_compare + scope.alermCond_text
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
    }])
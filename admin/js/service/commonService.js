/**
 * Created by chenqi1 on 2017/6/14.
 */
/**
 * Created by chenqi1 on 2017/2/21.
 */

//静态资源的数据service
app.service('staticData', function () {
    return {
        hostUrl: '',
        //分页相关
        //分页配置每页条数
        pageSize: 10,
        //分页配置索引数目
        pageMaxSize : 5,
        //设备状态
        deviceState :  [
            {id: 1 , name:'在线'},
            {id:2 , name : '离线'}
        ],
        checkState : [
            {id: 0 , name:'全部'},
            {id: 1 , name:'审核通过'},
            {id: 2 , name:'审核不通过'},
            {id: 3 , name:'待审核'},
        ],
        //点位类型
        PTtype : [
            {id: 1 , name:'3*3'},
            {id: 2 , name:'3*4'},
            {id: 3 , name:'1*2'},
            {id: 4 , name:'单屏'},
            {id: 5 , name:'1+1+1'}
        ],
        //项目来源
        orderSource : [
            {id: 1 , name:'出售'},
            {id: 2 , name:'赠送'},
            {id: 3 , name:'自营'},
            {id: 4 , name:'置换'}
        ],
        //广告单类型 
        adType : [
            {id:1,name:'视频'},
            {id:2,name:'互动游戏'},
        ],
        //状态 
        statusType : [
            {id:0,name:'草稿'},
            {id:1,name:'待审核'},
            {id:2,name:'审核不通过'},
            {id:3,name:'投放中'},
            {id:4,name:'已结束'},
            {id:5,name:'已过期'}
        ],
        //客户类别
        customerType : [
            {id: 1 , name:'直客'},
            {id: 2 , name:'代理'}
        ],
        //费用类别
        feeType : [
            {id:1 , name:'内容制作费'},
            {id:2 , name:'媒体投放费'}
        ],
        //广告类型
        sheetType : [
            {id:1 , name:'视频'},
            {id:2 , name:'互动游戏'}
        ],
        //picHost : 'http://mpsd.kdxcloud.download'
        //线上
        picHost : 'http://mpsd.kdxcloud.com:88'
    }
})

//各种模态框操作的service封装
app.service('commonService', ['$rootScope','$modal','$timeout', 'staticData', function ($rootScope,$modal, $timeout ,staticData) {
    //操作成功时的tip
    this.ctrlSuccess = function (data , reason) {
        $rootScope.ctrlSuccess = true
        $rootScope.opAction = data
        $rootScope.successReason = reason
        $timeout(function () {
            $rootScope.ctrlSuccess = false
        }, 2000)
    }

    //文件操作模态框
    this.fileManagerModal = function(data,mediaLists,format){
        $rootScope.fileManagerName = data;
        var fileData = {
            mediaLists :mediaLists,
            format :format
        }
        var fileManager = $modal.open({
            templateUrl: 'admin/modals/fileManagerModal.html',
            controller: 'fileManagerCtrl',
            resolve: {
                //给fileManagerCtrl传参数
                getDatas: function () {  
                    return fileData;
                }
            },
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        return fileManager;
    }

    //添加编辑成员模态框
    this.addMemberModal = function(operates,id){
        var addMember = $modal.open({
            templateUrl: 'admin/modals/addMemberModal.html',
            controller: 'addMemberCtrl',
            resolve: {
                operate: function () {
                    return operates;
                },
                id: function () {
                    return id;
                }
            },
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        return addMember;
    }

    //添加权限成员模态框
    this.addRoleMemberModal = function(roleId,name){
        var addRoleMember = $modal.open({
            templateUrl: 'admin/modals/addRoleMemberModal.html',
            controller: 'addRoleMemberModal',
            resolve: {
                info: function () {
                    return {roleId:roleId,name:name};
                }
            },
            backdrop: 'static',
            size:'lg',
            keyboard: false
        });
        return addRoleMember;
    }
    //添加站点模态框
    this.setPointModal = function(pointType,select){
        var setPoint = $modal.open({
            templateUrl: 'admin/modals/setPointModal.html',
            controller: 'setPointModal',
            resolve: {
                info: function () {
                    return {pointType:pointType,select:select};
                }
            },
            backdrop: 'static',
            size:'diyLg',
            keyboard: false
        });
        return setPoint;
    }

    //查看成员模态框
    this.detailMemberModal = function(id){
        var detailMember = $modal.open({
            templateUrl: 'admin/modals/detailMemberModal.html',
            controller: 'detailMemberCtrl',
            resolve: {
                userId: function () {
                    return id;
                }
            },
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        return detailMember;
    }
    //驳回发送请求模态框
    this.rejectRequest = function(taskId){
        var rejectRequest = $modal.open({
            templateUrl: 'admin/modals/rejectRequest.html',
            controller: 'rejectRequestCtrl',
            resolve: {
                info: function () {
                    return {taskId:taskId};
                }
            },
            backdrop: 'static',
            size:'sm',
            keyboard: false
        });
        return rejectRequest;
    }

    ////预览模态框
    //this.previewModal = function(taskId){
    //    var previewModal = $modal.open({
    //        templateUrl: 'admin/modals/previewModal.html',
    //        controller: 'previewCtrl',
    //        resolve: {
    //            info: function () {
    //                return {taskId:taskId};
    //            }
    //        },
    //        backdrop: 'static',
    //        //size:'sm',
    //        keyboard: false
    //    });
    //    return previewModal;
    //}
    ////操作失败tip
    this.ctrlError = function (data , reason) {
        $rootScope.ctrlError = true
        $rootScope.opAction = data
        $rootScope.errorReason = reason
        $timeout(function () {
            $rootScope.ctrlError = false
        }, 2000).then(function(){
            $rootScope.load = false
        })
    }

    //tipModal
    this.tipModal = function (data) {
        var modalConfirm = $modal.open({
            templateUrl: 'admin/modals/tipModal.html',
            controller: 'tipCtrl',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {typeInfo: data}
                }
            }
        });
        return modalConfirm
    }

    //确认操作模态框
    this.ctrlModal = function (data , obj) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/ctrlModal.html',
            controller: 'delModalCtrl',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {typeInfo: data , obj:obj}
                }
            }
        })
        return modalInstance
    }
    //点位冲突模态框
    this.conflictModal = function ( obj) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/conflictModal.html',
            controller: 'conflictModalCtrl',
            size: 'diyLg2',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {obj:obj}
                }
            }
        })
        return modalInstance
    }

    //新建节目模态框
    this.addPro = function(data){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/addProModal.html',
            controller: 'addProCtrl',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            //resolve: {
            //    info: function () {
            //        return {model: data}
            //    }
            //}
        })
        return modalInstance
    }

    //设备定时模态框
    this.editPT = function(id ,bool){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/setTimeModal.html',
            controller: 'editPTCtrl',
            size: 'diySm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {id: id , bool:bool }
                }
            }
        })
        return modalInstance
    }


    //查看终端截图模态框
    this.showSS = function( data){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/screenShot.html',
            controller: 'ShowSSCtrl',
            size: 'SS',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return { data:data }
                }
            }

        })
        return modalInstance
    }

    //添加项目模态框
    this.add_project = function(projectId){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/add_project_modal.html',
            controller: 'addProjectCtrl',
            size: 'diySm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {projectId:projectId }
                }
            }

        })
        return modalInstance
    }

    //添加默认素材
    this.defaultPlayList = function(pointType , defaultId){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/defulatPlayListModal.html',
            controller: 'defulatPlayListModalCtrl',
            size: 'SS',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {pointType:pointType , defaultId : defaultId}
                }
            }

        })
        return modalInstance
    }

    //添加默认素材1+1+1
    this.defaultPlayListNew = function(pointType , defaultId){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/defulatPlayListModal_1.html',
            controller: 'defulatPlayListModalNewCtrl',
            size: 'lg3',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {pointType:pointType , defaultId : defaultId}
                }
            }

        })
        return modalInstance
    }

    //查看项目详情
    this.show_project_detail = function(projectId){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/project_detail_modal.html',
            controller: 'showProjectDetailCtrl',
            size: 'diySm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function () {
                    return {projectId: projectId }
                }
            }

        })
        return modalInstance
    }

    //添加广告单时选择城市站点
    this.selectCitySite = function(pointType,cityList,citySite){
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/selectCitySite.html',
            controller: 'selectCitySiteCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
               info: function () {
                   return {pointType: pointType ,cityList: cityList , citySite : citySite}
               }
            }

        })
        return modalInstance
    }

    //添加点位弹框
    this.addPoint = function () {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/addPointModal.html',
            controller: 'addPointCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
               info: function () {
                   //return {pointType: pointType ,cityList: cityList , citySite : citySite}
               }
            }

        })
    }

        //点位播放列表
        this.showPlayList = function (pointId,date,deviceType,resourceIds) {
            var modalInstance = $modal.open({
                templateUrl: 'admin/modals/showPlayListModal.html',
                controller: 'showPlayListCtrl',
                size: 'diyLg2',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                   info: function () {
                       return {deviceType: deviceType ,date: date , pointId : pointId , resourceIds : resourceIds}
                   }
                }
    
            })
        }
}])


//存取值的service封装,避免使用$rootScope
app.service('dataAccess', ['$window', function ($window) {
    var list = {}
    return {
        get: function (key) {
            return list[key]
        },
        set: function (key, value) {
            list[key] = value
        },
        sessionSave: function (key, value) {
            $window.sessionStorage.setItem(key, JSON.stringify(value))
        },
        sessionGet: function (key) {
            return JSON.parse($window.sessionStorage.getItem(key))
        },
        sessionRemove: function (key) {
            $window.sessionStorage.removeItem(key)
        },
        sessionClear : function(){
            $window.sessionStorage.clear();
        }

    }
}])


//检测按钮的跳转权限
app.service('checkBtnService', ['$resource', '$state', 'staticData', 'commonService', '$q',
    function ($resource, $state, staticData, commonService, $q) {
        var host = staticData.hostUrl

        return {
            check: function (url, method, route, param) {
                var $com = $resource(host + "/api/common/preAccess?url=:url&method=:method",
                    {url: "@url", method: "@method"});
                var defer = $q.defer();

                $com.get({url: url, method: method}, function (data) {
                    if (data.success) {
                        if (!!route) {
                            $state.go(route, param)
                        }
                        defer.resolve(data)
                    } else {
                        commonService.ctrlModal('noPerType')
                        defer.reject(data)
                    }
                })
                return defer.promise

            }
        }
    }])

    //针对上传特殊新增一个检查口
app.service('checkUpdateStateService', ['$resource', '$state', 'staticData', 'commonService', '$q',
    function ($resource, $state, staticData, commonService, $q) {
        var host = staticData.hostUrl

        return {
            check: function (url, method, route, param) {
                var $com = $resource(host + "/api/common/preAccess?url=:url&method=:method",
                    {url: "@url", method: "@method"});
                var defer = $q.defer();

                $com.get({url: url, method: method}, function (data) {
                    if (data.success) {
                        if (!!route) {
                            $state.go(route, param)
                        }
                        defer.resolve(data)
                    } else {
                        defer.reject(data)
                    }
                })
                return defer.promise

            }
        }
    }])


//全选反选的操作相关封装
app.service('selectService', ['perService', function (perService) {
    return { 
        updateSelectionRole: function (selectedArr, e, id, childArr) {
            var action = (checkbox.checked ? 'add' : 'remove')
            perService.updateSelected(selectedArr, action, id)
            if (childArr != null) {
                perService.updateSelected(childArr, action, id)
            }
        },
        updateSelection: function (selectedArr, e, id, childArr) {
            var checkbox = e.target
            var action = (checkbox.checked ? 'add' : 'remove')
            perService.updateSelected(selectedArr, action, id)
            if (childArr != null) {
                perService.updateSelected(childArr, action, id)
            }
        },
        //权限添加人员
        updateSelectionRole: function (selectedArr, e, id) {
            var action = 'remove'
            perService.updateSelected(selectedArr, action, id)
        },

        //permissionBool代表权限页面的权限操作相关，为true则走权限相关方法
        selectAll: function (selectedArr, e, originData, idKey, permissionBool) {
            var checkbox = e.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            if (permissionBool) {

                angular.forEach(originData, function (data) {
                    angular.forEach(data.methods, function (mData) {
                        var entity = mData

                        perService.updateSelected(selectedArr, action, entity[idKey]);
                    })
                })
            }
            else {
                angular.forEach(originData, function (data) {
                    var entity = data
                    perService.updateSelected(selectedArr, action, entity[idKey]);
                })
            }
        },
        selectChildAll: function (selectedArr, childArr, e, originData, idKey, permissionBool) {
            var checkbox = e.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            if (permissionBool) {

                angular.forEach(originData.methods, function (data) {
                    var entity = data
                    perService.updateSelected(selectedArr, action, entity[idKey]);
                    perService.updateSelected(childArr, action, entity[idKey]);

                })
            }
            else {
                angular.forEach(originData, function (data) {
                    var entity = data
                    perService.updateSelected(selectedArr, action, entity[idKey]);
                })
            }
        },
        isSelected: function (arr, id) {
            if (arr.length) {
                return arr.indexOf(id) >= 0;
            }
        },

        isChildSelected: function (arr, id) {
            if (arr.length) {
                return arr.indexOf(id) >= 0;
            }
        },
        isSelectedAllRole: function (arr, datas, permissionBool) {
            if (arr.length) {
                if (permissionBool) {
                    var num = 0;

                    angular.forEach(datas, function (data) {
                        //console.log(data)
                        num += data.methods.length
                    })
                    //console.log(arr.length)
                    //console.log(num)
                    return arr.length === num;
                } else {
                    if(!datas){return}
                    return arr.length === datas.length;
                }
            }
        },
        isSelectedAll: function (arr, datas, permissionBool) {

            if (arr.length) {
                if (permissionBool) {
                    return arr.length === perService.getAllMethods(datas).length;
                } else {
                    return arr.length === datas.length;
                }
            }
        },
        isChildSelectedAll: function (arr, datas, permissionBool) {
            if (arr.length) {
                if (permissionBool) {
                    //console.log(perService.getAllMethods(datas, datas).length)
                    return arr.length === perService.getAllMethods(datas, datas).length;

                } else {
                    return arr.length === datas.length;
                }
            }
        }
    }
}])

//城市选择全选反选的操作相关封装
app.service('selectCityService', ['perService', function (perService) {
    return { 
        updateSelectionRole: function (selectedArr, e, id, childArr) {
            var action = (checkbox.checked ? 'add' : 'remove')
            perService.updateSelected(selectedArr, action, id)
            if (childArr != null) {
                perService.updateSelected(childArr, action, id)
            }
        },
        updateSelection: function (selectedArr, e, id, childArr) {
            var checkbox = e.target
            var action = (checkbox.checked ? 'add' : 'remove')
            perService.updateSelected(selectedArr, action, id)
            if (childArr != null) {
                perService.updateSelected(childArr, action, id)
            }
        },
        //权限添加人员
        updateSelectionRole: function (selectedArr, e, id) {
            var action = 'remove'
            perService.updateSelected(selectedArr, action, id)
        },

        //permissionBool代表权限页面的权限操作相关，为true则走权限相关方法
        selectAll: function (selectedArr, e, originData, idKey, permissionBool) {
            var checkbox = e.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            if (permissionBool) {

                angular.forEach(originData, function (data) {
                    angular.forEach(data.cityList, function (mData) {
                        var entity = mData

                        perService.updateSelected(selectedArr, action, entity[idKey]);
                    })
                })
            }
            else {
                angular.forEach(originData, function (data) {
                    var entity = data
                    perService.updateSelected(selectedArr, action, entity[idKey]);
                })
            }
        },
        selectChildAll: function (selectedArr, childArr, e, originData, idKey, permissionBool) {
            var checkbox = e.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            if (permissionBool) {

                angular.forEach(originData.cityList, function (data) {
                    var entity = data
                    perService.updateSelected(selectedArr, action, entity[idKey]);
                    perService.updateSelected(childArr, action, entity[idKey]);

                })
            }
            else {
                angular.forEach(originData, function (data) {
                    var entity = data
                    perService.updateSelected(selectedArr, action, entity[idKey]);
                })
            }
        },
        isSelected: function (arr, id) {
            if (arr.length) {
                return arr.indexOf(id) >= 0;
            }
        },

        isChildSelected: function (arr, id) {
            if (arr.length) {
                return arr.indexOf(id) >= 0;
            }
        },
        isSelectedAllRole: function (arr, datas, permissionBool) {
            if (arr.length) {
                if (permissionBool) {
                    var num = 0;

                    angular.forEach(datas, function (data) {
                        //console.log(data)
                        num += data.cityList.length
                    })
                    //console.log(arr.length)
                    //console.log(num)
                    return arr.length === num;
                } else {
                    if(!datas){return}
                    return arr.length === datas.length;
                }
            }
        },
        isSelectedAll: function (arr, datas, permissionBool) {

            if (arr.length) {
                if (permissionBool) {
                    return arr.length === perService.getAllCityMethods(datas).length;
                } else {
                    return arr.length === datas.length;
                }
            }
        },
        isChildSelectedAll: function (arr, datas, permissionBool) {
            if (arr.length) {
                if (permissionBool) {
                    return arr.length === perService.getAllCityMethods(datas, datas).length;

                } else {
                    return arr.length === datas.length;
                }
            }
        }
    }
}])

//select方法内部调用的service
app.service('perService', [function () {
    return {
        //封装方法获取已选项并添加到数组或者从数组中删除未选项
        updateSelected: function (selectArr, action, id) {

            if (action === 'add' && selectArr.indexOf(id) === -1) {
                selectArr.push(id);

            }
            if (action === 'remove' && selectArr.indexOf(id) !== -1) {
                var idx = selectArr.indexOf(id)
                selectArr.splice(idx, 1);

            }
            return selectArr
        },

        //封装方法获取所有的操作类型
        getAllMethods: function (perDatas, chlidDatas) {
            var allMethods = []
            if (chlidDatas == null || chlidDatas == undefined) {
                angular.forEach(perDatas, function (data) {
                    angular.forEach(data.methods, function (mData) {
                        allMethods.push(mData)
                    })
                })
            } else {
                angular.forEach(chlidDatas.methods, function (data) {

                    allMethods.push(data)

                })
            }

            return allMethods
        },

        getAllCityMethods: function (perDatas, chlidDatas) {
            var allMethods = []
            if (chlidDatas == null || chlidDatas == undefined) {
                angular.forEach(perDatas, function (data) {
                    angular.forEach(data.cityList, function (mData) {
                        allMethods.push(mData)
                    })
                })
            } else {
                angular.forEach(chlidDatas.cityList, function (data) {

                    allMethods.push(data)

                })
            }

            return allMethods
        }
    }
}])

//cookie操作service
app.service('cookieService' , [function(){
    return {
        getCookie : function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        writeCookie : function(data){
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);
            //写cookie
            var data = data;
            document.cookie = 'name' + "="+ data.email + ";expires=" + expireDate.toGMTString();
            document.cookie = 'password' + "="+ data.password + ";expires=" + expireDate.toGMTString();
        }
    }
}])

//拦截器判断用户是否登录超时或无权限
app.factory('UserInterceptor', ['$q', '$rootScope', 'dataAccess',
    function ($q, $rootScope, dataAccess) {
        return {
            request: function (config) {
                //加载框的loading层
                $rootScope.load = true;
                config.requestTimestamp = new Date().getTime();
                return config;
            },

            response: function (response) {
                $rootScope.load = false;
                var data = response.data
                //判断错误信息，如果是未登录
                if (data['access'] == 'notlogin' || data['access'] == 'outlogin') {
                    $rootScope.$emit("userIntercepted", "notlogin", response);
                }
                //如果是无权限（需要弹框）

                if (data['code'] != 'noPop' && data['access'] == 'notpermission') {
                    dataAccess.set('notPerBool', 1)
                    $rootScope.$emit("userNotPermission", "notpermission", response);
                }
                else {
                    dataAccess.set('notPerBool', 0)
                }
                //如果是被禁用
                if (data['access'] == 'forbidden') {
                    $rootScope.$emit("forbidden", "forbidden", response);
                }

                return response
            },
            responseError: function (response) {
                // 对失败的响应进行处理
                var data = response
                if (data.status != 200) {
                    $rootScope.$emit("serverError", "reqError", response);
                }
                return response
            }
        }
    }])

app.service('showCheckBox',[function (){
    return {
        checkboxShow: function (id,outOrHover) {
            if (outOrHover == 'out') {
                var checked = $("#" + id).find('label input').attr('checked');
                if (checked) {
                    return;
                } else {
                    $("." + id).hide();
                    $("#" + id).find('label i').css('visibility', 'hidden');
                }
            } else {
                $("." + id).show();
                $("#" + id).find('label i').css('visibility', 'visible');
            }

        }
    }
}]);

app.service('addDiyDom',[function () {
    return {
        diyDom: function (treeId,treeNode,check) {
            var spaceWidth = 25;
			var switchObj = $("#" + treeNode.tId + "_switch"),
            checkObj = $("#" + treeNode.tId + "_check"),
			icoObj = $("#" + treeNode.tId + "_ico");
            var spanObj = $("#" + treeNode.tId + "_span");
			switchObj.remove();
            checkObj.remove();
            if (check) {
                spanObj.before(checkObj);
            }
			icoObj.before(switchObj);
            
            //替换图标的icon
            switch (treeNode.format) {
                case 'picture': 
                    spanObj.removeClass().addClass('node_name1') 
                break;
                case 'video' : 
                    spanObj.removeClass().addClass('node_name2')
                break;
                case 'other' : 
                    spanObj.removeClass().addClass('node_name3')
                default:
            }
            
				var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
                switchObj.before(spaceStr);
        }
    }
}]);

//设备模块

//判断时间输入控件时间有效性
app.service('checkTimeService',[function(){
    return {
        checkHour : function(data){
            var bool = false
            var hour = parseInt(data.substring(0,2))
            hour>23? bool = true:bool = false
            return bool
        },
        checkMinute : function(data){
            var bool = false
            var minute = parseInt(data.substring(data.length - 2))
            minute>59?bool = true: bool = false
            return bool
        },

        checkTime : function(data){
            var bool = false
            var hour = parseInt(data.substring(0,2))
            var minute = parseInt(data.substring(data.length - 2))
            hour>23 || minute >59?bool = true: bool = false
            return bool
        },


        getSendTime : function(data){
            if(data){
                var time = data.substring(0,2) + ':' + data.substring(2)
                return time
            }
        },

        getModelTime : function(data){
            if(data){
                var time = data.substring(0,2) + data.substring(3)
                return time
            }
        },
        //日期转换时间戳
        dateFormat : function(date){
            var date = date
            date = date.substring(0,19);
            date = date.replace(/-/g,'/');
            var timestamp = new Date(date).getTime();
            return timestamp
        }
    }
}])

//日期控件获取所需日期格式
app.service('formatDateService' , [function(){
    return {
        getDate: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d
        },
        //获取当前时间
        getNowFormatDate: function () {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var strMin = date.getMinutes()
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (strMin >= 0 && strMin <= 9) {
                strMin = "0" + strMin;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + strMin
            return currentdate;

        },
        formatHour: function (date) {
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            return h;
        },
        formatMinute: function (date) {
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            return minute;
        },
        //获取时分
        formatTime : function(date){
            var str
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            str = h+':'+minute
            return str
        }
    }
}])

//生成随机数
app.service('randomStringServive',[function() {
    return {
        randomString : function () {
        　　var len = 10;
        　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        　　var maxPos = $chars.length;
        　　var pwd = '';
        　　for (var i = 0; i < len; i++) {
        　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        　　}
        　　return pwd;
    }
}
}])

app.service('adService',['staticData' , function(staticData){
    //格式化日期控件所选时间
    //播放列表专用
    this.formatDateTime = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        y = y.toString();
        m = m.toString();
        d = d.toString();
        if(h < 10){
            h = '0'+ h
        }
        //h = h.toString();
        //var minute = date.getMinutes();
        //minute = minute < 10 ? ('0' + minute) : minute;
        //return y + '-' + m + '-' + d + ' ' + h+':'+minute;
        return y + m + d + ' ' + h;
    };

    this.formatDate = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        y = y.toString();
        m = m.toString();
        d = d.toString();
        return y  + m  + d;
        //return y + '-' + m + '-' + d;
    };

    this.getMoth = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        y = y.toString();
        m = m.toString();
        return y + '-' + m ;
        //return y + '-' + m + '-' + d;
    };

    this.formatHourTime = function (date) {
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        //var minute = date.getMinutes();
        //minute = minute < 10 ? ('0' + minute) : minute;
        return h;
        //return y + '-' + m + '-' + d;
    };

}])

//设备服务
app.service('deviceService',[function(){

    //站点详情解析位置数据
    this.getStationLocation=function(list , data){
        
        var scopeObj = {}
        //$scope.pointProvince + $scope.pointCity + $scope.pointDistrict + $scope.detailAddress
        angular.forEach(list , function(province){
            if(province.name == data.pointProvince){
                scopeObj.selected = province
                angular.forEach(province.child , function(city){
                    if(city.name == data.pointCity){
                        scopeObj.selected2 = city
                        angular.forEach(city.child , function(deviceDistrict){
                            if(deviceDistrict.value == data.pointDistrict){
                                scopeObj.selected3 = deviceDistrict
                            }
                        })
                    }
                })
            }
        })

        return scopeObj
    }
}])
//给自定义directive使用的$apply
//app.factory('safeApply', function ($rootScope) {
//    return function (scope, fn) {
//        var phase = scope.$root.$$phase;
//        if (phase == '$apply' || phase == '$digest') {
//            if (fn && ( typeof (fn) === 'function')) {
//                fn();
//            }
//        } else {
//            scope.$apply(fn);
//        }
//    }
//});

app.controller('memberManagerCtrl', ['$scope', '$rootScope', '$http', '$resource', 'commonService', 'checkBtnService', 'showCheckBox',
    function ($scope, $rootScope, $http, $resource, commonService, checkBtnService, showCheckBox) {

        $scope.selected = [];//初始化复选框
        $rootScope.reflash = false;

        //鼠标移入时操作
        $scope.mousemoveEvent = function (id) {
            showCheckBox.checkboxShow(id,'hover');
        }

        //鼠标移出时操作
        $scope.mouseoutEvent = function (id) {
            console.log('id'+id);
            showCheckBox.checkboxShow(id,'out');
        }

        /**
         * 列出成员列表接口
         */
        $scope.query = function (queryValue) {
            //测试接口
            if (queryValue) {
                var userName = queryValue;
            } else {
                var userName = '';
            }

            //console.log('搜索关键字为：' + queryValue);
            var $com = $resource($scope.app.host + "/api/mps-user/user?userName=:userName", {
                userName: '@userName'
            });

            $com.get({ userName: userName },
                function (data) {
                    $scope.memberList = data.results;
                })
        }



        //删除成员操作
        $scope.deleteMember = function (userId) {
            console.log('删除成员' + userId);
            var id = $scope.selected.join(',');
            if (userId) {
                id = userId;
            }
            if (!id) {
                commonService.ctrlError('删除', '未选择成员');
                return;
            }
            console.log('删除' + id);
            //权限判断
            checkBtnService.check("/api/mps-user/user/" + id, 'delete').then(function () {
                commonService.ctrlModal('memberName').result.then(function () {
                    var $com = $resource($scope.app.host + "/api/mps-user/user/:id", { id: '@id' });
                    $com.delete({}, { id: id }, function (data) {
                        console.log(data);
                        if (data.success) {
                            commonService.ctrlSuccess('删除');
                            $scope.selected = [];
                            $scope.query();
                            $scope.keyword = ''
                        }
                    });
                })
            })
        }

        //判断是否为选中状态
        $scope.isChecked = function (id) {
            return $scope.selected.indexOf(id) >= 0;
        }

        //删除选中的成员
        $scope.deleteSelected = function () {
            console.log('delete' + $scope.selected);
        }

        //搜索成员列表
        $scope.searchMember = function (keyword, e) {
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    console.log('search ' + keyword);//开始进行查询操作
                    keyword = keyword.replace(/&/g, '%26')
                    $scope.query(keyword);

                }
            }

        }

        //用户复选框操作，给出checkbox结果
        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if (checked) {
                $scope.selected.push(id);
            } else {
                var idx = $scope.selected.indexOf(id);
                $scope.selected.splice(idx, 1);
            }
            console.log($scope.selected);
        }


        //编辑成员
        $scope.editMember = function (id) {
            console.log('编辑成员' + id);
            checkBtnService.check("/api/mps-user/user/" + id, 'put').then(function () {
                commonService.addMemberModal('edit', id);
            })
        }

        //添加成员
        $scope.addMember = function () {
            //console.log('添加成员');
            checkBtnService.check("/api/mps-user/user", 'post').then(function () {
                commonService.addMemberModal('add');
            })
        }

        //查看成员
        $scope.showDetailMember = function (id) {
            commonService.detailMemberModal(id);
        }

        $scope.query();

        //滚动条
        $scope.scrollHeight = function () {
            //console.log($(window).height())
            $('#scroll').css('height', $(window).height() - 230)
        }

        $scope.scrollHeight();
        $(window).resize(function () {
            $('#scroll').css('height', $(window).height() - 230)
        });

        //滚动条设置
        setTimeout(function () {
            var scroll = new Optiscroll(document.getElementById('scroll'));
            //滚动底部的时候触发
            $('#scroll').on('scrollreachbottom', function (ev) {

            });
        }, 100)

        //监听reflash刷新当前页面成员数据
        var watch = $scope.$watch('reflash', function (newValue, oldValue, scope) {
            if (newValue) {
                $scope.query();
                $rootScope.reflash = false;
            }
        });
    }])
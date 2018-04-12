'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$rootScope' ,'$translate', '$localStorage', '$window', '$state' , '$location','dataAccess', 'commonService','checkBtnService','staticData',
    function(              $scope,$rootScope,   $translate,   $localStorage,   $window , $state ,$location, dataAccess , commonService , checkBtnService , staticData) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'Angulr',
        //host: "http://172.17.9.92:8000",
        host: staticData.hostUrl,
        version: '1.3.3',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-white',
          navbarCollapseColor: 'bg-white',
          asideColor: 'bg-white',
          headerFixed: true,
          asideFixed: false,
          asideFolded: true,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }


      //路由拦截,检查权限
      $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        if(toState.name=='auth.login')return;// 如果是进入登录界面则允许
        // 如果用户不存在
        if(!dataAccess.sessionGet('adminName')){
          event.preventDefault();// 取消默认跳转行为
          $state.go("auth.login");//跳转到登录界面
        }
      });


      //拦截器:如果用户登录状态丢失，返回登录页
      $rootScope.$on('userIntercepted',function(data){
         //跳转到登录界面
        commonService.tipModal('conflictType').result.then(function(){
          $state.go("auth.login");
        })
      });


      ////拦截器:如果用户无权限查看该页面，给出提示
      $rootScope.$on('userNotPermission',function(data){
        commonService.ctrlModal('noPerType').result.then(function(){
          return
        })
      });

      ////拦截器，如果后台出错，给出提示
      $rootScope.$on('serverError',function(data){
        commonService.tipModal('serverErrorType').result.then(function(){
          return
        })
      });


      //w5c表单验证配置
      var vm = $scope.vm = {
        htmlSource: "",
        showErrorType: "1",
        showDynamicElement: true,
        dynamicName: "dynamicName",
        entity: {}
      };

      vm.saveEntity = function ($event) {
        //do somethings for bz
        alert("Save Successfully!!!");
      };
      //每个表单的配置，如果不设置，默认和全局配置相同
      vm.validateOptions = {
        blurTrig: true
      };

      vm.customizer = function () {
        return vm.entity.customizer > vm.entity.number;
      };

      vm.changeShowType = function () {
        if (vm.showErrorType == 2) {
          vm.validateOptions.showError = false;
          vm.validateOptions.removeError = false;
        } else {
          vm.validateOptions.showError = true;
          vm.validateOptions.removeError = true;
        }
      };

      vm.types = [
        {
          value: 1,
          text: "选择框"
        },
        {
          value: 2,
          text: "输入框"
        }
      ];

      //权限检测
      $scope.checkBtn = function(url , method , route , params){
        checkBtnService.check(url , method , route , params )
      }

    // 全局变量图片以及视频开头的域
     // $rootScope.address = 'http://mpsd.kdxcloud.dev/'

     //$rootScope.address = 'http://mpsd.kdxcloud.download'
      //线上
      $rootScope.address = 'http://mpsd.kdxcloud.com:88'


  }]);
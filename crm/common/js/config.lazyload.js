// lazyload config

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   ['common/vendor/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
      sparkline:      ['common/vendor/jquery/charts/sparkline/jquery.sparkline.min.js'],
      plot:           ['common/vendor/jquery/charts/flot/jquery.flot.min.js',
                          'common/vendor/jquery/charts/flot/jquery.flot.resize.js',
                          'common/vendor/jquery/charts/flot/jquery.flot.tooltip.min.js',
                          'common/vendor/jquery/charts/flot/jquery.flot.spline.js',
                          'common/vendor/jquery/charts/flot/jquery.flot.orderBars.js',
                          'common/vendor/jquery/charts/flot/jquery.flot.pie.min.js'],
      slimScroll:     ['common/vendor/jquery/slimscroll/jquery.slimscroll.min.js'],
      sortable:       ['common/vendor/jquery/sortable/jquery.sortable.js'],
      nestable:       ['common/vendor/jquery/nestable/jquery.nestable.js',
                          'common/vendor/jquery/nestable/nestable.css'],
      filestyle:      ['common/vendor/jquery/file/bootstrap-filestyle.min.js'],
      slider:         ['common/vendor/jquery/slider/bootstrap-slider.js',
                          'common/vendor/jquery/slider/slider.css'],
      chosen:         ['common/vendor/jquery/chosen/chosen.jquery.min.js',
                          'common/vendor/jquery/chosen/chosen.css'],
      TouchSpin:      ['common/vendor/jquery/spinner/jquery.bootstrap-touchspin.min.js',
                          'common/vendor/jquery/spinner/jquery.bootstrap-touchspin.css'],
      wysiwyg:        ['common/vendor/jquery/wysiwyg/bootstrap-wysiwyg.js',
                          'common/vendor/jquery/wysiwyg/jquery.hotkeys.js'],
      dataTable:      ['common/vendor/jquery/datatables/jquery.dataTables.min.js',
                          'common/vendor/jquery/datatables/dataTables.bootstrap.js',
                          'common/vendor/jquery/datatables/dataTables.bootstrap.css'],
      vectorMap:      ['common/vendor/jquery/jvectormap/jquery-jvectormap.min.js',
                          'common/vendor/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                          'common/vendor/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                          'common/vendor/jquery/jvectormap/jquery-jvectormap.css'],
      footable:       ['common/vendor/jquery/footable/footable.all.min.js',
                          'common/vendor/jquery/footable/footable.core.css']
      }
  )
  // oclazyload config
    //配置共通文件位置.
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  false, //是否开始DEBUG模式
          events: true,
          modules: [
              {
                  name: 'ngTable',  //对应插件的注入名称
                  files: [
                      'common/vendor/angular/angular-ng-table/ng-table.js', //插件文件位置.
                      'common/vendor/angular/angular-ng-table/ng-table.css'
                  ]
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      'common/vendor/modules/ngImgCrop/ng-img-crop.js',
                      'common/vendor/modules/ngImgCrop/ng-img-crop.css'
                  ]
              },
              {
                  name: 'ngFileUpload',
                  files: [
                      'common/vendor/modules/ngFileUpload/ng-file-upload-shim.min.js',
                      'common/vendor/modules/ngFileUpload/ng-file-upload.min.js'
                  ]
              }
              ,
              {
                  name: 'ngCsv',
                  files: [
                      'common/vendor/angular/ngcsv/ng-csv.js'
                  ]
              },
              {
                  name:'ngGrid',
                  files: [
                      'common/vendor/modules/ng-grid/ng-grid.min.css',
                      'common/vendor/modules/ng-grid/ng-grid.min.js'
                  ]
              }
          ]
      });
  }])
;
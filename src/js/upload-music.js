{
  let view = {
    el: '#container',
    find(selector){
      return $(this.el).find(selector)[0]
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.initQiniu()
    },
    initQiniu(){
      //引入Plupload 、qiniu.js后
      var uploader = Qiniu.uploader({
        runtimes: 'html5', //上传模式,依次退化
        browse_button: this.view.find('#pickfiles'), //上传选择的点选按钮，**必需**
        uptoken_url: 'http://localhost:3333/uptoken', //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        domain: 'pb0x7nn6r.bkt.clouddn.com', //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
        container: 'container', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '10mb', //最大文件体积限制
        dragdrop: true, //开启可拖曳上传
        drop_element: this.view.find('#container'), //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          'FilesAdded': function (up, files) {
            plupload.each(files, function (file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          'BeforeUpload': function (up, file) {
            // 每个文件上传前,处理相关的事情
          },
          'UploadProgress': function (up, file) {
            // 每个文件上传时,处理相关的事情
          },
          'FileUploaded': function (up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink = 'http://' + domain + '/' + encodeURIComponent(res.key); //获取上传成功后的文件的Url
            window.eventHub.trigger('upload', {
              name: res.key,
              url: sourceLink
            })
          },
          'Error': function (up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          'UploadComplete': function () {
            //队列文件处理完毕后,处理相关的事情
          }
        }
      });
    }
  }
  controller.init(view, model)

}
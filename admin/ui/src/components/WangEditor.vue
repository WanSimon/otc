<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left;"></div>
  </div>
</template>

<script>
import axios from 'axios';
import E from "wangeditor";
import {upload} from "@/api/resource";
export default {
  name: "Editor",
  data() {
    return {
      editor: null,
      editorContent: ''
    };
  },
  props: {
    initContent: {
      type: String,
      default: ''
    },
  },
  watch: {
    'initContent'(){
      if(this.editor) this.editor.txt.html(this.initContent);
    }
  },
  mounted() {
    let self = this;
    self.editor = new E(this.$refs.editorElem);
    self.editor.customConfig.onchange = html => {
      self.editorContent = html;
      self.$emit('catch-data', self.editorContent);
    };
    self.editor.customConfig.menus = [
      // 菜单配置
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ];

    // self.editor.customConfig.uploadImgServer = `${self.$globalConfig.resource.baseUrl}${self.$globalConfig.resource.uploadUrl}&filename=proudct_detail`;
    // self.editor.customConfig.uploadFileName = 'file';
    // //可使用监听函数在上传图片的不同阶段做相应处理
    // self.editor.customConfig.uploadImgHooks = {
    //   before: function (xhr, editor, files) {
    //     // 图片上传之前触发
    //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
    //     // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
    //     // return {
    //     //     prevent: true,
    //     //     msg: '放弃上传'
    //     // }
    //   },
    //   success: function (xhr, editor, result) {
    //     console.info(result);
    //     // 图片上传并返回结果，图片插入成功之后触发
    //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
    //   },
    //   fail: function (xhr, editor, result) {
    //     // 图片上传并返回结果，但图片插入错误时触发
    //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
    //   },
    //   error: function (xhr, editor) {
    //     // 图片上传出错时触发
    //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
    //   },
    //   timeout: function (xhr, editor) {
    //     // 图片上传超时时触发
    //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
    //   },
    //   // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
    //   // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
    //   customInsert: function (insertImg, result, editor) {
    //     // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
    //     // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
    //     // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
    //     var url = `${self.$globalConfig.resource.baseUrl}/${result.uuid}`;
    //     insertImg(url)
    //     // result 必须是一个 JSON 格式字符串！！！否则报错
    //   }
    // }
    self.editor.customConfig.customAlert = function (info) {
      self.$message({ message: info || '未知错误, 请联系管理员', type: 'warning', offset: '60'});
    }
    //每次只允许上传一张
    self.editor.customConfig.uploadImgMaxLength = 1;
    //图片大小限制100M
    self.editor.customConfig.uploadImgMaxSize = 100 * 1024 * 1024;
    //自定义上传
    self.editor.customConfig.customUploadImg = async (files, insert)=> {
      if(files.length){
        let file = files[0];
        try {
          let uuid =await upload(file);
          let img = `${self.$conf.resource.baseUrl}${uuid}`;
          insert(img);
        } catch (e) {
          self.$message({ message: '上传失败, 请多试几次, 或请联系管理员', type: 'warning', offset: '60'});
        }
      }
    }
    self.editor.create();
    self.editor.txt.html(self.initContent);
  }
}
</script>

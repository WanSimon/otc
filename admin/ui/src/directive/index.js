/**
 * 注冊全局指令
 *
 * */

import error_image from './error-image';

const myDirective = (Vue)=> {
  error_image.install(Vue);
}
export default myDirective;

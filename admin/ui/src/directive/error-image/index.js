import error_image from './error_image'

const install = function(Vue) {
  Vue.directive('error-image', error_image)
}

error_image.install = install;
export default error_image;

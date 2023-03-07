async function handle(el) {
  let imgURL = el.getAttribute('src');
  let exist = await imageIsExist(imgURL);
  if(!exist) el.setAttribute('src', require('@/assets/404_images/404_image.jpg'));
}

export default {
  bind(el, binding, vnode) {
    handle(el);
  },
  inserted(el, binding, vnode) {

  },
  unbind(el) {

  }
}

/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function(url) {
  return new Promise((resolve) => {
    let img = new Image();
    img.onload =  function() {
      if (this.complete == true){
        resolve(true);
        img = null;
      }
    }
    img.onerror = function() {
      resolve(false);
      img = null;
    }
    img.src = url;
  })
}

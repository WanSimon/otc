import getConf from "../js/conf";
import axios from 'axios';
let conf = getConf();
// OSS资源地址
async function uploadOss(file) {
  let url = `${conf.resource.url}${ conf.resource.uploadRoute}`;
  const formData = new FormData();
  formData.append("fileData", file);
  let config = { headers:{'Content-Type':'multipart/form-data'}};
  let res;
  try{
    res = await axios.post(url, formData, config);
  }
  catch (e) {
    console.error(e);
    throw e;
  }
  if(res && res.status !== 200 ){
    console.error(res);
    throw new Error(`http status code ${res.status}`);
  }
  else if( res.data && res.data.code == 1000 ){
    return res.data.data.localPath;
  }
  else {
    console.error(res);
    throw new Error(res.data.msg);
  }
}

// 服务器本地资源地址
async function uploadLocal(file) {
  let filename = file.name;
  let url = `${conf.resource.baseUrl}${conf.resource.uploadUrl}&filename=${filename}`;
  const formData = new FormData();
  formData.append("file", file);
  let config = { headers: { 'Content-Type': 'multipart/form-data' } };
  let res = await axios.post(url, formData, config);
  if (res && res.status === 200 && res.data && res.data.code === 0)
    return res.data.uuid;
  else return false;
}

export async function upload(file) {
  if(conf.resourceType ===1){
    return uploadLocal(file);
  }
  else {
    return uploadOss(file);
  }
}

const confJson = {
  // 1： 服务器本地资源  2：OSS资源
  resourceType: 1,
// 服务器本地资源地址
  localResource: {
    //baseUrl: 'http://115.159.87.61:8000/resource/',
    baseUrl: 'http://dev.equipment.cinyou.cn:11080/resource/resource/',
    uploadUrl: 'upload?type=2&program_type=xy_admin',
    resourceUrl:'http://121.36.228.192:8080/api/v1/res/view/',
  },
  // OSS资源地址
  ossResource: {
    url: 'http://dev.equipment.cinyou.cn:11080/',
    baseUrl: 'http://dev.equipment.cinyou.cn:11080/view/',
    uploadRoute: 'upload',
    downloadRoute: 'download/',
    resourceUrl:'http://dev.equipment.cinyou.cn:11080/view/',
  }
};

export default function getConf() {
  if (confJson.resourceType === 1) {
    confJson.resource = confJson.localResource;
  } else {
    confJson.resource = confJson.ossResource;
  }
  return confJson;
};

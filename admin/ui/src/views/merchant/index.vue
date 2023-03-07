<template>
  <div class="app-container">
    <el-container style="height: 100%">
      <el-aside width="300px" style="height: 100%;overflow-y: auto">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <div style="margin-top: 15px">
          <el-tree
            class="filter-tree"
            node-key="value"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
            ref="merchantTree">
             <span style="width:280px;font-size:14px" slot-scope="{ node, data }" class="op-btn">
                <span> {{ data.label }} </span>
                <span style="float:right">
                 <i class="el-icon-plus" style="padding:0 15px" @click='() => nodeAppend(node, data)'></i>
                 <i class="el-icon-delete" @click='() => nodeDelete(node, data)'></i>
                </span>
             </span>
          </el-tree>
        </div>
      </el-aside>
      <el-container style="position:absolute;bottom: 0;top:20px;left: 320px;right: 0">
        <el-main style="padding-top: 0px">
          <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <divider :title="dividerTitle[0]"></divider>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="商户名称" prop="fullname">
                  <el-input v-model="form.fullname" placeholder="请输入商户名称" maxlength="64" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="商户简称" prop="fullname">
                  <el-input v-model="form.shortname" placeholder="请输入商户名称" maxlength="20" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="商户类型" prop="type">
                  <el-select v-model="form.type" placeholder="请选择商户类型" style="width:100%;">
                    <el-option v-for="(val, index) in $conf.merchantTypeArr" :key="index" :label="val"
                               :value="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="!isTop">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="父商户" prop="parent_id">
                  <SelectTree
                    placeholder="请选择商户"
                    style="width: 100%"
                    :props="defaultProps"
                    :options="treeData"
                    :value="form.parent_id"
                    @getValue="getValue($event)"/>
                </el-form-item>
              </el-col>
            </el-row>
            <divider :title="dividerTitle[1]"></divider>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="联系人" prop="contacts">
                  <el-input v-model="form.contacts" placeholder="请输入联系人" maxlength="64" autocomplete="off"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="省" prop="province">
                  <el-select v-model="form.province" placeholder="请选择省份" filterable @change="changeCity('province')"
                             clearable
                             style="width:100%;">
                    <el-option v-for="(label,value) in provinceData" :key="value" :label="label"
                               :value="value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="详细地址" prop="addr">
                  <el-input v-model="form.addr" placeholder="请输入详细地址" maxlength="255" autocomplete="off"
                            clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="联系电话" prop="mobile">
                  <el-input v-model="form.mobile" placeholder="请输入联系电话" maxlength="16" autocomplete="off"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="市" prop="city">
                  <el-select v-model="form.city" placeholder="请选择城市" filterable clearable style="width:100%;"
                             @change="changeCity('city')">
                    <el-option v-for="(label,value) in cityData" :key="value" :label="label" :value="value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="120" autocomplete="off"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="区" prop="area">
                  <el-select v-model="form.area" placeholder="请选择区域" filterable clearable style="width:100%;">
                    <el-option v-for="(label,value) in areaData" :key="value" :label="label" :value="value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <divider :title="dividerTitle[2]"></divider>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="商户Logo" prop="logourl">
                  <el-upload
                    accept="image/*"
                    class="avatar-uploader"
                    action=""
                    :data="{filename: '商户Logo', key: 'logourl'}"
                    :show-file-list="false" :http-request="uploadImage">
                    <el-image v-if="imgObj.logourl" :src="imgObj.logourl" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="营业执照" prop="business_licence_url">
                  <el-upload
                    accept="image/*"
                    class="avatar-uploader"
                    action=""
                    :data="{filename: '营业执照', key: 'business_licence_url'}"
                    :show-file-list="false" :http-request="uploadImage">
                    <el-image v-if="imgObj.business_licence_url" :src="imgObj.business_licence_url" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="执照编号" prop="business_licence_no">
                  <el-input v-model="form.business_licence_no" placeholder="请输入营业执照编号" maxlength="64"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="过期日期" prop="business_licence_expired_date">
                  <el-date-picker v-model="form.business_licence_expired_date" type="date" style="width: 100%"
                                  placeholder="请输入营业执照过期日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="药品许可证" prop="business_licence_url">
                  <el-upload
                    accept="image/*"
                    class="avatar-uploader"
                    action=""
                    :data="{filename: '药品许可证', key: 'drug_licence_url'}"
                    :show-file-list="false" :http-request="uploadImage">
                    <el-image v-if="imgObj.drug_licence_url" :src="imgObj.drug_licence_url" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="许可证编号" prop="drug_licence_no">
                  <el-input v-model="form.drug_licence_no" placeholder="请输入药品许可证编号" maxlength="64"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="过期日期" prop="drug_licence_expired_date">
                  <el-date-picker v-model="form.drug_licence_expired_date" type="date" style="width: 100%"
                                  placeholder="请选择药品许可证过期日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="身份证正面" prop="business_licence_url">
                  <el-upload
                    accept="image/*"
                    class="avatar-uploader"
                    action=""
                    :data="{filename: '身份证正面', key: 'front_idcard_url'}"
                    :show-file-list="false" :http-request="uploadImage">
                    <el-image v-if="imgObj.front_idcard_url" :src="imgObj.front_idcard_url" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="身份证反面" prop="business_licence_url">
                  <el-upload
                    accept="image/*"
                    class="avatar-uploader"
                    action=""
                    :data="{filename: '身份证反面', key: 'back_idcard_url'}"
                    :show-file-list="false" :http-request="uploadImage">
                    <el-image v-if="imgObj.back_idcard_url" :src="imgObj.back_idcard_url" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="身份证号" prop="idcard">
                  <el-input v-model="form.idcard" placeholder="请输入身份证号" maxlength="18" autocomplete="off"
                            clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="公众号二维码" prop="business_licence_url">
                  <el-upload
                    accept=".jpg,.png"
                    class="avatar-uploader"
                    action=""
                    :data="{filename: '公众号二维码', key: 'qr_code_url'}"
                    :show-file-list="false" :http-request="uploadImage">
                    <el-image v-if="imgObj.qr_code_url" :src="imgObj.qr_code_url" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="二维码链接" prop="qr_code_link">
                  <el-input v-model="form.qr_code_link" placeholder="请输入二维码链接" maxlength="500"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <divider :title="dividerTitle[3]"></divider>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="合同编号" prop="contract_no">
                  <el-input v-model="form.contract_no" placeholder="请输入合同编号" maxlength="50"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="合同开始日期" prop="contract_begin_date">
                  <el-date-picker v-model="form.contract_begin_date" type="date" style="width: 100%"
                                  placeholder="请选择合同开始日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="合同结束日期" prop="contract_end_date">
                  <el-date-picker v-model="form.contract_end_date" type="date" style="width: 100%"
                                  placeholder="请选择合同结束日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="签约日期" prop="sign_date">
                  <el-date-picker v-model="form.sign_date" type="date" style="width: 100%"
                                  placeholder="请选择签约日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="合同签约人" prop="contract_signer">
                  <el-input v-model="form.contract_signer" placeholder="请输入合同签约人" maxlength="64"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="客户电话" prop="service_phone">
                  <el-input v-model="form.service_phone" placeholder="请输入客户电话" maxlength="16"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="发票信息" prop="invoice_desc">
                  <el-input v-model="form.invoice_desc" placeholder="请输入发票信息" maxlength="128"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item label="收货提醒" prop="receive_remind">
                  <el-input v-model="form.receive_remind" placeholder="请输入收货提醒" maxlength="128"
                            autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-if="isAAdmin">
              <divider :title="dividerTitle[4]"></divider>
              <el-row v-for="(items,index) in config.wechat" :key="index" :gutter="10">
                <div class="config_title">
                  {{ configType[index] }}
                </div>
                <el-table
                  :data="items"
                  border
                  max-height="300"
                  style="width: 100%"
                  size="mini"
                  v-if="index !=='pay'">
                  <el-table-column type="expand" v-if="index =='public_accounts'">
                    <template slot-scope="{row,$index}">
                      <el-table
                        :data="row.template"
                        element-loading-text="Loading"
                        border>
                        <el-table-column label="模板类型" align="center">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.key" placeholder="请选择模板" clearable style="width:100%;">
                              <el-option v-for="(val, idx) in msgTemplate" :key="idx" :label="val"
                                         :value="idx"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="id" align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.id" placeholder="请输入id" clearable
                                      maxlength="128"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80px" align="center" fixed="right">
                          <template slot-scope="scope">
                            <div class="operation">
                              <div class="operation_btn" @click="addMsgRow($index,scope,index)">
                                <i class="el-icon-circle-plus-outline"></i></div>
                              <div class="operation_btn" @click="reduceMsgRow($index,scope,index)">
                                <i class="el-icon-remove-outline"></i>
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                        <div slot="empty" style="height:60px;line-height: 60px;font-size: 14px">
                          暂无数据,请点击
                          <el-button type="text" size="mini" @click="addMsgRow($index,0,index)">添加新的一行</el-button>
                        </div>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column type="index" width="50" align="center"></el-table-column>
                  <el-table-column :label="`${configType[index]}名称`" clearable align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name" placeholder="请输入名称" clearable maxlength="128"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column :label="`${configType[index]}类型`" align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.appType" placeholder="请选择类型" clearable style="width:100%;">
                        <el-option v-for="(val, idx) in appTypeData[index]" :key="idx" :label="val.label"
                                   :value="val.value"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="账号" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.appId" placeholder="请输入账号app_id" clearable
                                maxlength="128"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="应用密钥" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.appSecret" placeholder="请输入应用密钥" clearable
                                maxlength="128"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="推送角色" align="center" v-if="index =='public_accounts'">
                    <template slot-scope="scope">
                      <el-select multiple v-model="scope.row.notify_roles" filterable placeholder="请选择角色" clearable
                                 style="width:100%;">
                        <el-option v-for="item in roleData" :key="item.innerid" :label="item.name"
                                   :value="item.innerid"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80px" align="center" fixed="right">
                    <template slot-scope="scope">
                      <div class="operation">
                        <div class="operation_btn" @click="addRow(scope,index)"><i
                          class="el-icon-circle-plus-outline"></i></div>
                        <div class="operation_btn" @click="reduceRow(scope,index,'wechat')"><i
                          class="el-icon-remove-outline"></i>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <div slot="empty" style="height:60px;line-height: 60px;font-size: 14px">
                    暂无数据,请点击
                    <el-button type="text" size="mini" @click="addRow(0,index)">添加新的一行</el-button>
                  </div>
                </el-table>
                <template v-if="index =='pay'">
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="app_id" prop="appid">
                      <el-input v-model="items.appid" placeholder="请输入账号app_id" maxlength="128"
                                autocomplete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="secret" prop="secret">
                      <el-input v-model="items.secret" placeholder="请输入secret" maxlength="128"
                                autocomplete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="支付商户号" prop="mch_id">
                      <el-input v-model="items.mch_id" placeholder="请输入支付商户号" maxlength="128"
                                autocomplete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="支付密钥" prop="mch_key">
                      <el-input v-model="items.mch_key" placeholder="请输入支付密钥" maxlength="128"
                                autocomplete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
              <divider :title="dividerTitle[5]"></divider>
              <el-row :gutter="10">
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="app_id" prop="ali_appid">
                    <el-input v-model="config.ali['pay'].appid" placeholder="请输入支付宝支付app_id" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <divider :title="dividerTitle[6]"></divider>
              <el-row :gutter="10">
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="商户美团编号" prop="merchant_third_code">
                    <el-input v-model="form.merchant_third_code" placeholder="请输入商户美团编号" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="app_name" prop="app_name">
                    <el-input v-model="configThird.app_name" placeholder="请输入app_name" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="app_id" prop="app_id">
                    <el-input v-model="configThird.app_id" placeholder="请输入账号app_id" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="app_secret" prop="app_secret">
                    <el-input v-model="configThird.app_secret" placeholder="请输入请输入app_secret" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <divider :title="dividerTitle[7]"></divider>
              <el-row :gutter="10">
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="服务商" prop="sms_type">
                    <el-select v-model="config['sms'].type" placeholder="请选择服务商" clearable @change="changeSmsType"
                               style="width:100%;">
                      <el-option v-for="(label,value) in $conf.smsType" :key="value" :label="label"
                                 :value="value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="config['sms'].type=='tencent'">
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="APPID" prop="sms_appid">
                      <el-input v-model="config['sms'].appid" placeholder="请输入appid" maxlength="128"
                                autocomplete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="私钥(security_key)" prop="sms_security_key">
                      <el-input v-model="config['sms'].security_key" placeholder="请输入私钥" maxlength="128"
                                autocomplete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
              <el-row :gutter="10" v-if="config['sms'].type=='tencent'">
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="签名(sign)" prop="sms_sign">
                    <el-input v-model="config['sms'].sign" placeholder="请输入签名" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="region" prop="sms_region">
                    <el-input v-model="config['sms'].region" placeholder="请输入region" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin: 15px 0" v-if="config['sms'].type=='tencent'">
                <el-table
                  :data="config['sms'].template"
                  border
                  max-height="300"
                  style="width: 100%"
                  size="mini">
                  <el-table-column type="index" width="50" align="center"></el-table-column>
                  <el-table-column label="模板类型" align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.key" placeholder="请选择模板" clearable style="width:100%;">
                        <el-option v-for="(val, idx) in smsTemplate" :key="idx" :label="val"
                                   :value="idx"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="id" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.id" placeholder="请输入id" clearable
                                maxlength="128"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="time" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.time" placeholder="请输入time" clearable
                                maxlength="128"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80px" align="center" fixed="right">
                    <template slot-scope="scope">
                      <div class="operation">
                        <div class="operation_btn" @click="addSmsRow(scope)"><i
                          class="el-icon-circle-plus-outline"></i></div>
                        <div class="operation_btn" @click="reduceRow(scope,'template','sms')"><i
                          class="el-icon-remove-outline"></i>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <div slot="empty" style="height:60px;line-height: 60px;font-size: 14px">
                    暂无数据,请点击
                    <el-button type="text" size="mini" @click="addSmsRow(0)">添加新的一行</el-button>
                  </div>
                </el-table>
              </el-row>
              <divider :title="dividerTitle[8]"></divider>
              <el-row :gutter="10">
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="前置机地址" prop="his_server">
                    <el-input v-model="config['his'].his_server" placeholder="请输入前置机Server地址" maxlength="128"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item label="HIS编号" prop="his_code">
                    <el-input v-model="config['his'].his_code" placeholder="请输入商户HIS编号" maxlength="64"
                              autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :sm="24" :md="24" :lg="16">
                  <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" :rows="3"
                              maxlength="100"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-form>
          <el-row>
            <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
          </el-row>
        </el-main>
        <el-footer>
        </el-footer>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  import {upload} from "@/api/resource";
  import {getMerchantTree, getOneMerchant, add, update, del} from "@/api/merchant";
  import {getRolePairs} from '@/api/role';
  import {getCodeTree} from "@/api/code";
  import {parseTree} from "@/utils";
  import {isEmail, isIdcard, isPhone} from "@/utils/validate";
  import chinaData from '@/js/city';
  import divider from '@/components/Divider'
  import SelectTree from "@/components/treeSelect";

  export default {
    components: {divider, SelectTree},
    name: "index",
    data() {
      return {
        submitLoading: false,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label',
          value: 'value',
        },
        treeData: [],
        roleData: [],
        form: {},
        //表单验证
        rules: {
          type: [
            {required: true, message: '请选择商户类型', trigger: 'change'},
          ],
          fullname: [
            {required: true, message: '请输入商户名称', trigger: 'blur'},
          ],
          email: [
            {validator: isEmail, trigger: 'blur'},
          ],
          idcard: [
            {validator: isIdcard, trigger: 'blur'},
          ],
          mobile: [
            {validator: isPhone, trigger: 'blur'},
          ],
          service_phone: [
            {validator: isPhone, trigger: 'blur'},
          ]
        },
        imgObj: {},
        provinceData: chinaData.province_list,
        cityData: [],
        areaData: [],
        dividerTitle: ['基本信息', '联系方式', '商家信息', '合同信息', '配置信息 | 微信', '配置信息 | 支付宝', '配置信息 | 美团', '配置信息 | 短信', '配置信息 | 其他'],
        config: {},
        configThird: {},//第三方配置(美团)
        configType: {
          mini_program: "小程序",
          public_accounts: "公众号",
          pay: "支付",
        },
        appTypeData: {
          mini_program: [{
            value: 1,
            label: '医生端'
          }, {
            value: 2,
            label: '患者端'
          }],
          public_accounts: [{
            value: 10,
            label: '运维'
          }, {
            value: 11,
            label: '云商城'
          }]
        },
        //短信类型
        smsTemplate: {},
        //公众号信息类型
        msgTemplate: {},
        selectNode: '',//新增节点的父级节点id
        isTop: false,//是否为顶层节点
        isAAdmin: false,
      }
    },
    watch: {
      filterText(val) {
        this.$refs.merchantTree.filter(val);
      }
    },
    methods: {
      //初始化config配置
      getConfig() {
        this.config = {
          wechat: {
            mini_program: [{name: "", appType: '', appId: "", appSecret: ""}],
            public_accounts: [{name: "", appType: '', appId: "", appSecret: "", notify_roles: [], template: []}],
            pay: {appid: "", mch_id: "", mch_key: "", secret: ""}
          },
          ali: {pay: {appid: ""}},
          his: {his_server: "", his_code: ""},
          sms: {type: "", appid: "", security_key: "", sign: "", region: "", template: [{key: "", id: "", time: ""}]}
        };
        this.configThird = {app_name: "", app_id: "", app_secret: ""};
      },
      async getMerchantTree() {
        let dbData = await getMerchantTree();
        let newData = JSON.parse(JSON.stringify(dbData))
        this.treeData = parseTree(newData);
        if (Array.isArray(this.treeData) && this.treeData.length) {
          this.getOneMerchant(this.treeData[0].value)
          //如果节点为父级 则不显示父商户选择框
          this.isTop = this.treeData[0].isTop
          this.$nextTick(() => {
            this.$refs.merchantTree.setCurrentKey(this.treeData[0].value);
            this.controlOpBtn()
          })
        }
      },
      //获取消息模板类型
      async getSmsTemplate() {
        let data = {code: ["SMS_TEMPLATE_TYPE", "MSG_TEMPLATE_TYPE"]}
        return getCodeTree(data).then(res => {
          const data = res;
          this.smsTemplate = data.SMS_TEMPLATE_TYPE;
          this.msgTemplate = data.MSG_TEMPLATE_TYPE;
        }).catch(err => {
          this.$message.warning("获取模板类型失败");
        })
      },
      //获取角色
      async getRoleParis() {
        return getRolePairs().then(res => {
          this.roleData = res
        }).catch(err => {
          this.$message.warning(err.message || '获取角色失败');
        })
      },
      //获取商户信息
      getOneMerchant(innerid) {
        getOneMerchant(innerid).then(res => {
          this.form = res;
          this.config = JSON.parse(res.config);
          res.config_third ? this.configThird = JSON.parse(res.config_third) : this.configThird = {
            app_name: "",
            app_id: "",
            app_secret: ""
          };
          if (this.form.province) {
            let search1 = String(this.form.province).substr(0, 2);
            this.cityData = this.handlerData(chinaData.city_list, search1);
          }
          if (this.form.province && this.form.city) {
            let search2 = String(this.form.city).substr(0, 4);
            this.areaData = this.handlerData(chinaData.county_list, search2);
          }
          let baseUrl = this.$conf.resource.baseUrl;
          this.form.logourl ? this.$set(this.imgObj, 'logourl', baseUrl + this.form.logourl) : this.$set(this.imgObj, 'logourl', null);
          this.form.business_licence_url ? this.$set(this.imgObj, 'business_licence_url', baseUrl + this.form.business_licence_url) : this.$set(this.imgObj, 'business_licence_url', null);
          this.form.drug_licence_url ? this.$set(this.imgObj, 'drug_licence_url', baseUrl + this.form.drug_licence_url) : this.$set(this.imgObj, 'drug_licence_url', null);
          this.form.front_idcard_url ? this.$set(this.imgObj, 'front_idcard_url', baseUrl + this.form.front_idcard_url) : this.$set(this.imgObj, 'front_idcard_url', null);
          this.form.back_idcard_url ? this.$set(this.imgObj, 'back_idcard_url', baseUrl + this.form.back_idcard_url) : this.$set(this.imgObj, 'back_idcard_url', null);
          this.form.qr_code_url ? this.$set(this.imgObj, 'qr_code_url', baseUrl + this.form.qr_code_url) : this.$set(this.imgObj, 'qr_code_url', null);
        }).catch(err => {
          this.$message.warning(err.message || '获取数据失败');
        })
      },
      //获取商户id
      getValue(value) {
        this.form.parent_id = value
      },
      //节点过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //新增子节点
      nodeAppend(node, data) {
        //新增数据
        let nodeapp = {id: '1', label: '新增节点', parentId: data.value};
        if (!data.children) {
          if (data.hasOwnProperty('children')) {
            delete data['children']
          }
          this.$set(data, 'children', []);
        }
        data.children.push(nodeapp)
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const selectIndex = children.findIndex(v => v.value === data.value);//同一级 被选中节点的index
        const selectNode = children[selectIndex];  //拿到被添加的上一级(点击添加的节点)
        this.selectNode = selectNode;
      },
      //删除节点
      nodeDelete(node, data) {
        this.$confirm('确定删除该节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const parent = node.parent; //点击节点的父级
          const children = parent.data.children || parent.data;
          const selectIndex = children.findIndex(v => v.value === data.value);
          let nodeInnerId = children[selectIndex].value;//点击节点的value
          if (nodeInnerId) {
            del(nodeInnerId).then(res => {
              this.$message.success('操作成功');
              this.getMerchantTree();
              this.getOneMerchant(this.treeData[0].value);
            }).catch((err) => {
              this.$message.warning(err.message || '操作失败');
            })
          } else {
            children.splice(selectIndex, 1);
          }
        }).catch(() => {
        });
      },
      //点击节点
      handleNodeClick(data, node, e) {
        if (data.value) {
          //获取所点击的节点的商户信息
          this.getOneMerchant(data.value);
          //如果节点为父级 则不显示父商户选择框
          this.isTop = data.isTop;
        } else {
          this.form = {};
          this.$set(this.form, 'parent_id', data.parentId);
          this.$set(this.form, 'shortname', data.label);
          //新添加的节点显示父商户选择框
          this.isTop = false
          this.imgObj = {};
          this.getConfig();
        }
        //判断是否是最后一个节点
        let lastClass = node.childNodes.length > 0 ? false : true
        this.controlOpBtn(e, this.isTop, lastClass)
      },
      //控制新增删除
      controlOpBtn(e = '', isTop = true, lastClass = false) {
        let lists = document.getElementsByClassName("op-btn");
        for (let i = 0; i < lists.length; i++) {
          lists[i].lastChild.style.display = 'none'
        }
        let dom = '' //操作节点dom
        let delDom = ''////删除节点dom
        if (e) {
          dom = e.$el.getElementsByClassName('op-btn')[0].lastChild
          delDom = dom.lastChild
        } else {
          dom = document.getElementsByClassName('op-btn')[0].lastChild
          delDom = dom.lastChild
        }
        if (lastClass && !isTop) {
          dom.style.display = 'block'
          delDom.style.display = 'inline-block'
        } else {
          dom.style.display = 'block'
          delDom.style.display = 'none'
        }
      },
      //配置设置  新增行(data：行数据,key:微信配置类型[小程序;公众号])
      addRow(data, key) {
        let list = this.config.wechat[key];
        let obj = {};
        if (key == 'public_accounts') {
          obj = {
            name: "",
            appType: "",
            appId: "",
            appSecret: "",
            notify_roles: [],
            template: [],
          }
        } else {
          obj = {
            name: "",
            appType: "",
            appId: "",
            appSecret: "",
          }
        }
        list.splice(data.$index + 1, 0, obj);
      },
      //配置设置  删除行(data：行数据,type:配置类型[微信{key:微信配置类型[小程序;公众号]}，短信{key:短信配置模板[template]}])
      reduceRow(data, key, type) {
        this.config[type][key].splice(data.$index, 1);
      },

      //短信配置设置  新增行
      addSmsRow(data) {
        let list = this.config.sms['template'];
        list.splice(data.$index + 1, 0, {
          key: "",
          id: "",
          time: ""
        });
      },
      //微信公众号信息配置 新增行(pIdx:父级序号,data:子级行数据,key:微信配置类型[小程序;公众号]})
      addMsgRow(pIdx, data, key) {
        let wechatConf = this.config.wechat[key][pIdx];
        let list = wechatConf.template;
        list.splice(data.$index + 1, 0, {
          key: "",
          id: "",
        });
      },
      //微信公众号信息配置 删除行(pIdx:父级序号,data:子级行数据,key:微信配置类型[小程序;公众号]})
      reduceMsgRow(pIdx, data, key) {
        let wechatConf = this.config.wechat[key][pIdx];
        wechatConf.template.splice(data.$index, 1);
      },
      //短信改变服务商
      changeSmsType(e) {
        this.config.sms = {
          type: e,
          appid: "",
          security_key: "",
          sign: "",
          region: "",
          template: [{key: "", id: "", time: ""}]
        };
      },
      //图片上传
      async uploadImage(data) {
        let fileType = data.file.name.split('.').pop();
        if (data.data.key == 'qr_code_url' && (fileType.toLowerCase() != 'jpg' && fileType.toLowerCase() != 'png')) {
          return this.$message.warning("公众号二维码只可以上传图片且格式需为'.jpg'或'.png'");
        }
        const file = data.file;
        try {
          let uuid = await upload(file);
          this.$set(this.imgObj, data.data.key, URL.createObjectURL(file));
          this.$set(this.form, data.data.key, uuid);
        } catch (e) {
          console.error(e)
        }
      },
      //省市区联动
      changeCity(type) {
        if (type === 'province') {
          let search = String(this.form.province).substr(0, 2);
          this.cityData = this.handlerData(chinaData.city_list, search);
          this.areaData = {};
          this.$set(this.form, 'city', null);
          this.$set(this.form, 'area', null);
        } else if (type === 'city') {
          let search = String(this.form.city).substr(0, 4);
          this.areaData = this.handlerData(chinaData.county_list, search);
          this.$set(this.form, 'area', null);
        }
      },
      //处理数据
      handlerData(originalData, searchData) {
        let ret = {};
        let reg = new RegExp(`^${searchData}`);
        Object.keys(originalData).forEach(key => {
          if (reg.test(key)) ret[key] = originalData[key];
        });
        return ret;
      },
      //保存
      onSubmit() {
        this.$refs.form.validate(valide => {
          if (valide) {
            let params = {
              ...this.form,
              config: this.config,
              config_third: this.configThird
            };
            this.submitLoading = true;
            let promiseObj = this.form.innerid ? update(params) : add(params);
            promiseObj.then(res => {
              this.$message.success('保存成功');
              this.getMerchantTree();
            }).catch(err => {
              this.$message.warning(err.message || '操作失败')
            }).finally(() => {
              this.submitLoading = false;
            })
          }
        })
      }
    },
    async created() {
      //判断是否为A端用户
      this.isAAdmin = this.$store.state.user.isAAdmin
      this.getConfig();
      await this.getMerchantTree();
      await this.getSmsTemplate();
      await this.getRoleParis();
    }

  }
</script>

<style scoped lang="scss">
  .edit-input {
    border: 1px solid #DCDFE6;
    width: 50%;

    &:focus {
      outline: none;
      border: 0px;
      border: 1px solid #409EFF;
    }
  }

  .config_title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #8c939d;
  }

  .operation {
    padding: 0px 5px;
    width: 100%;
    display: inline-flex;
    font-size: 18px;
    flex-direction: row;
    justify-content: space-between;

    &_btn {
      width: 20px;
      height: 20px;
      color: #409EFF;

      &:hover {
        cursor: pointer;
      }

      &:last-child {
        color: #F56C6C;
      }
    }
  }

</style>

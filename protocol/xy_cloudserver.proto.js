module.exports = require("protobufjs").newBuilder({})['import']({
    "package": null,
    "options": {
        "java_package": "pb"
    },
    "messages": [
        {
            "name": "Header",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "sender",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "sender_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "version",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "invoke_id",
                    "id": 4
                }
            ]
        },
        {
            "name": "TimeHorizon",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "time_begin",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "time_end",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "hour_begin",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "hour_end",
                    "id": 4
                }
            ]
        },
        {
            "name": "DetailSearchCondition",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "time_begin",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "time_end",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "order_by",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "order_type",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "page_size",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "page_index",
                    "id": 6
                }
            ]
        },
        {
            "name": "PageInfo",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "page_index",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "page_count",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "item_count",
                    "id": 3
                }
            ]
        },
        {
            "name": "KeyValue",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "key",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "value",
                    "id": 20
                }
            ]
        },
        {
            "name": "SourceInfo",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "source_type",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "source_id",
                    "id": 2
                }
            ]
        },
        {
            "name": "ErrorResponse",
            "fields": [
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "errcode",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "errmsg",
                    "id": 2
                }
            ]
        },
        {
            "name": "CommonResponse",
            "fields": [
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "errcode",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "errmsg",
                    "id": 2
                }
            ]
        },
        {
            "name": "NoBody",
            "fields": []
        },
        {
            "name": "CustomerSearchCondition",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "id",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cf_account_id",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "wechat_open_id",
                    "id": 12
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "wechat_union_id",
                    "id": 13
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "wechat_code",
                    "id": 30
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "code",
                    "id": 18
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ali_id",
                    "id": 14
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mobile",
                    "id": 15
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "device_mac",
                    "id": 16
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "email",
                    "id": 17
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "app_device_id",
                    "id": 21
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "card_id",
                    "id": 22
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "car_num",
                    "id": 28
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "id_num",
                    "id": 40
                }
            ]
        },
        {
            "name": "xy_cloudserver",
            "fields": [],
            "messages": [
                {
                    "name": "Message",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "Header",
                            "name": "header",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "ErrorResponse",
                            "name": "res_error",
                            "id": 2,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "HeartbeatRequest",
                            "name": "req_heartbeat",
                            "id": 10,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "HeartbeatResponse",
                            "name": "res_heartbeat",
                            "id": 11,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentGroupRequest",
                            "name": "req_get_equipment_group",
                            "id": 15,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentGroupResponse",
                            "name": "res_get_equipment_group",
                            "id": 16,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "RegisterEquipmentRequest",
                            "name": "req_register_equipment",
                            "id": 20,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "RegisterEquipmentResponse",
                            "name": "res_register_equipment",
                            "id": 21,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentInfoRequest",
                            "name": "req_get_equipment_info",
                            "id": 30,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentInfoResponse",
                            "name": "res_get_equipment_info",
                            "id": 31,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "SearchCustomerRequest",
                            "name": "req_search_customer",
                            "id": 40,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "SearchCustomerResponse",
                            "name": "res_search_customer",
                            "id": 41,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "CheckEquipmentProductRequest",
                            "name": "req_check_equipment_product",
                            "id": 50,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_check_equipment_product",
                            "id": 51,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentAdminRequest",
                            "name": "req_get_equipment_admin",
                            "id": 60,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentAdminResponse",
                            "name": "res_get_equipment_admin",
                            "id": 61,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentProductRequest",
                            "name": "req_get_equipment_product",
                            "id": 70,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentProductResponse",
                            "name": "res_get_equipment_product",
                            "id": 71,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentOrderInfoRequest",
                            "name": "req_get_equipment_order_info",
                            "id": 80,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetEquipmentOrderInfoResponse",
                            "name": "res_get_equipment_order_info",
                            "id": 81,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "RegisterCustomerRequest",
                            "name": "req_register_customer",
                            "id": 100,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "RegisterCustomerResponse",
                            "name": "res_register_customer",
                            "id": 101,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "SubmitOrderRequest",
                            "name": "req_submit_order",
                            "id": 110,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_submit_order",
                            "id": 111,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "UpdateOrderStatusRequest",
                            "name": "req_update_order_status",
                            "id": 112,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_update_order_status",
                            "id": 113,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetOrderInfoRequest",
                            "name": "req_get_order_info",
                            "id": 115,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetOrderInfoResponse",
                            "name": "res_get_order_info",
                            "id": 116,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "PickUPProductRequest",
                            "name": "req_pick_up_customer_product",
                            "id": 120,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "PickUPProductResponse",
                            "name": "res_pick_up_customer_product",
                            "id": 121,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentProductChgRequest",
                            "name": "req_equipment_product_changed",
                            "id": 200,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_equipment_product_changed",
                            "id": 201,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentOrderChgRequest",
                            "name": "req_equipment_order_changed",
                            "id": 202,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_equipment_order_changed",
                            "id": 203,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "ReportEquipmentFaultRequest",
                            "name": "req_report_equipment_fault",
                            "id": 210,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_report_equipment_fault",
                            "id": 211,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "OrderChangedNotify",
                            "name": "ntf_order_chg",
                            "id": 220,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "OrderStatusChangedNotify",
                            "name": "ntf_order_status_chg",
                            "id": 225,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentProductChangedNotify",
                            "name": "ntf_equipment_product_chg",
                            "id": 230,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentOrderChangedNotify",
                            "name": "ntf_equipment_order_chg",
                            "id": 240,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "PayRequest",
                            "name": "req_pay",
                            "id": 300,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "PayResponse",
                            "name": "res_pay",
                            "id": 301,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "CancelPayRequest",
                            "name": "req_cancel_pay",
                            "id": 310,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_cancel_pay",
                            "id": 311,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "RefundPayRequest",
                            "name": "req_refund_pay",
                            "id": 320,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "RefundPayResponse",
                            "name": "res_refund_pay",
                            "id": 321,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "PreCreateTradeRequest",
                            "name": "req_pre_create_trade",
                            "id": 330,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "PreCreateTradeResponse",
                            "name": "res_pre_create_trade",
                            "id": 331,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetPayStatusRequest",
                            "name": "req_get_pay_status",
                            "id": 340,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetPayStatusResponse",
                            "name": "res_get_pay_status",
                            "id": 341,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetRefundPayStatusRequest",
                            "name": "req_get_refundpay_status",
                            "id": 350,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "GetRefundPayStatusResponse",
                            "name": "res_get_refundpay_status",
                            "id": 351,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "PayMedicalInsuranceRequest",
                            "name": "req_pay_medical_insurance",
                            "id": 400,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_pay_medical_insurance",
                            "id": 401,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "UpdateMedicalInsuranceStatusRequest",
                            "name": "req_update_medical_insurance_status",
                            "id": 410,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "NoBody",
                            "name": "res_update_medical_insurance_status",
                            "id": 411,
                            "oneof": "content"
                        }
                    ],
                    "oneofs": {
                        "content": [
                            2,
                            10,
                            11,
                            15,
                            16,
                            20,
                            21,
                            30,
                            31,
                            40,
                            41,
                            50,
                            51,
                            60,
                            61,
                            70,
                            71,
                            80,
                            81,
                            100,
                            101,
                            110,
                            111,
                            112,
                            113,
                            115,
                            116,
                            120,
                            121,
                            200,
                            201,
                            202,
                            203,
                            210,
                            211,
                            220,
                            225,
                            230,
                            240,
                            300,
                            301,
                            310,
                            311,
                            320,
                            321,
                            330,
                            331,
                            340,
                            341,
                            350,
                            351,
                            400,
                            401,
                            410,
                            411
                        ]
                    }
                },
                {
                    "name": "EquipmentTypeInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "type",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "manufacturer",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "hardware_type",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "thermal_printer_type",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "laser_printer_type",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "scanner_type",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "frone_camera_type",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_camera_type",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "orifice_camera_type",
                            "id": 90
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "refrigeration_type",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ipc_hardware_type",
                            "id": 110
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ipc_software_type",
                            "id": 111
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "drug_channel",
                            "id": 120
                        }
                    ]
                },
                {
                    "name": "EquipmentGroupInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "no",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_id",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_name",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_qr_code",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "isenable",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "addr",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "longitude",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "latitude",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "contacts",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 71
                        }
                    ]
                },
                {
                    "name": "EquipmentInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentGroupInfo",
                            "name": "equipment_group_info",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentTypeInfo",
                            "name": "equipment_type_info",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "EEquipmentStatus",
                            "name": "status",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentProductInfo",
                            "name": "equipment_product_info",
                            "id": 65
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentOrderInfo",
                            "name": "equipment_order_info",
                            "id": 66
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ipaddr",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "mac",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "no",
                            "id": 90
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "drug_channel",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "CustomerInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id_card",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "addr",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "ECustomerSource",
                            "name": "source",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "avatar",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "ESex",
                            "name": "sex",
                            "id": 90
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "birthday",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "born",
                            "id": 110
                        },
                        {
                            "rule": "optional",
                            "type": "ECustomerStatus",
                            "name": "status",
                            "id": 120
                        }
                    ]
                },
                {
                    "name": "ProductCategory",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "parent_id",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "fullname",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "image",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "SymptomInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "part",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "people_classify",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "desc",
                            "id": 50
                        }
                    ]
                },
                {
                    "name": "ImageInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EImageType",
                            "name": "type",
                            "id": 15
                        }
                    ]
                },
                {
                    "name": "ProductInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "alias",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "approval_number",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "bar_code",
                            "id": 35
                        },
                        {
                            "rule": "repeated",
                            "type": "ProductCategory",
                            "name": "category_list_info",
                            "id": 40
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "combination_product_list_id",
                            "id": 45
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "length",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "height",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "width",
                            "id": 52
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "brand",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "unit",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "manufacturer",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "origin_place",
                            "id": 90
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "operator_category_Id",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "min_day",
                            "id": 110
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "max_day",
                            "id": 115
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "usage_dosage",
                            "id": 120
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "treatment_course",
                            "id": 130
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "eat_time",
                            "id": 140
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "product_function",
                            "id": 150
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "adverse_reaction",
                            "id": 160
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "taboo",
                            "id": 170
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "attention",
                            "id": 180
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "interactions",
                            "id": 190
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "specification",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "expiration_date",
                            "id": 210
                        },
                        {
                            "rule": "repeated",
                            "type": "SymptomInfo",
                            "name": "product_symptom_list_info",
                            "id": 220
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "home_thumb",
                            "id": 230
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "analeptic_flag",
                            "id": 240
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "ephedrine_flag",
                            "id": 250
                        },
                        {
                            "rule": "optional",
                            "type": "EProductStatus",
                            "name": "sale_status",
                            "id": 260
                        },
                        {
                            "rule": "repeated",
                            "type": "ImageInfo",
                            "name": "image_list",
                            "id": 270
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "detail",
                            "id": 280
                        }
                    ]
                },
                {
                    "name": "MerchantProductInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_product_id",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_product_no",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "ProductInfo",
                            "name": "product_info",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "EProductType",
                            "name": "product_type",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "batch_number",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "batch",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "electronic_monitoring_code",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "price",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "customer_price",
                            "id": 41
                        }
                    ]
                },
                {
                    "name": "ProductDisplayInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "x",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "y",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "z",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "show_image",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "EquipmentProductInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "SlotProductInfo",
                            "name": "slot_product_list_info",
                            "id": 20
                        }
                    ],
                    "messages": [
                        {
                            "name": "SlotProductInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "slot_no",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "MerchantProductInfo",
                                    "name": "merchant_product_info",
                                    "id": 30
                                },
                                {
                                    "rule": "optional",
                                    "type": "ProductDisplayInfo",
                                    "name": "product_display_info",
                                    "id": 40
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "real_stock",
                                    "id": 50
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "lock_stock",
                                    "id": 55
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "upper_limit",
                                    "id": 60
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "AccountInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "DeliveryInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "delivery_name",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "delivery_phone",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "delivery_addr",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "begin_appointment_time",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "end_appointment_time",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "EDeliveryStatus",
                            "name": "status",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "op_account_id",
                            "id": 90
                        }
                    ]
                },
                {
                    "name": "OrderInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "unique_code",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "inner_order_no",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "outer_order_no",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "serial_no",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_id",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "amount",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "customer_amount",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "pay_amount",
                            "id": 90
                        },
                        {
                            "rule": "optional",
                            "type": "EPayType",
                            "name": "pay_type",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "EOrderStatus",
                            "name": "order_status",
                            "id": 105
                        },
                        {
                            "rule": "optional",
                            "type": "EPayStatus",
                            "name": "pay_status",
                            "id": 110
                        },
                        {
                            "rule": "optional",
                            "type": "EBuyWay",
                            "name": "buy_way",
                            "id": 120
                        },
                        {
                            "rule": "optional",
                            "type": "EOrderSource",
                            "name": "order_source",
                            "id": 130
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "customer_id",
                            "id": 140
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "pick_up_code",
                            "id": 150
                        },
                        {
                            "rule": "optional",
                            "type": "EPickUpType",
                            "name": "pick_up_type",
                            "id": 160
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "pay_order_no",
                            "id": 170
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id_card",
                            "id": 180
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "medical_insurance_card",
                            "id": 190
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "lock_product",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "lock_expire_date",
                            "id": 205
                        },
                        {
                            "rule": "repeated",
                            "type": "OrderDetailInfo",
                            "name": "order_detail_info_list",
                            "id": 210
                        }
                    ]
                },
                {
                    "name": "OrderDetailInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "merchant_product_id",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "amount",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "customer_amount",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "unit_price",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "customer_price",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "product_count",
                            "id": 90
                        }
                    ]
                },
                {
                    "name": "EquipmentOrderInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "SlotOrderInfo",
                            "name": "slot_order_list_info",
                            "id": 20
                        }
                    ],
                    "messages": [
                        {
                            "name": "SlotOrderInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "slot_no",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "OrderInfo",
                                    "name": "order_info",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "ESlotOrderStatus",
                                    "name": "slot_status",
                                    "id": 30
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "EquipmentFaultInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EEquipmentFaultType",
                            "name": "fault_type",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "fault_code",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "content",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_time",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "EquipmentProductChgInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EEquipmentOperationType",
                            "name": "op_type",
                            "id": 15
                        },
                        {
                            "rule": "repeated",
                            "type": "SlotProductChangedInfo",
                            "name": "slot_product_chg_info_list",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "op_account_id",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "order_id",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "lock_product",
                            "id": 45
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "result",
                            "id": 50
                        }
                    ],
                    "messages": [
                        {
                            "name": "SlotProductChangedInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "slot_no",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "merchant_product_id",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "electronic_monitoring_code",
                                    "id": 30
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "changed_count",
                                    "id": 40
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "real_stock",
                                    "id": 50
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "lock_stock",
                                    "id": 60
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint64",
                                    "name": "op_time",
                                    "id": 70
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "errcode",
                                    "id": 80
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "errmsg",
                                    "id": 90
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "EquipmentOrderChgInfo",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EEquipmentOperationType",
                            "name": "op_type",
                            "id": 20
                        },
                        {
                            "rule": "repeated",
                            "type": "SlotOrderChangedInfo",
                            "name": "slot_order_chg_info_list",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "op_account_id",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "result",
                            "id": 50
                        }
                    ],
                    "messages": [
                        {
                            "name": "SlotOrderChangedInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "slot_no",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "order_id",
                                    "id": 40
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "order_unique_code",
                                    "id": 50
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "changed_count",
                                    "id": 60
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint64",
                                    "name": "op_time",
                                    "id": 70
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "errcode",
                                    "id": 80
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "errmsg",
                                    "id": 90
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "HeartbeatRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "temperature",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "humidity",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "HeartbeatResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "EEquipmentStatus",
                            "name": "equipment_status",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "status_flag",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "RegisterEquipmentRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "mac",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_group_id",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_type",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "RegisterEquipmentResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "EquipmentInfo",
                            "name": "equipment_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetEquipmentInfoRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "mac",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "GetEquipmentInfoResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "EquipmentInfo",
                            "name": "equipment_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "SearchCustomerRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id_card",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "SearchCustomerResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "CustomerInfo",
                            "name": "customer_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "CheckEquipmentProductRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "EquipmentProductInfo",
                            "name": "equipment_product_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetEquipmentAdminRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id_card",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "account_login_id",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "account_pwd",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "GetEquipmentAdminResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "AccountInfo",
                            "name": "account_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetEquipmentProductRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetEquipmentProductResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "EquipmentProductInfo",
                            "name": "equipment_product_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetEquipmentOrderInfoRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetEquipmentOrderInfoResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "EquipmentOrderInfo",
                            "name": "equipment_order_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetProductCategoryRequest",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "product_list_id",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetProductCategoryResponse",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "ProductCategoryRelationInfo",
                            "name": "product_category_relation_list_info",
                            "id": 10
                        }
                    ],
                    "messages": [
                        {
                            "name": "ProductCategoryRelationInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "product_id",
                                    "id": 10
                                },
                                {
                                    "rule": "repeated",
                                    "type": "ProductCategory",
                                    "name": "product_category_list_info",
                                    "id": 20
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "RegisterCustomerRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "openid",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "mobile",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "password",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nick_name",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "avatar",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "ESex",
                            "name": "sex",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "location",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id_card",
                            "id": 80
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "birthday",
                            "id": 90
                        }
                    ]
                },
                {
                    "name": "RegisterCustomerResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "CustomerInfo",
                            "name": "customer_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "SubmitOrderRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "OrderInfo",
                            "name": "order_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetOrderInfoRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "order_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "inner_order_no",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "outer_order_no",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "serial_no",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "unique_code",
                            "id": 50
                        }
                    ]
                },
                {
                    "name": "GetOrderInfoResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "OrderInfo",
                            "name": "order_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "PickUPProductRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "pick_up_code",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "PickUPProductResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "order_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "lock_product",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "presc_id",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "trade_no",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "EOrderStatus",
                            "name": "order_status",
                            "id": 17
                        },
                        {
                            "rule": "repeated",
                            "type": "PickUPProductInfo",
                            "name": "pick_up_product_list_info",
                            "id": 20
                        }
                    ],
                    "messages": [
                        {
                            "name": "PickUPProductInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "merchant_product_id",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "product_count",
                                    "id": 20
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "GetEquipmentGroupRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "account_login_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "account_pwd",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "GetEquipmentGroupResponse",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "EquipmentGroupInfo",
                            "name": "equipment_grop_info_list",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "EquipmentProductChgRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "req_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentProductChgInfo",
                            "name": "equipment_product_chg_info",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "EquipmentOrderChgRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "req_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentOrderChgInfo",
                            "name": "equipment_order_chg_info",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "ReportEquipmentFaultRequest",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "EquipmentFaultInfo",
                            "name": "fault_info_list",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "UpdateOrderStatusRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "order_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EOrderStatus",
                            "name": "status",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "OrderChangedNotify",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "OrderInfo",
                            "name": "order_info",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "OrderStatusChangedNotify",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "order_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EOrderStatus",
                            "name": "status",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "EquipmentProductChangedNotify",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "req_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentProductChgInfo",
                            "name": "equipment_product_chg_info",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "EquipmentOrderChangedNotify",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "req_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "EquipmentOrderChgInfo",
                            "name": "equipment_order_chg_info",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "PayRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "merchant_id",
                            "id": 10
                        },
                        {
                            "rule": "required",
                            "type": "ETradeType",
                            "name": "trade_type",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "trade_no",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "openid",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "auth_code",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "total_fee",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "discountable_fee",
                            "id": 45
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "comment",
                            "id": 50
                        }
                    ]
                },
                {
                    "name": "PayResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "total_fee",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "discount",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "EPayStatus",
                            "name": "status",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "pay_url",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "PayRequestParam",
                            "name": "pay_req_param",
                            "id": 50
                        }
                    ],
                    "messages": [
                        {
                            "name": "PayRequestParam",
                            "fields": [
                                {
                                    "rule": "required",
                                    "type": "int32",
                                    "name": "time_stamp",
                                    "id": 10
                                },
                                {
                                    "rule": "required",
                                    "type": "string",
                                    "name": "nonce_str",
                                    "id": 15
                                },
                                {
                                    "rule": "required",
                                    "type": "string",
                                    "name": "package",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "sign_type",
                                    "id": 25
                                },
                                {
                                    "rule": "required",
                                    "type": "string",
                                    "name": "pay_sign",
                                    "id": 30
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "partnerid",
                                    "id": 35
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "prepay_id",
                                    "id": 40
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "CancelPayRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "trade_no",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "RefundPayRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "op_account_id",
                            "id": 10
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "trade_no",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "refund_fee",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "comment",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "RefundPayResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "refund_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "refund_fee",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "ERefundStatus",
                            "name": "status",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "PreCreateTradeRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "merchant_id",
                            "id": 10
                        },
                        {
                            "rule": "required",
                            "type": "ETradeType",
                            "name": "trade_type",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "body",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "return_url",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "show_url",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "trade_no",
                            "id": 35
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "total_fee",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "discountable_fee",
                            "id": 55
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "comment",
                            "id": 60
                        }
                    ]
                },
                {
                    "name": "PreCreateTradeResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "total_fee",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "discount",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "pay_url",
                            "id": 35
                        }
                    ]
                },
                {
                    "name": "GetPayStatusRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "trade_no",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetPayStatusResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "EPayStatus",
                            "name": "status",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetRefundPayStatusRequest",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "trade_no",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "GetRefundPayStatusResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ERefundStatus",
                            "name": "status",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "PayMedicalInsuranceRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "presc_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "trade_no",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "equipment_id",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "op_time",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "total_fee",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "EPayStatus",
                            "name": "status",
                            "id": 60
                        }
                    ]
                },
                {
                    "name": "UpdateMedicalInsuranceStatusRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "presc_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "trade_no",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "EPayStatus",
                            "name": "status",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "op_time",
                            "id": 40
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "EEquipmentStatus",
                    "values": [
                        {
                            "name": "ES_IsOk",
                            "id": 0
                        },
                        {
                            "name": "ES_Fault",
                            "id": 1
                        },
                        {
                            "name": "ES_Offline",
                            "id": 2
                        },
                        {
                            "name": "ES_Stop",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ESex",
                    "values": [
                        {
                            "name": "Sex_Unknow",
                            "id": 0
                        },
                        {
                            "name": "Sex_Male",
                            "id": 1
                        },
                        {
                            "name": "Sex_Female",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ECustomerSource",
                    "values": [
                        {
                            "name": "RS_Platform",
                            "id": 0
                        },
                        {
                            "name": "RS_Equipment",
                            "id": 1
                        },
                        {
                            "name": "CS_APP",
                            "id": 2
                        },
                        {
                            "name": "RS_Wechat",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ECustomerStatus",
                    "values": [
                        {
                            "name": "CS_Invalid",
                            "id": 0
                        },
                        {
                            "name": "CS_Valid",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "EProductStatus",
                    "values": [
                        {
                            "name": "PS_NoSale",
                            "id": 0
                        },
                        {
                            "name": "PS_Sale",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "EAccountRole",
                    "values": [
                        {
                            "name": "AR_Super_Admin",
                            "id": 1
                        },
                        {
                            "name": "AR_verification_Admin",
                            "id": 2
                        },
                        {
                            "name": "AR_Drug_Admin",
                            "id": 3
                        },
                        {
                            "name": "AR_Equipment_Admin",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "EPayType",
                    "values": [
                        {
                            "name": "PT_Wechat",
                            "id": 0
                        },
                        {
                            "name": "PT_Ali",
                            "id": 1
                        },
                        {
                            "name": "PT_MedicalInsuranceCard",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "EPayStatus",
                    "values": [
                        {
                            "name": "PS_NoPay",
                            "id": 0
                        },
                        {
                            "name": "PS_SUCCESS",
                            "id": 1
                        },
                        {
                            "name": "PS_WAITING",
                            "id": 2
                        },
                        {
                            "name": "PS_Failed",
                            "id": 3
                        },
                        {
                            "name": "PS_Refunded",
                            "id": 4
                        },
                        {
                            "name": "PS_EXPIRED",
                            "id": 5
                        },
                        {
                            "name": "PS_CANCLED",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "EBuyWay",
                    "values": [
                        {
                            "name": "BW_Buy",
                            "id": 0
                        },
                        {
                            "name": "BW_Take",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "EOrderStatus",
                    "values": [
                        {
                            "name": "OS_NoPay",
                            "id": 0
                        },
                        {
                            "name": "OS_Paied",
                            "id": 1
                        },
                        {
                            "name": "OS_Taked",
                            "id": 2
                        },
                        {
                            "name": "OS_Expired",
                            "id": 3
                        },
                        {
                            "name": "OS_Failed",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "EOrderSource",
                    "values": [
                        {
                            "name": "OSRC_Platform",
                            "id": 0
                        },
                        {
                            "name": "OSRC_Third",
                            "id": 1
                        },
                        {
                            "name": "OSRC_Equipment",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "EPickUpType",
                    "values": [
                        {
                            "name": "PUP_Input_Code",
                            "id": 0
                        },
                        {
                            "name": "PUP_Scan_QRCode",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "EEquipmentOperationType",
                    "values": [
                        {
                            "name": "EOT_Supplement",
                            "id": 0
                        },
                        {
                            "name": "EOT_OFF",
                            "id": 1
                        },
                        {
                            "name": "EOT_Pick_UP",
                            "id": 2
                        },
                        {
                            "name": "EOT_Check",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "EEquipmentFaultType",
                    "values": [
                        {
                            "name": "EF_Equipment_Fault",
                            "id": 0
                        },
                        {
                            "name": "EF_replenish_Product_Fault",
                            "id": 1
                        },
                        {
                            "name": "EF_Off_Product_Fault",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ETradeType",
                    "values": [
                        {
                            "name": "WX_JSAPI",
                            "id": 1
                        },
                        {
                            "name": "WX_NATIVE",
                            "id": 2
                        },
                        {
                            "name": "WX_APP",
                            "id": 3
                        },
                        {
                            "name": "WX_MICROPAY",
                            "id": 4
                        },
                        {
                            "name": "WX_MWEB",
                            "id": 5
                        },
                        {
                            "name": "ALI_BARCODE",
                            "id": 10
                        },
                        {
                            "name": "ALI_NATIVE",
                            "id": 11
                        },
                        {
                            "name": "ALI_APP",
                            "id": 12
                        },
                        {
                            "name": "ALI_WAP",
                            "id": 13
                        },
                        {
                            "name": "ALI_INSTANT",
                            "id": 14
                        },
                        {
                            "name": "ALI_FACEPAY",
                            "id": 15
                        },
                        {
                            "name": "CASH_PAY",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "ERefundStatus",
                    "values": [
                        {
                            "name": "WAIT_REFUND",
                            "id": 0
                        },
                        {
                            "name": "REFUND_SUCCESS",
                            "id": 1
                        },
                        {
                            "name": "REFUND_ERROR",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "EImageType",
                    "values": [
                        {
                            "name": "IMAGE_THUMBNAIL",
                            "id": 1
                        },
                        {
                            "name": "IMAGE_FRONT",
                            "id": 2
                        },
                        {
                            "name": "IMAGE_BACK",
                            "id": 3
                        },
                        {
                            "name": "IMAGE_OTHER",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "EProductType",
                    "values": [
                        {
                            "name": "PRODUCT_INSURANCE_OTHER",
                            "id": 1
                        },
                        {
                            "name": "PRODUCT_NON_INSURANCE_OTHER",
                            "id": 2
                        },
                        {
                            "name": "PRODUCT_INSURANCE_PRESCRIPTION",
                            "id": 3
                        },
                        {
                            "name": "PRODUCT_NON_INSURANCE_PRESCRIPTION",
                            "id": 4
                        },
                        {
                            "name": "PRODUCT_INSURANCE_CLASSA_NON_PRESCRIPTION",
                            "id": 5
                        },
                        {
                            "name": "PRODUCT_INSURANCE_CLASSB_NON_PRESCRIPTION",
                            "id": 6
                        },
                        {
                            "name": "PRODUCT_NON_INSURANCE_CLASSA_NON_PRESCRIPTION",
                            "id": 7
                        },
                        {
                            "name": "PRODUCT_NON_INSURANCE_CLASSB_NON_PRESCRIPTION",
                            "id": 8
                        }
                    ]
                },
                {
                    "name": "EDeliveryStatus",
                    "values": [
                        {
                            "name": "DELIVERY_NO_START",
                            "id": 0
                        },
                        {
                            "name": "DELIVERY_WAITING",
                            "id": 1
                        },
                        {
                            "name": "DELIVERY_FINISHED",
                            "id": 2
                        },
                        {
                            "name": "DELIVERY_FAILED",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ESlotOrderStatus",
                    "values": [
                        {
                            "name": "SOS_IDLE",
                            "id": 0
                        },
                        {
                            "name": "SOS_USING",
                            "id": 2
                        },
                        {
                            "name": "SOS_BIND_FAILED",
                            "id": 3
                        },
                        {
                            "name": "SOS_EXPIRED",
                            "id": 4
                        }
                    ]
                }
            ]
        }
    ],
    "enums": [
        {
            "name": "EDictationMode",
            "values": [
                {
                    "name": "DictationMode_Disabled",
                    "id": 1
                },
                {
                    "name": "DictationMode_Sleep",
                    "id": 2
                },
                {
                    "name": "DictationMode_Active",
                    "id": 3
                }
            ]
        },
        {
            "name": "ELEDMode",
            "values": [
                {
                    "name": "LEDMode_ON",
                    "id": 0
                },
                {
                    "name": "LEDMode_OFF",
                    "id": 1
                },
                {
                    "name": "LEDMode_FLASH",
                    "id": 2
                },
                {
                    "name": "LEDMode_BREATH",
                    "id": 3
                }
            ]
        }
    ]
}).build();
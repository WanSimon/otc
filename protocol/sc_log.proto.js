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
            "name": "sc",
            "fields": [],
            "messages": [
                {
                    "name": "log",
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
                                    "type": "NotifyNewLog",
                                    "name": "evt_new_log",
                                    "id": 10,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "GetFileListRequest",
                                    "name": "req_get_file_list",
                                    "id": 20,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "GetFileListResponse",
                                    "name": "res_get_file_list",
                                    "id": 21,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "GetFileContentRequest",
                                    "name": "req_get_file_content",
                                    "id": 30,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "GetFileContentResponse",
                                    "name": "res_get_file_content",
                                    "id": 31,
                                    "oneof": "content"
                                }
                            ],
                            "oneofs": {
                                "content": [
                                    2,
                                    10,
                                    20,
                                    21,
                                    30,
                                    31
                                ]
                            }
                        },
                        {
                            "name": "LogContent",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "uint64",
                                    "name": "offset",
                                    "id": 1
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "length",
                                    "id": 2
                                },
                                {
                                    "rule": "optional",
                                    "type": "ELogLevel",
                                    "name": "level",
                                    "id": 3
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint64",
                                    "name": "time",
                                    "id": 4
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint64",
                                    "name": "thread",
                                    "id": 5
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "content",
                                    "id": 6
                                }
                            ]
                        },
                        {
                            "name": "FileInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "file_name",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "file_size",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "duration",
                                    "id": 30
                                }
                            ]
                        },
                        {
                            "name": "NotifyNewLog",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "server_name",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "file_name",
                                    "id": 30
                                },
                                {
                                    "rule": "repeated",
                                    "type": "LogContent",
                                    "name": "content",
                                    "id": 50
                                }
                            ]
                        },
                        {
                            "name": "GetFileListRequest",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "reply",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "invoke_id",
                                    "id": 20
                                }
                            ]
                        },
                        {
                            "name": "GetFileListResponse",
                            "fields": [
                                {
                                    "rule": "repeated",
                                    "type": "FileInfo",
                                    "name": "files",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "invoke_id",
                                    "id": 20
                                }
                            ]
                        },
                        {
                            "name": "GetFileContentRequest",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "invoke_id",
                                    "id": 2
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "file_name",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "offset",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "max_line_count",
                                    "id": 30
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "reply",
                                    "id": 40
                                }
                            ]
                        },
                        {
                            "name": "GetFileContentResponse",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "invoke_id",
                                    "id": 2
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "offset",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "file_size",
                                    "id": 20
                                },
                                {
                                    "rule": "repeated",
                                    "type": "string",
                                    "name": "contents",
                                    "id": 30
                                }
                            ]
                        }
                    ],
                    "enums": [
                        {
                            "name": "ELogLevel",
                            "values": [
                                {
                                    "name": "None",
                                    "id": 0
                                },
                                {
                                    "name": "Error",
                                    "id": 1
                                },
                                {
                                    "name": "Warn",
                                    "id": 2
                                },
                                {
                                    "name": "Info",
                                    "id": 3
                                },
                                {
                                    "name": "Debug",
                                    "id": 4
                                },
                                {
                                    "name": "Trace",
                                    "id": 5
                                }
                            ]
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
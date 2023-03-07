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
            "name": "system",
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
                            "type": "BasedataChangedNotify",
                            "name": "ntf_basedata_changed",
                            "id": 10,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "ConfigChangedNotify",
                            "name": "ntf_config_changed",
                            "id": 20,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "SystemStatusNotify",
                            "name": "ntf_status",
                            "id": 30,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "Ping",
                            "name": "ping",
                            "id": 40,
                            "oneof": "content"
                        },
                        {
                            "rule": "optional",
                            "type": "Pong",
                            "name": "pong",
                            "id": 50,
                            "oneof": "content"
                        }
                    ],
                    "oneofs": {
                        "content": [
                            2,
                            10,
                            20,
                            30,
                            40,
                            50
                        ]
                    }
                },
                {
                    "name": "BasedataChangedNotify",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "abstract",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "DataChanged",
                            "name": "detail",
                            "id": 20
                        }
                    ],
                    "messages": [
                        {
                            "name": "DataChanged",
                            "fields": [
                                {
                                    "rule": "required",
                                    "type": "EOP",
                                    "name": "op",
                                    "id": 10
                                },
                                {
                                    "rule": "required",
                                    "type": "string",
                                    "name": "table_name",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "innerid",
                                    "id": 30
                                },
                                {
                                    "rule": "repeated",
                                    "type": "KeyValue",
                                    "name": "param",
                                    "id": 40
                                }
                            ]
                        }
                    ],
                    "enums": [
                        {
                            "name": "EOP",
                            "values": [
                                {
                                    "name": "Insert",
                                    "id": 1
                                },
                                {
                                    "name": "Update",
                                    "id": 2
                                },
                                {
                                    "name": "Delete",
                                    "id": 3
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "ConfigChangedNotify",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "ETargetType",
                            "name": "target_type",
                            "id": 10
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "instance_name",
                            "id": 20
                        },
                        {
                            "rule": "repeated",
                            "type": "KeyValue",
                            "name": "param",
                            "id": 30
                        }
                    ],
                    "enums": [
                        {
                            "name": "ETargetType",
                            "values": [
                                {
                                    "name": "SubSystem",
                                    "id": 1
                                },
                                {
                                    "name": "Program",
                                    "id": 2
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "SystemStatusNotify",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "EStatus",
                            "name": "status",
                            "id": 10
                        }
                    ],
                    "enums": [
                        {
                            "name": "EStatus",
                            "values": [
                                {
                                    "name": "Init",
                                    "id": 1
                                },
                                {
                                    "name": "Running",
                                    "id": 2
                                },
                                {
                                    "name": "Closed",
                                    "id": 3
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Ping",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "instance_name",
                            "id": 10
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "replay",
                            "id": 20
                        },
                        {
                            "rule": "required",
                            "type": "int64",
                            "name": "tick",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "Pong",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int64",
                            "name": "tick",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "HostInfo",
                            "name": "host_info",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "ProcessInfo",
                            "name": "process_info",
                            "id": 30
                        }
                    ],
                    "messages": [
                        {
                            "name": "HostInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "os_name",
                                    "id": 1
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "host_name",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "ip_address",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "mem_total",
                                    "id": 30
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "mem_free",
                                    "id": 40
                                }
                            ]
                        },
                        {
                            "name": "ProcessInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "uint64",
                                    "name": "pid",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint64",
                                    "name": "ppid",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "pindex",
                                    "id": 30
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "mem_used",
                                    "id": 40
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "mem_total",
                                    "id": 50
                                },
                                {
                                    "rule": "optional",
                                    "type": "bool",
                                    "name": "is_db_connected",
                                    "id": 60
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "db_query_count",
                                    "id": 70
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "db_query_times",
                                    "id": 80
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "db_link_occupy",
                                    "id": 90
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "message_in_count",
                                    "id": 100
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "message_out_count",
                                    "id": 110
                                },
                                {
                                    "rule": "optional",
                                    "type": "bool",
                                    "name": "is_redis_connected",
                                    "id": 120
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
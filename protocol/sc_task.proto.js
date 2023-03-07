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
                    "name": "task",
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
                                    "type": "AddTaskRequest",
                                    "name": "req_add_task",
                                    "id": 30,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "AddTaskReqsponse",
                                    "name": "res_add_task",
                                    "id": 31,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "UpdateTaskRequest",
                                    "name": "req_update_task",
                                    "id": 40,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "NoBody",
                                    "name": "res_update_task",
                                    "id": 41,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "StartTaskRequest",
                                    "name": "req_start_task",
                                    "id": 10,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "StartTaskResponse",
                                    "name": "res_start_task",
                                    "id": 11,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "TerminateTaskRequest",
                                    "name": "req_terminate_task",
                                    "id": 20,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "NoBody",
                                    "name": "res_terminate_task",
                                    "id": 21,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "PauseTaskRequest",
                                    "name": "req_pause_task",
                                    "id": 50,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "NoBody",
                                    "name": "res_pause_task",
                                    "id": 51,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "ResumeTaskRequest",
                                    "name": "req_resume_task",
                                    "id": 60,
                                    "oneof": "content"
                                },
                                {
                                    "rule": "optional",
                                    "type": "NoBody",
                                    "name": "res_resume_task",
                                    "id": 61,
                                    "oneof": "content"
                                }
                            ],
                            "oneofs": {
                                "content": [
                                    2,
                                    30,
                                    31,
                                    40,
                                    41,
                                    10,
                                    11,
                                    20,
                                    21,
                                    50,
                                    51,
                                    60,
                                    61
                                ]
                            }
                        },
                        {
                            "name": "TaskRunPlan",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "Once",
                                    "name": "once",
                                    "id": 10,
                                    "oneof": "type"
                                },
                                {
                                    "rule": "optional",
                                    "type": "Cycle",
                                    "name": "cycle",
                                    "id": 20,
                                    "oneof": "type"
                                },
                                {
                                    "rule": "optional",
                                    "type": "uint32",
                                    "name": "timeout",
                                    "id": 40
                                },
                                {
                                    "rule": "optional",
                                    "type": "bool",
                                    "name": "repeate",
                                    "id": 50
                                }
                            ],
                            "oneofs": {
                                "type": [
                                    10,
                                    20
                                ]
                            },
                            "messages": [
                                {
                                    "name": "Once",
                                    "fields": [
                                        {
                                            "rule": "optional",
                                            "type": "uint64",
                                            "name": "time",
                                            "id": 10
                                        }
                                    ]
                                },
                                {
                                    "name": "Cycle",
                                    "fields": [
                                        {
                                            "rule": "optional",
                                            "type": "bool",
                                            "name": "align",
                                            "id": 10
                                        },
                                        {
                                            "rule": "optional",
                                            "type": "int32",
                                            "name": "minute",
                                            "id": 21
                                        },
                                        {
                                            "rule": "optional",
                                            "type": "int32",
                                            "name": "hour",
                                            "id": 22
                                        },
                                        {
                                            "rule": "optional",
                                            "type": "int32",
                                            "name": "day",
                                            "id": 23
                                        },
                                        {
                                            "rule": "optional",
                                            "type": "int32",
                                            "name": "month",
                                            "id": 24
                                        },
                                        {
                                            "rule": "optional",
                                            "type": "int32",
                                            "name": "year",
                                            "id": 25
                                        },
                                        {
                                            "rule": "optional",
                                            "type": "int32",
                                            "name": "week",
                                            "id": 26
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "TaskInfo",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "id",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "SourceInfo",
                                    "name": "source",
                                    "id": 20
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "name",
                                    "id": 30
                                },
                                {
                                    "rule": "required",
                                    "type": "string",
                                    "name": "type",
                                    "id": 40
                                },
                                {
                                    "rule": "repeated",
                                    "type": "KeyValue",
                                    "name": "parameter",
                                    "id": 50
                                },
                                {
                                    "rule": "optional",
                                    "type": "TaskRunPlan",
                                    "name": "plan",
                                    "id": 60
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "desc",
                                    "id": 70
                                },
                                {
                                    "rule": "optional",
                                    "type": "bool",
                                    "name": "is_active",
                                    "id": 80
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "retry_count",
                                    "id": 90
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "retry_interval",
                                    "id": 100
                                }
                            ]
                        },
                        {
                            "name": "AddTaskRequest",
                            "fields": [
                                {
                                    "rule": "required",
                                    "type": "TaskInfo",
                                    "name": "task_info",
                                    "id": 10
                                }
                            ]
                        },
                        {
                            "name": "AddTaskReqsponse",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "TaskInfo",
                                    "name": "task_info",
                                    "id": 10
                                }
                            ]
                        },
                        {
                            "name": "UpdateTaskRequest",
                            "fields": [
                                {
                                    "rule": "required",
                                    "type": "TaskInfo",
                                    "name": "task_info",
                                    "id": 10
                                }
                            ]
                        },
                        {
                            "name": "StartTaskRequest",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "task_id",
                                    "id": 10,
                                    "oneof": "method"
                                },
                                {
                                    "rule": "optional",
                                    "type": "TaskInfo",
                                    "name": "task_info",
                                    "id": 20,
                                    "oneof": "method"
                                },
                                {
                                    "rule": "repeated",
                                    "type": "KeyValue",
                                    "name": "parameter",
                                    "id": 30
                                }
                            ],
                            "oneofs": {
                                "method": [
                                    10,
                                    20
                                ]
                            }
                        },
                        {
                            "name": "StartTaskResponse",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "run_id",
                                    "id": 10
                                }
                            ]
                        },
                        {
                            "name": "PauseTaskRequest",
                            "fields": [
                                {
                                    "rule": "required",
                                    "type": "string",
                                    "name": "run_id",
                                    "id": 10
                                },
                                {
                                    "rule": "optional",
                                    "type": "int32",
                                    "name": "duration",
                                    "id": 20
                                }
                            ]
                        },
                        {
                            "name": "ResumeTaskRequest",
                            "fields": [
                                {
                                    "rule": "required",
                                    "type": "string",
                                    "name": "run_id",
                                    "id": 10
                                }
                            ]
                        },
                        {
                            "name": "TerminateTaskRequest",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "run_id",
                                    "id": 5
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "reason",
                                    "id": 10
                                }
                            ]
                        }
                    ],
                    "enums": [
                        {
                            "name": "ETaskStatus",
                            "values": [
                                {
                                    "name": "TS_Waiting",
                                    "id": 1
                                },
                                {
                                    "name": "TS_Running",
                                    "id": 2
                                },
                                {
                                    "name": "TS_Success",
                                    "id": 3
                                },
                                {
                                    "name": "TS_Terminate",
                                    "id": 4
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
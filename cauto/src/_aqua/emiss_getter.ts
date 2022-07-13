/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.7.4-330
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    CallParams,
    callFunction,
    registerService,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v3';


// Services

export interface EmissGetterDef {
    calc_emission: (gpm: number, speeds: number[], interval: number, callParams: CallParams<'gpm' | 'speeds' | 'interval'>) => { error_msg: string; res_high: number; res_low: number; result: number; success: boolean; } | Promise<{ error_msg: string; res_high: number; res_low: number; result: number; success: boolean; }>;
    get_configs: (year: number, make: string, model: string, callParams: CallParams<'year' | 'make' | 'model'>) => { error_msg: string; result: string; success: boolean; } | Promise<{ error_msg: string; result: string; success: boolean; }>;
}
export function registerEmissGetter(service: EmissGetterDef): void;
export function registerEmissGetter(serviceId: string, service: EmissGetterDef): void;
export function registerEmissGetter(peer: FluencePeer, service: EmissGetterDef): void;
export function registerEmissGetter(peer: FluencePeer, serviceId: string, service: EmissGetterDef): void;
       

export function registerEmissGetter(...args: any) {
    registerService(
        args,
        {
    "defaultServiceId" : "emiss-getter",
    "functions" : {
        "tag" : "labeledProduct",
        "fields" : {
            "calc_emission" : {
                "tag" : "arrow",
                "domain" : {
                    "tag" : "labeledProduct",
                    "fields" : {
                        "gpm" : {
                            "tag" : "scalar",
                            "name" : "u32"
                        },
                        "speeds" : {
                            "tag" : "array",
                            "type" : {
                                "tag" : "scalar",
                                "name" : "f32"
                            }
                        },
                        "interval" : {
                            "tag" : "scalar",
                            "name" : "f32"
                        }
                    }
                },
                "codomain" : {
                    "tag" : "unlabeledProduct",
                    "items" : [
                        {
                            "tag" : "struct",
                            "name" : "EmissResult",
                            "fields" : {
                                "success" : {
                                    "tag" : "scalar",
                                    "name" : "bool"
                                },
                                "error_msg" : {
                                    "tag" : "scalar",
                                    "name" : "string"
                                },
                                "res_low" : {
                                    "tag" : "scalar",
                                    "name" : "f32"
                                },
                                "res_high" : {
                                    "tag" : "scalar",
                                    "name" : "f32"
                                },
                                "result" : {
                                    "tag" : "scalar",
                                    "name" : "f32"
                                }
                            }
                        }
                    ]
                }
            },
            "get_configs" : {
                "tag" : "arrow",
                "domain" : {
                    "tag" : "labeledProduct",
                    "fields" : {
                        "year" : {
                            "tag" : "scalar",
                            "name" : "u32"
                        },
                        "make" : {
                            "tag" : "scalar",
                            "name" : "string"
                        },
                        "model" : {
                            "tag" : "scalar",
                            "name" : "string"
                        }
                    }
                },
                "codomain" : {
                    "tag" : "unlabeledProduct",
                    "items" : [
                        {
                            "tag" : "struct",
                            "name" : "ConfigResult",
                            "fields" : {
                                "error_msg" : {
                                    "tag" : "scalar",
                                    "name" : "string"
                                },
                                "result" : {
                                    "tag" : "scalar",
                                    "name" : "string"
                                },
                                "success" : {
                                    "tag" : "scalar",
                                    "name" : "bool"
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
}
    );
}
      
// Functions
 

export function get_emissions(
    gpm: number,
    speeds: number[],
    interval: number,
    config?: {ttl?: number}
): Promise<number>;

export function get_emissions(
    peer: FluencePeer,
    gpm: number,
    speeds: number[],
    interval: number,
    config?: {ttl?: number}
): Promise<number>;

export function get_emissions(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                           (call %init_peer_id% ("getDataSrv" "gpm") [] gpm)
                          )
                          (call %init_peer_id% ("getDataSrv" "speeds") [] speeds)
                         )
                         (call %init_peer_id% ("getDataSrv" "interval") [] interval)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (call "12D3KooWCMr9mU894i8JXAFqpgoFtx6qnV1LFPSfVc3Y34N4h4LS" ("db28e777-ad2f-4a65-8633-4d3834e07c3a" "calc_emission") [gpm speeds interval] res)
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (call -relay- ("op" "noop") [])
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res.$.result!])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "get_emissions",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "gpm" : {
                    "tag" : "scalar",
                    "name" : "u32"
                },
                "speeds" : {
                    "tag" : "array",
                    "type" : {
                        "tag" : "scalar",
                        "name" : "f32"
                    }
                },
                "interval" : {
                    "tag" : "scalar",
                    "name" : "f32"
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "scalar",
                    "name" : "f32"
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}

 

export function get_configs(
    year: number,
    make: string,
    model: string,
    config?: {ttl?: number}
): Promise<string>;

export function get_configs(
    peer: FluencePeer,
    year: number,
    make: string,
    model: string,
    config?: {ttl?: number}
): Promise<string>;

export function get_configs(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                           (call %init_peer_id% ("getDataSrv" "year") [] year)
                          )
                          (call %init_peer_id% ("getDataSrv" "make") [] make)
                         )
                         (call %init_peer_id% ("getDataSrv" "model") [] model)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (call "12D3KooWCMr9mU894i8JXAFqpgoFtx6qnV1LFPSfVc3Y34N4h4LS" ("db28e777-ad2f-4a65-8633-4d3834e07c3a" "get_configs") [year make model] res)
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (call -relay- ("op" "noop") [])
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res.$.result!])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "get_configs",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "year" : {
                    "tag" : "scalar",
                    "name" : "u32"
                },
                "make" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "model" : {
                    "tag" : "scalar",
                    "name" : "string"
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "scalar",
                    "name" : "string"
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
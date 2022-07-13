/*
 * Copyright 2021 Fluence Labs Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

use marine_rs_sdk::{marine, module_manifest, MountedBinaryResult};
// use picorand::{WyRand, RNG};
use serde_json::json;

// #[macro_use]
// extern crate fstrings;

module_manifest!();

pub fn main() {}

#[marine]
pub struct ConfigResult {
    pub result: String,
    pub success: bool,
    pub error_msg: String,
}

#[marine]
pub struct EmissResult {
    pub result: f32,
    pub res_low: f32,
    pub res_high: f32,
    pub success: bool,
    pub error_msg: String,
}

#[marine]
pub fn get_configs(year: u32, make: String, model: String) -> ConfigResult {
    let url = "https://cauto-api.vercel.app/api/modelConfigs".to_string();
    let json_data = json!({ "year": year, "make": make, "model": model });

    let curl_cmd = vec![
        "-X".to_string(),
        "GET".to_string(),
        "-H".to_string(),
        "Accept: application/json".to_string(),
        "-H".to_string(),
        "Content-Type: application/json".to_string(),
        "--data".to_string(),
        json_data.to_string(),
        url,
    ];
    let response = curl_request(curl_cmd);
    let result = String::from_utf8(response.stdout);

    match result {
        Ok(res) => {
            // let json_res = serde_json::from_str(&res.clone());
            // if json_res.is_err() {
            //     return Result {
            //         result: "".to_string(),
            //         success: false,
            //         error_msg: "Failure to complete call".to_string(),
            //     };
            // }
            // let json_res: serde_json::Value = json_res.unwrap();
            // let value = json_res[coin.to_lowercase()][currency.to_lowercase()].as_f64();
            // if value.is_none() {
            //     return Result {
            //         result: "".to_string(),
            //         success: false,
            //         error_msg:
            //             "No values from source available. Check your configuration values."
            //                 .to_string(),
            //     };
            // }

            // let value: f64 = value.unwrap();

            ConfigResult {
                result: res,
                success: true,
                error_msg: "".to_string(),
            }
        }
        Err(_) => ConfigResult {
            result: "".to_string(),
            success: false,
            error_msg: String::from_utf8(response.stderr).unwrap(),
        },
    }
}

#[marine]
pub fn calc_emission(gpm: u32, speeds: Vec<f32>, interval: f32) -> EmissResult {
    let mut count = 0;
    let mut distance = 0.0;
    
    if speeds.len() == 0 {
        EmissResult {
            result: 0.0,
            res_low: 0.0,
            res_high: 0.0,
            success: false,
            error_msg: "No speed data".to_string(),
        }
    } else {
        loop {
            if count == 0 {
                count += 1;
                continue;
            }
            if count >= speeds.len() { break; }
            
            distance += interval * (speeds[count] + speeds[count - 1]) / 2.0;
            count += 1;
        }
    
        let emission = gpm as f32 * distance / 1609.0;
    
        EmissResult {
            result: emission,
            res_low: emission * 80.0 / 100.0,
            res_high: emission * 120.0 / 100.0,
            success: true,
            error_msg: "".to_string(),
        }
    }
}

#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
    pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult;
}

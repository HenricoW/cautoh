#!/usr/bin/env bash -o errexit -o nounset -o pipefail

mkdir -p artifacts

cd curl_adapter
cargo update --aggressive
marine build --release
cd ..

cd emiss_getter
cargo update --aggressive
marine build --release
cd ..

rm -f artifacts/*.wasm

cp curl_adapter/target/wasm32-wasi/release/curl_adapter.wasm artifacts/
cp emiss_getter/target/wasm32-wasi/release/emiss_getter.wasm artifacts/
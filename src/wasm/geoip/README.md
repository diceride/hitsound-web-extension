# wasm-geoip

A WebAssembly (WASM) GeoLite2 binary database (MMDB) loader

## Getting started

### Generating Rust targets for Bazel

[cargo-raze](https://github.com/google/cargo-raze) generates Bazel BUILD files, a vendoring instruction for the WORKSPACE, and aliases to the explicit dependencies from Cargo dependencies.

Install [cargo-raze](https://github.com/google/cargo-raze)

```sh
$ cargo install cargo-raze
```

Build the Bazel BUILD files

```sh
$ cargo raze
```

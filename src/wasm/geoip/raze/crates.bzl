"""
@generated
cargo-raze generated Bazel file.

DO NOT EDIT! Replaced on runs of cargo-raze
"""

load("@bazel_tools//tools/build_defs/repo:git.bzl", "new_git_repository")  # buildifier: disable=load
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")  # buildifier: disable=load
load("@bazel_tools//tools/build_defs/repo:utils.bzl", "maybe")  # buildifier: disable=load

def raze_fetch_remote_crates():
    """This function defines a collection of repos and should be called in a WORKSPACE file"""
    maybe(
        http_archive,
        name = "raze__build_const__0_2_1",
        url = "https://crates.io/api/v1/crates/build_const/0.2.1/download",
        type = "tar.gz",
        sha256 = "39092a32794787acd8525ee150305ff051b0aa6cc2abaf193924f5ab05425f39",
        strip_prefix = "build_const-0.2.1",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.build_const-0.2.1.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__bumpalo__3_6_1",
        url = "https://crates.io/api/v1/crates/bumpalo/3.6.1/download",
        type = "tar.gz",
        sha256 = "63396b8a4b9de3f4fdfb320ab6080762242f66a8ef174c49d8e19b674db4cdbe",
        strip_prefix = "bumpalo-3.6.1",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.bumpalo-3.6.1.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__byteorder__1_4_3",
        url = "https://crates.io/api/v1/crates/byteorder/1.4.3/download",
        type = "tar.gz",
        sha256 = "14c189c53d098945499cdfa7ecc63567cf3886b3332b312a5b4585d8d3a6a610",
        strip_prefix = "byteorder-1.4.3",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.byteorder-1.4.3.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__cfg_if__0_1_10",
        url = "https://crates.io/api/v1/crates/cfg-if/0.1.10/download",
        type = "tar.gz",
        sha256 = "4785bdd1c96b2a846b2bd7cc02e86b6b3dbf14e7e53446c4f54c92a361040822",
        strip_prefix = "cfg-if-0.1.10",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.cfg-if-0.1.10.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__cfg_if__1_0_0",
        url = "https://crates.io/api/v1/crates/cfg-if/1.0.0/download",
        type = "tar.gz",
        sha256 = "baf1de4339761588bc0619e3cbc0120ee582ebb74b53b4efbf79117bd2da40fd",
        strip_prefix = "cfg-if-1.0.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.cfg-if-1.0.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__crc__1_8_1",
        url = "https://crates.io/api/v1/crates/crc/1.8.1/download",
        type = "tar.gz",
        sha256 = "d663548de7f5cca343f1e0a48d14dcfb0e9eb4e079ec58883b7251539fa10aeb",
        strip_prefix = "crc-1.8.1",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.crc-1.8.1.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__ipnetwork__0_18_0",
        url = "https://crates.io/api/v1/crates/ipnetwork/0.18.0/download",
        type = "tar.gz",
        strip_prefix = "ipnetwork-0.18.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.ipnetwork-0.18.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__js_sys__0_3_57",
        url = "https://crates.io/api/v1/crates/js-sys/0.3.57/download",
        type = "tar.gz",
        strip_prefix = "js-sys-0.3.57",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.js-sys-0.3.57.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__lazy_static__1_4_0",
        url = "https://crates.io/api/v1/crates/lazy_static/1.4.0/download",
        type = "tar.gz",
        sha256 = "e2abad23fbc42b3700f2f279844dc832adb2b2eb069b2df918f455c4e18cc646",
        strip_prefix = "lazy_static-1.4.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.lazy_static-1.4.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__libc__0_2_93",
        url = "https://crates.io/api/v1/crates/libc/0.2.93/download",
        type = "tar.gz",
        sha256 = "9385f66bf6105b241aa65a61cb923ef20efc665cb9f9bb50ac2f0c4b7f378d41",
        strip_prefix = "libc-0.2.93",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.libc-0.2.93.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__log__0_4_14",
        url = "https://crates.io/api/v1/crates/log/0.4.14/download",
        type = "tar.gz",
        sha256 = "51b9bbe6c47d51fc3e1a9b945965946b4c44142ab8792c50835a980d362c2710",
        strip_prefix = "log-0.4.14",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.log-0.4.14.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__lzma_rs__0_2_0",
        url = "https://crates.io/api/v1/crates/lzma-rs/0.2.0/download",
        type = "tar.gz",
        sha256 = "aba8ecb0450dfabce4ad72085eed0a75dffe8f21f7ada05638564ea9db2d7fb1",
        strip_prefix = "lzma-rs-0.2.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.lzma-rs-0.2.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__maxminddb__0_23_0",
        url = "https://crates.io/api/v1/crates/maxminddb/0.23.0/download",
        type = "tar.gz",
        strip_prefix = "maxminddb-0.23.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.maxminddb-0.23.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__memchr__2_4_0",
        url = "https://crates.io/api/v1/crates/memchr/2.4.0/download",
        type = "tar.gz",
        sha256 = "b16bd47d9e329435e309c58469fe0791c2d0d1ba96ec0954152a5ae2b04387dc",
        strip_prefix = "memchr-2.4.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.memchr-2.4.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__memory_units__0_4_0",
        url = "https://crates.io/api/v1/crates/memory_units/0.4.0/download",
        type = "tar.gz",
        sha256 = "8452105ba047068f40ff7093dd1d9da90898e63dd61736462e9cdda6a90ad3c3",
        strip_prefix = "memory_units-0.4.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.memory_units-0.4.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__proc_macro2__1_0_28",
        url = "https://crates.io/api/v1/crates/proc-macro2/1.0.28/download",
        type = "tar.gz",
        sha256 = "5c7ed8b8c7b886ea3ed7dde405212185f423ab44682667c8c6dd14aa1d9f6612",
        strip_prefix = "proc-macro2-1.0.28",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.proc-macro2-1.0.28.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__quote__1_0_9",
        url = "https://crates.io/api/v1/crates/quote/1.0.9/download",
        type = "tar.gz",
        sha256 = "c3d0b9745dc2debf507c8422de05d7226cc1f0644216dfdfead988f9b1ab32a7",
        strip_prefix = "quote-1.0.9",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.quote-1.0.9.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__serde__1_0_136",
        url = "https://crates.io/api/v1/crates/serde/1.0.136/download",
        type = "tar.gz",
        strip_prefix = "serde-1.0.136",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.serde-1.0.136.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__serde_derive__1_0_136",
        url = "https://crates.io/api/v1/crates/serde_derive/1.0.136/download",
        type = "tar.gz",
        strip_prefix = "serde_derive-1.0.136",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.serde_derive-1.0.136.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__syn__1_0_68",
        url = "https://crates.io/api/v1/crates/syn/1.0.68/download",
        type = "tar.gz",
        sha256 = "3ce15dd3ed8aa2f8eeac4716d6ef5ab58b6b9256db41d7e1a0224c2788e8fd87",
        strip_prefix = "syn-1.0.68",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.syn-1.0.68.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__unicode_xid__0_2_1",
        url = "https://crates.io/api/v1/crates/unicode-xid/0.2.1/download",
        type = "tar.gz",
        sha256 = "f7fe0bb3479651439c9112f72b6c505038574c9fbb575ed1bf3b797fa39dd564",
        strip_prefix = "unicode-xid-0.2.1",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.unicode-xid-0.2.1.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__wasm_bindgen__0_2_80",
        url = "https://crates.io/api/v1/crates/wasm-bindgen/0.2.80/download",
        type = "tar.gz",
        strip_prefix = "wasm-bindgen-0.2.80",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.wasm-bindgen-0.2.80.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__wasm_bindgen_backend__0_2_80",
        url = "https://crates.io/api/v1/crates/wasm-bindgen-backend/0.2.80/download",
        type = "tar.gz",
        strip_prefix = "wasm-bindgen-backend-0.2.80",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.wasm-bindgen-backend-0.2.80.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__wasm_bindgen_macro__0_2_80",
        url = "https://crates.io/api/v1/crates/wasm-bindgen-macro/0.2.80/download",
        type = "tar.gz",
        strip_prefix = "wasm-bindgen-macro-0.2.80",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.wasm-bindgen-macro-0.2.80.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__wasm_bindgen_macro_support__0_2_80",
        url = "https://crates.io/api/v1/crates/wasm-bindgen-macro-support/0.2.80/download",
        type = "tar.gz",
        strip_prefix = "wasm-bindgen-macro-support-0.2.80",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.wasm-bindgen-macro-support-0.2.80.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__wasm_bindgen_shared__0_2_80",
        url = "https://crates.io/api/v1/crates/wasm-bindgen-shared/0.2.80/download",
        type = "tar.gz",
        strip_prefix = "wasm-bindgen-shared-0.2.80",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.wasm-bindgen-shared-0.2.80.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__web_sys__0_3_51",
        url = "https://crates.io/api/v1/crates/web-sys/0.3.51/download",
        type = "tar.gz",
        sha256 = "e828417b379f3df7111d3a2a9e5753706cae29c41f7c4029ee9fd77f3e09e582",
        strip_prefix = "web-sys-0.3.51",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.web-sys-0.3.51.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__wee_alloc__0_4_5",
        url = "https://crates.io/api/v1/crates/wee_alloc/0.4.5/download",
        type = "tar.gz",
        sha256 = "dbb3b5a6b2bb17cb6ad44a2e68a43e8d2722c997da10e928665c72ec6c0a0b8e",
        strip_prefix = "wee_alloc-0.4.5",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.wee_alloc-0.4.5.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__winapi__0_3_9",
        url = "https://crates.io/api/v1/crates/winapi/0.3.9/download",
        type = "tar.gz",
        sha256 = "5c839a674fcd7a98952e593242ea400abe93992746761e38641405d28b00f419",
        strip_prefix = "winapi-0.3.9",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.winapi-0.3.9.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__winapi_i686_pc_windows_gnu__0_4_0",
        url = "https://crates.io/api/v1/crates/winapi-i686-pc-windows-gnu/0.4.0/download",
        type = "tar.gz",
        sha256 = "ac3b87c63620426dd9b991e5ce0329eff545bccbbb34f3be09ff6fb6ab51b7b6",
        strip_prefix = "winapi-i686-pc-windows-gnu-0.4.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.winapi-i686-pc-windows-gnu-0.4.0.bazel"),
    )

    maybe(
        http_archive,
        name = "raze__winapi_x86_64_pc_windows_gnu__0_4_0",
        url = "https://crates.io/api/v1/crates/winapi-x86_64-pc-windows-gnu/0.4.0/download",
        type = "tar.gz",
        sha256 = "712e227841d057c1ee1cd2fb22fa7e5a5461ae8e48fa2ca79ec42cfc1931183f",
        strip_prefix = "winapi-x86_64-pc-windows-gnu-0.4.0",
        build_file = Label("//src/wasm/geoip/raze/remote:BUILD.winapi-x86_64-pc-windows-gnu-0.4.0.bazel"),
    )

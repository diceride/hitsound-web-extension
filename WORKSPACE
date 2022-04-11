workspace(
    name = "web-extension",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "bazel_skylib",
    sha256 = "f7be3474d42aae265405a592bb7da8e171919d74c16f082a5457840f06054728",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.2.1/bazel-skylib-1.2.1.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.2.1/bazel-skylib-1.2.1.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "2b2004784358655f334925e7eadc7ba80f701144363df949b3293e1ae7a2fb7b",
    url = "https://github.com/bazelbuild/rules_nodejs/releases/download/5.4.0/rules_nodejs-5.4.0.tar.gz",
)

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "npm_install")

# NodeJS LTS
node_repositories(
    node_version = "16.13.0",
)

npm_install(
    name = "npm",
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
)

load("@build_bazel_rules_nodejs//toolchains/esbuild:esbuild_repositories.bzl", "esbuild_repositories")

esbuild_repositories(npm_repository = "npm")

http_archive(
    name = "rules_rust",
    sha256 = "f582bb974433065c49ccbd5a60582468217f4c648df847a18db993e18eff9176",
    strip_prefix = "rules_rust-8f0dd9042e55a5782a3d6c2503d52eebf5931a44",
    url = "https://github.com/bazelbuild/rules_rust/archive/8f0dd9042e55a5782a3d6c2503d52eebf5931a44.tar.gz",
)

load("@rules_rust//rust:repositories.bzl", "rules_rust_dependencies", "rust_register_toolchains")

rules_rust_dependencies()

rust_register_toolchains(
    edition = "2021",
    version = "1.60.0",
)

load("@rules_rust//bindgen:repositories.bzl", "rust_bindgen_repositories")

rust_bindgen_repositories()

load("@rules_rust//wasm_bindgen:repositories.bzl", "rust_wasm_bindgen_repositories")

rust_wasm_bindgen_repositories()

register_toolchains("//bazel/wasm_bindgen:default_wasm_bindgen_toolchain")

load("//src/wasm/geoip/raze:crates.bzl", rust_wasm_geoip_fetch_remote_crates = "raze_fetch_remote_crates")

rust_wasm_geoip_fetch_remote_crates()

http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "90e736db4ff15cd46bf4d22c360b3c9ee718da3e746c72c44531ae8c55b38fbb",
    strip_prefix = "rules_sass-81632b2ef46de9306fb36b6725ff3d5b142105b8",
    url = "https://github.com/bazelbuild/rules_sass/archive/81632b2ef46de9306fb36b6725ff3d5b142105b8.tar.gz",
)

load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")

sass_repositories()

http_archive(
    name = "build_bazel_rules_web_ext",
    sha256 = "69ba9e2c756f47855241c7b0a22b5b834e11958b2edc938dbe127e38420f69e0",
    strip_prefix = "rules_web_ext-0.3.0",
    url = "https://github.com/browserbuild/rules_web_ext/archive/0.3.0.tar.gz",
)

load("@build_bazel_rules_web_ext//:package.bzl", "rules_browserbuild_dependencies")

rules_browserbuild_dependencies()

load("@build_bazel_rules_web_ext//:index.bzl", "browserbuild_setup_workspace")

browserbuild_setup_workspace()

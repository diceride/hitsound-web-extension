# buildifier: disable=module-docstring
load("@rules_rust//rust/private:transitions.bzl", "wasm_bindgen_transition")
load(
    "@rules_rust//wasm_bindgen:providers.bzl",
    "DeclarationInfo",
    "JSEcmaScriptModuleInfo",
    "JSModuleInfo",
    "JSNamedModuleInfo",
)

def _rust_wasm_bindgen_impl(ctx):
    toolchain = ctx.toolchains[Label("//bazel/wasm_bindgen:wasm_bindgen_toolchain")]
    bindgen_bin = toolchain.bindgen

    args = ctx.actions.args()
    args.add("--out-dir", ctx.outputs.bindgen_wasm_module.dirname)
    args.add("--out-name", ctx.attr.name)
    args.add_all(ctx.attr.bindgen_flags)
    args.add(ctx.file.wasm_file)

    ctx.actions.run(
        executable = bindgen_bin,
        inputs = [ctx.file.wasm_file],
        outputs = [
            ctx.outputs.bindgen_wasm_module,
            ctx.outputs.javascript_bindings,
            ctx.outputs.typescript_bindings,
        ],
        mnemonic = "RustWasmBindgen",
        progress_message = "Generating WebAssembly bindings for {}..".format(ctx.file.wasm_file.path),
        arguments = [args],
    )

    declarations = depset([
        ctx.outputs.typescript_bindings,
    ])
    es5_sources = depset([
        ctx.outputs.javascript_bindings,
    ])
    es6_sources = depset([
        ctx.outputs.javascript_bindings,
    ])

    return [
        DefaultInfo(
            files = depset([
                ctx.outputs.bindgen_wasm_module,
                ctx.outputs.javascript_bindings,
                ctx.outputs.typescript_bindings,
            ]),
        ),
        DeclarationInfo(
            declarations = declarations,
            transitive_declarations = declarations,
        ),
        JSModuleInfo(
            direct_sources = es5_sources,
            sources = es5_sources,
        ),
        JSNamedModuleInfo(
            direct_sources = es5_sources,
            sources = es5_sources,
        ),
        JSEcmaScriptModuleInfo(
            direct_sources = es6_sources,
            sources = es6_sources,
        ),
    ]

rust_wasm_bindgen = rule(
    implementation = _rust_wasm_bindgen_impl,
    attrs = {
        "bindgen_flags": attr.string_list(),
        "wasm_file": attr.label(
            allow_single_file = True,
            cfg = wasm_bindgen_transition,
        ),
        "_allowlist_function_transition": attr.label(
            default = Label("@rules_rust//tools/allowlists/function_transition_allowlist"),
        ),
    },
    outputs = {
        "bindgen_wasm_module": "%{name}_bg.wasm",
        "javascript_bindings": "%{name}.js",
        "typescript_bindings": "%{name}.d.ts",
    },
    toolchains = [
        str(Label("//bazel/wasm_bindgen:wasm_bindgen_toolchain")),
    ],
    incompatible_use_toolchain_transition = True,
)

def _rust_wasm_bindgen_toolchain_impl(ctx):
    return platform_common.ToolchainInfo(
        bindgen = ctx.executable.bindgen,
    )

rust_wasm_bindgen_toolchain = rule(
    implementation = _rust_wasm_bindgen_toolchain_impl,
    attrs = {
        "bindgen": attr.label(
            executable = True,
            cfg = "exec",
        ),
    },
)

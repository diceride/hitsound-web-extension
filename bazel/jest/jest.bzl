load("@bazel_skylib//rules:write_file.bzl", "write_file")
load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("@npm//jest-cli:index.bzl", "jest", _jest_test = "jest_test")

def jest_test(name, srcs, jest_config, deps = [], **kwargs):
    "A macro around the autogenerated jest_test rule"
    templated_args = [
        "--env=jsdom",
        "--no-cache",
        "--no-watchman",
        "--ci",
        "--colors",
    ]
    templated_args.extend(["--config", "$(rootpath %s)" % jest_config])

    tests = []
    for src in srcs:
        test_name = "%s.test" % src
        ts_project(
            name = test_name,
            testonly = True,
            srcs = [src],
            declaration = True,
            tsconfig = "//:test_tsconfig",
            deps = [
                "@npm//@types/node",
                "@npm//@types/jest",
            ] + deps,
        )

        tests.extend([test_name])

        templated_args.extend(["--runTestsByPath", "$(rootpath %s)" % test_name])

    data = [jest_config, "@npm//jsdom", "@npm//jest-esm-transformer"] + tests
    _jest_test(
        name = name,
        data = data,
        templated_args = templated_args,
        **kwargs
    )

    write_file(
        name = "chdir",
        out = "chdir.js",
        content = [
            "process.chdir(process.env['BUILD_WORKSPACE_DIRECTORY'])",
            "process.chdir('%s')" % native.package_name() if native.package_name() else "",
        ],
    )

    jest(
        name = "%s.update" % name,
        data = data + ["chdir.js"],
        templated_args = templated_args + [
            "--updateSnapshot",
            "--runInBand",
            "--node_options=--require=$(rootpath chdir.js)",
        ],
        **kwargs
    )

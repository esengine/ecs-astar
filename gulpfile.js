'use strict';
const gulp = require("gulp");
const terser = require('gulp-terser');
const inject = require("gulp-inject-string");
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const { deleteAsync } = require('del');
const tsProject = ts.createProject('tsconfig.json');

// 清理构建目录
function clean() {
    return deleteAsync(['bin/**/*']);
}

// 构建完整版本（包含所有算法）
function buildComplete() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(concat('pathfinding.js'))
        .pipe(inject.prepend('// 高性能寻路算法库 - 完整版 v1.0.1\n'))
        .pipe(gulp.dest('./bin'))
        .pipe(terser({
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            mangle: {
                toplevel: true
            }
        }))
        .pipe(concat('pathfinding.min.js'))
        .pipe(gulp.dest('./bin'));
}

// 构建A*算法模块
function buildAStar() {
    const astarProject = ts.createProject('tsconfig.json', {
        include: [
            "src/Types/**/*",
            "src/Utils/**/*",
            "src/AI/Pathfinding/AStar/**/*"
        ]
    });
    
    return astarProject.src()
        .pipe(astarProject())
        .js.pipe(concat('astar.js'))
        .pipe(inject.prepend('// A*寻路算法模块 v1.0.1\n'))
        .pipe(gulp.dest('./bin/modules'))
        .pipe(terser({
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            mangle: {
                toplevel: true
            }
        }))
        .pipe(concat('astar.min.js'))
        .pipe(gulp.dest('./bin/modules'));
}

// 构建广度优先算法模块
function buildBFS() {
    const bfsProject = ts.createProject('tsconfig.json', {
        include: [
            "src/Types/**/*",
            "src/Utils/**/*",
            "src/AI/Pathfinding/BreadthFirst/**/*"
        ]
    });
    
    return bfsProject.src()
        .pipe(bfsProject())
        .js.pipe(concat('breadth-first.js'))
        .pipe(inject.prepend('// 广度优先搜索算法模块 v1.0.1\n'))
        .pipe(gulp.dest('./bin/modules'))
        .pipe(terser({
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            mangle: {
                toplevel: true
            }
        }))
        .pipe(concat('breadth-first.min.js'))
        .pipe(gulp.dest('./bin/modules'));
}

// 构建类型定义文件
function buildDts() {
    return tsProject.src()
        .pipe(tsProject())
        .dts.pipe(concat('pathfinding.d.ts'))
        .pipe(gulp.dest('./bin'));
}

// 复制包文件
function copyPackageFiles() {
    return gulp.src(['package.json', 'README.md'])
        .pipe(gulp.dest('./bin'));
}

// 创建模块目录
function createModuleDir() {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./bin/modules'));
}

function build() {
    return gulp.src('bin/**/*');
}

// 导出任务
exports.clean = clean;
exports.buildComplete = buildComplete;
exports.buildAStar = buildAStar;
exports.buildBFS = buildBFS;
exports.buildDts = buildDts;
exports.copyPackageFiles = copyPackageFiles;
exports.createModuleDir = createModuleDir;

// 构建所有模块
exports.buildModules = gulp.series(createModuleDir, gulp.parallel(buildAStar, buildBFS));

// 完整构建
exports.build = gulp.series(
    clean,
    buildComplete, 
    buildDts, 
    copyPackageFiles, 
    exports.buildModules,
    build
);

exports.default = exports.build;
const gulp = require("gulp");
const gulpEsbuild = require("gulp-esbuild");
const sass = require("gulp-sass")(require("sass"));

// scss 轉 css
gulp.task("scss", async () => {
    await sleep(1);
    return gulp.src("./scss/**/*.scss") // 指定要處理的 Scss 檔案目錄
        .pipe(sass({
            //outputStyle: "compressed", //壓縮
        }))
        .pipe(gulp.dest("./css")) // 指定編譯後的 css 檔案目錄
});


// ts 轉 js
gulp.task("ts", async () => {
    await sleep(1);
    return gulp.src("./ts/**/*.ts")
        .pipe(gulpEsbuild({
            //minify: true, //壓縮
            //outfile: "bundle.js",
            //bundle: true,
            //loader: { ".tsx": "tsx", },
        }))
        .pipe(gulp.dest("./js"))
});


// 打包 - 單次
gulp.task("build", gulp.series("scss", "ts", ));

// 打包 - 持續監控檔案變化
gulp.task("watch", gulp.series("scss", "ts", () => {
    gulp.watch("./scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./ts/**/*.ts", gulp.series("ts"));
}));



async function sleep(ms) {
    await new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(); //繼續往下執行
        }, ms);
    })
}

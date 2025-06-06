import terser from "@rollup/plugin-terser";
import getBabelOutputPlugin from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.ts",
  output: { file: "./dist/index.js", format: "iife" },
  plugins: [
    terser({
      ecma: 5,
      mangle: true,
    }),
    getBabelOutputPlugin({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "Chrome 47",
          },
        ],
      ],
    }),
    typescript(),
  ],
};

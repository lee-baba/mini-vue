import typescript from "@rollup/plugin-typescript";
export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/cjs/index.js",
      format: "cjs",
    },
    {
      file: "./dist/esm/index.js",
      format: "es",
    },
  ],
  plugins: [typescript()],
};

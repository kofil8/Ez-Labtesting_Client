import path from "path";

export default {
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    reporters: ["default"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
};

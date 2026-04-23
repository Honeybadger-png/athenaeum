import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  clearMocks: true,
  testEnvironment: "node",
  // 1. Tell Jest to treat .ts files as ESM
  extensionsToTreatAsEsm: [".ts"], 
  
  transform: {
    // 2. Apply the ESM configuration to ts-jest
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  
  // 3. This helps Jest resolve your imports correctly
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
};
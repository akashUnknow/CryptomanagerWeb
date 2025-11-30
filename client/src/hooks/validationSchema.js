// validationSchema.js
import { z } from "zod";

// ---- Enums ----
export const Modes = z.enum([
  "ECB", "CBC", "CFB", "OFB", "CTR", "GCM", "CCM"
]);

export const Paddings = z.enum([
  "NoPadding", "PKCS5", "ISO9797_M1", "ISO9797_M2"
]);

export const Algorithms = z.enum([
  "DES", "DESede", "DESX", "AES"
]);

// ---- Request Validator ----
export const RequestSchema = z.object({
  algorithm: Algorithms,
  key: z.string().regex(/^[0-9A-Fa-f]+$/, "Key must be HEX"),
  mode: Modes,
  padding: Paddings,
  data: z.string().min(1, "Data cannot be empty"),
  iv: z.string().optional().nullable(),
  inputType: z.enum(["hex", "text"]),
  tagLength: z.number().optional()
}).superRefine((val, ctx) => {

  const keyLen = val.key.length;

  // ---------------------- DES VALIDATION ----------------------
  if (val.algorithm === "DES" && keyLen !== 16) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "DES key must be exactly 16 hex chars (8 bytes)",
      path: ["key"]
    });
  }

  if (val.algorithm === "DESede" && !(keyLen === 32 || keyLen === 48)) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "3DES key must be 32 hex chars (2-key) or 48 hex chars (3-key)",
      path: ["key"]
    });
  }

  if (val.algorithm === "DESX" && keyLen !== 48) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "DESX key must be exactly 48 hex chars",
      path: ["key"]
    });
  }

  // IV required for CBC, CFB, OFB (DES/3DES)
  if (["CBC", "CFB", "OFB"].includes(val.mode)) {
    if (!val.iv || val.iv.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `IV is required for ${val.mode} mode`,
        path: ["iv"]
      });
    } else if (val.algorithm !== "AES" && val.iv.length !== 16) {
      // For DES/3DES, IV should be 16 hex chars (8 bytes)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `DES/3DES IV must be 16 hex chars (8 bytes)`,
        path: ["iv"]
      });
    }
  }

  // ---------------------- AES VALIDATION ----------------------
  if (val.algorithm === "AES") {
    const keyBytes = val.key.length / 2;
    if (![16, 24, 32].includes(keyBytes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `AES key must be 32 hex chars (AES-128), 48 hex chars (AES-192), or 64 hex chars (AES-256). Current length: ${val.key.length}`,
        path: ["key"]
      });
    }

    // Modes that MUST use NoPadding
    const noPaddingModes = ["CFB", "OFB", "CTR", "GCM", "CCM"];
    if (noPaddingModes.includes(val.mode) && val.padding !== "NoPadding") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${val.mode} mode must use NoPadding`,
        path: ["padding"]
      });
    }

    // IV validation for AES modes
    const ivModes = ["CBC", "CFB", "OFB", "CTR", "GCM", "CCM"];
    if (ivModes.includes(val.mode)) {
      if (!val.iv || val.iv.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `IV/Nonce is required for ${val.mode} mode`,
          path: ["iv"]
        });
      }
    }

    // AES-GCM specific
    if (val.mode === "GCM") {
      if (!val.tagLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GCM mode requires tagLength (typically 128)",
          path: ["tagLength"]
        });
      }
      if (val.iv && ![24, 32].includes(val.iv.length)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GCM nonce must be 24 hex chars (12 bytes) or 32 hex chars (16 bytes)",
          path: ["iv"]
        });
      }
    }

    // AES-CCM specific
    if (val.mode === "CCM") {
      if (!val.tagLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CCM mode requires tagLength",
          path: ["tagLength"]
        });
      }
      if (val.iv && (val.iv.length < 14 || val.iv.length > 26)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CCM nonce must be between 14-26 hex chars (7-13 bytes)",
          path: ["iv"]
        });
      }
    }
  }

  // Validate data when inputType=hex
  if (val.inputType === "hex") {
    if (!/^[0-9A-Fa-f]+$/.test(val.data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data contains non-hexadecimal characters",
        path: ["data"]
      });
    }
    if (val.data.length % 2 !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hex data must have even number of characters",
        path: ["data"]
      });
    }
  }

});
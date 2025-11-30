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
  data: z.string(),
  iv: z.string().optional().nullable(),
  inputType: z.enum(["hex", "text"]),
  tagLength: z.number().optional() // required for GCM/CCM only
}).superRefine((val, ctx) => {

  const keyLen = val.key.length;

  // ---------------------- DES VALIDATION ----------------------
  if (val.algorithm === "DES" && keyLen !== 16) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "DES key must be 16 hex chars" });
  }

  if (val.algorithm === "DESede" && !(keyLen === 32 || keyLen === 48)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "DESede key must be 32 or 48 hex chars" });
  }

  if (val.algorithm === "DESX" && keyLen !== 48) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "DESX key must be 48 hex chars" });
  }

  // IV required for CBC, CFB, OFB
  if (["CBC", "CFB", "OFB"].includes(val.mode)) {
    if (!val.iv || val.iv.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `IV required for ${val.mode} mode`
      });
    }
  }

  // ---------------------- AES VALIDATION ----------------------
  if (val.algorithm === "AES") {
    const keyBytes = val.key.length / 2;
    if (![16, 24, 32].includes(keyBytes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "AES key must be 16/24/32 bytes"
      });
    }

    // ECB → No IV, must have padding
    if (val.mode === "ECB") {
      if (val.iv) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "IV is NOT allowed in ECB mode"
        });
      }
      if (val.padding === "NoPadding") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ECB mode requires padding"
        });
      }
    }

    // Modes that MUST use NoPadding
    const noPaddingModes = ["CFB", "OFB", "CTR", "GCM", "CCM"];
    if (noPaddingModes.includes(val.mode) && val.padding !== "NoPadding") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${val.mode} mode must use NoPadding`
      });
    }

    // IV validation for AES modes
    const ivModes = ["CBC", "CFB", "OFB", "CTR", "GCM", "CCM"];
    if (ivModes.includes(val.mode) && (!val.iv || val.iv.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `IV is required for ${val.mode}`
      });
    }

    // AES-GCM
    if (val.mode === "GCM") {
      if (!val.tagLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GCM tagLength required"
        });
      }
      if (val.iv && ![24, 32].includes(val.iv.length)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GCM IV must be 12 or 16 bytes"
        });
      }
    }

    // AES-CCM
    if (val.mode === "CCM") {
      if (!val.tagLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CCM tagLength required"
        });
      }
      if (val.iv && (val.iv.length < 14 || val.iv.length > 26)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CCM IV must be between 7–13 bytes"
        });
      }
    }
  }

  // Validate data when inputType=hex
  if (val.inputType === "hex") {
    if (!/^[0-9A-Fa-f]+$/.test(val.data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data declared HEX but contains non-hex chars"
      });
    }
    if (val.data.length % 2 !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hex data must have even length"
      });
    }
  }

});

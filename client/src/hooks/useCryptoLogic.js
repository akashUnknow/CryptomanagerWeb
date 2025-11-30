// useCryptoLogic.js
import { useState } from "react";
import { RequestSchema } from "./validationSchema";

export default function useCryptoLogic() {
  const [inputSource, setInputSource] = useState("direct");
  const [inputType, setInputType] = useState("hex");
  const [data, setData] = useState("1122334455667788");

  const [key1, setKey1] = useState("0123456789ABCDEF");
  const [key2, setKey2] = useState("0123456789ABCDEF");
  const [key3, setKey3] = useState("0123456789ABCDEF");

  const [algorithm, setAlgorithm] = useState("DESede");
  const [mode, setMode] = useState("CBC");
  const [padding, setPadding] = useState("PKCS5");
  const [iv, setIv] = useState("0001020304050607");
  const [tagLength, setTagLength] = useState(128);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Combine keys for DES / 3DES / DESX
  const combinedKey = () => {
    if (algorithm === "DES") return key1;
    if (algorithm === "DESede") return key1 + key2 + key3;
    if (algorithm === "DESX") return key1 + key2 + key3;
    return key1; // AES uses only key1
  };

  const handleEncrypt = async () => {
    setError(null);
    setResult("");

    const payload = {
      algorithm,
      key: combinedKey(),
      mode,
      padding,
      data: data.trim(),
      iv: iv || undefined,
      inputType,
      tagLength
    };
    console.log("Payload:", payload);

    try {
      RequestSchema.parse(payload);
    } catch (err) {
      if (err.errors) setError(err.errors.map(e => e.message).join(" | "));
      return;
    }

    setLoading(true);
    try {
      const url =
        algorithm === "AES"
          ? "http://localhost:8080/api/aes/encrypt"
          : "http://localhost:8080/api/encrypt";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) setError(json.error || JSON.stringify(json));
      else setResult(json.cipherText);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = () => {
    setError("Decrypt not implemented yet");
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return {
    // state
    inputSource,
    inputType,
    data,
    key1,
    key2,
    key3,
    algorithm,
    mode,
    padding,
    iv,
    tagLength,
    result,
    loading,
    error,
    copied,

    // setters
    setInputSource,
    setInputType,
    setData,
    setKey1,
    setKey2,
    setKey3,
    setAlgorithm,
    setMode,
    setPadding,
    setIv,
    setTagLength,

    // handlers
    handleEncrypt,
    handleDecrypt,
    handleCopy
  };
}

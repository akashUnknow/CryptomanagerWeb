import { useState } from 'react';
import { z } from 'zod';

// ZOD validation schemas
const Modes = z.enum(['ECB','CBC','CFB','OFB','DESX']);
const Paddings = z.enum(['NoPadding','PKCS5','ISO9797_M1','ISO9797_M2']);
const Algorithms = z.enum(['DES','DESede','DESX']);

const RequestSchema = z.object({
  algorithm: Algorithms,
  key: z.string().regex(/^[0-9A-Fa-f]+$/,'Key must be HEX'),
  mode: Modes,
  padding: Paddings,
  data: z.string(),
  iv: z.string().optional().nullable(),
  inputType: z.enum(['hex','text'])
}).superRefine((val, ctx) => {
  // Validate key length according to algorithm
  const keyLen = val.key.length;
  if (val.algorithm === 'DES' && keyLen !== 16) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom, 
      message: 'DES key must be 16 hex chars (8 bytes)'
    });
  }
  if (val.algorithm === 'DESede') {
    if (!(keyLen === 32 || keyLen === 48)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, 
        message: 'DESede key must be 32 (2-key) or 48 (3-key) hex chars'
      });
    }
  }
  if (val.algorithm === 'DESX' && keyLen !== 48) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom, 
      message: 'DESX key must be 48 hex chars'
    });
  }

  // IV required except for ECB and DESX
  if (['CBC','CFB','OFB'].includes(val.mode) && (!val.iv || val.iv.trim()==='')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom, 
      message: 'IV required for CBC/CFB/OFB (8 bytes = 16 hex chars)'
    });
  }
  if (val.iv && val.iv.length % 2 !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom, 
      message: 'IV hex must have even length'
    });
  }
  // const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Data validations
  if (val.inputType === 'hex') {
    if (!/^[0-9A-Fa-f]+$/.test(val.data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, 
        message: 'Data declared as HEX but contains non-hex chars'
      });
    }
    if (val.data.length % 2 !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, 
        message: 'Hex data must have even length (pairs of hex digits)'
      });
    }
  }
});

// Custom hook for crypto operations
export default function useCryptoLogic() {
  // State management
  const [inputSource, setInputSource] = useState('direct');
  const [inputType, setInputType] = useState('hex');
  const [data, setData] = useState('1122334455667788');
  const [key1, setKey1] = useState('0123456789ABCDEF');
  const [key2, setKey2] = useState('0123456789ABCDEF');
  const [key3, setKey3] = useState('0123456789ABCDEF');
  const [algorithm, setAlgorithm] = useState('DESede');
  const [mode, setMode] = useState('CBC');
  const [padding, setPadding] = useState('PKCS5');
  const [iv, setIv] = useState('0001020304050607');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Helper: Combine keys based on algorithm
  const combinedKey = () => {
    if (algorithm === 'DES') return key1;
    if (algorithm === 'DESede') {
      const k = (key1 || '') + (key2 || '');
      if (key3 && key3.trim().length > 0) return k + key3;
      return k;
    }
    // DESX expects 48 hex chars
    return (key1 || '') + (key2 || '') + (key3 || '');
  };

  // Encryption handler
  const handleEncrypt = async () => {
    setError(null);
    setResult('');

    const payload = {
      algorithm,
      key: combinedKey(),
      mode,
      padding,
      data: data.trim(),
      iv: iv && iv.trim() ? iv.trim() : undefined,
      inputType
    };
    // console.log('Payload:', payload);

    // Validate with Zod
    try {
      RequestSchema.parse(payload);
      // console.log('Validation passed');
    } catch (err) {
      console.error('Validation error:akash', err);
      if (err instanceof z.ZodError) {
        setError(err.errors.map(e => e.message).join(' ; '));
        return;
      }
      setError('Validation failed');
      return;
    }

    setLoading(true);
    try {
      const sendBody = {
        algorithm,
        key: combinedKey(),
        mode,
        padding,
        data: data.trim(),
        iv: iv && iv.trim() ? iv.trim() : undefined
      };
      console.log('Sending to API:', sendBody);

      const res = await fetch('http://localhost:8080/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendBody)
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || JSON.stringify(json));
      } else {
        setResult(json.cipherText || JSON.stringify(json));
      }
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // Decryption handler (placeholder)
  const handleDecrypt = async () => {
    setError(null);
    setResult('');
    // TODO: Implement decrypt logic
    setError('Decrypt functionality not yet implemented');
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  // Fill sample data
  const fillSample = (type) => {
    if (type === '3des-cbc') {
      setAlgorithm('DESede');
      setMode('CBC');
      setPadding('PKCS5');
      setKey1('0123456789ABCDEF');
      setKey2('0123456789ABCDEF');
      setKey3('0123456789ABCDEF');
      setData('1234567809');
      setIv('0001020304050607');
      setInputType('hex');
    }
    if (type === 'des-ecb') {
      setAlgorithm('DES');
      setMode('ECB');
      setPadding('NoPadding');
      setKey1('0123456789ABCDEF');
      setKey2('');
      setKey3('');
      setData('1122334455667788');
      setIv('');
      setInputType('hex');
    }
  };

  // Load sample block
  const loadSampleBlock = () => {
    setData('1122334455667788');
    setInputType('hex');
  };

  // Return state and handlers
  return {
    // State
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
    result,
    loading,
    error,
    copied,
    
    // Setters
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
    
    // Handlers
    handleEncrypt,
    handleDecrypt,
    handleCopy,
    fillSample,
    loadSampleBlock
  };
}
import React, { useState } from 'react';
import { z } from 'zod';
import { Lock, Key, Hash, ChevronRight, Upload, Download, Copy, Check, Settings } from 'lucide-react';

// Simple UI primitives (kept from your original snippet but wired up)
const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]}`} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>{children}</div>
);
const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      {Icon && (<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon className="w-5 h-5" /></div>)}
      <input className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${Icon ? 'pl-11' : ''}`} {...props} />
    </div>
  </div>
);
const Select = ({ label, options, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white" {...props}>
      {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
  </div>
);
const Textarea = ({ label, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <textarea className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" {...props} />
  </div>
);

// ---------- ZOD validation schema ----------
const Modes = z.enum(['ECB','CBC','CFB','OFB','DESX']);
const Paddings = z.enum(['NoPadding','PKCS5','ISO9797_M1','ISO9797_M2']);
const Algorithms = z.enum(['DES','DESede','DESX']);

const RequestSchema = z.object({
  algorithm: Algorithms,
  key: z.string().regex(/^[0-9A-Fa-f]+$/,'Key must be HEX'),
  mode: Modes,
  padding: Paddings,
  data: z.string(), // hex or text depending on inputType
  iv: z.string().optional().nullable(),
  inputType: z.enum(['hex','text'])
}).superRefine((val, ctx) => {
  // Validate key length according to algorithm
  const keyLen = val.key.length;
  if (val.algorithm === 'DES' && keyLen !== 16) ctx.addIssue({code:z.ZodIssueCode.custom, message:'DES key must be 16 hex chars (8 bytes)'});
  if (val.algorithm === 'DESede') {
    if (!(keyLen === 32 || keyLen === 48)) ctx.addIssue({code:z.ZodIssueCode.custom, message:'DESede key must be 32 (2-key) or 48 (3-key) hex chars'});
  }
  if (val.algorithm === 'DESX' && keyLen !== 48) ctx.addIssue({code:z.ZodIssueCode.custom, message:'DESX key must be 48 hex chars'});

  // IV required except for ECB and DESX (DESX treated as ECB)
  if (['CBC','CFB','OFB'].includes(val.mode) && (!val.iv || val.iv.trim()==='')) ctx.addIssue({code:z.ZodIssueCode.custom, message:'IV required for CBC/CFB/OFB (8 bytes = 16 hex chars)'});
  if (val.iv && val.iv.length % 2 !== 0) ctx.addIssue({code:z.ZodIssueCode.custom, message:'IV hex must have even length'});

  // Data validations
  if (val.inputType === 'hex') {
    if (!/^[0-9A-Fa-f]+$/.test(val.data)) ctx.addIssue({code:z.ZodIssueCode.custom, message:'Data declared as HEX but contains non-hex chars'});
    if (val.data.length % 2 !== 0) ctx.addIssue({code:z.ZodIssueCode.custom, message:'Hex data must have even length (pairs of hex digits)'});
  }

});

// ---------- Helper functions ----------
function toHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2,'0').toUpperCase()).join(' ');
}

// ---------- Main DESContent component with API integration ----------
export default function DESContent() {
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

  const combinedKey = () => {
    if (algorithm === 'DES') return key1;
    // DESede: if key3 provided 48-chars -> 3-key, else 2-key (concatenate k1+k2)
    if (algorithm === 'DESede') {
      const k = (key1||'') + (key2||'');
      if (key3 && key3.trim().length>0) return k + key3;
      return k;
    }
    // DESX expects 48 hex chars (w1 + desKey + w2)
    return (key1||'') + (key2||'') + (key3||'');
  };

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

    // Validate with Zod
    try {
      RequestSchema.parse(payload);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors.map(e=>e.message).join(' ; '));
        return;
      }
      setError('Validation failed');
      return;
    }

    setLoading(true);
    try {
      // The backend described in this conversation expects "data" to be HEX in many cases.
      // We will send exactly what user chose: if inputType is 'text' we send plain text bytes; if 'hex' we send hex string.

      const sendBody = {
        algorithm,
        key: combinedKey(),
        mode,
        padding,
        data: data.trim(),
        iv: iv && iv.trim() ? iv.trim() : undefined
      };

      const res = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(sendBody)
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || JSON.stringify(json));
      } else {
        // Backend now returns HEX string for ciphertext in many of our fixes. If it returns base64, we will show it raw.
        setResult(json.cipherText || JSON.stringify(json));
      }

    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  const fillSample = (type) => {
    // quick presets
    if (type==='3des-cbc') {
      setAlgorithm('DESede'); setMode('CBC'); setPadding('PKCS5'); setKey1('0123456789ABCDEF'); setKey2('0123456789ABCDEF'); setKey3('0123456789ABCDEF'); setData('1234567809'); setIv('0001020304050607'); setInputType('hex');
    }
    if (type==='des-ecb') { setAlgorithm('DES'); setMode('ECB'); setPadding('NoPadding'); setKey1('0123456789ABCDEF'); setKey2(''); setKey3(''); setData('1122334455667788'); setIv(''); setInputType('hex'); }
  };

  return (
    <div className="space-y-6 no-scrollbar">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Upload className="w-5 h-5 text-blue-600"/></div>
          <div><h3 className="font-semibold text-gray-900">Input Configuration</h3><p className="text-sm text-gray-500">Configure your input source and data</p></div>
        </div>

        <div className="space-y-4">
          <Select label="Input Source" options={[{value:'direct',label:'Direct Input'},{value:'file',label:'File Upload'}]} value={inputSource} onChange={(e)=>setInputSource(e.target.value)} />

          <div className="flex gap-3">
            <Select label="Input Type" options={[{value:'hex',label:'HEX'},{value:'text',label:'Plain Text'}]} value={inputType} onChange={(e)=>setInputType(e.target.value)} />
            <Button variant="secondary" onClick={()=>{ setData('1122334455667788'); setInputType('hex'); }}>Use sample block</Button>
            <Button variant="ghost" onClick={()=>fillSample('3des-cbc')}>Load 3DES-CBC sample</Button>
          </div>

          <Textarea label="Input Data" rows={6} value={data} onChange={(e)=>setData(e.target.value)} placeholder={inputType==='hex' ? 'Enter HEX data (e.g. 112233...)' : 'Enter plain text...'} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Settings className="w-5 h-5 text-purple-600"/></div>
        <div><h3 className="font-semibold text-gray-900">Encryption Settings</h3><p className="text-sm text-gray-500">Configure encryption parameters</p></div></div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Select label="Algorithm" options={[{value:'DES',label:'DES (56-bit)'},{value:'DESede',label:'3DES (112/168-bit)'},{value:'DESX',label:'DESX (whitened)'}]} value={algorithm} onChange={(e)=>setAlgorithm(e.target.value)} />
          <Select label="Mode" options={[{value:'ECB',label:'ECB'},{value:'CBC',label:'CBC'},{value:'CFB',label:'CFB'},{value:'OFB',label:'OFB'}]} value={mode} onChange={(e)=>setMode(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Input icon={Key} label={algorithm==='DES'?'Key (16 hex chars)':'Key1'} value={key1} onChange={(e)=>setKey1(e.target.value)} placeholder="Key 1 (hex)" />
          <Input icon={Key} label={algorithm==='DES'?'':'Key 2'} value={key2} onChange={(e)=>setKey2(e.target.value)} placeholder="Key 2 (hex)" />
          <Input icon={Key} label={algorithm==='DES'?'':'Key 3 (optional)'} value={key3} onChange={(e)=>setKey3(e.target.value)} placeholder="Key 3 (hex)" />
        </div>

        <Input icon={Hash} label="Initial Vector (IV - hex)" placeholder="IV (16 hex chars)" value={iv} onChange={(e)=>setIv(e.target.value)} />

        <div className="mt-4">
          <Select label="Padding" options={[{value:'NoPadding',label:'NoPadding'},{value:'PKCS5',label:'PKCS5'},{value:'ISO9797_M1',label:'ISO9797_M1'},{value:'ISO9797_M2',label:'ISO9797_M2'}]} value={padding} onChange={(e)=>setPadding(e.target.value)} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Lock className="w-5 h-5 text-green-600"/></div>
        <div><h3 className="font-semibold text-gray-900">Execute Operations</h3><p className="text-sm text-gray-500">Encrypt or decrypt your data</p></div></div>

        <div className="flex gap-3">
          <Button variant="primary" size="lg" icon={Lock} className="flex-1" onClick={handleEncrypt} disabled={loading}>{loading?'Encrypting...':'Encrypt'}</Button>
          <Button variant="outline" size="lg" icon={Key} className="flex-1" onClick={()=>{ /* decrypt handler if you add later */ }}>Decrypt</Button>
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Download className="w-5 h-5 text-gray-600"/></div>
          <div><h3 className="font-semibold text-gray-900">Output Result</h3><p className="text-sm text-gray-500">Your encrypted/decrypted data</p></div></div>

          <Button variant="ghost" size="sm" icon={copied?Check:Copy} onClick={handleCopy}>{copied?'Copied!':'Copy'}</Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[120px] font-mono text-sm text-gray-600">
          {result || 'Result will appear here...'}
        </div>
      </Card>
    </div>
  );
}

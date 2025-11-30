import React from 'react';
import { Settings, Key, Hash } from 'lucide-react';
import { Card, CardHeader, Input, Select } from '../UIComponents';

export default function EncryptionSettingsCard({
  algorithm,
  setAlgorithm,
  mode,
  setMode,
  key1,
  setKey1,
  key2,
  setKey2,
  key3,
  setKey3,
  iv,
  setIv,
  padding,
  setPadding
}) {

  // AES dynamic label
  const getAESKeyLabel = () => {
    if (!key1) return "AES Key (hex)";
    const len = key1.length;

    if (len === 32) return "AES-128 (32 hex chars)";
    if (len === 48) return "AES-192 (48 hex chars)";
    if (len === 64) return "AES-256 (64 hex chars)";

    return "AES Key (valid: 32 / 48 / 64 hex chars)";
  };

  // AES modes
  const aesModes = [
    { value: 'ECB', label: 'ECB' },
    { value: 'CBC', label: 'CBC' },
    { value: 'CFB', label: 'CFB' },
    { value: 'OFB', label: 'OFB' },
    { value: 'CCM', label: 'CCM (AEAD)' },
    { value: 'GCM', label: 'GCM (AEAD)' }
  ];

  // DES modes (original)
  const desModes = [
    { value: 'ECB', label: 'ECB' },
    { value: 'CBC', label: 'CBC' },
    { value: 'CFB', label: 'CFB' },
    { value: 'OFB', label: 'OFB' }
  ];

  // select correct modes based on algorithm
  let modeOptions = [];
  if (algorithm === "AES") {
    modeOptions = aesModes;
  } else {
    modeOptions = desModes;
  }
  let algorithmOptions = [];
  if (algorithm === "AES") {
    algorithmOptions = [
      { value: 'AES', label: 'AES (128/192/256-bit)' }
    ];
  } else if (algorithm === "DES") {
    algorithmOptions = [
      { value: 'DES', label: 'DES (56-bit)' },
      { value: 'DESede', label: '3DES (112/168-bit)' },
      { value: 'DESX', label: 'DESX (Whitened)' }
    ];
  } else {
    {/* default to all options */ }
  }

  return (
    <Card className="p-6">
      <CardHeader
        icon={Settings}
        title="Encryption Settings"
        description="Configure encryption parameters"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />

      {/* Algorithm + Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Algorithm Dropdown */}
        <Select
          label="Algorithm"
          options={algorithmOptions}
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        />

        {/* Dynamic Mode */}
        <Select
          label="Mode"
          options={modeOptions}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        />
      </div>

      {/* Dynamic Key Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

        {/* Key 1 */}
        <Input
          icon={Key}
          label={
            algorithm === 'AES'
              ? getAESKeyLabel()
              : algorithm === 'DES'
                ? 'DES Key (16 hex chars)'
                : 'Key 1'
          }
          value={key1}
          onChange={(e) => setKey1(e.target.value)}
          placeholder="Hex key"
        />

        {/* Key 2 */}
        <Input
          icon={Key}
          label={algorithm === 'AES' ? '' : 'Key 2'}
          value={key2}
          onChange={(e) => setKey2(e.target.value)}
          placeholder="Key 2 (hex)"
          disabled={algorithm === 'DES' || algorithm === "AES"}
        />

        {/* Key 3 */}
        <Input
          icon={Key}
          label={algorithm === 'AES' ? '' : 'Key 3 (optional)'}
          value={key3}
          onChange={(e) => setKey3(e.target.value)}
          placeholder="Key 3 (hex)"
          disabled={algorithm === 'DES' || algorithm === "AES"}
        />
      </div>

      {/* IV */}
      <Input
        icon={Hash}
        label={mode === "GCM" || mode === "CCM" ? "Nonce (IV - hex)" : "IV (hex)"}
        placeholder="IV / Nonce"
        value={iv}
        onChange={(e) => setIv(e.target.value)}
        disabled={mode === 'ECB'}
      />

      {/* Padding */}
      <div className="mt-4">
        <Select
          label="Padding"
          options={[
            { value: 'NoPadding', label: 'NoPadding' },
            { value: 'PKCS5', label: 'PKCS5' },
            { value: 'ISO9797_M1', label: 'ISO9797_M1' },
            { value: 'ISO9797_M2', label: 'ISO9797_M2' }
          ]}
          value={padding}
          onChange={(e) => setPadding(e.target.value)}
          disabled={mode === "GCM" || mode === "CCM"}
        />
      </div>
    </Card>
  );
}

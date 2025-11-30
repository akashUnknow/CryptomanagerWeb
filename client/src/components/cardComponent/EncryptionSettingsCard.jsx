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
  return (
    <Card className="p-6">
      <CardHeader 
        icon={Settings}
        title="Encryption Settings"
        description="Configure encryption parameters"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select 
          label="Algorithm" 
          options={[
            { value: 'DES', label: 'DES (56-bit)' },
            { value: 'DESede', label: '3DES (112/168-bit)' },
            { value: 'DESX', label: 'DESX (whitened)' }
          ]} 
          value={algorithm} 
          onChange={(e) => setAlgorithm(e.target.value)} 
        />
        <Select 
          label="Mode" 
          options={[
            { value: 'ECB', label: 'ECB' },
            { value: 'CBC', label: 'CBC' },
            { value: 'CFB', label: 'CFB' },
            { value: 'OFB', label: 'OFB' }
          ]} 
          value={mode} 
          onChange={(e) => setMode(e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Input 
          icon={Key} 
          label={algorithm === 'DES' ? 'Key (16 hex chars)' : 'Key 1'} 
          value={key1} 
          onChange={(e) => setKey1(e.target.value)} 
          placeholder="Key 1 (hex)" 
        />
        <Input 
          icon={Key} 
          label={algorithm === 'DES' ? '' : 'Key 2'} 
          value={key2} 
          onChange={(e) => setKey2(e.target.value)} 
          placeholder="Key 2 (hex)" 
          disabled={algorithm === 'DES'}
        />
        <Input 
          icon={Key} 
          label={algorithm === 'DES' ? '' : 'Key 3 (optional)'} 
          value={key3} 
          onChange={(e) => setKey3(e.target.value)} 
          placeholder="Key 3 (hex)" 
          disabled={algorithm === 'DES'}
        />
      </div>

      <Input 
        icon={Hash} 
        label="Initial Vector (IV - hex)" 
        placeholder="IV (16 hex chars)" 
        value={iv} 
        onChange={(e) => setIv(e.target.value)} 
        disabled={mode === 'ECB'}
      />

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
        />
      </div>
    </Card>
  );
}
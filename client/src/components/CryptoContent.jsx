import React from 'react';
import { Lock, Key, Hash, Upload, Download, Copy, Check, Settings } from 'lucide-react';
import useCryptoLogic from '../hooks/useCryptoLogic';
import { Button, Card, CardHeader, Input, Select, Textarea, Alert, ResultDisplay } from './UIComponents';

export default function CryptoContent() {
  const {
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
  } = useCryptoLogic();

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Input Configuration Card */}
        <Card className="p-6">
          <CardHeader 
            icon={Upload}
            title="Input Configuration"
            description="Configure your input source and data"
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <div className="space-y-4">
            <Select 
              label="Input Source" 
              options={[
                { value: 'direct', label: 'Direct Input' },
                { value: 'file', label: 'File Upload' }
              ]} 
              value={inputSource} 
              onChange={(e) => setInputSource(e.target.value)} 
            />

            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Select 
                  label="Input Type" 
                  options={[
                    { value: 'hex', label: 'HEX' },
                    { value: 'text', label: 'Plain Text' }
                  ]} 
                  value={inputType} 
                  onChange={(e) => setInputType(e.target.value)} 
                />
              </div>
              <div className="flex gap-2 items-end">
                <Button 
                  variant="secondary" 
                  onClick={loadSampleBlock}
                >
                  Use sample block
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => fillSample('3des-cbc')}
                >
                  Load 3DES-CBC
                </Button>
              </div>
            </div>

            <Textarea 
              label="Input Data" 
              rows={6} 
              value={data} 
              onChange={(e) => setData(e.target.value)} 
              placeholder={inputType === 'hex' ? 'Enter HEX data (e.g. 112233...)' : 'Enter plain text...'} 
            />
          </div>
        </Card>

        {/* Encryption Settings Card */}
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

        {/* Execute Operations Card */}
        <Card className="p-6">
          <CardHeader 
            icon={Lock}
            title="Execute Operations"
            description="Encrypt or decrypt your data"
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              variant="primary" 
              size="lg" 
              icon={Lock} 
              onClick={handleEncrypt} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Encrypting...' : 'Encrypt'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              icon={Key} 
              onClick={handleDecrypt}
              className="w-full"
            >
              Decrypt
            </Button>
          </div>

          {error && (
            <div className="mt-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
        </Card>

        {/* Output Result Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Output Result</h3>
                <p className="text-sm text-gray-500">Your encrypted/decrypted data</p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              icon={copied ? Check : Copy} 
              onClick={handleCopy}
              disabled={!result}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <ResultDisplay result={result} onCopy={handleCopy} copied={copied} />
        </Card>

      </div>
    </div>
  );
}
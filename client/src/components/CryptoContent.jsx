import React, { useEffect } from 'react';
import InputConfigCard from './cardComponent/InputConfigCard.jsx';
import EncryptionSettingsCard from './cardComponent/EncryptionSettingsCard.jsx';
import ExecuteOperationsCard from './cardComponent/ExecuteOperationsCard.jsx';
import OutputResultCard from './cardComponent/OutputResultCard.jsx';
import useCryptoLogic from '../hooks/useCryptoLogic';


export default function CryptoContent({ active }) {
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

  // Sync sidebar selection with algorithm
  useEffect(() => {
    if (active === 'DES') {
      setAlgorithm('DES');
    } else if (active === 'AES') {
      setAlgorithm('AES');
      // console.log(`${active} not yet implemented`);
    }
  }, [active, setAlgorithm]);
  const supportedAlgorithms = ['RSA', 'DES', 'AES', 'Blowfish', 'RC2', 'RC4', 'RSASSA', 'ECDSA', 'EdDSA', 'SHA', 'MD5', 'HMAC',
    'RIPEMD', 'CRC', 'RSA-KEY-PAIR', 'DSA-KEY-PAIR', 'EC-KEY-PAIR', 'PRIME-GENERATION', 'ASN1-PARSING'
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Show active algorithm indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Active Algorithm:</strong> {active}
            {!['DES','AES'].includes(active) && (
              <span className="ml-2 text-blue-600">(Not yet implemented - showing DES configuration)</span>
            )}
          </p>
        </div>

        {/* Rest of your existing code... */}
        {/* Input Configuration Card */}
        <InputConfigCard
          inputSource={inputSource}
          setInputSource={setInputSource}
          inputType={inputType}
          setInputType={setInputType}
          data={data}
          setData={setData}
          loadSampleBlock={loadSampleBlock}
          fillSample={fillSample}
        />

        {/* Encryption Settings Card */}
        <EncryptionSettingsCard
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          mode={mode}
          setMode={setMode}
          key1={key1}
          setKey1={setKey1}
          key2={key2}
          setKey2={setKey2}
          key3={key3}
          setKey3={setKey3}
          iv={iv}
          setIv={setIv}
          padding={padding}
          setPadding={setPadding}
        />

        {/* Execute Operations Card */}
        <ExecuteOperationsCard
          handleEncrypt={handleEncrypt}
          handleDecrypt={handleDecrypt}
          loading={loading}
          error={error}
        />

        {/* Output Result Card */}
        <OutputResultCard
          result={result}
          copied={copied}
          handleCopy={handleCopy}
        />

      </div>
    </div>
  );
}
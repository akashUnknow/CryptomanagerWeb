import React from 'react';
import { Upload } from 'lucide-react';
import { Button, Card, CardHeader, Select, Textarea } from '../UIComponents';

export default function InputConfigCard({
  inputSource,
  setInputSource,
  inputType,
  setInputType,
  data,
  setData,
  loadSampleBlock,
  fillSample
}) {
  return (
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
  );
}
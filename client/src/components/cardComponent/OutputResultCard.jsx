import React from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Button, Card, ResultDisplay } from '../UIComponents';

export default function OutputResultCard({
  result,
  copied,
  handleCopy
}) {
  return (
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
  );
}
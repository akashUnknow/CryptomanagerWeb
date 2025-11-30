import React from 'react';
import { Lock, Key } from 'lucide-react';
import { Button, Card, CardHeader, Alert } from '../UIComponents';

export default function ExecuteOperationsCard({
  handleEncrypt,
  handleDecrypt,
  loading,
  error
}) {

  return (
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
  );
}
import { Shield, Lock, Key, Hash, FileKey, Settings, ChevronRight } from 'lucide-react';

export default function Sidebar({ active, onSelect }) {
  const cryptoMenu = [
    {
      title: 'CIPHERS',
      icon: Lock,
      items: ['RSA', 'DES', 'AES', 'Blowfish', 'RC2', 'RC4']
    },
    {
      title: 'SIGNATURES',
      icon: FileKey,
      items: ['RSASSA', 'DSA', 'ECDSA', 'GOST']
    },
    {
      title: 'HASHES',
      icon: Hash,
      items: ['SHA', 'MD5', 'HMAC', 'RIPEMD160', 'CRC']
    },
    {
      title: 'KEY GENERATION',
      icon: Key,
      items: ['RSA key pair', 'DSA key pair', 'ECDSA key pair']
    },
    {
      title: 'MISC',
      icon: Settings,
      items: ['Prime generator', 'ASN1 parser']
    }
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900">CryptoLab</h1>
          <p className="text-xs text-gray-500">Security Suite</p>
        </div>
      </div>

      {cryptoMenu.map((group, gIndex) => (
        <div key={gIndex} className="mb-6">
          <div className="flex items-center gap-2 px-2 mb-3">
            <group.icon className="w-4 h-4 text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {group.title}
            </h2>
          </div>

          <ul className="space-y-1">
            {group.items.map((item, iIndex) => (
              <li key={iIndex}>
                <button
                  onClick={() => onSelect(item)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    active === item
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium text-sm">{item}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${active === item ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
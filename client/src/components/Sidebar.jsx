import { useState } from "react";

export default function Sidebar({ active, onSelect }) {

  const cryptoMenu = [
    {
      title: "CIPHERS",
      items: ["RSA", "DES", "AES", "Blowfish", "RC2", "RC4"]
    },
    {
      title: "SIGNATURES",
      items: ["RSASSA", "DSA", "ECDSA", "GOST"]
    },
    {
      title: "HASHES",
      items: ["SHA", "MD5", "HMAC", "RIPEMD160", "CRC"]
    },
    {
      title: "KEY GENERATION",
      items: ["RSA key pair", "DSA key pair", "ECDSA key pair"]
    },
    {
      title: "MISC",
      items: ["Prime generator", "ASN1 parser"]
    }
  ];

  return (
    <div className="w-72 bg-white border-r p-3 overflow-y-auto shadow-sm h-full">

      {cryptoMenu.map((group, gIndex) => (
        <div key={gIndex} className="mb-4">
          <h2 className="font-bold text-gray-700 mb-1">{group.title}</h2>

          <ul className="ml-2 space-y-1">
            {group.items.map((item, iIndex) => (
              <li
                key={iIndex}
                onClick={() => onSelect(item)}
                className={`cursor-pointer px-2 py-1 rounded 
                  ${active === item ? "bg-blue-600 text-white" : "hover:bg-gray-200"}
                `}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
}

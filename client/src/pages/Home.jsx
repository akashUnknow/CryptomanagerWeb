import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CryptoContent from "../components/CryptoContent";
export default function Home() {
  const [active, setActive] = useState("DES");

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 no-scrollbar">
      <Sidebar active={active} onSelect={setActive} />
      <CryptoContent active={active} />
    </div>
  );
}
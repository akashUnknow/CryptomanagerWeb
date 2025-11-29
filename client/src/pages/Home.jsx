import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CryptoContent from "../components/CryptoContent";

export default function Home() {
  const [active, setActive] = useState("DES");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active={active} onSelect={setActive} />
      <CryptoContent active={active} />
    </div>
  );
}
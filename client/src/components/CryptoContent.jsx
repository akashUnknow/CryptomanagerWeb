import { Button } from "@/components/ui/button";

export default function CryptoContent({ active }) {

  return (
    <div className="p-6 w-full">

      <h1 className="text-2xl font-bold mb-4">{active}</h1>

      {/* Render DES Section */}
      {active === "DES" && (
        <div className="bg-white shadow p-4 rounded border w-full">

          <div className="mb-4">
            <label className="block font-semibold">Input source:</label>
            <select className="border p-2 w-full rounded">
              <option>direct input</option>
              <option>file</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Input:</label>
            <textarea className="border p-2 w-full rounded h-24"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold">Key type</label>
              <select className="border p-2 w-full rounded">
                <option>16B 3DES</option>
                <option>24B 3DES</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">Chaining mode</label>
              <select className="border p-2 w-full rounded">
                <option>DESX</option>
                <option>ECB</option>
                <option>CBC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <input className="border p-2 rounded" placeholder="Key 1" />
            <input className="border p-2 rounded" placeholder="Key 2" />
            <input className="border p-2 rounded" placeholder="Key 3" />
          </div>

          <div className="mb-4">
            <input className="border p-2 w-full rounded" placeholder="Initial Vector" />
          </div>

          <div className="flex gap-3">
            <Button>Encipher</Button>
            <Button variant="secondary">Decipher</Button>
          </div>

        </div>
      )}

      {/* Placeholder for Other Sections */}
      {active !== "DES" && (
        <div className="text-gray-600 text-sm">
          Module <strong>{active}</strong> is not implemented yet.
        </div>
      )}
    </div>
  );
}

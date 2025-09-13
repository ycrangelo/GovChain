import DecryptedText from "./animation/DecryptedText";

export default function Home() {
  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-purple-900"></div>

      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Content */}
      <div className="relative z-10 border border-white/20 bg-black/70 backdrop-blur-md max-w-4xl p-10 rounded-2xl shadow-xl">
        <h1 className="text-6xl font-bold mb-6 text-center text-white drop-shadow-lg">
          GovChain
        </h1>
      </div>
    </div>
  );
}

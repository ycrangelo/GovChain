import FaultyTerminal from "./animation/FaultyTerminal";

export default function Home() {
  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden bg-[#111111]">
      {/* DotGrid background */}
      <div className="absolute inset-0 z-0">
        <FaultyTerminal
          scale={3}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={0.5}
          chromaticAberration={0}
          dither={0}
          curvature={0}
          tint="#ffffff"
          mouseReact={true}
          mouseStrength={0.1}
          pageLoadAnimation={false}
          brightness={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl p-10">
        <h1
          className="text-9xl font-bold mb-6 text-center text-white"
          style={{
            textShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(82, 39, 255, 0.6)",
          }}
        >
          Gov_Chain
        </h1>
      </div>
    </div>
  );
}

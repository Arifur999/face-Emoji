import React, { useCallback, useState } from 'react';
import { Terminal } from 'lucide-react';
import { AsciiCanvas } from './components/AsciiCanvas';
import { ControlPanel } from './components/ControlPanel';
import { AnalysisModal } from './components/AnalysisModal';
import { analyzeImage } from './services/geminiService';
import { playAnalysisCompleteSound, playAnalysisStartSound, playButtonSound } from './utils/soundEffects';
import { AnalysisResult, AsciiOptions } from './types';

const App: React.FC = () => {
  const [options, setOptions] = useState<AsciiOptions>({
    fontSize: 12,
    brightness: 1.0,
    contrast: 1.0,
    colorMode: 'matrix',
    density: 'complex',
    resolution: 0.2,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const requestCameraAccess = useCallback(async () => {
    playButtonSound();
    setPermissionError(null);
    setIsRequestingAccess(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      stream.getTracks().forEach((track) => track.stop());
      setHasCameraAccess(true);
    } catch (error) {
      console.error('Camera permission request failed:', error);
      setPermissionError('Camera access needed. Please click Allow in your browser permission prompt and try again.');
    } finally {
      setIsRequestingAccess(false);
    }
  }, []);

  const exitSite = useCallback(() => {
    playButtonSound();
    setIsExiting(true);

    // Most browsers block window.close unless script-opened.
    window.open('', '_self');
    window.close();

    window.setTimeout(() => {
      window.location.replace('about:blank');
    }, 120);
  }, []);

  const handleCapture = useCallback(async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setIsModalOpen(true);
    playAnalysisStartSound();

    try {
      const result = await analyzeImage(imageData);
      setAnalysisResult(result);
      playAnalysisCompleteSound();
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({
        description: 'SYSTEM ERROR: Neural link connection failed.',
        tags: ['ERROR', 'OFFLINE'],
        threatLevel: 'UNKNOWN',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  if (isExiting) {
    return (
      <div className="flex h-dvh min-h-[100svh] w-full items-center justify-center bg-black px-4 text-center font-mono text-green-500">
        Closing session...
      </div>
    );
  }

  return (
    <div className="relative flex h-dvh min-h-[100svh] w-full flex-col overflow-hidden bg-black">
      <header className="pointer-events-none absolute left-0 top-0 z-20 flex w-full flex-col gap-2 bg-gradient-to-b from-black/85 to-transparent px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2 text-green-500">
          <Terminal className="h-5 w-5 animate-pulse sm:h-6 sm:w-6" />
          {/* <h1 className="text-base font-bold uppercase tracking-widest sm:text-xl">
            CyberCam<span className="ml-1 text-[10px] opacity-70 sm:text-xs">Ar_if</span>
          </h1> */}


          <h1 className="text-base font-bold uppercase tracking-widest sm:text-xl">
  CyberCam
  <a
    href="https://instagram.com/ARIF_XTWO"
    target="_blank"
    rel="noopener noreferrer"
    className="ml-1 text-[10px] opacity-70 sm:text-xs hover:text-green-400 transition"
  >
    Ar_if
  </a>
</h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-green-800 sm:text-xs">
          <span>SYS.STATUS: ONLINE</span>
          <span>CAM.FEED: {hasCameraAccess ? 'ACTIVE' : 'LOCKED'}</span>
          <span className={hasCameraAccess ? 'animate-pulse' : ''}>REC: {hasCameraAccess ? 'ON' : 'OFF'}</span>
        </div>
      </header>

      <main className="relative z-10 flex-grow">
        {hasCameraAccess ? (
          <AsciiCanvas options={options} onCapture={handleCapture} />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,120,0.08),rgba(0,0,0,0.95)_58%)]" />
        )}
      </main>

      {hasCameraAccess && <ControlPanel options={options} setOptions={setOptions} />}

      {isModalOpen && (
        <AnalysisModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isLoading={isAnalyzing}
          result={analysisResult}
        />
      )}

      {!hasCameraAccess && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-green-500/60 bg-[#030b05] p-5 font-mono shadow-[0_0_40px_rgba(0,255,120,0.14)] sm:p-6">
            <div className="mb-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-green-700">Security Gateway</p>
              <h2 className="text-xl font-bold text-green-400">Camera Permission Required</h2>
              <p className="text-sm leading-relaxed text-green-300/80">
                To continue, allow camera access. You can exit if you do not want to share camera permission.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={requestCameraAccess}
                disabled={isRequestingAccess}
                className="border border-green-500 bg-green-500/20 px-4 py-2 text-sm font-bold uppercase tracking-wide text-green-300 transition-colors hover:bg-green-500/35 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRequestingAccess ? 'Requesting...' : 'Allow'}
              </button>
              <button
                type="button"
                onClick={exitSite}
                className="border border-green-900 bg-black px-4 py-2 text-sm font-bold uppercase tracking-wide text-green-500 transition-colors hover:border-green-700 hover:text-green-300"
              >
                Exit
              </button>
            </div>

            {permissionError && (
              <p className="mt-4 border border-red-900/60 bg-red-950/20 p-3 text-xs text-red-300">{permissionError}</p>
            )}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default App;

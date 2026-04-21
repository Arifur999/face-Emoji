import React from 'react';
import { AsciiOptions, DENSITY_MAPS } from '../types';
import { Sliders, Monitor, Type, Palette } from 'lucide-react';
import { playButtonSound } from '../utils/soundEffects';

interface ControlPanelProps {
  options: AsciiOptions;
  setOptions: React.Dispatch<React.SetStateAction<AsciiOptions>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions }) => {
  const handleChange = (key: keyof AsciiOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleModeChange = (key: keyof AsciiOptions, value: any) => {
      playButtonSound();
      handleChange(key, value);
  }

  return (
    <div className="absolute bottom-0 z-30 w-full border-t border-green-900/50 bg-black/80 p-3 backdrop-blur-sm transition-all duration-300 sm:p-4">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-start justify-center gap-4 text-[11px] font-mono text-green-500 sm:items-center sm:gap-6 sm:text-xs">
        
        {/* Font Size */}
        <div className="flex w-[calc(50%-0.5rem)] min-w-[140px] flex-col gap-1 sm:w-32">
          <div className="flex items-center gap-2 mb-1">
             <Type className="w-3 h-3" />
             <label>FONT SIZE: {options.fontSize}px</label>
          </div>
          <input 
            type="range" 
            min="6" 
            max="24" 
            value={options.fontSize} 
            onChange={(e) => handleChange('fontSize', Number(e.target.value))}
            className="accent-green-500 h-1 bg-green-900 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Brightness */}
        <div className="flex w-[calc(50%-0.5rem)] min-w-[140px] flex-col gap-1 sm:w-32">
           <div className="flex items-center gap-2 mb-1">
             <Sliders className="w-3 h-3" />
             <label>GAIN: {options.brightness.toFixed(1)}</label>
           </div>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1" 
            value={options.brightness} 
            onChange={(e) => handleChange('brightness', Number(e.target.value))}
            className="accent-green-500 h-1 bg-green-900 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div className="flex w-[calc(50%-0.5rem)] min-w-[140px] flex-col gap-1 sm:w-32">
           <div className="flex items-center gap-2 mb-1">
             <Monitor className="w-3 h-3" />
             <label>CONTRAST: {options.contrast.toFixed(1)}</label>
           </div>
          <input 
            type="range" 
            min="0.5" 
            max="3.0" 
            step="0.1" 
            value={options.contrast} 
            onChange={(e) => handleChange('contrast', Number(e.target.value))}
            className="accent-green-500 h-1 bg-green-900 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Color Mode */}
        <div className="flex max-w-[260px] flex-col gap-2 sm:max-w-none">
            <div className="flex items-center gap-2">
                <Palette className="w-3 h-3" />
                <span>MODE</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {(['matrix', 'bw', 'retro', 'color'] as const).map(mode => (
                    <button
                        key={mode}
                        onClick={() => handleModeChange('colorMode', mode)}
                        className={`min-w-[58px] border px-2 py-1 text-[10px] uppercase transition-colors ${options.colorMode === mode ? 'border-green-500 bg-green-500 text-black' : 'border-green-800 bg-transparent text-green-700 hover:border-green-500'}`}
                    >
                        {mode}
                    </button>
                ))}
            </div>
        </div>

        {/* Density Map */}
        <div className="flex max-w-[260px] flex-col gap-2 sm:max-w-none">
            <div className="flex items-center gap-2">
                <Type className="w-3 h-3" />
                <span>CHARSET</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {(Object.keys(DENSITY_MAPS) as Array<keyof typeof DENSITY_MAPS>).map(mode => (
                    <button
                        key={mode}
                        onClick={() => handleModeChange('density', mode)}
                        className={`min-w-[58px] border px-2 py-1 text-[10px] uppercase transition-colors ${options.density === mode ? 'border-green-500 bg-green-500 text-black' : 'border-green-800 bg-transparent text-green-700 hover:border-green-500'}`}
                    >
                        {mode}
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

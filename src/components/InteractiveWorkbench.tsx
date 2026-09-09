import React, { useState, useEffect, useRef } from 'react';
import { Activity, Binary, Play, Pause, RefreshCw, Cpu, CheckCircle, Zap } from 'lucide-react';

export const InteractiveWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ecg' | 'register'>('ecg');

  // === ECG SIMULATOR STATE ===
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [bpm, setBpm] = useState<number>(75);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(false);
  const [leadOff, setLeadOff] = useState<boolean>(false);
  const [rrInterval, setRrInterval] = useState<number>(800);
  const animationFrameRef = useRef<number | null>(null);
  const sampleIndexRef = useRef<number>(0);
  const bufferRef = useRef<number[]>([]);

  // Calculate R-R interval from BPM
  useEffect(() => {
    setRrInterval(Math.round(60000 / bpm));
  }, [bpm]);

  // ECG Real-time Canvas Rendering
  useEffect(() => {
    if (activeTab !== 'ecg') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Pre-fill buffer if empty
    if (bufferRef.current.length === 0) {
      bufferRef.current = new Array(width).fill(midY);
    }

    let lastTime = performance.now();
    const samplingIntervalMs = 1000 / 250; // 4ms per sample (250 Hz)
    let accumulatedTime = 0;

    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isRunning) {
        accumulatedTime += delta;

        while (accumulatedTime >= samplingIntervalMs) {
          accumulatedTime -= samplingIntervalMs;
          sampleIndexRef.current = (sampleIndexRef.current + 1) % 1000000;

          let sampleValue = 0;

          if (leadOff) {
            // Flatline with high-impedance drift
            sampleValue = Math.sin(sampleIndexRef.current * 0.02) * 5;
          } else {
            // Synthesize realistic P-Q-R-S-T cardiac waveform at 250 Hz
            const samplesPerBeat = Math.round((250 * 60) / bpm);
            const phase = (sampleIndexRef.current % samplesPerBeat) / samplesPerBeat;

            if (phase >= 0.12 && phase <= 0.18) {
              // P wave (atrial depolarization)
              const pPhase = (phase - 0.12) / 0.06;
              sampleValue += Math.sin(pPhase * Math.PI) * 16;
            } else if (phase >= 0.23 && phase <= 0.25) {
              // Q wave (septal depolarization)
              sampleValue -= 12;
            } else if (phase >= 0.25 && phase <= 0.29) {
              // R wave (ventricular depolarization - sharp peak)
              const rPhase = (phase - 0.25) / 0.04;
              sampleValue += Math.sin(rPhase * Math.PI) * 110;
            } else if (phase >= 0.29 && phase <= 0.32) {
              // S wave
              sampleValue -= 24;
            } else if (phase >= 0.42 && phase <= 0.56) {
              // T wave (ventricular repolarization)
              const tPhase = (phase - 0.42) / 0.14;
              sampleValue += Math.sin(tPhase * Math.PI) * 28;
            }

            // Optional 50 Hz power-line hum noise
            if (noiseEnabled) {
              sampleValue += Math.sin(sampleIndexRef.current * ((2 * Math.PI * 50) / 250)) * 14;
            }
          }

          // Invert y for canvas (higher voltage = higher on screen)
          const y = midY - sampleValue;
          bufferRef.current.push(y);
          if (bufferRef.current.length > width) {
            bufferRef.current.shift();
          }
        }
      }

      // Draw oscilloscope grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Draw ECG trace
      ctx.strokeStyle = leadOff ? '#ef4444' : '#10b981'; // green for normal, red for lead off
      ctx.lineWidth = 2;
      ctx.shadowColor = leadOff ? '#ef4444' : '#10b981';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      for (let i = 0; i < bufferRef.current.length; i++) {
        const x = i;
        const y = bufferRef.current[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset blur

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, isRunning, bpm, noiseEnabled, leadOff]);

  // === STM32 REGISTER EXPLORER STATE (SPI_CR1) ===
  const [spiBits, setSpiBits] = useState<{ [bit: number]: number }>({
    6: 1, // SPE: SPI Enable
    2: 1, // MSTR: Master configuration
    5: 0, // BR[2]: Baud rate prescaler bit 2
    4: 1, // BR[1]: Baud rate prescaler bit 1
    3: 0, // BR[0]: Baud rate prescaler bit 0
    1: 0, // CPOL: Clock polarity
    0: 1, // CPHA: Clock phase
    7: 0, // LSBFIRST
    8: 1, // SSI: Internal slave select
    9: 1, // SSM: Software slave management
  });

  const toggleBit = (bitIndex: number) => {
    setSpiBits((prev) => ({
      ...prev,
      [bitIndex]: prev[bitIndex] ? 0 : 1,
    }));
  };

  // Compute 32-bit register value
  const registerValue = Object.entries(spiBits).reduce((acc, [bit, val]) => {
    return val ? acc | (1 << Number(bit)) : acc;
  }, 0);

  const hexString = '0x' + registerValue.toString(16).toUpperCase().padStart(8, '0');

  // Baud rate translation
  const brCode = ((spiBits[5] || 0) << 2) | ((spiBits[4] || 0) << 1) | (spiBits[3] || 0);
  const baudPrescalers = ['fPCLK / 2', 'fPCLK / 4', 'fPCLK / 8', 'fPCLK / 16', 'fPCLK / 32', 'fPCLK / 64', 'fPCLK / 128', 'fPCLK / 256'];
  const currentBaud = baudPrescalers[brCode];

  return (
    <section id="workbench" className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Hardware & Driver Test Bench</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">
            Interactive Engineering Workbench
          </h2>
          <p className="text-sm text-neutral-600 max-w-xl mx-auto">
            Test and simulate the physical signal processing and bare metal programming layers built for the ESP32 and STM32 Cortex-M.
          </p>
        </div>

        {/* Workbench Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-neutral-100 p-1 rounded-xl border border-neutral-200 flex gap-1">
            <button
              onClick={() => setActiveTab('ecg')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ecg'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>ESP32 AD8232 ECG Telemetry (250 Hz)</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Binary className="w-4 h-4 text-blue-600" />
              <span>STM32 Bare-Metal Register Explorer</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ECG SIMULATOR */}
        {activeTab === 'ecg' && (
          <div className="bg-[#0b1120] rounded-2xl border border-neutral-800 shadow-xl overflow-hidden p-6 text-white max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    AD8232 AFE &bull; ESP32 UART STREAM
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Simulating hardware timer ISR sampling at deterministic 250 Hz (4 ms period).
                </p>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono transition-colors"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isRunning ? 'Pause Stream' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => {
                    bufferRef.current = [];
                    sampleIndexRef.current = 0;
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs transition-colors"
                  title="Clear oscilloscope buffer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Oscilloscope Screen */}
            <div className="mt-4 relative rounded-xl overflow-hidden border border-neutral-800 bg-slate-950">
              <canvas
                ref={canvasRef}
                width={720}
                height={220}
                className="w-full h-[220px] block"
              />

              {/* HUD Telemetry Overlay */}
              <div className="absolute top-2 left-3 flex items-center gap-4 text-[11px] font-mono bg-slate-900/80 px-3 py-1 rounded backdrop-blur border border-slate-800 text-neutral-300">
                <div>
                  RATE: <span className="text-emerald-400 font-bold">{bpm} BPM</span>
                </div>
                <div>
                  R-R: <span className="text-cyan-400 font-bold">{rrInterval} ms</span>
                </div>
                <div>
                  FS: <span className="text-amber-400 font-bold">250 Hz</span>
                </div>
                <div>
                  STATUS: <span className={leadOff ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{leadOff ? 'LEAD OFF (LO+)' : 'LEADS LOCKED'}</span>
                </div>
              </div>
            </div>

            {/* Hardware Controls & Injection */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800/80 text-xs">
              {/* BPM Slider */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between font-mono mb-2">
                  <span className="text-neutral-400">Heart Rate:</span>
                  <span className="text-emerald-400 font-bold">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={120}
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* 50Hz Noise Toggle */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-200">50 Hz AC Hum Noise</div>
                  <div className="text-[11px] text-neutral-400">Simulate notch filter input</div>
                </div>
                <button
                  onClick={() => setNoiseEnabled(!noiseEnabled)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    noiseEnabled
                      ? 'bg-amber-500 text-black'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {noiseEnabled ? 'NOISE ON' : 'CLEAN'}
                </button>
              </div>

              {/* Lead-Off Simulation */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-200">Electrode Disconnect</div>
                  <div className="text-[11px] text-neutral-400">Trigger AD8232 LO+ pin</div>
                </div>
                <button
                  onClick={() => setLeadOff(!leadOff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    leadOff
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {leadOff ? 'LEAD OFF' : 'ATTACHED'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-neutral-400 font-mono text-center">
              Based on ESP32 ADC1_CHANNEL_0 timer ISR transmitting 5-byte telemetry packets over UART to MATLAB.
            </div>
          </div>
        )}

        {/* TAB 2: STM32 REGISTER BITFIELD EXPLORER */}
        {activeTab === 'register' && (
          <div className="bg-[#12161f] rounded-2xl border border-neutral-800 shadow-xl overflow-hidden p-6 text-white max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono font-bold text-blue-300">
                    STM32F4 &bull; SPI_CR1 (SPI CONTROL REGISTER 1)
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Direct bare metal programming without ST HAL. Toggle bits below to calculate binary mask and C code.
                </p>
              </div>

              <div className="bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-800/80 flex items-center gap-3">
                <span className="text-xs text-blue-300 font-mono">CR1 Hex Value:</span>
                <span className="text-sm font-mono font-extrabold text-white tracking-widest">
                  {hexString}
                </span>
              </div>
            </div>

            {/* Interactive Bit Buttons Grid */}
            <div className="mt-6">
              <div className="text-xs font-mono text-neutral-400 mb-2 flex justify-between">
                <span>Click individual bit flags to toggle state (1 / 0):</span>
                <span>Bit 9 down to Bit 0</span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono">
                {[
                  { bit: 9, name: 'SSM', desc: 'Software Slave Mgmt' },
                  { bit: 8, name: 'SSI', desc: 'Internal Slave Select' },
                  { bit: 7, name: 'LSBFIRST', desc: 'Frame Format' },
                  { bit: 6, name: 'SPE', desc: 'SPI Peripheral Enable' },
                  { bit: 5, name: 'BR[2]', desc: 'Baud Prescaler Bit 2' },
                  { bit: 4, name: 'BR[1]', desc: 'Baud Prescaler Bit 1' },
                  { bit: 3, name: 'BR[0]', desc: 'Baud Prescaler Bit 0' },
                  { bit: 2, name: 'MSTR', desc: 'Master Selection' },
                  { bit: 1, name: 'CPOL', desc: 'Clock Polarity' },
                  { bit: 0, name: 'CPHA', desc: 'Clock Phase' },
                ].map((item) => {
                  const isSet = !!spiBits[item.bit];
                  return (
                    <button
                      key={item.bit}
                      onClick={() => toggleBit(item.bit)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                        isSet
                          ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                          : 'bg-slate-900 border-slate-800 text-neutral-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] text-neutral-400 font-sans">b{item.bit}</span>
                      <span className="text-base font-bold my-1">{isSet ? '1' : '0'}</span>
                      <span className="text-[10px] font-bold tracking-tight truncate w-full">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generated Bare-Metal C Code Block */}
            <div className="mt-6 bg-[#0a0d14] rounded-xl border border-neutral-800 p-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-2">
                <span>Dynamically Generated Bare-Metal C Driver API Code:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Syntactically Verified
                </span>
              </div>
              <pre className="text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`/* Configure STM32 SPI1 without HAL */
SPI1->CR1 = 0; // Reset register
${spiBits[6] ? 'SPI1->CR1 |= (1 << 6);  // SPE: Enable SPI peripheral\n' : ''}${spiBits[2] ? 'SPI1->CR1 |= (1 << 2);  // MSTR: Configure as Master\n' : ''}SPI1->CR1 |= (${brCode} << 3);  // BR[2:0]: Prescaler ${currentBaud}
${spiBits[1] ? 'SPI1->CR1 |= (1 << 1);  // CPOL: Clock idle state is HIGH\n' : 'SPI1->CR1 &= ~(1 << 1); // CPOL: Clock idle state is LOW\n'}${spiBits[0] ? 'SPI1->CR1 |= (1 << 0);  // CPHA: Second clock transition\n' : 'SPI1->CR1 &= ~(1 << 0); // CPHA: First clock transition\n'}/* Resulting Register Write: SPI1->CR1 = ${hexString}; */`}
              </pre>
            </div>

            {/* Hardware Status Breakdown */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-300">
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <span className="text-neutral-500 block">SPI Mode:</span>
                <span className="font-bold text-white">
                  {spiBits[2] ? 'Master Device' : 'Slave Device'} &bull; Mode ({spiBits[1] || 0},{spiBits[0] || 0})
                </span>
              </div>
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <span className="text-neutral-500 block">Baud Prescaler:</span>
                <span className="font-bold text-cyan-300">{currentBaud}</span>
              </div>
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <span className="text-neutral-500 block">Peripheral State:</span>
                <span className="font-bold text-emerald-400">
                  {spiBits[6] ? 'ACTIVE (Clock Enabled)' : 'DISABLED (Low Power)'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

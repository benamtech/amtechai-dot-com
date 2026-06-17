import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { Conversation as ConversationClient } from '@elevenlabs/client';
import type { EmbeddedMessage } from './types';
import EmbeddedMessageList from './EmbeddedMessageList';

const AGENT_ID = 'agent_2801kje09vk5f17rjk4as694mt49';

interface EmbeddedVoiceModeProps {
  messages: EmbeddedMessage[];
  onAddMessage: (message: Omit<EmbeddedMessage, 'id' | 'created_at'>) => void;
  autoStart?: boolean;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'speaking';

export default function EmbeddedVoiceMode({
  messages,
  onAddMessage,
  autoStart = false,
}: EmbeddedVoiceModeProps) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const conversationRef = useRef<ConversationClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<ConnectionStatus>('disconnected');
  const hasAutoStarted = useRef(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (autoStart && !hasAutoStarted.current && status === 'disconnected') {
      hasAutoStarted.current = true;
      startCall();
    }
  }, [autoStart]);

  useEffect(() => {
    return () => {
      if (conversationRef.current) conversationRef.current.endSession();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.22;
    const barCount = 64;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * dataArray.length);
      const value = dataArray[dataIndex] / 255;
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      const barLength = value * baseRadius * 0.8 + 2;
      const innerRadius = baseRadius;
      const outerRadius = innerRadius + barLength;
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;
      const opacity = 0.3 + value * 0.7;
      ctx.strokeStyle = `rgba(225, 29, 42, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const avgValue = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const glowRadius = baseRadius + avgValue * 20;
    const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.5, centerX, centerY, glowRadius * 1.5);
    gradient.addColorStop(0, `rgba(225, 29, 42, ${0.03 + avgValue * 0.08})`);
    gradient.addColorStop(1, 'rgba(225, 29, 42, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  }, []);

  const startCall = async () => {
    try {
      setStatus('connecting');
      const conv = await ConversationClient.startSession({
        agentId: AGENT_ID,
        onConnect: () => setStatus('connected'),
        onDisconnect: () => setStatus('disconnected'),
        onMessage: (message) => {
          if (message.type === 'user_transcript' && message.message) {
            onAddMessage({ role: 'user', content: message.message, mode: 'voice' });
          } else if (message.type === 'agent_response' && message.message) {
            setStatus('speaking');
            onAddMessage({ role: 'agent', content: message.message, mode: 'voice' });
            setTimeout(() => {
              if (statusRef.current !== 'disconnected') setStatus('connected');
            }, 1000);
          }
        },
        onError: (error) => {
          console.error('Conversation error:', error);
          setStatus('disconnected');
        },
      });
      conversationRef.current = conv;

      try {
        audioContextRef.current = new AudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;
        drawVisualizer();
      } catch (err) {
        console.error('Audio visualization error:', err);
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      setStatus('disconnected');
    }
  };

  const endCall = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setStatus('disconnected');
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connecting': return 'Connecting';
      case 'connected': return 'Listening';
      case 'speaking': return 'Speaking';
      default: return 'Ready';
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {showTranscript && messages.length > 0 ? (
        <div className="flex h-full w-full flex-col">
          <div className="flex shrink-0 items-center justify-between px-6 py-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40">
              Transcript
            </span>
            <button
              onClick={() => setShowTranscript(false)}
              className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
            >
              Back
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <EmbeddedMessageList messages={messages} />
          </div>
          {status !== 'disconnected' && (
            <div className="flex shrink-0 items-center justify-center gap-6 py-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex h-10 w-10 items-center justify-center border transition-all ${
                  isMuted
                    ? 'border-red/40 bg-red/10 text-red'
                    : 'border-black/[0.06] bg-[#FAFAFA] text-black/40 hover:text-black'
                }`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={endCall}
                className="flex h-10 w-10 items-center justify-center border border-red bg-red/10 text-red transition-all hover:bg-red/20"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="relative flex items-center justify-center" style={{ width: '280px', height: '280px' }}>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              style={{ width: '280px', height: '280px' }}
            />
            <div
              className={`absolute inset-0 m-auto transition-all duration-1000 ${
                status === 'connected' || status === 'speaking'
                  ? 'opacity-100'
                  : status === 'connecting'
                    ? 'animate-pulse opacity-60'
                    : 'opacity-0'
              }`}
              style={{
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(225,29,42,0.08) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              {status === 'disconnected' ? (
                <button
                  onClick={startCall}
                  className="group flex h-20 w-20 items-center justify-center border border-red/30 bg-white transition-all hover:border-red hover:shadow-red-glow"
                >
                  <Mic className="h-7 w-7 text-red transition-transform group-hover:scale-110" />
                </button>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center">
                  <div
                    className={`h-3 w-3 ${status === 'speaking' ? 'bg-red' : 'bg-black'} ${status === 'connecting' ? 'animate-pulse' : ''}`}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className={`font-mono text-xs uppercase tracking-[0.2em] ${status === 'speaking' ? 'text-red' : 'text-black/40'}`}>
              {getStatusLabel()}
            </p>
            {status === 'disconnected' && (
              <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-black/40">
                Click to start the estimator demo
              </p>
            )}
          </div>

          {status !== 'disconnected' && (
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex h-10 w-10 items-center justify-center border transition-all ${
                  isMuted
                    ? 'border-red/40 bg-red/10 text-red'
                    : 'border-black/[0.06] bg-[#FAFAFA] text-black/40 hover:text-black'
                }`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={endCall}
                className="flex h-10 w-10 items-center justify-center border border-red bg-red/10 text-red transition-all hover:bg-red/20"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          )}

          {messages.length > 0 && (
            <button
              onClick={() => setShowTranscript(true)}
              className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
            >
              View transcript ({messages.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

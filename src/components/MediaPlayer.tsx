// ============================================================
// MEDIA PLAYER — React island
// Props: tracks array with title, artist, src, type
// Features: play/pause, seek, time display, volume, track info
// Styling: glass card, dark bg, full width
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  src: string;
  type: 'audio';
}

interface MediaPlayerProps {
  tracks: Track[];
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MediaPlayer({ tracks }: MediaPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [volume, setVolume]             = useState(0.8);
  const [muted, setMuted]               = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = tracks[currentTrack];

  // Sync volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // On track change, reset and optionally auto-play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }

  function handleEnded() {
    if (currentTrack < tracks.length - 1) {
      setCurrentTrack(i => i + 1);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    const t = parseFloat(e.target.value);
    if (audio) audio.currentTime = t;
    setCurrentTime(t);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  }

  function toggleMute() {
    setMuted(m => !m);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--border-radius)',
        padding: '2rem',
        width: '100%',
      }}
    >
      <audio
        ref={audioRef}
        src={track?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Track selector — show when multiple tracks */}
      {tracks.length > 1 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tracks.map((t, i) => (
            <button
              key={i}
              onClick={() => setCurrentTrack(i)}
              style={{
                background: i === currentTrack ? 'var(--surface-2)' : 'transparent',
                border: `1px solid ${i === currentTrack ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                borderRadius: 'calc(var(--border-radius) / 2)',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                textAlign: 'left',
                color: i === currentTrack ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
              }}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}

      {/* Track Info */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 300,
            color: 'var(--text-primary)',
            margin: '0 0 0.25rem',
            lineHeight: 1.3,
          }}
        >
          {track?.title}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          {track?.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '0.5rem', position: 'relative' }}>
        <div
          style={{
            position: 'relative',
            height: '4px',
            background: 'var(--surface-2)',
            borderRadius: '2px',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress}%`,
              background: 'var(--accent)',
              borderRadius: '2px',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          style={{
            position: 'absolute',
            top: '-8px',
            left: 0,
            width: '100%',
            opacity: 0,
            cursor: 'pointer',
            height: '20px',
            margin: 0,
          }}
          aria-label="Seek"
        />
      </div>

      {/* Time display */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            background: 'var(--accent)',
            border: 'none',
            cursor: 'pointer',
            color: '#0d1119',
            flexShrink: 0,
            transition: 'background 0.2s ease',
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Track navigation dots — multiple tracks */}
        {tracks.length > 1 && (
          <div style={{ display: 'flex', gap: '0.4rem', flex: 1 }}>
            {tracks.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTrack(i)}
                aria-label={`Track ${i + 1}`}
                style={{
                  width: i === currentTrack ? '1.5rem' : '0.4rem',
                  height: '0.4rem',
                  borderRadius: '2px',
                  background: i === currentTrack ? 'var(--accent)' : 'var(--border-subtle)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Spacer if single track */}
        {tracks.length === 1 && <div style={{ flex: 1 }} />}

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem',
            }}
          >
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div style={{ position: 'relative', width: '80px', height: '4px', background: 'var(--surface-2)', borderRadius: '2px' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${muted ? 0 : volume * 100}%`,
                background: 'var(--text-muted)',
                borderRadius: '2px',
              }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
              style={{
                position: 'absolute',
                top: '-8px',
                left: 0,
                width: '100%',
                opacity: 0,
                cursor: 'pointer',
                height: '20px',
                margin: 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

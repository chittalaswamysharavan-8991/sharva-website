import React, { useEffect, useRef, useState } from "react";

export default function FocusTimer() {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [duration]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            clearInterval(timerRef.current);
            playTimerDoneSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  function playTimerDoneSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error("Audio failed", e);
    }
  }

  return (
    <div className="focus-timer-widget">
      <div className="timer-display">
        <span className="time-numbers">{formatTime(timeLeft)}</span>
        <span className="timer-status">{isRunning ? "Focusing..." : "Ready"}</span>
      </div>
      <div className="timer-controls">
        <button onClick={toggleTimer} className="timer-btn play-pause-btn">
          {isRunning ? "Pause" : "Start Build"}
        </button>
        <button onClick={resetTimer} className="timer-btn reset-btn">
          Reset
        </button>
        <div className="duration-presets">
          <button
            onClick={() => setDuration(25)}
            className={duration === 25 ? "preset-btn active" : "preset-btn"}
          >
            25m
          </button>
          <button
            onClick={() => setDuration(50)}
            className={duration === 50 ? "preset-btn active" : "preset-btn"}
          >
            50m
          </button>
          <button
            onClick={() => setDuration(15)}
            className={duration === 15 ? "preset-btn active" : "preset-btn"}
          >
            15m
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PerformanceMonitor,
  PerformanceWarningSystem,
  getMemoryUsage,
  FrameTimeAnalyzer,
} from '@/utils/performance';

const PerformanceOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<{ heapUsed: number; heapTotal: number } | null>(
    null
  );
  const [warnings, setWarnings] = useState<string[]>([]);
  const [frameTimeAnalyzer] = useState(() => new FrameTimeAnalyzer());

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    const updateInterval = setInterval(() => {
      // Update memory usage
      setMemory(getMemoryUsage());

      // Update warnings
      setWarnings(PerformanceWarningSystem.checkPerformance());
    }, 1000);

    // Monitor FPS
    monitor.onFrame((currentFps) => {
      setFps(Math.round(currentFps));
      frameTimeAnalyzer.addFrame(performance.now());
    });

    // Toggle overlay with Alt + P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [frameTimeAnalyzer]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-lg font-mono text-sm z-50"
      >
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={fps < 30 ? 'text-red-400' : 'text-green-400'}>
              {fps}
            </span>
          </div>

          {memory && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>
                {Math.round(memory.heapUsed / 1024 / 1024)}MB /{' '}
                {Math.round(memory.heapTotal / 1024 / 1024)}MB
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Avg Frame Time:</span>
            <span>
              {Math.round(frameTimeAnalyzer.getAverageFrameTime())}ms
            </span>
          </div>

          <div className="flex justify-between">
            <span>95th Percentile:</span>
            <span>
              {Math.round(frameTimeAnalyzer.getFrameTimePercentile(95))}ms
            </span>
          </div>

          {warnings.length > 0 && (
            <div className="mt-4 pt-2 border-t border-white/20">
              <div className="text-yellow-400">Warnings:</div>
              {warnings.map((warning, index) => (
                <div key={index} className="text-xs mt-1 text-yellow-200">
                  {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PerformanceOverlay; 
import { useRef, useEffect } from 'react';
import './ParticleWaveBackground.scss';

const NUM_PARTICLES = 600;
const PARTICLE_DIAMETER_VH = 0.5;
const ANIMATION_DURATION_MS = 60000;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomNormal(mean, standardDeviation) {
  let u, v, squared;
  do {
    u = 2 * Math.random() - 1;
    v = 2 * Math.random() - 1;
    squared = u * u + v * v;
  } while (squared >= 1 || squared === 0);

  const multiplier = Math.sqrt((-2 * Math.log(squared)) / squared);
  return standardDeviation * u * multiplier + mean;
}

function resolveChannel(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (value.mean != null) return randomNormal(value.mean, value.dev ?? 0);
  if (value.min != null) return randomRange(value.min, value.max ?? value.min);
  return null;
}

function toColorChannel(value) {
  return clamp(Math.round(value), 0, 255);
}

function toAlpha(value) {
  return clamp(value, 0, 1);
}

const DEFAULT_COLOR_CONFIG = {
  red: 12,
  green: 175,
  blue: 255,
  alpha: { min: 0, max: 1 },
};

function generateColor(colorConfig) {
  return {
    red: toColorChannel(
      resolveChannel(colorConfig?.red) ?? DEFAULT_COLOR_CONFIG.red,
    ),
    green: toColorChannel(
      resolveChannel(colorConfig?.green) ??
        resolveChannel(DEFAULT_COLOR_CONFIG.green),
    ),
    blue: toColorChannel(
      resolveChannel(colorConfig?.blue) ?? DEFAULT_COLOR_CONFIG.blue,
    ),
    alpha: toAlpha(
      resolveChannel(colorConfig?.alpha) ??
        resolveChannel(DEFAULT_COLOR_CONFIG.alpha),
    ),
  };
}

function createParticle(colorConfig) {
  const { red, green, blue, alpha } = generateColor(colorConfig);

  return {
    x: -2,
    y: -2,
    diameter: Math.max(
      0,
      randomNormal(PARTICLE_DIAMETER_VH, PARTICLE_DIAMETER_VH / 2),
    ),
    duration: randomNormal(ANIMATION_DURATION_MS, ANIMATION_DURATION_MS * 0.1),
    amplitude: randomNormal(16, 2),
    offsetY: randomNormal(0, 10),
    arc: Math.PI * 2,
    startTime: performance.now() - randomRange(0, ANIMATION_DURATION_MS),
    colour: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
  };
}

function updateParticle(particle, time) {
  const elapsed = time - particle.startTime;
  const progress = (elapsed % particle.duration) / particle.duration;

  particle.x = progress;
  particle.y =
    Math.sin(progress * particle.arc) * particle.amplitude + particle.offsetY;
}

function drawParticle(context, particle, viewWidth, viewHeight) {
  const vh = viewHeight / 100;

  context.fillStyle = particle.colour;
  context.beginPath();
  context.ellipse(
    particle.x * viewWidth,
    particle.y * vh + viewHeight / 2,
    particle.diameter * vh,
    particle.diameter * vh,
    0,
    0,
    2 * Math.PI,
  );
  context.fill();
}

function resizeCanvas(canvas, context) {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { width, height };
}

const ParticleWaveBackground = ({ colorConfig } = {}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const animationFrameRef = useRef(null);
  const colorConfigRef = useRef(colorConfig);
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const configChanged = colorConfig !== colorConfigRef.current;

    let viewWidth, viewHeight;
    let resizeTimer = null;

    function handleResize() {
      const dimensions = resizeCanvas(canvas, context);
      viewWidth = dimensions.width;
      viewHeight = dimensions.height;
    }

    function handleResizeDebounced() {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        handleResize();
        resizeTimer = null;
      });
    }

    handleResize();
    window.addEventListener('resize', handleResizeDebounced);

    if (!particlesRef.current || configChanged) {
      if (particlesRef.current && configChanged) {
        for (const p of particlesRef.current) {
          const { red, green, blue, alpha } = generateColor(colorConfig);
          p.colour = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        }
      } else {
        particlesRef.current = Array.from({ length: NUM_PARTICLES }, () =>
          createParticle(colorConfig),
        );
      }
      colorConfigRef.current = colorConfig;
    }

    function handleVisibilityChange() {
      pausedRef.current = document.hidden;
      if (!pausedRef.current && !animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animationLoop);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    function animationLoop(time) {
      if (pausedRef.current) {
        animationFrameRef.current = null;
        return;
      }

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        updateParticle(particles[i], time);
      }

      context.clearRect(0, 0, viewWidth, viewHeight);

      for (const particle of particles) {
        drawParticle(context, particle, viewWidth, viewHeight);
      }

      animationFrameRef.current = requestAnimationFrame(animationLoop);
    }

    animationFrameRef.current = requestAnimationFrame(animationLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResizeDebounced);
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
    };
  }, [colorConfig]);

  return (
    <div className='particle-wave-wrap'>
      <canvas
        ref={canvasRef}
        className='particle-wave-canvas'
      />
    </div>
  );
};

export default ParticleWaveBackground;

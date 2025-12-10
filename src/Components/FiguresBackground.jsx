import { useMemo } from 'react';
import './FiguresBackground.scss';

const generateShapes = (numShapes) => {
  const shapes = [];
  const shapeTypes = ['circle', 'triangle', 'cross', 'square'];

  for (let i = 0; i < numShapes; i++) {
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const animationDelay = `${Math.random() * -5}s`;

    shapes.push({
      id: i,
      className: shapeType,
      style: { top, left, animationDelay },
    });
  }

  return shapes;
};

const FiguresBackground = () => {
  // Memoize shapes to prevent unnecessary regeneration on re-renders
  const shapes = useMemo(() => generateShapes(30), []);

  return (
    <div className='backwrap'>
      <div className='back-shapes'>
        {shapes.map((shape) => (
          <span
            key={shape.id}
            className={`floating ${shape.className}`}
            style={shape.style}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default FiguresBackground;

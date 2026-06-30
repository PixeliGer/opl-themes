import { useMemo } from 'react';
import './FiguresBackground.scss';

const SHAPE_TYPES = ['circle', 'triangle', 'cross', 'square'];
const NUM_SHAPES = 30;

const generateShapes = (count) => {
  const shapes = [];
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: i,
      className: SHAPE_TYPES[i % SHAPE_TYPES.length],
      style: {
        top: `${(i * 17 + 3) % 100}%`,
        left: `${(i * 31 + 7) % 100}%`,
        animationDelay: `${(i % 5) * -1}s`,
      },
    });
  }
  return shapes;
};

const FiguresBackground = () => {
  const shapes = useMemo(() => generateShapes(NUM_SHAPES), []);

  return (
    <div className='backwrap'>
      <div className='back-shapes'>
        {shapes.map((shape) => (
          <span
            key={shape.id}
            className={`floating ${shape.className}`}
            style={shape.style}
          />
        ))}
      </div>
    </div>
  );
};

export default FiguresBackground;

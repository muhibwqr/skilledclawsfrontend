import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';

import './Dock.css';

function DockItem({ label, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }) {
  const ref = useRef(null);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - rect.width / 2;
  });

  const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, 1.12, 1]);
  const scale = useSpring(targetScale, spring);

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <span className="dock-item-text">{label}</span>
    </motion.div>
  );
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.2, stiffness: 300, damping: 20 },
  distance = 160,
  panelHeight = 52,
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => mouseX.set(pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            label={item.label}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={1.12}
            baseItemSize={80}
          />
        ))}
      </motion.div>
    </div>
  );
}

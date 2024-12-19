import { useEffect } from 'react';
import { Container } from '@pixi/react';
import { useCanvasStore } from '@/store/canvasStore';
import { useWidgetStore } from '@/store/widgetStore';
import BaseWidget from './widgets/BaseWidget';

const WidgetManager = () => {
  const { widgets, removeWidget } = useWidgetStore();
  const { scale } = useCanvasStore();

  // Load widget component dynamically
  const loadWidget = async (type: string) => {
    try {
      const module = await import(`./widgets/${type}Widget.tsx`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load widget: ${type}`, error);
      return null;
    }
  };

  return (
    <Container>
      {widgets.map((widget) => (
        <BaseWidget
          key={widget.id}
          x={widget.position.x}
          y={widget.position.y}
          width={widget.size.width}
          height={widget.size.height}
          onClose={() => removeWidget(widget.id)}
        >
          {/* Widget content will be rendered here dynamically */}
        </BaseWidget>
      ))}
    </Container>
  );
};

export default WidgetManager; 
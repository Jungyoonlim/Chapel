import { useEffect, useState, useMemo } from 'react';
import { Container } from '@pixi/react';
import { useCanvasStore } from '@/store/canvasStore';
import { useWidgetStore } from '@/store/widgetStore';
import BaseWidget from './widgets/BaseWidget';
import { Widget } from '@chapel/shared';
import dynamic from 'next/dynamic';
import { getVisibleWidgets } from '@/utils/virtualization';

// Dynamically import widgets
const widgets = {
  timeline: dynamic(() => import('./widgets/TimelineWidget')),
  'task-list': dynamic(() => import('./widgets/TaskListWidget')),
  // Add more widgets here as they are created
};

const WidgetManager = () => {
  const { widgets: widgetInstances, removeWidget, updateWidget } = useWidgetStore();
  const { position, scale } = useCanvasStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loadedWidgets, setLoadedWidgets] = useState<Record<string, React.ComponentType<any>>>({});

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Load widget components
  useEffect(() => {
    const loadWidgets = async () => {
      const uniqueTypes = [...new Set(widgetInstances.map(w => w.type))];
      const loaded: Record<string, React.ComponentType<any>> = {};

      for (const type of uniqueTypes) {
        try {
          const WidgetComponent = widgets[type];
          if (WidgetComponent) {
            loaded[type] = WidgetComponent;
          }
        } catch (error) {
          console.error(`Failed to load widget: ${type}`, error);
        }
      }

      setLoadedWidgets(loaded);
    };

    loadWidgets();
  }, [widgetInstances]);

  // Get visible widgets based on current viewport
  const visibleWidgets = useMemo(() => {
    return getVisibleWidgets(widgetInstances, {
      x: -position.x / scale,
      y: -position.y / scale,
      width: dimensions.width / scale,
      height: dimensions.height / scale,
      scale,
    });
  }, [widgetInstances, position, scale, dimensions]);

  const handleWidgetUpdate = (widget: Widget, updates: Partial<Widget>) => {
    updateWidget(widget.id, updates);
  };

  return (
    <Container>
      {visibleWidgets.map((widget) => {
        const WidgetComponent = loadedWidgets[widget.type];

        return (
          <BaseWidget
            key={widget.id}
            x={widget.position.x}
            y={widget.position.y}
            width={widget.size.width}
            height={widget.size.height}
            onClose={() => removeWidget(widget.id)}
          >
            {WidgetComponent && (
              <WidgetComponent
                widget={widget}
                onUpdate={(updates) => handleWidgetUpdate(widget, updates)}
              />
            )}
          </BaseWidget>
        );
      })}
    </Container>
  );
};

export default WidgetManager; 
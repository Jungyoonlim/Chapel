import { create } from 'zustand';
import { Widget } from '@chapel/shared';

interface WidgetState {
  widgets: Widget[];
  selectedWidgetId: string | null;
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  selectWidget: (id: string | null) => void;
}

export const useWidgetStore = create<WidgetState>((set) => ({
  widgets: [],
  selectedWidgetId: null,

  addWidget: (widget) =>
    set((state) => ({
      widgets: [...state.widgets, widget],
    })),

  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
      selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId,
    })),

  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  selectWidget: (id) =>
    set({
      selectedWidgetId: id,
    }),
})); 
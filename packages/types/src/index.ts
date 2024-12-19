// Widget Types
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface WidgetBase {
  id: string
  type: string
  position: Position
  size: Size
  data: Record<string, unknown>
}

// Intent Types
export interface Intent {
  action: string
  goal: string
  widgets: string[]
}

export interface IntentResponse {
  success: boolean
  intent?: Intent
  error?: string
}

// Widget Types
export interface TimelineWidget extends WidgetBase {
  type: 'timeline'
  data: {
    events: Array<{
      id: string
      title: string
      date: string
      description?: string
    }>
  }
}

export interface TaskListWidget extends WidgetBase {
  type: 'task-list'
  data: {
    tasks: Array<{
      id: string
      title: string
      completed: boolean
      dueDate?: string
    }>
  }
}

export interface ChartWidget extends WidgetBase {
  type: 'chart'
  data: {
    type: 'bar' | 'line' | 'pie'
    title: string
    data: Array<{
      label: string
      value: number
    }>
  }
}

// Union type of all widget types
export type Widget = TimelineWidget | TaskListWidget | ChartWidget

// Canvas State Types
export interface CanvasState {
  widgets: Widget[]
  selectedWidgetId?: string
  scale: number
  position: Position
}

// Theme Types
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  error: string
  success: string
  warning: string
}

export interface Theme {
  colors: ThemeColors
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  typography: {
    fontSizes: Record<string, string>
    fontWeights: Record<string, number>
    lineHeights: Record<string, number>
  }
} 
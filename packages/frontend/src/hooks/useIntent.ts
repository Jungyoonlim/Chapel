import { useMutation } from '@tanstack/react-query';
import { Intent, IntentResponse } from '@chapel/shared';
import { useWidgetStore } from '@/store/widgetStore';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UseIntentOptions {
  onSuccess?: (response: IntentResponse) => void;
  onError?: (error: Error) => void;
}

export const useIntent = (options: UseIntentOptions = {}) => {
  const { addWidget } = useWidgetStore();

  const mutation = useMutation({
    mutationFn: async (input: string): Promise<IntentResponse> => {
      const response = await fetch(`${API_URL}/api/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error('Failed to process intent');
      }

      return response.json();
    },
    onSuccess: (response) => {
      if (response.success && response.intent) {
        // Create widgets based on the intent
        response.intent.widgets.forEach((widgetType) => {
          addWidget({
            id: uuidv4(),
            type: widgetType,
            position: { x: Math.random() * 500, y: Math.random() * 500 }, // Random initial position
            size: { width: 300, height: 200 }, // Default size
            data: {}, // Will be populated by the specific widget component
          });
        });
      }
      options.onSuccess?.(response);
    },
    onError: (error) => {
      console.error('Intent processing error:', error);
      options.onError?.(error);
    },
  });

  return mutation;
};

export default useIntent; 
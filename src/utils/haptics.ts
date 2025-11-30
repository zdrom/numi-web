/**
 * Trigger haptic feedback on supported devices
 * @param type - The intensity of the haptic feedback
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 50
    };
    navigator.vibrate(patterns[type]);
  }
};

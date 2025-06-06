interface Settings {
  selectedModel: string;
  apiKeyOpenAI: string;
  apiKeyAnthropic: string;
  voiceEnabled: boolean;
  selectedVoice: string;
  theme: 'light' | 'dark' | 'system';
}

export const loadSettings = (): Settings | null => {
  try {
    const serializedSettings = localStorage.getItem('appSettings');
    if (serializedSettings === null) {
      return null;
    }
    return JSON.parse(serializedSettings);
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return null;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    const serializedSettings = JSON.stringify(settings);
    localStorage.setItem('appSettings', serializedSettings);
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

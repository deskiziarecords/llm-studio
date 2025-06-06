import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { AppSettings, ModelConfig } from '../types';
import { motion } from 'framer-motion';
import { Save, Key, Volume2, PaintBucket, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, currentModel } = useStore();
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedMessage, setSavedMessage] = useState(false);

  // Effect to update localSettings if global settings change from elsewhere
  // or if the settings from the store are loaded after initial component mount.
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  
  const handleSave = () => {
    updateSettings(localSettings);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };
  
  const updateApiKey = (provider: string, value: string) => {
    setLocalSettings({
      ...localSettings,
      apiKeys: { ...localSettings.apiKeys, [provider]: value }
    });
  };
  
  const updateVoiceSettings = (key: keyof AppSettings['voice'], value: any) => {
    setLocalSettings({
      ...localSettings,
      voice: { ...localSettings.voice, [key]: value }
    });
  };
  
  const updateAppearanceSettings = (key: keyof AppSettings['appearance'], value: any) => {
    setLocalSettings({
      ...localSettings,
      appearance: { ...localSettings.appearance, [key]: value }
    });
  };
  
  const updateAdvancedSettings = (key: keyof AppSettings['advanced'], value: any) => {
    setLocalSettings({
      ...localSettings,
      advanced: { ...localSettings.advanced, [key]: value }
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 transition-colors rounded-lg text-white"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>
      
      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 p-3 bg-green-500/20 border border-green-600/30 rounded-lg text-green-400"
        >
          Settings saved successfully
        </motion.div>
      )}
      
      <div className="space-y-8">
        {/* API Keys */}
        <SettingsSection title="API Keys" icon={<Key className="text-primary-400" />}>
          {currentModel && currentModel.type === 'local' ? (
            <div className="p-4 text-sm text-gray-400 bg-dark-700 rounded-lg">
              API keys are not required for the selected local model ({currentModel.name}).
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  value={localSettings.apiKeys['openai'] || ''}
                  onChange={(e) => updateApiKey('openai', e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Anthropic API Key</label>
                <input
                  type="password"
                  value={localSettings.apiKeys['anthropic'] || ''}
                  onChange={(e) => updateApiKey('anthropic', e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              {/* Add other API key inputs here if needed, e.g., for other cloud providers */}
            </div>
          )}
        </SettingsSection>
        
        {/* Voice Settings */}
        <SettingsSection title="Voice Settings" icon={<Volume2 className="text-secondary-400" />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Enable Voice Commands</label>
              <Toggle
                enabled={localSettings.voice.enabled}
                onChange={(value) => updateVoiceSettings('enabled', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Auto-play Responses</label>
              <Toggle
                enabled={localSettings.voice.autoPlayResponses}
                onChange={(value) => updateVoiceSettings('autoPlayResponses', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Voice Selection</label>
              <select
                value={localSettings.voice.voice}
                onChange={(e) => updateVoiceSettings('voice', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="default">Default</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="british">British</option>
                <option value="australian">Australian</option>
              </select>
            </div>
          </div>
        </SettingsSection>
        
        {/* Appearance */}
        <SettingsSection title="Appearance" icon={<PaintBucket className="text-accent-400" />}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Theme</label>
              <div className="flex gap-3">
                {(['dark', 'light'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateAppearanceSettings('theme', theme)}
                    className={`px-4 py-2 rounded-lg border ${
                      localSettings.appearance.theme === theme
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-dark-600 bg-dark-700'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Font Size</label>
              <div className="flex gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateAppearanceSettings('fontSize', size)}
                    className={`px-4 py-2 rounded-lg border ${
                      localSettings.appearance.fontSize === size
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-dark-600 bg-dark-700'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>
        
        {/* Advanced Settings */}
        <SettingsSection title="Advanced Settings" icon={<Sliders className="text-green-400" />}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Temperature</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={localSettings.advanced.temperature}
                  onChange={(e) => updateAdvancedSettings('temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="min-w-10 text-center">{localSettings.advanced.temperature}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max Tokens</label>
              <input
                type="number"
                min="100"
                max="8000"
                value={localSettings.advanced.maxTokens}
                onChange={(e) => updateAdvancedSettings('maxTokens', parseInt(e.target.value))}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Stream Responses</label>
              <Toggle
                enabled={localSettings.advanced.streamResponses}
                onChange={(value) => updateAdvancedSettings('streamResponses', value)}
              />
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon, children }) => {
  return (
    <section className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-dark-700 bg-dark-800">
        {icon}
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </section>
  );
};

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary-600' : 'bg-dark-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};
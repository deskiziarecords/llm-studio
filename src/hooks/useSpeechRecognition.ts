import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isListening, setIsListening } = useStore();
  
  // Check if browser supports speech recognition
  const browserSupportsSpeechRecognition = () => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  };
  
  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition()) {
      setError('Your browser does not support speech recognition.');
      return;
    }
    
    setIsListening(true);
    // In a real implementation, we would set up the Web Speech API here
    
    // This is just a simulation for the demo
    console.log('Started listening...');
  }, [setIsListening]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    setIsListening(false);
    // In a real implementation, we would stop the Web Speech API here
    
    // This is just a simulation for the demo
    console.log('Stopped listening...');
    
    // Simulate receiving transcript
    setTranscript('What is the weather like today?');
  }, [setIsListening]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
}
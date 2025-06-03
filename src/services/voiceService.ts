import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export class VoiceService {
  private static instance: VoiceService;
  private recognition: ReturnType<typeof useSpeechRecognition> | null = null;
  private synthesis: ReturnType<typeof useSpeechSynthesis> | null = null;
  
  private constructor() {
    // Private constructor to enforce singleton pattern
  }
  
  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }
  
  public initialize(
    recognition: ReturnType<typeof useSpeechRecognition>,
    synthesis: ReturnType<typeof useSpeechSynthesis>
  ): void {
    this.recognition = recognition;
    this.synthesis = synthesis;
  }
  
  public startListening(): void {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return;
    }
    
    this.recognition.startListening();
  }
  
  public stopListening(): string {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return '';
    }
    
    this.recognition.stopListening();
    const transcript = this.recognition.transcript;
    this.recognition.resetTranscript();
    return transcript;
  }
  
  public speak(text: string): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not initialized');
      return;
    }
    
    this.synthesis.speak(text);
  }
  
  public stopSpeaking(): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not initialized');
      return;
    }
    
    this.synthesis.stop();
  }
  
  public isListening(): boolean {
    return this.recognition?.isListening || false;
  }
  
  public isPlaying(): boolean {
    return this.synthesis?.isPlaying || false;
  }
  
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.voices || [];
  }
  
  public setVoice(voice: SpeechSynthesisVoice): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not initialized');
      return;
    }
    
    this.synthesis.setVoice(voice);
  }
}

export default VoiceService.getInstance();
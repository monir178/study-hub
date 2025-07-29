import { useState, useRef, useCallback, useEffect } from "react";
import { useUploadFile } from "./useMessages";

interface VoiceRecorderOptions {
  roomId: string;
  onUploadSuccess: (result: {
    url: string;
    fileName: string;
    format: string;
  }) => void;
  onUploadError: (error: Error) => void;
}

interface RecordingState {
  isRecording: boolean;
  isUploading: boolean;
  duration: number;
  formattedTime: string;
}

export function useVoiceRecorder(options: VoiceRecorderOptions) {
  const { roomId, onUploadSuccess, onUploadError } = options;
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isUploading: false,
    duration: 0,
    formattedTime: "00:00",
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const uploadFile = useUploadFile();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const fileName = `voice-message-${Date.now()}.wav`;

        // Create a File object from the blob
        const audioFile = new File([audioBlob], fileName, {
          type: "audio/wav",
        });

        setState((prev) => ({ ...prev, isUploading: true }));

        try {
          const result = await uploadFile.mutateAsync({
            file: audioFile,
            roomId,
          });

          onUploadSuccess({
            url: result.url,
            fileName,
            format: "audio/wav",
          });
        } catch (error) {
          onUploadError(
            error instanceof Error ? error : new Error("Upload failed"),
          );
        } finally {
          setState((prev) => ({ ...prev, isUploading: false }));
        }
      };

      mediaRecorderRef.current.start();
      setState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
        formattedTime: "00:00",
      }));

      // Start timer
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const newDuration = prev.duration + 1;
          return {
            ...prev,
            duration: newDuration,
            formattedTime: formatTime(newDuration),
          };
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      onUploadError(
        error instanceof Error ? error : new Error("Failed to start recording"),
      );
    }
  }, [roomId, onUploadSuccess, onUploadError, uploadFile]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setState((prev) => ({ ...prev, isRecording: false }));

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setState((prev) => ({
        ...prev,
        isRecording: false,
        duration: 0,
        formattedTime: "00:00",
      }));

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (mediaRecorderRef.current && state.isRecording) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [state.isRecording]);

  return {
    isRecording: state.isRecording,
    isUploading: state.isUploading,
    duration: state.duration,
    formattedTime: state.formattedTime,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}

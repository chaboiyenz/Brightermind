// Minimal typing for the Jitsi Meet External API, loaded at runtime from
// https://meet.jit.si/external_api.js (see app/call/[sessionId]/CallRoom.tsx).
// Deliberately narrow — only the surface this app actually calls — rather
// than pulling in @jitsi/react-sdk just for its types. Reference:
// https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe

interface JitsiMeetExternalAPIOptions {
  roomName: string;
  parentNode: HTMLElement;
  width?: string | number;
  height?: string | number;
  userInfo?: { displayName?: string; email?: string };
  configOverwrite?: Record<string, unknown>;
  interfaceConfigOverwrite?: Record<string, unknown>;
}

interface JitsiDeviceError {
  type: string;
  message: string;
}

interface JitsiMuteStatus {
  muted: boolean;
}

interface JitsiMeetExternalAPI {
  addListener(event: "videoConferenceJoined", handler: () => void): void;
  addListener(event: "videoConferenceLeft", handler: () => void): void;
  addListener(event: "readyToClose", handler: () => void): void;
  addListener(event: "cameraError", handler: (error: JitsiDeviceError) => void): void;
  addListener(event: "micError", handler: (error: JitsiDeviceError) => void): void;
  addListener(event: "audioMuteStatusChanged", handler: (status: JitsiMuteStatus) => void): void;
  addListener(event: "videoMuteStatusChanged", handler: (status: JitsiMuteStatus) => void): void;
  executeCommand(command: "toggleAudio" | "toggleVideo" | "hangup"): void;
  getNumberOfParticipants(): number;
  dispose(): void;
}

interface JitsiMeetExternalAPIConstructor {
  new (domain: string, options: JitsiMeetExternalAPIOptions): JitsiMeetExternalAPI;
}

interface Window {
  JitsiMeetExternalAPI?: JitsiMeetExternalAPIConstructor;
}

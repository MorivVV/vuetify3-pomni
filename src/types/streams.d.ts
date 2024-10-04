interface StreamSubscriber {
  app: string;
  stream: string;
  clientId: string;
  connectCreated: string;
  bytes: number;
  ip: string;
  protocol: string;
}
interface StreamMediaVideo {
  codec: string;
  width: number;
  height: number;
  profile: string;
  level: number;
  fps: number;
}
interface StreamMediaAudio {
  codec: string;
  profile: string;
  samplerate: number;
  channels: number;
}
interface StreamMediaPublisher {
  app: string;
  stream: string;
  clientId: string;
  connectCreated: string;
  bytes: number;
  ip: string;
  audio: StreamMediaAudio;
  video: StreamMediaVideo;
}
interface StreamMediaChanel {
  publisher: StreamMediaPublisher;
  subscribers: StreamSubscriber[];
}
interface StreamMediaApp {
  [x: "test" | string]: StreamMediaChanel;
}
interface StreamMedia {
  [x: "live" | string]: StreamMediaApp;
}

interface FileStats {
  id: number;
  path: string;
  length: number;
}
interface FileData {
  Files: FileStats[];
}
interface ServerData {
  TorrServer: FileData;
}
interface TorrentInfo {
  title: string;
  poster: string;
  data: string;
  timestamp: number;
  name: string;
  hash: string;
  stat: number;
  stat_string: string;
  loaded_size: number;
  torrent_size: number;
  preloaded_bytes: number;
  total_peers: number;
  pending_peers: number;
  active_peers: number;
  connected_seeders: number;
  half_open_peers: number;
  bytes_written: number;
  bytes_read: number;
  bytes_read_data: number;
  bytes_read_useful_data: number;
  chunks_read: number;
  chunks_read_useful: number;
  chunks_read_wasted: number;
  pieces_dirtied_good: number;
  file_stats: FileStats[];
}

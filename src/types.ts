export interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string;
  code: string;
  createdAt: number;
}

export interface FileStore {
  [code: string]: SharedFile;
}
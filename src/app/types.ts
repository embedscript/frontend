export interface Embed {
  ID: string;
  name: string;
  description: string;
  available?: boolean;
  image?: string;
  background?: string;
  // Field that exists to make search more accurate
  searchDescription?: string;
  timeToImplement?: number;
}

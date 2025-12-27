import { toByteArray, fromByteArray } from '../../vendor/base64-js';

export class Octostore {
  private static readonly SEPARATOR = '#';

  private static async compressString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    const stream = new CompressionStream('deflate-raw');
    const writer = stream.writable.getWriter();

    writer.write(data);
    writer.close();

    const buf = await new Response(stream.readable).arrayBuffer();
    const compressed = new Uint8Array(buf);

    return fromByteArray(compressed);
  }

  private static async decompressString(
    compressedBase64: string,
  ): Promise<string> {
    const compressed = toByteArray(compressedBase64);

    const stream = new DecompressionStream('deflate-raw');
    const writer = stream.writable.getWriter();

    writer.write(new Uint8Array(compressed));
    writer.close();

    const buf = await new Response(stream.readable).arrayBuffer();
    const decompressed = new Uint8Array(buf);
    const decoder = new TextDecoder();

    return decoder.decode(decompressed);
  }

  static async setData(data: string[]): Promise<void> {
    try {
      const compressed = await Promise.all(data.map(this.compressString));
      window.location.hash = compressed.join(this.SEPARATOR);
    } catch (error) {
      throw new Error(`Failed to set data: ${error}`);
    }
  }

  static async setItem(index: number, data: string): Promise<void> {
    try {
      const hash = window.location.hash.slice(1);
      const values = hash ? hash.split(this.SEPARATOR) : [];

      values[index] = await this.compressString(data);
      window.location.hash = values.join(this.SEPARATOR);
    } catch (error) {
      throw new Error(`Failed to set data: ${error}`);
    }
  }

  static async getData(): Promise<string[] | null> {
    try {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        return null;
      }

      const values = hash.split(this.SEPARATOR);

      return await Promise.all(
        values.map((value) => {
          if (!value) {
            return '';
          }

          return this.decompressString(value);
        }),
      );
    } catch (error) {
      console.warn('Failed to decompress data from URL:', error);
      return null;
    }
  }

  static async getItem(index: number): Promise<string | null> {
    const data = await this.getData();
    if (!data) {
      return null;
    }

    return data[index] ?? null;
  }

  static clearData(): void {
    window.location.hash = '';
  }

  static hasData(): boolean {
    return window.location.hash.length > 1;
  }
}

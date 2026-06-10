import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  getNumber(key: string, defaultValue?: number): number {
    return parseInt(process.env[key] || String(defaultValue), 10) || 0;
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) return defaultValue || false;
    return value === 'true' || value === '1';
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class ParamsService {
  private params: Map<string, any> = new Map();

  public set(key: string, value: any): void {
    this.params.set(key, value);
  }

  public get(key: string): any {
    return this.params.get(key);
  }

  public remove(key: string): boolean {
    return this.params.delete(key);
  }
}

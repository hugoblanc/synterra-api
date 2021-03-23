import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private _isProduction: boolean;

  constructor() {
    this._isProduction = process.env.PIM_ENVIRONMENT === 'true' ? true : false;
  }

  get isProduction(): boolean {
    return this._isProduction;
  }
}

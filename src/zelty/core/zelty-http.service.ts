import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ZeltyHttpService {
  private static BASE_URL = 'https://api.zelty.fr/2.4/';
  private static ZELTY_TOKEN = 'Bearer MjEzOToA8z9gdxQgQWqeSK6BKPMMReIuBA==';

  constructor(private readonly http: HttpService) {}

  public get<T = any>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Observable<T> {
    config.headers = {
      Authorization: ZeltyHttpService.ZELTY_TOKEN,
    };
    return this.http
      .get<T>(ZeltyHttpService.BASE_URL + url, config)
      .pipe(map((response) => response.data));
  }
}

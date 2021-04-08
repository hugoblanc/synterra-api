import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ZeltyHttpService {
  private static BASE_URL = 'https://api.zelty.fr/2.4/';
  // private static BASE_URL_CATALOG = ZeltyHttpService.BASE_URL + 'catalog/';
  // private static BASE_URL_DISH = ZeltyHttpService.BASE_URL_CATALOG + 'dishes/';

  private static ZELTY_TOKEN = 'Bearer MjEzOToA8z9gdxQgQWqeSK6BKPMMReIuBA==';

  constructor(private readonly http: HttpService) {
    this.http.axiosRef.interceptors.request.use((config) => {
      config.url = ZeltyHttpService.BASE_URL + config.url;
      console.log(config.url);
      config.headers.Authorization = ZeltyHttpService.ZELTY_TOKEN;
      return config;
    });
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return this.http.get<T>(url, config).pipe(map((response) => response.data));
  }
}

// @Injectable()
// export class ZeltyHttpService {
//   private static BASE_URL = 'https://api.zelty.fr/2.4/';
//   private static BASE_URL_CATALOG = ZeltyHttpService.BASE_URL + 'catalog/';
//   private static BASE_URL_DISH = ZeltyHttpService.BASE_URL_CATALOG + 'dishes/';

//   private static config: AxiosRequestConfig = {
//     headers: { Authorization: 'Bearer MjEzOToA8z9gdxQgQWqeSK6BKPMMReIuBA==' },
//   };

//   constructor(private readonly http: HttpService) {}

//   public getProductFromZelty(): Observable<Dish[]> {
//     return this.http
//       .get<ZeltyDishesResponse>(
//         ZeltyHttpService.BASE_URL_DISH,
//         ZeltyHttpService.config,
//       )
//       .pipe(map((response) => response.data.dishes));
//   }

//   public getProductFromZeltyById(id: number): Observable<Dish> {
//     return this.http
//       .get<ZeltyDishResponse>(
//         ZeltyHttpService.BASE_URL_DISH + id,
//         ZeltyHttpService.config,
//       )
//       .pipe(map((response) => response.data.dish));
//   }
// }

import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JiraHttpService {
  private static BASE_URL = 'https://hubert-campagne.atlassian.net/rest/api/2/';

  private static JIRA_TOKEN =
    'Basic Y29udGFjdEBzeW50ZXJyYS5mcjo0TWRRMVV2S0dzWW9VYU80alFYajlBOTY=';

  constructor(private readonly http: HttpService) {
    // this.http.axiosRef;
    // this.http.axiosRef.interceptors.request.use((config) => {
    //   config.url = JiraHttpService.BASE_URL + config.url;
    //   console.log(config.url);
    //   config.headers.Authorization = JiraHttpService.JIRA_TOKEN;
    //   return config;
    // });
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Observable<T> {
    config.headers = { Authorization: JiraHttpService.JIRA_TOKEN };
    return this.http
      .get<T>(JiraHttpService.BASE_URL + url, config)
      .pipe(map((response) => response.data));
  }

  public post<T = any>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {},
  ): Observable<T> {
    config.headers = { Authorization: JiraHttpService.JIRA_TOKEN };

    return this.http
      .post<T>(JiraHttpService.BASE_URL + url, body, config)
      .pipe(map((response) => response.data));
  }
}

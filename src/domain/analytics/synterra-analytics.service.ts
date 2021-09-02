import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AvgTiming } from './model/avg-timing';

@Injectable()
export class SynterraAnalyticsService {
  BASE_URL = process.env.SYNTERRA_ANALYTICS_URL;
  constructor(private readonly http: HttpService) {}

  getPastAverage(): Observable<AvgTiming> {
    return this.http
      .get<AvgTiming>(this.BASE_URL + 'jira-analytics/past-average')
      .pipe(map((response) => response.data));
  }
}

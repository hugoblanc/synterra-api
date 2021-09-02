import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AvgTimingDTO } from '@synterra/shared/dist/class/avg-timing';
import { map, Observable } from 'rxjs';

@Injectable()
export class SynterraAnalyticsService {
  BASE_URL = process.env.SYNTERRA_ANALYTICS_URL;
  constructor(private readonly http: HttpService) {}

  getPastAverage(): Observable<AvgTimingDTO> {
    return this.http
      .get<AvgTimingDTO>(this.BASE_URL + 'jira-analytics/past-average')
      .pipe(map((response) => response.data));
  }
}

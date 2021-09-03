import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AvgTimingHubRepository } from '@synterra/shared';
import { AvgTimingDTO } from '@synterra/shared/dist/class/avg-timing';
import { map, Observable } from 'rxjs';

@Injectable()
export class SynterraAnalyticsService implements OnModuleInit {
  private logger = new Logger(SynterraAnalyticsService.name);

  BASE_URL = process.env.SYNTERRA_ANALYTICS_URL;
  constructor(private readonly avgHubRepository: AvgTimingHubRepository) {}

  getPastAverage(): Observable<AvgTimingDTO> {
    return this.avgHubRepository
      .load()
      .pipe(map((model) => model.get() as AvgTimingDTO));
  }
  onModuleInit() {
    // this.avgHubRepository.watch().subscribe((value: spinal.Model) => {
    //   this.logger.debug('avg value changed');
    //   const timingModel: spinal.Model = value['10012']['3'];
    //   console.log('timingModel ' + timingModel.has_been_directly_modified());
    //   console.log('timingModel ' + timingModel.has_been_modified());
    //   console.log(
    //     'timingModel.count ' + timingModel.count.has_been_directly_modified(),
    //   );
    //   console.log('timingModel.count ' + timingModel.count.has_been_modified());
    //   console.log(
    //     'timingModel.offset ' + timingModel.offset.has_been_directly_modified(),
    //   );
    //   console.log(
    //     'timingModel.offset ' + timingModel.offset.has_been_modified(),
    //   );
    // });
  }
}

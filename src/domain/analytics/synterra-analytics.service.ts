import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  AvgDailyTimingHubRepository,
  AvgPastTimingHubRepository,
} from '@synterra/shared';
import { AvgTimingDTO } from '@synterra/shared/dist/class/avg-timing';
import { map, Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DailyAvgUpdatedEvent } from '../../event/analytics/daily-avg-updated.event';

@Injectable()
export class SynterraAnalyticsService implements OnModuleInit {
  private logger = new Logger(SynterraAnalyticsService.name);

  constructor(
    private readonly dailyHubRepository: AvgDailyTimingHubRepository,
    private readonly pastHubRepository: AvgPastTimingHubRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getPastAverage(): Observable<AvgTimingDTO> {
    return this.pastHubRepository
      .load()
      .pipe(map((model) => model.get() as AvgTimingDTO));
  }
  onModuleInit() {
    this.dailyHubRepository.watch().subscribe((value: spinal.Model) => {
      this.logger.debug('Daily value changed');
      const event = new DailyAvgUpdatedEvent(value.get());
      this.eventEmitter.emit(DailyAvgUpdatedEvent.EVENT_NAME, event);
    });

    this.pastHubRepository.watch().subscribe((value: spinal.Model) => {
      this.logger.debug('Past value changed');
      const timingModel: spinal.Model = value['10012']['3'];
      console.log('timingModel ' + timingModel.has_been_directly_modified());
      console.log('timingModel ' + timingModel.has_been_modified());
      console.log(
        'timingModel.count ' + timingModel.count.has_been_directly_modified(),
      );
      console.log('timingModel.count ' + timingModel.count.has_been_modified());
      console.log(
        'timingModel.offset ' + timingModel.offset.has_been_directly_modified(),
      );
      console.log(
        'timingModel.offset ' + timingModel.offset.has_been_modified(),
      );
    });
  }
}

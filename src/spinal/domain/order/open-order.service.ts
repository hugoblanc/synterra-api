import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  catchError,
  EMPTY,
  forkJoin,
  mergeMap,
  Observable,
  of,
  tap,
} from 'rxjs';
import { MainTaskCreatedEvent } from '../../../event/jira/main-task-created.event';
import { SubTasksCreatedEvent } from '../../../event/jira/sub-tasks-created.event';
import { SubTasksUpdatedEvent } from '../../../event/jira/sub-tasks-updated.event';
import { OpenOrdersHubRepository } from './open-order-hub.repository';

@Injectable()
export class OpenOrderService {
  private logger = new Logger(OpenOrderService.name);

  constructor(private readonly hubRepository: OpenOrdersHubRepository) {}

  @OnEvent(MainTaskCreatedEvent.EVENT_NAME)
  handleMainTaskCreated(mainTaskEvent: MainTaskCreatedEvent) {
    const factory = mainTaskEvent.factory;
    const jiraIssueId = mainTaskEvent.taskId;
    const orderId = factory.order.id;
    this.logger.log('MainTaskCreatedEvent handled order id ' + orderId);
    const timingInformations = factory.task.extractTimingInformation();
    const additionalJiraInformation = {
      jiraIssueId,
      ...timingInformations,
    };

    this.hubRepository.find({ id: orderId }).subscribe((orders) => {
      this.logger.log('Matching order length ' + orders.length);
      const matchingOrder = orders[0];
      if (matchingOrder) {
        matchingOrder.add_attr(additionalJiraInformation);
      }
    });
  }

  @OnEvent(SubTasksCreatedEvent.EVENT_NAME)
  handleSubTasksCreated(subTasksEvent: SubTasksCreatedEvent) {
    const factory = subTasksEvent.factory;
    const subTasks = factory.subTasks;
    const issuesCreatedIds = subTasksEvent.issuesCreated.map(
      (issue) => issue.id,
    );
    this.logger.log('SubTasksCreatedEvent handled ids ' + issuesCreatedIds);

    const addAllMissingAttributs$ = subTasks.map((subTask, index) => {
      const dishId = subTask.dishId;
      const timingInformations = subTask.extractTimingInformation();
      const jiraIssueId = issuesCreatedIds[index];

      const additionalJiraInformation = {
        jiraIssueId,
        ...timingInformations,
      };

      const contents: any = [{ type: 'dish', id: dishId }];
      const findChild$ = this.findValorized(contents);
      this.logger.debug('Dish id' + dishId);

      return this.addAdditionalJiraInformation(
        findChild$,
        additionalJiraInformation,
      );
    });

    forkJoin(addAllMissingAttributs$).subscribe();
  }

  @OnEvent(SubTasksUpdatedEvent.EVENT_NAME)
  handleSubTasksUpdated(subTasksEvent: SubTasksUpdatedEvent) {
    console.log(subTasksEvent);

    const updateMIssingAttributes$ = subTasksEvent.subTaskUpdates.map(
      (subTaskUpdate) => {
        const contents = [{ type: 'dish', jiraIssueId: subTaskUpdate.id }];
        const findChild$ = this.findValorized(contents);

        return this.modifyAdditionalJiraInformation(
          findChild$,
          'maxPreparationTime',
          subTaskUpdate.fields.customfield_10031,
        );
      },
    );

    forkJoin(updateMIssingAttributes$).subscribe();
  }

  private findValorized(contents: any): Observable<any> {
    const findInContent$ = this.hubRepository.findChild({ contents });
    const findInMenu$ = this.hubRepository.findChild({
      contents: [{ contents }],
    });
    return findInContent$.pipe(
      mergeMap((model) => (model ? of(model) : findInMenu$)),
      catchError(() => {
        this.logger.error('Could not find valorized ');
        return EMPTY;
      }),
    );
  }

  private modifyAdditionalJiraInformation(
    findChild$: Observable<any>,
    attributName: string,
    value: any,
  ) {
    return findChild$.pipe(
      tap((model: spinal.Model) => {
        if (model) {
          model.mod_attr(attributName, value);
        } else {
          this.logger.error(`Could not find the dish `);
        }
      }),
    );
  }

  private addAdditionalJiraInformation(findChild$: Observable<any>, info: any) {
    return findChild$.pipe(
      tap((model: spinal.Model) => {
        if (model) {
          model.add_attr(info);
        } else {
          this.logger.error(`Could not find the dish `, info);
        }
      }),
    );
  }
}

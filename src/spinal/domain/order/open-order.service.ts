import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { catchError, EMPTY, forkJoin, mergeMap, of, tap } from 'rxjs';
import { MainTaskCreatedEvent } from '../../../event/jira/main-task-created.event';
import { SubTasksCreatedEvent } from '../../../event/jira/sub-tasks-created.event';
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

      const contents = [{ type: 'dish', id: dishId }];
      const findInContent$ = this.hubRepository.findChild({ contents });
      const findInMenu$ = this.hubRepository.findChild({
        contents: [{ contents }],
      });

      this.logger.debug('Dish id' + dishId);
      const addAttributes$ = findInContent$.pipe(
        mergeMap((model) => (model ? of(model) : findInMenu$)),
        tap((model: spinal.Model) => {
          if (model) {
            model.add_attr(additionalJiraInformation);
          } else {
            this.logger.error(
              `Could not find dish with id ${dishId} in order ${factory.order.id}`,
            );
          }
        }),
        catchError((error) => {
          this.logger.error(error);
          return EMPTY;
        }),
      );
      return addAttributes$;
    });

    forkJoin(addAllMissingAttributs$).subscribe();
  }
}

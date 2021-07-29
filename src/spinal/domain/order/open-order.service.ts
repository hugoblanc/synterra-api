import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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
    const jiraIssueId = factory.order.id;
    const timingInformations = factory.task.extactTimingInformation();
    const additionalJiraInformation = { jiraIssueId, ...timingInformations };

    this.hubRepository.find({ id: jiraIssueId }).subscribe((orders) => {
      console.log(orders);

      orders[0].add_attr(additionalJiraInformation);
    });
  }

  @OnEvent(SubTasksCreatedEvent.EVENT_NAME)
  handleSubTasksCreated(subTasksEvent: SubTasksCreatedEvent) {
    const factory = subTasksEvent.factory;
    const subTasks = factory.subTasks;
    const issues = subTasksEvent.subTasks;
    const jiraIssueId = factory.order.id;

    this.hubRepository.find({ id: jiraIssueId }).subscribe((orders) => {
      const order = orders[0];
      for (const subTask of subTasks) {
        const dishId = subTask.dishId;
        const timingInformations = subTask.extactTimingInformation();
        const additionalJiraInformation = { dishId, ...timingInformations };
      }
      // ici il faut trouver les bon dish sachant qu'il s'agit de model
    });
  }
}

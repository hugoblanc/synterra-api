import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IssueFactory } from './issue.factory';
import { JiraHttpService } from './jira-http.service';
import { IssueCreatedDto } from './models/jira-issue-created.dto';
import { OrderCreatedEvent } from '../event/zelty/order-created.event';

@Injectable()
export class JiraTaskService {
  constructor(private readonly jiraHttp: JiraHttpService) {
    // this.createTask()
    //   .pipe(
    //     catchError((error) => {
    //       console.log(error);
    //       return of(error);
    //     }),
    //   )
    //   .subscribe((result) => {
    //     console.log('Resultat ---------------');
    //     console.log(result);
    //   });
  }

  @OnEvent(OrderCreatedEvent.EVENT_NAME)
  createTask(createdEvent: OrderCreatedEvent) {
    const issueFactory = new IssueFactory(createdEvent.order);

    console.log('--------------- Event order created ---------------- ');

    console.log(issueFactory.getTask());
    console.log(issueFactory.getSubTasks());
    const mainTask = issueFactory.getTask();
    this.jiraHttp
      .post<IssueCreatedDto>('issue', mainTask)
      .pipe(
        mergeMap((issueCreatedDto: IssueCreatedDto) => {
          issueFactory.addParentId(issueCreatedDto.id);
          const subTasks = issueFactory.getSubTasks();
          const postSubTasks$ = subTasks.map((sub) =>
            this.jiraHttp.post('issue', sub),
          );
          return forkJoin(postSubTasks$);
        }),
      )
      .subscribe();
  }
}

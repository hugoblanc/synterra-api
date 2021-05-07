import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('yo')
  yo() {
    return 'toto';
  }
}

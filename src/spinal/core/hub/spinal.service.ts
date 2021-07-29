import { Injectable, OnModuleInit } from '@nestjs/common';
import { SpinalWrapper } from '@synterra/spinal-rxjs';

@Injectable()
export class SpinalService extends SpinalWrapper implements OnModuleInit {
  onModuleInit() {
    const SPINAL_USER_ID = process.env.SPINAL_USER_ID;
    const SPINAL_PASSWORD = process.env.SPINAL_PASSWORD;
    const SPINALHUB_IP = process.env.SPINALHUB_IP;
    const SPINALHUB_PORT = +process.env.SPINALHUB_PORT;

    this.initSpinalConnexion(
      SPINAL_USER_ID,
      SPINAL_PASSWORD,
      SPINALHUB_IP,
      SPINALHUB_PORT,
    );
  }
}

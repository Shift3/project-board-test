import { Injectable } from '@nestjs/common';

import appMetaData from '@metadata';

@Injectable()
export class AppService {
  returnHealthCheck(): string {
    return `Server up and healthy on version ${appMetaData.version}!`;
  }
}

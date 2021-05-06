import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: 'Server health check with application version' })
  @Get('health-check')
  healthCheck(): string {
    return this.appService.returnHealthCheck();
  }
}

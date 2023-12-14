import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './base/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('csrf')
  @Public()
  async getCsrfToken(@Req() req: any, @Res() res: any) {
    const csrfToken = req.csrfToken();
    res.json({ csrfToken });
  }
}

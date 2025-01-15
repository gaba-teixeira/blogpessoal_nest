import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TemaService } from '../services/tema.service';
import { Tema } from '../entities/tema.entity';

@Controller('/tema')
export class TemaController {
  constructor(private readonly temaService: TemaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Tema[]> {
    return this.temaService.findAll();
  }
}

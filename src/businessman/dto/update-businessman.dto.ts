import { PartialType } from '@nestjs/swagger';
import { CreateBusinessmanDto } from './create-businessman.dto';

export class UpdateBusinessmanDto extends PartialType(CreateBusinessmanDto) {}

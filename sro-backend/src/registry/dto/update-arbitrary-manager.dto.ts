import { PartialType } from '@nestjs/mapped-types';
import { CreateArbitraryManagerDto } from './create-arbitrary-manager.dto';

export class UpdateArbitraryManagerDto extends PartialType(CreateArbitraryManagerDto) {}

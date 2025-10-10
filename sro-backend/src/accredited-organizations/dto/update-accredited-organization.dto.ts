import { PartialType } from '@nestjs/mapped-types';
import { CreateAccreditedOrganizationDto } from './create-accredited-organization.dto';

export class UpdateAccreditedOrganizationDto extends PartialType(CreateAccreditedOrganizationDto) {}



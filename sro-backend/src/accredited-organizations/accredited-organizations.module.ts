import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccreditedOrganizationsService } from './accredited-organizations.service';
import { AccreditedOrganizationsController } from './accredited-organizations.controller';
import { AccreditedOrganization, AccreditedOrganizationSchema } from '@/database/schemas/accredited-organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccreditedOrganization.name, schema: AccreditedOrganizationSchema },
    ]),
  ],
  controllers: [AccreditedOrganizationsController],
  providers: [AccreditedOrganizationsService],
  exports: [AccreditedOrganizationsService],
})
export class AccreditedOrganizationsModule {}



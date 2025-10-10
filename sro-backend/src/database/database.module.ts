import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import databaseConfig from '@/config/database.config';
import { User, UserSchema } from './schemas/user.schema';
import { ArbitraryManager, ArbitraryManagerSchema } from './schemas/arbitrary-manager.schema';
import { News, NewsSchema } from './schemas/news.schema';
import { NewsCategory, NewsCategorySchema } from './schemas/news-category.schema';
import { DocumentModel, DocumentSchema } from './schemas/document.schema';
import { Event, EventSchema } from './schemas/event.schema';
import { EventType, EventTypeSchema } from './schemas/event-type.schema';
import { CompensationFund, CompensationFundSchema } from './schemas/compensation-fund.schema';
import { Inspection, InspectionSchema } from './schemas/inspection.schema';
import { DisciplinaryMeasure, DisciplinaryMeasureSchema } from './schemas/disciplinary-measure.schema';
import { Page, PageSchema } from './schemas/page.schema';
import { SiteSettings, SiteSettingsSchema } from './schemas/site-settings.schema';
import { Log, LogSchema } from './schemas/log.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { PasswordResetToken, PasswordResetTokenSchema } from './schemas/password-reset-token.schema';
import { LoginAttempt, LoginAttemptSchema } from './schemas/login-attempt.schema';
import { createIndexes } from './indexes';
import { AccreditedOrganization, AccreditedOrganizationSchema } from './schemas/accredited-organization.schema';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ArbitraryManager.name, schema: ArbitraryManagerSchema },
      { name: News.name, schema: NewsSchema },
      { name: NewsCategory.name, schema: NewsCategorySchema },
      { name: DocumentModel.name, schema: DocumentSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventType.name, schema: EventTypeSchema },
      { name: CompensationFund.name, schema: CompensationFundSchema },
      { name: Inspection.name, schema: InspectionSchema },
      { name: DisciplinaryMeasure.name, schema: DisciplinaryMeasureSchema },
      { name: Page.name, schema: PageSchema },
      { name: SiteSettings.name, schema: SiteSettingsSchema },
      { name: Log.name, schema: LogSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
      { name: AccreditedOrganization.name, schema: AccreditedOrganizationSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ArbitraryManager.name) private arbitraryManagerModel: Model<ArbitraryManager>,
    @InjectModel(News.name) private newsModel: Model<News>,
    @InjectModel(NewsCategory.name) private newsCategoryModel: Model<NewsCategory>,
    @InjectModel(DocumentModel.name) private documentModel: Model<DocumentModel>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(EventType.name) private eventTypeModel: Model<EventType>,
    @InjectModel(CompensationFund.name) private compensationFundModel: Model<CompensationFund>,
    @InjectModel(Inspection.name) private inspectionModel: Model<Inspection>,
    @InjectModel(DisciplinaryMeasure.name) private disciplinaryMeasureModel: Model<DisciplinaryMeasure>,
    @InjectModel(Page.name) private pageModel: Model<Page>,
    @InjectModel(SiteSettings.name) private siteSettingsModel: Model<SiteSettings>,
    @InjectModel(Log.name) private logModel: Model<Log>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(PasswordResetToken.name) private passwordResetTokenModel: Model<PasswordResetToken>,
    @InjectModel(LoginAttempt.name) private loginAttemptModel: Model<LoginAttempt>,
    @InjectModel(AccreditedOrganization.name) private accreditedOrganizationModel: Model<AccreditedOrganization>,
  ) {}

  async onModuleInit() {
    try {
      const models = {
        User: this.userModel,
        ArbitraryManager: this.arbitraryManagerModel,
        News: this.newsModel,
        NewsCategory: this.newsCategoryModel,
        Document: this.documentModel,
        Event: this.eventModel,
        EventType: this.eventTypeModel,
        CompensationFund: this.compensationFundModel,
        Inspection: this.inspectionModel,
        DisciplinaryMeasure: this.disciplinaryMeasureModel,
        Page: this.pageModel,
        SiteSettings: this.siteSettingsModel,
        Log: this.logModel,
        RefreshToken: this.refreshTokenModel,
        PasswordResetToken: this.passwordResetTokenModel,
        LoginAttempt: this.loginAttemptModel,
        AccreditedOrganization: this.accreditedOrganizationModel,
      };

      await createIndexes(models);
      console.log('✅ DatabaseModule инициализирован успешно');
    } catch (error) {
      console.error('❌ Ошибка при инициализации DatabaseModule:', error);
    }
  }
}

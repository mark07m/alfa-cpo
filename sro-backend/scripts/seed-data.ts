import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompensationFund, CompensationFundDocument } from '../src/database/schemas/compensation-fund.schema';
import { DisciplinaryMeasure, DisciplinaryMeasureDocument } from '../src/database/schemas/disciplinary-measure.schema';
import { DocumentModel, DocumentDocument } from '../src/database/schemas/document.schema';
import { EventType, EventTypeDocument } from '../src/database/schemas/event-type.schema';
import { ArbitraryManager, ArbitraryManagerDocument } from '../src/database/schemas/arbitrary-manager.schema';
import { Types } from 'mongoose';

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const compensationFundModel = app.get<Model<CompensationFundDocument>>(getModelToken(CompensationFund.name));
  const disciplinaryMeasureModel = app.get<Model<DisciplinaryMeasureDocument>>(getModelToken(DisciplinaryMeasure.name));
  const documentModel = app.get<Model<DocumentDocument>>(getModelToken(DocumentModel.name));
  const eventTypeModel = app.get<Model<EventTypeDocument>>(getModelToken(EventType.name));
  const arbitraryManagerModel = app.get<Model<ArbitraryManagerDocument>>(getModelToken(ArbitraryManager.name));

  try {
    console.log('🌱 Начинаем заполнение тестовыми данными...');

    // 1. Создаем тестовые данные для компенсационного фонда
    console.log('💰 Создаем данные компенсационного фонда...');
    const existingFund = await compensationFundModel.findOne();
    if (!existingFund) {
      const fund = new compensationFundModel({
        amount: 5000000, // 5 миллионов рублей
        currency: 'RUB',
        lastUpdated: new Date(),
        bankDetails: {
          bankName: 'ПАО Сбербанк',
          accountNumber: '40702810123456789012',
          bik: '044525225',
          correspondentAccount: '30101810400000000225',
          inn: '7707083893',
          kpp: '770701001',
        },
        history: [
          {
            date: new Date('2024-01-15'),
            operation: 'increase',
            amount: 2000000,
            description: 'Первоначальный взнос в компенсационный фонд',
            documentUrl: '/documents/fund-initial.pdf'
          },
          {
            date: new Date('2024-03-20'),
            operation: 'increase',
            amount: 1500000,
            description: 'Дополнительный взнос от новых членов СРО',
            documentUrl: '/documents/fund-additional.pdf'
          },
          {
            date: new Date('2024-06-10'),
            operation: 'increase',
            amount: 1000000,
            description: 'Ежеквартальный взнос',
            documentUrl: '/documents/fund-quarterly.pdf'
          },
          {
            date: new Date('2024-08-15'),
            operation: 'increase',
            amount: 500000,
            description: 'Взнос от расширения членской базы',
            documentUrl: '/documents/fund-expansion.pdf'
          }
        ],
        createdBy: new Types.ObjectId(),
        updatedBy: new Types.ObjectId(),
      });
      await fund.save();
      console.log('✅ Данные компенсационного фонда созданы');
    } else {
      console.log('ℹ️ Данные компенсационного фонда уже существуют');
    }

    // 2. Создаем тестовые данные для типов событий
    console.log('📅 Создаем типы событий...');
    const eventTypes = [
      {
        name: 'Конференция',
        slug: 'conference',
        description: 'Научно-практические конференции и семинары',
        color: '#3B82F6',
        icon: 'conference',
        isActive: true
      },
      {
        name: 'Обучение',
        slug: 'education',
        description: 'Курсы повышения квалификации и профессионального развития',
        color: '#10B981',
        icon: 'education',
        isActive: true
      },
      {
        name: 'Собрание',
        slug: 'meeting',
        description: 'Общие собрания членов СРО',
        color: '#F59E0B',
        icon: 'meeting',
        isActive: true
      },
      {
        name: 'Экзамен',
        slug: 'exam',
        description: 'Квалификационные экзамены и аттестации',
        color: '#EF4444',
        icon: 'exam',
        isActive: true
      },
      {
        name: 'Выставка',
        slug: 'exhibition',
        description: 'Профессиональные выставки и форумы',
        color: '#8B5CF6',
        icon: 'exhibition',
        isActive: true
      }
    ];

    for (const eventTypeData of eventTypes) {
      const existingType = await eventTypeModel.findOne({ name: eventTypeData.name });
      if (!existingType) {
        const eventType = new eventTypeModel(eventTypeData);
        await eventType.save();
        console.log(`✅ Тип события "${eventTypeData.name}" создан`);
      }
    }

    // 3. Создаем тестовые документы
    console.log('📄 Создаем тестовые документы...');
    const documents = [
      {
        title: 'Устав СРО АУ',
        description: 'Основной документ, регламентирующий деятельность саморегулируемой организации',
        category: 'regulatory',
        fileUrl: '/documents/ustav-sro-au.pdf',
        fileName: 'ustav-sro-au.pdf',
        originalName: 'Устав СРО АУ.pdf',
        fileSize: 2048576,
        fileType: 'pdf',
        mimeType: 'application/pdf',
        uploadedAt: new Date(),
        version: '1.0',
        isPublic: true,
        downloadCount: 156,
        tags: ['устав', 'регламент', 'основной'],
        metadata: {
          author: 'СРО АУ',
          publisher: 'СРО АУ',
          language: 'ru',
          pages: 45
        },
        createdBy: new Types.ObjectId(),
        updatedBy: new Types.ObjectId()
      },
      {
        title: 'Правила профессиональной деятельности',
        description: 'Правила осуществления профессиональной деятельности арбитражных управляющих',
        category: 'rules',
        fileUrl: '/documents/professional-rules.pdf',
        fileName: 'professional-rules.pdf',
        originalName: 'Правила профессиональной деятельности.pdf',
        fileSize: 1536000,
        fileType: 'pdf',
        mimeType: 'application/pdf',
        uploadedAt: new Date(),
        version: '2.1',
        isPublic: true,
        downloadCount: 89,
        tags: ['правила', 'профессиональная деятельность', 'арбитражные управляющие'],
        metadata: {
          author: 'СРО АУ',
          publisher: 'СРО АУ',
          language: 'ru',
          pages: 32
        },
        createdBy: new Types.ObjectId(),
        updatedBy: new Types.ObjectId()
      },
      {
        title: 'Отчет о деятельности за 2024 год',
        description: 'Годовой отчет о деятельности саморегулируемой организации',
        category: 'reports',
        fileUrl: '/documents/annual-report-2024.pdf',
        fileName: 'annual-report-2024.pdf',
        originalName: 'Отчет о деятельности за 2024 год.pdf',
        fileSize: 5120000,
        fileType: 'pdf',
        mimeType: 'application/pdf',
        uploadedAt: new Date(),
        version: '1.0',
        isPublic: true,
        downloadCount: 234,
        tags: ['отчет', '2024', 'деятельность', 'годовой'],
        metadata: {
          author: 'СРО АУ',
          publisher: 'СРО АУ',
          language: 'ru',
          pages: 128
        },
        createdBy: new Types.ObjectId(),
        updatedBy: new Types.ObjectId()
      },
      {
        title: 'Положение о компенсационном фонде',
        description: 'Положение о формировании и использовании компенсационного фонда',
        category: 'compensation-fund',
        fileUrl: '/documents/compensation-fund-regulation.pdf',
        fileName: 'compensation-fund-regulation.pdf',
        originalName: 'Положение о компенсационном фонде.pdf',
        fileSize: 1024000,
        fileType: 'pdf',
        mimeType: 'application/pdf',
        uploadedAt: new Date(),
        version: '1.2',
        isPublic: true,
        downloadCount: 67,
        tags: ['компенсационный фонд', 'положение', 'финансы'],
        metadata: {
          author: 'СРО АУ',
          publisher: 'СРО АУ',
          language: 'ru',
          pages: 28
        },
        createdBy: new Types.ObjectId(),
        updatedBy: new Types.ObjectId()
      }
    ];

    for (const docData of documents) {
      const existingDoc = await documentModel.findOne({ title: docData.title });
      if (!existingDoc) {
        const document = new documentModel(docData);
        await document.save();
        console.log(`✅ Документ "${docData.title}" создан`);
      }
    }

    // 4. Создаем тестовые дисциплинарные меры
    console.log('⚖️ Создаем дисциплинарные меры...');
    
    // Сначала получаем существующих арбитражных управляющих
    const managers = await arbitraryManagerModel.find().limit(3);
    if (managers.length > 0) {
      const disciplinaryMeasures = [
        {
          managerId: managers[0]._id,
          type: 'warning',
          reason: 'Нарушение сроков предоставления отчетности',
          date: new Date('2024-02-15'),
          decisionNumber: 'ДМ-2024-001',
          status: 'active',
          documents: [],
          appealDeadline: new Date('2024-03-15'),
          createdBy: new Types.ObjectId(),
          updatedBy: new Types.ObjectId()
        },
        {
          managerId: managers[1] ? managers[1]._id : managers[0]._id,
          type: 'reprimand',
          reason: 'Несоблюдение стандартов профессиональной деятельности',
          date: new Date('2024-04-20'),
          decisionNumber: 'ДМ-2024-002',
          status: 'active',
          documents: [],
          appealDeadline: new Date('2024-05-20'),
          createdBy: new Types.ObjectId(),
          updatedBy: new Types.ObjectId()
        },
        {
          managerId: managers[2] ? managers[2]._id : managers[0]._id,
          type: 'suspension',
          reason: 'Грубое нарушение профессиональной этики',
          date: new Date('2024-06-10'),
          decisionNumber: 'ДМ-2024-003',
          status: 'expired',
          documents: [],
          appealDeadline: new Date('2024-07-10'),
          createdBy: new Types.ObjectId(),
          updatedBy: new Types.ObjectId()
        }
      ];

      for (const measureData of disciplinaryMeasures) {
        const existingMeasure = await disciplinaryMeasureModel.findOne({ 
          decisionNumber: measureData.decisionNumber 
        });
        if (!existingMeasure) {
          const measure = new disciplinaryMeasureModel(measureData);
          await measure.save();
          console.log(`✅ Дисциплинарная мера "${measureData.decisionNumber}" создана`);
        }
      }
    } else {
      console.log('⚠️ Нет арбитражных управляющих для создания дисциплинарных мер');
    }

    console.log('🎉 Заполнение тестовыми данными завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка при заполнении данными:', error);
  } finally {
    await app.close();
  }
}

seedData();

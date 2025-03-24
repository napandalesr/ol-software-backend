import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TEST ol software')
    .setDescription('Documentación de la API para la gestión de comerciantes y establecimientos.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  app.enableCors()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();

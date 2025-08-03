import morgan from 'morgan';
import { Request, Response } from 'express';

// Кастомный формат логирования
morgan.token('body', (req: Request) => {
  // Не логируем чувствительные данные
  const sensitiveFields = ['password', 'token', 'receipt'];
  const body = { ...req.body };
  
  sensitiveFields.forEach(field => {
    if (body[field]) {
      body[field] = '[REDACTED]';
    }
  });
  
  return JSON.stringify(body);
});

// Формат для разработки
const devFormat = ':method :url :status :res[content-length] - :response-time ms :body';

// Формат для продакшена
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

export const loggerMiddleware = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat
);
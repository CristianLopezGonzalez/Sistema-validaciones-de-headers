# Security Scanner SaaS

## Requisitos
- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Instalación

1. Clonar repositorio
2. Instalar dependencias: `npm install`
3. Copiar variables de entorno: `cp .env.example .env`
4. Configurar `.env` con tus valores
5. Iniciar base de datos (Docker o cloud)
6. Migrar DB: `npm run prisma:migrate`
7. Iniciar servidor: `npm run dev`

## Scripts Disponibles
- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Producción
- `npm run lint` - Revisar código
- `npm run format` - Formatear código
- `npm run prisma:studio` - Abrir DB visual

## Variables de Entorno
Ver `.env.example` para lista completa

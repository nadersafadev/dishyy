import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClient = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismaClient
}

export const prisma = prismaClient

// Test database connection
prisma
  .$connect()
  .then(() => {
    console.log('Successfully connected to the database')
  })
  .catch((e) => {
    console.error('Failed to connect to the database:', e)
    process.exit(1)
  })

// Ensure connections are closed when the app is shutting down
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Handle errors
prisma.$on('error', (e) => {
  console.error('Prisma Client error:', e)
})

// Handle queries
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
  return result
})

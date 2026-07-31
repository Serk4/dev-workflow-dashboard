import type { PrismaClient } from '@prisma/client'
import { prisma } from './db.js'

export type Context = {
  prisma: PrismaClient
}

export const createContext = (): Context => ({ prisma })

import { PrismaClient } from "@prisma/client";
import { DeepMockProxy } from "jest-mock-extended";
import prisma from "@/utils/prisma/prisma";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

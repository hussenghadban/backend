import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = "your_secret_key";
export const resolvers = {
  Query: {
    getUsers: async () => {
      return await prisma.user.findMany();
    },
    getUser: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({ where: { id } });
    },
    getCategories: async () => {
      return await prisma.category.findMany();
    },
    getCategory: async (_: any, { id }: { id: string }) => {
      return await prisma.category.findUnique({ where: { id } });
    },
    getSubcategories: async () => {
      return await prisma.subcategory.findMany();
    },
    getSubcategory: async (_: any, { id }: { id: string }) => {
      return await prisma.subcategory.findUnique({ where: { id } });
    },
    getProducts: async () => {
      return await prisma.product.findMany({
        include: {
          category: true,      // Fetch related category
          subcategory: true,   // Fetch related subcategory
        },
      });
    },
    getProduct: async (_: any, { id }: { id: string }) => {
      return await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          subcategory: true,
        },
      });
    },
  },

  Mutation: {
    createUser: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
      return await prisma.user.create({ data: { name, email, password } });
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },
    
    deleteUser: async (_: any, { id }: { id: string }) => {
      await prisma.user.delete({ where: { id } });
      return "User deleted successfully!";
    },
    createCategory: async (_: any, { name, description }: { name: string; description?: string }) => {
      return await prisma.category.create({ data: { name, description } });
    },
    createSubcategory: async (_: any, { name, description }: { name: string; description?: string }) => {
      return await prisma.subcategory.create({ data: { name, description } });
    },
    createProduct: async (_: any, { name, description, price, categoryId, subcategoryId }: { name: string; description?: string; price: number; categoryId: string; subcategoryId?: string }) => {
      return await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
          subcategoryId,
        },
        include: {
          category: true,      // Ensure category is returned
          subcategory: true,   // Ensure subcategory is returned
        },
      });
    },
   deleteCategory: async (_: any, { id }: { id: string }) => {
    try {
      // Delete all products associated with this category first
      await prisma.product.deleteMany({ where: { categoryId: id } });

      // Delete the category
      await prisma.category.delete({ where: { id } });

      return "Category deleted successfully!";
    } catch (error: any) {
      throw new Error("Failed to delete category: " + error.message);
    }
  },

  deleteSubcategory: async (_: any, { id }: { id: string }) => {
    try {
      // Delete all products associated with this subcategory first
      await prisma.product.deleteMany({ where: { subcategoryId: id } });

      // Delete the subcategory
      await prisma.subcategory.delete({ where: { id } });

      return "Subcategory deleted successfully!";
    } catch (error: any) {
      throw new Error("Failed to delete subcategory: " + error.message);
    }
  },

  deleteProduct: async (_: any, { id }: { id: string }) => {
    try {
      await prisma.product.delete({ where: { id } });
      return "Product deleted successfully!";
    } catch (error: any) {
      throw new Error("Failed to delete product: " + error.message);
    }
  },
  },
};

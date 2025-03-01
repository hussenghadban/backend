"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = "your_secret_key";
exports.resolvers = {
    Query: {
        getUsers: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.user.findMany();
        }),
        getUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield prisma.user.findUnique({ where: { id } });
        }),
        getCategories: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.category.findMany();
        }),
        getCategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield prisma.category.findUnique({ where: { id } });
        }),
        getSubcategories: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.subcategory.findMany();
        }),
        getSubcategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield prisma.subcategory.findUnique({ where: { id } });
        }),
        getProducts: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.product.findMany({
                include: {
                    category: true, // Fetch related category
                    subcategory: true, // Fetch related subcategory
                },
            });
        }),
        getProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield prisma.product.findUnique({
                where: { id },
                include: {
                    category: true,
                    subcategory: true,
                },
            });
        }),
    },
    Mutation: {
        createUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, email, password }) {
            return yield prisma.user.create({ data: { name, email, password } });
        }),
        login: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error("User not found");
            }
            const isValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isValid) {
                throw new Error("Invalid password");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });
            return { token, user };
        }),
        deleteUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            yield prisma.user.delete({ where: { id } });
            return "User deleted successfully!";
        }),
        createCategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, description }) {
            return yield prisma.category.create({ data: { name, description } });
        }),
        createSubcategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, description }) {
            return yield prisma.subcategory.create({ data: { name, description } });
        }),
        createProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, description, price, categoryId, subcategoryId }) {
            return yield prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    categoryId,
                    subcategoryId,
                },
                include: {
                    category: true, // Ensure category is returned
                    subcategory: true, // Ensure subcategory is returned
                },
            });
        }),
        deleteCategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            yield prisma.category.delete({ where: { id } });
            return "Category deleted successfully!";
        }),
        deleteSubcategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            yield prisma.subcategory.delete({ where: { id } });
            return "Subcategory deleted successfully!";
        }),
        deleteProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            yield prisma.product.delete({ where: { id } });
            return "Product deleted successfully!";
        }),
    },
};

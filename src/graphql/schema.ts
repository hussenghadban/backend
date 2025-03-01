import { gql } from "apollo-server-express";
export const typeDefs = gql`
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: String!
}
type AuthPayload {
  token: String!
  user: User!
}

type Category {
  id: ID!
  name: String!
  description: String
  products: [Product!]!
}

type Subcategory {
  id: ID!
  name: String!
  description: String
  products: [Product!]!
}

type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  category: Category
  subcategory: Subcategory
}

type Query {
  getUsers: [User!]!
  getUser(id: ID!): User
  getCategories: [Category!]!
  getCategory(id: ID!): Category
  getSubcategories: [Subcategory!]!
  getSubcategory(id: ID!): Subcategory
  getProducts: [Product!]!
  getProduct(id: ID!): Product
}

type Mutation {
 login(email: String!, password: String!): AuthPayload!
  createUser(name: String!, email: String!, password: String!): User!
  deleteUser(id: ID!): String!
  createCategory(name: String!, description: String): Category!
  createSubcategory(name: String!, description: String): Subcategory!
  createProduct(name: String!, description: String, price: Float!, categoryId: ID!, subcategoryId: ID): Product!
  deleteCategory(id: ID!): String!
  deleteSubcategory(id: ID!): String!
  deleteProduct(id: ID!): String!
}
`;

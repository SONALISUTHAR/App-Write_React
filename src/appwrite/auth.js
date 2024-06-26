import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client;
  account;

  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userId = ID.unique();

      const userAccount = await this.account.create(
        userId,
        email,
        password,
        name
      );

      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error(
        "Appwrite service :: getCurrentUser :: error",
        error.message,
        error.stack
      );
    }

    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log(" Appwrite services :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;

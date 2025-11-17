import { Prisma, PrismaClient } from "@repo/database";

class DB {
    private prisma: PrismaClient;
    private isConnected: boolean = false;

    constructor() {
        this.prisma = new PrismaClient();
        this.init_connection();
    }

    private async init_connection() {
        try {
            await this.prisma.$connect();
            this.isConnected = true;
            console.log("Database connected");
        } catch (error) {
            console.error("Failed to connect to database", error);
            return;
        }
    }

    public async getUserById(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });
            return user;
        } catch (error) {
            console.error("Error fetching user", error);
            return null;
        }
    }

    public async createUser(data: Prisma.UserCreateInput) {
        try {
           const user = await this.prisma.user.create({
            data :{
                name : data.name,
                email : data.email,
                password : data.password,
                photo : data.photo
            }
           })
            return user;
        } catch (error) {
            console.error("Error creating user", error);
            return null;
        }
    }

    public async updateUser(userId: string, data: Prisma.UserUpdateInput) {
        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data
            });
            return user;
        } catch (error) {
            console.error("Error updating user", error);
            return null;
        }
    }

    public async deleteUser(userId: string) {
        try {
            await this.prisma.user.delete({
                where: { id: userId }
            });
            return true;
        } catch (error) {
            console.error("Error deleting user", error);
            return false;
        }
    }


    public async disconnect() {
        try {
            await this.prisma.$disconnect();
            console.log("Database disconnected");
        } catch (error) {
            console.error("Failed to disconnect database", error);
        }
    }
}

export default DB;

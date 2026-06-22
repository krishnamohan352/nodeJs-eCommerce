import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { createRoleAndPermission } from "./utils/createRoleAndPermission.js";
import { createAdminUser } from "./utils/adminUserSeed.js";

const port = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB();

        await createRoleAndPermission();
        await createAdminUser();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error("Server startup error:", error);
    }
};

startServer();
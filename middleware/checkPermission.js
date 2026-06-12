import User from "../models/userModel.js";
import Role from "../models/roleModel.js";

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).populate({
        path: "role",
        populate: {
          path: "permissions",
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userPermissions = user.role.permissions.map(
        (p) => p.name
      );

      const hasPermission =
        userPermissions.includes(requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({
          message: "Forbidden: no permission",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

export { checkPermission };
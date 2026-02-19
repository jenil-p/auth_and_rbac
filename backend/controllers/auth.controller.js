import User from "../models/users.model.js";
import Role from "../models/role.model.js";
import { createTokenForUser } from "../services/authentication.js";

// register
export async function createUser(req, res) {
  try {
    const { fullname, email, password } = req.body;

    const userRole = await Role.findOne({ name: "user" });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ fullname, email, password, role: userRole._id, });

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User creation failed" });
  }
}

// log in in system
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false }).populate("role").select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createTokenForUser(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
}

// get the user
export async function getUser(req, res) {
  return res.status(200).json({ user: req.user });
}

// log out
export async function logOutHelper(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
}

// delete user (only admin can do delete user)
export async function deleteUser(req, res, next) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = true;
    await user.save();

    req.objectId = userId;

    res.status(200).json({ message: "User deleted" });

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
}

import bcrypt from "bcrypt";
import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, image = "", role = "user" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (image) {
      const imageMatch = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
      if (!imageMatch || Buffer.from(imageMatch[1], "base64").byteLength > 5 * 1024 * 1024) {
        return res.status(400).json({
          message: "Profile image must be a JPEG, PNG, or WebP smaller than 5 MB",
        });
      }
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" || normalizedEmail.includes("admin") ? "admin" : "user";

    const newUser = new User({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: hashedPassword,
      image,
      role: userRole,
    });

    await newUser.save();

    const accessToken = jwt.sign(
      { id: newUser._id, email: newUser.email, role: userRole },
      process.env.JWT_ACCESS_SECRET || "default_jwt_secret_elora",
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: newUser._id, email: newUser.email, role: userRole },
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret_elora",
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const userRole = user.role || (normalizedEmail.includes("admin") ? "admin" : "user");
    
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: userRole },
      process.env.JWT_ACCESS_SECRET || "default_jwt_secret_elora",
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: userRole },
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret_elora",
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: userRole,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email image role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile Fetched",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role || "user",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

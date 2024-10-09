import express from "express";
import prisma from "../auth";
import bcrypt from "argon2";
import jwt from "jsonwebtoken";

const router = express.Router();

// @route   POST /api/admin/create
// @desc    Create a new admin
// @access  Private/Admin
router.post("/create", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password,
        role: role || "admin",
      },
    });
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(400).json({ message: "Error creating admin", error });
  }
});

// @route   POST /api/admin/login
// @desc    Login admin and return token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    if (admin) {
      const isMatch = await bcrypt.verify(admin.password, password);
      if (isMatch) {
        const token = jwt.sign(
          { id: admin.id, role: admin.role },
          process.env.JWT_SECRET || "secret",
          { expiresIn: "1h" } // Token expires in 1 hour
        );

        res.status(200).json({
          token, // Return token to the client
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        });
      } else {
        res.status(400).json({ message: "Invalid email or password" });
      }
    }
    res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}); // Login route

// @route   GET /api/admin/admins
// @desc    Get all admins
// @access  Private/Admin
router.get("/admins", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/admin/admin/:id
// @desc    Get an admin by ID
// @access  Private/Admin
router.get("/admin/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const admin = await prisma.admin.findUnique({
      where: {
        id,
      },
    });
    if (!admin) {
      res.status(400).json({ message: "Admin not found" });
    }
    res.status(201).json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   PUT /api/admin/edit/:id
// @desc    Edit an admin by ID
// @access  Private/Admin
router.put("/edit/:id", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const id = Number(req.params.id);
    let admin = await prisma.admin.findUnique({
      where: {
        id,
      },
    });
    if (admin) {
      admin = await prisma.admin.update({
        where: {
          id,
        },
        data: {
          name: name || admin.name,
          email: email || admin.email,
          password: password || admin.password,
          role: role || admin.role,
        },
      });
      res.status(201).json({ message: "Admin updated successfully", admin });
    }
    res.status(400).json({ message: "Admin not found" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   DELETE /api/admin/admin/:id
// @desc    Delete an admin by ID
// @access  Private/Admin
router.delete("/admin/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const admin = await prisma.admin.delete({
            where: {
                id
            }
        });
        if(admin){
            res.status(200).json({message: 'Admin deleted successfully', admin})
        }
        res.status(400).json({message: "Admin not found"})
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
});

export default router;

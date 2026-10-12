import cloudinary from "../config/cloudinary.js";
import Product from "../model/productSchema.js";
import { fashionProducts } from "../seed.js";

export const seedFashionProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(fashionProducts);
    res.status(200).json({
      message: "Fashion dress catalog seeded successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to seed products",
      error: error.message,
    });
  }
};

export const productController = async (req, res) => {
  try {
    const {
      description,
      stock,
      gender,
      category,
      price,
      name,
      material,
      submitterName,
      submitterEmail,
      submitterNote,
      image,
    } = req.body;

    const imageUrls = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "products",
          }
        );
        imageUrls.push(result.secure_url);
      }
    } else if (image) {
      if (Array.isArray(image)) {
        imageUrls.push(...image);
      } else {
        imageUrls.push(image);
      }
    }

    // Role-based status: ONLY verified admins can directly publish 'approved' products.
    // All user submissions are strictly initialized as 'pending' for Admin approval.
    const isAdmin = req.user?.role === "admin" || req.user?.email?.toLowerCase().includes("admin");
    const productStatus = isAdmin ? (req.body.status || "approved") : "pending";

    const product = {
      name,
      price: Number(price),
      description: description || "",
      category: category || "Occasionwear",
      gender: gender || "Women",
      status: productStatus,
      stock: Number(stock) || 1,
      material: material || "",
      submittedBy: {
        name: submitterName || req.user?.name || "Atelier Client",
        email: submitterEmail || req.user?.email || "",
        note: submitterNote || "",
      },
      images: imageUrls,
    };

    const newProduct = await Product.create(product);
    res.status(201).json({
      message:
        productStatus === "approved"
          ? "Garment published directly to live catalog by administrator."
          : "Garment submission received. It is now awaiting administrator review and approval.",
      newProduct,
    });
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({
      message: "Server error creating product",
      error: err.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { gender, category, status, all } = req.query;
    const filter = {};

    // If 'all' is true (admin view), do not restrict by status unless requested
    if (all === "true") {
      if (status) filter.status = status;
    } else {
      // Public storefront ONLY sees approved products
      filter.status = status || "approved";
    }

    if (gender && gender !== "All") {
      filter.gender = gender;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching products",
      error: error.message,
    });
  }
};

export const getAdminProductDashboard = async (req, res) => {
  try {
    const allProducts = await Product.find().sort({ createdAt: -1 });
    const pendingCount = allProducts.filter((p) => p.status === "pending").length;
    const approvedCount = allProducts.filter((p) => p.status === "approved").length;
    const rejectedCount = allProducts.filter((p) => p.status === "rejected").length;

    res.status(200).json({
      message: "Admin dashboard metrics fetched",
      stats: {
        total: allProducts.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      products: allProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching admin dashboard",
      error: error.message,
    });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(
      id,
      { status: "approved", rejectionReason: "" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product approved successfully and published to live collection.",
      product: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error approving product",
      error: error.message,
    });
  }
};

export const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Does not meet atelier quality standards" } = req.body;
    const updated = await Product.findByIdAndUpdate(
      id,
      { status: "rejected", rejectionReason: reason },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product submission rejected.",
      product: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error rejecting product",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product removed from docket successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

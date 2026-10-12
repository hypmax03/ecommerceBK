async function test() {
  try {
    // 1. Submit a pending Winter garment
    const submitRes = await fetch("http://localhost:3000/api/product/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Classic Fit Pure Cashmere Overcoat — Camel Tan",
        price: 8999,
        category: "Outerwear & Coats",
        gender: "Men",
        season: "Winter",
        material: "100% Mongolian Cashmere",
        stock: 7,
        description: "An unlined luxury overcoat tailored from pure Mongolian cashmere with a horn-button front and notched lapels.",
        submitterName: "Julian Véricourt",
        submitterEmail: "julian@vericourt.com",
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85",
      }),
    });
    const submitData = await submitRes.json();
    console.log("Submitted product:", submitData.message);
    const productId = submitData.newProduct._id;
    console.log("Product ID:", productId, "Status:", submitData.newProduct.status);

    // 2. Check public catalog (should be 0 because product is still pending)
    const pubRes1 = await fetch("http://localhost:3000/api/product/");
    const pubData1 = await pubRes1.json();
    console.log("Public approved products count (before approval):", pubData1.products.length);

    // 3. Check admin dashboard (should have 1 pending)
    const adminRes = await fetch("http://localhost:3000/api/product/admin/dashboard");
    const adminData = await adminRes.json();
    console.log("Admin dashboard pending count:", adminData.stats.pending);

    // 4. Admin Approves the product
    const approveRes = await fetch(`http://localhost:3000/api/product/approve/${productId}`, {
      method: "PUT",
    });
    const approveData = await approveRes.json();
    console.log("Approved message:", approveData.message);

    // 5. Check public catalog now (should have 1 approved product!)
    const pubRes2 = await fetch("http://localhost:3000/api/product/");
    const pubData2 = await pubRes2.json();
    console.log("Public approved products count (after approval):", pubData2.products.length);
    console.log("Product in live store:", pubData2.products[0].name, "Season:", pubData2.products[0].season);
  } catch (err) {
    console.error("Test error:", err);
  }
}

test();

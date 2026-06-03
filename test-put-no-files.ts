import fetch from "node-fetch";
import FormData from "form-data";

async function test() {
  const formData = new FormData();
  formData.append('name', 'Retro Space');
  formData.append('category', 'classic');
  formData.append('price', '150000');
  formData.append('config_json', JSON.stringify({ gallery: [] }));
  formData.append('thumbnail', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809');

  try {
    const res = await fetch("http://localhost:3000/api/admin/themes/test-id-123", {
      method: "PUT",
      body: formData
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

test();

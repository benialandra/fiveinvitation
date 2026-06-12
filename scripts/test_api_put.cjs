async function testPut() {
  const form = new FormData();
  form.append('groom_name', 'test_groom');
  form.append('bride_name', 'test_bride');
  form.append('customizations', JSON.stringify({
    font: 'Great Vibes',
    color: '#8F9779',
    groom_image: 'https://example.com/api_groom.jpg',
    bride_image: 'https://example.com/api_bride.jpg'
  }));

  try {
    const res = await fetch('http://localhost:3000/api/orders/INV-RUO5VQ', {
      method: 'PUT',
      body: form
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Error connecting to server:", err);
  }
}

testPut();

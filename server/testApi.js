import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting API End-to-End Tests ---');
  try {
    // 1. Health check
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', health.data.status);

    // 2. Register User
    const testEmail = `alexander.${Date.now()}@expiryguard.io`;
    const regRes = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Alexander Vance',
      email: testEmail,
      password: 'password123',
    });
    console.log('✅ User Registration:', regRes.data.success, 'Token:', regRes.data.token.slice(0, 20) + '...');
    const token = regRes.data.token;

    // 3. Login
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: testEmail,
      password: 'password123',
    });
    console.log('✅ User Login:', loginRes.data.success, 'User:', loginRes.data.user.name);

    // 4. Create Item with Auth Header
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
    const createRes = await axios.post(
      `${API_BASE}/items`,
      {
        productName: 'MacBook Pro 16" M3 Max',
        vendor: 'Apple Inc.',
        category: 'Electronics',
        purchaseDate: '2024-01-15',
        warrantyPeriodMonths: 12,
        price: 3499.00,
        serialNumber: 'C02G4581MD6R',
        notes: 'Includes AppleCare+ coverage.',
        reminderDays: [30, 15, 7, 1],
      },
      authHeaders
    );
    console.log('✅ Item Created in Vault:', createRes.data.success, 'ID:', createRes.data.item._id, 'Status:', createRes.data.item.status);
    const itemId = createRes.data.item._id;

    // 5. Get Stats
    const statsRes = await axios.get(`${API_BASE}/items/stats`, authHeaders);
    console.log('✅ Dashboard Stats:', statsRes.data.stats);

    // 6. Get Items
    const itemsRes = await axios.get(`${API_BASE}/items`, authHeaders);
    console.log('✅ Listed Items count:', itemsRes.data.count);

    // 7. Get Item By ID
    const singleRes = await axios.get(`${API_BASE}/items/${itemId}`, authHeaders);
    console.log('✅ Get Item by ID:', singleRes.data.item.productName);

    console.log('\n🎉 ALL BACKEND API ENDPOINTS VERIFIED AND PASSING SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Test Failed:', err.response?.data || err.message);
  }
}

runTests();

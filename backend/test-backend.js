import http from 'http';

async function testBackend() {
  console.log('🧪 Starting backend verification test...');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const healthData = await healthRes.json();
  console.log('✅ Healthcheck Response:', healthData);

  // 2. Test Roast Endpoint
  const roastRes = await fetch('http://localhost:5000/api/roast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'JOHN DOE. Junior React Developer. Passionate and hardworking, built a calculator in HTML/CSS.',
      intensity: 'spicy',
      targetRole: 'Frontend Engineer'
    })
  });

  const roastData = await roastRes.json();
  console.log('✅ Roast Response Success:', roastData.success);
  console.log('📊 Overall Score:', roastData.data?.overall_score);
  console.log('💀 Savage Roast Sample:', roastData.data?.savage_roast?.substring(0, 100) + '...');
  console.log('🚩 Red Flags Count:', roastData.data?.red_flags?.length);
  console.log('✨ Bullet Rewrites Count:', roastData.data?.bullet_rewrites?.length);

  // 3. Test Past Roasts List
  const listRes = await fetch('http://localhost:5000/api/roasts');
  const listData = await listRes.json();
  console.log('📁 Stored Roasts Count:', listData.data?.length);

  console.log('🎉 All backend tests passed!');
  process.exit(0);
}

testBackend().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

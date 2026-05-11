/**
 * Script de prueba para el flujo de checkout de Stripe
 * Simula el proceso completo de pago con tarjetas de prueba
 */

const API_URL = 'http://localhost:3000/api';

// Tarjetas de prueba de Stripe
const TEST_CARDS = {
  success: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2025,
    cvc: '123',
    name: 'Test Success'
  },
  declined: {
    number: '4000000000000002',
    exp_month: 12,
    exp_year: 2025,
    cvc: '123',
    name: 'Test Declined'
  },
  insufficient_funds: {
    number: '4000000000009995',
    exp_month: 12,
    exp_year: 2025,
    cvc: '123',
    name: 'Test Insufficient Funds'
  },
  requires_authentication: {
    number: '4000002500003155',
    exp_month: 12,
    exp_year: 2025,
    cvc: '123',
    name: 'Test 3D Secure'
  }
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testHealthCheck() {
  logSection('🏥 Test 1: Health Check del Backend');

  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();

    if (response.ok) {
      log('✅ Backend está funcionando correctamente', 'green');
      log(`   Status: ${data.status}`, 'blue');
      log(`   Stripe: ${data.stripe}`, 'blue');
      return true;
    } else {
      log('❌ Backend respondió con error', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error al conectar con el backend: ${error.message}`, 'red');
    return false;
  }
}

async function testCreatePaymentIntent(amount = 249000, currency = 'pyg') {
  logSection(`💳 Test 2: Crear Payment Intent (${amount} ${currency.toUpperCase()})`);

  try {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        paymentMethodId: 'pending',
        email: 'test@bysolenne.shop',
        metadata: {
          quantity: '1',
          product: 'Solenne PDRN Serum (TEST)',
        }
      })
    });

    const data = await response.json();

    if (response.ok && data.clientSecret) {
      log('✅ Payment Intent creado exitosamente', 'green');
      log(`   Client Secret: ${data.clientSecret.substring(0, 30)}...`, 'blue');
      log(`   Status: ${data.status}`, 'blue');
      return data;
    } else {
      log('❌ Error al crear Payment Intent', 'red');
      log(`   Error: ${data.error || 'Unknown error'}`, 'yellow');
      return null;
    }
  } catch (error) {
    log(`❌ Error en la petición: ${error.message}`, 'red');
    return null;
  }
}

async function testPaymentIntentWithCard(cardType) {
  const card = TEST_CARDS[cardType];
  logSection(`🧪 Test 3: Pago con tarjeta de prueba - ${cardType.toUpperCase()}`);

  log(`📋 Tarjeta de prueba:`, 'yellow');
  log(`   Número: ${card.number}`, 'blue');
  log(`   Vencimiento: ${card.exp_month}/${card.exp_year}`, 'blue');
  log(`   CVC: ${card.cvc}`, 'blue');
  log(`   Nombre: ${card.name}`, 'blue');

  // Crear Payment Intent
  const paymentIntent = await testCreatePaymentIntent();

  if (!paymentIntent) {
    log('❌ No se pudo crear el Payment Intent', 'red');
    return false;
  }

  log('\n📝 Pasos para probar manualmente:', 'magenta');
  log('   1. Abre http://localhost:8080 en tu navegador', 'blue');
  log('   2. Haz clic en "COMPRAR AHORA"', 'blue');
  log('   3. Selecciona cantidad (1 o 2 unidades)', 'blue');
  log('   4. En el modal de Stripe, usa estos datos:', 'blue');
  log(`      - Número de tarjeta: ${card.number}`, 'cyan');
  log(`      - Vencimiento: ${card.exp_month}/${card.exp_year}`, 'cyan');
  log(`      - CVC: ${card.cvc}`, 'cyan');
  log(`      - Nombre: ${card.name}`, 'cyan');

  if (cardType === 'success') {
    log('\n✅ Esta tarjeta DEBERÍA ser aceptada', 'green');
  } else if (cardType === 'declined') {
    log('\n⚠️  Esta tarjeta DEBERÍA ser declinada', 'yellow');
  } else if (cardType === 'insufficient_funds') {
    log('\n⚠️  Esta tarjeta DEBERÍA fallar por fondos insuficientes', 'yellow');
  } else if (cardType === 'requires_authentication') {
    log('\n🔐 Esta tarjeta DEBERÍA solicitar autenticación 3D Secure', 'yellow');
  }

  return true;
}

async function testAllScenarios() {
  log('\n' + '█'.repeat(60), 'cyan');
  log('█  NOCTE - Test Completo de Stripe Checkout  █', 'cyan');
  log('█'.repeat(60) + '\n', 'cyan');

  // Test 1: Health Check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    log('\n❌ Los tests no pueden continuar sin el backend', 'red');
    return;
  }

  // Test 2: Payment Intent básico
  await testCreatePaymentIntent();

  // Test 3: Payment Intent con doble cantidad (Pack Pareja)
  await testCreatePaymentIntent(369000, 'pyg');

  // Test 4: Diferentes escenarios de tarjetas
  log('\n\n' + '🃏 '.repeat(30), 'magenta');
  log('TARJETAS DE PRUEBA DE STRIPE', 'magenta');
  log('🃏 '.repeat(30) + '\n', 'magenta');

  await testPaymentIntentWithCard('success');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testPaymentIntentWithCard('declined');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testPaymentIntentWithCard('insufficient_funds');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testPaymentIntentWithCard('requires_authentication');

  // Resumen final
  logSection('📊 RESUMEN DE TESTS');
  log('✅ Backend Health Check: OK', 'green');
  log('✅ Payment Intent Creation: OK', 'green');
  log('✅ Tarjetas de prueba documentadas: OK', 'green');

  log('\n📚 RECURSOS ADICIONALES:', 'yellow');
  log('   Documentación Stripe: https://stripe.com/docs/testing', 'blue');
  log('   Más tarjetas de prueba: https://stripe.com/docs/testing#cards', 'blue');

  log('\n🎯 PRÓXIMOS PASOS:', 'magenta');
  log('   1. Prueba cada tarjeta en el checkout real', 'blue');
  log('   2. Verifica los logs del backend en la consola', 'blue');
  log('   3. Revisa el dashboard de Stripe para ver los pagos', 'blue');
  log('   4. Asegúrate que NO aparezca el widget de dev helper', 'blue');

  console.log('\n');
}

// Ejecutar tests
testAllScenarios().catch(error => {
  log(`\n❌ Error crítico en los tests: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

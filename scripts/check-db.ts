/**
 * Script de diagnóstico para verificar dados no banco
 * Run: npx tsx scripts/check-db.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI não definida. Configure no .env.local');
  process.exit(1);
}

async function checkDB() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    console.log('   URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado!\n');

    const db = mongoose.connection.db!;

    // Check tenants
    const tenants = await db.collection('tenants').find({}).toArray();
    console.log(`📦 Tenants encontrados: ${tenants.length}`);
    tenants.forEach(t => {
      console.log(`   - ${t.slug}: ${t.name} (active: ${t.active})`);
    });

    // Check users
    const users = await db.collection('users').find({}).toArray();
    console.log(`\n👥 Usuários encontrados: ${users.length}`);
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.role}) - active: ${u.active}`);
      console.log(`     passwordHash: ${u.passwordHash ? 'SET' : 'MISSING!'}`);
    });

    // Check machines
    const machines = await db.collection('machines').find({}).toArray();
    console.log(`\n⚙️ Máquinas encontradas: ${machines.length}`);

    // Check work orders
    const workOrders = await db.collection('workorders').find({}).toArray();
    console.log(`📋 Ordens de serviço encontradas: ${workOrders.length}`);

    console.log('\n✅ Diagnóstico concluído!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDB();

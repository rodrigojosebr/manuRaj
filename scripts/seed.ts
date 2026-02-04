/**
 * Seed script for manuRaj
 * Creates a demo tenant with users, machines, work orders, and preventive plans
 *
 * Run with: npm run db:seed
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI não definida!');
  console.error('   Configure a variável MONGODB_URI no arquivo .env.local');
  console.error('   Exemplo: mongodb+srv://usuario:senha@cluster.mongodb.net/manuraj?retryWrites=true&w=majority');
  process.exit(1);
}

// Schemas
const tenantSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  plan: { type: String, default: 'free' },
  adsEnabled: { type: Boolean, default: true },
  adUnitIds: [String],
  active: { type: Boolean, default: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  name: String,
  email: String,
  passwordHash: String,
  role: String,
  active: { type: Boolean, default: true },
}, { timestamps: true });

const machineSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  name: String,
  code: String,
  location: String,
  manufacturer: String,
  model: String,
  serial: String,
  status: { type: String, default: 'operational' },
}, { timestamps: true });

const workOrderSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
  type: { type: String, enum: ['corrective', 'preventive', 'request'] },
  status: { type: String, enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  startedAt: Date,
  finishedAt: Date,
  timeSpentMin: Number,
  partsUsed: [{
    name: String,
    qty: Number,
    unit: String,
  }],
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, collection: 'work_orders' });

const preventivePlanSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
  name: String,
  periodicityDays: Number,
  checklistItems: [{
    label: String,
    required: Boolean,
  }],
  nextDueDate: Date,
  active: { type: Boolean, default: true },
}, { timestamps: true, collection: 'preventive_plans' });

const Tenant = mongoose.model('Tenant', tenantSchema);
const User = mongoose.model('User', userSchema);
const Machine = mongoose.model('Machine', machineSchema);
const WorkOrder = mongoose.model('WorkOrder', workOrderSchema);
const PreventivePlan = mongoose.model('PreventivePlan', preventivePlanSchema);

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Tenant.deleteMany({}),
      User.deleteMany({}),
      Machine.deleteMany({}),
      WorkOrder.deleteMany({}),
      PreventivePlan.deleteMany({}),
    ]);

    // Create demo tenant
    console.log('🏢 Creating demo tenant...');
    const tenant = await Tenant.create({
      name: 'Indústria Demo Ltda',
      slug: 'demo',
      plan: 'free',
      adsEnabled: true,
      adUnitIds: ['banner-1', 'rail-1'],
      active: true,
    });

    // Hash password
    const passwordHash = await bcrypt.hash('demo1234', 12);

    // Create users with different roles
    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        tenantId: tenant._id,
        name: 'Carlos Silva',
        email: 'admin@demo.com',
        passwordHash,
        role: 'general_supervisor',
        active: true,
      },
      {
        tenantId: tenant._id,
        name: 'Ana Santos',
        email: 'supervisor@demo.com',
        passwordHash,
        role: 'maintenance_supervisor',
        active: true,
      },
      {
        tenantId: tenant._id,
        name: 'João Oliveira',
        email: 'joao@demo.com',
        passwordHash,
        role: 'maintainer',
        active: true,
      },
      {
        tenantId: tenant._id,
        name: 'Pedro Costa',
        email: 'pedro@demo.com',
        passwordHash,
        role: 'maintainer',
        active: true,
      },
      {
        tenantId: tenant._id,
        name: 'Maria Fernandes',
        email: 'maria@demo.com',
        passwordHash,
        role: 'operator',
        active: true,
      },
      {
        tenantId: tenant._id,
        name: 'Lucas Almeida',
        email: 'lucas@demo.com',
        passwordHash,
        role: 'operator',
        active: true,
      },
    ]);

    const supervisor = users[1];
    const maintainer1 = users[2];
    const maintainer2 = users[3];

    // Create sample machines
    console.log('⚙️ Creating machines...');
    const machines = await Machine.insertMany([
      {
        tenantId: tenant._id,
        name: 'Torno CNC Romi',
        code: 'TRN-001',
        location: 'Galpão A - Setor 1',
        manufacturer: 'ROMI',
        model: 'D800',
        serial: 'ROM2023001',
        status: 'operational',
      },
      {
        tenantId: tenant._id,
        name: 'Fresadora Universal',
        code: 'FRS-001',
        location: 'Galpão A - Setor 2',
        manufacturer: 'Diplomat',
        model: 'FU250',
        serial: 'DIP2022045',
        status: 'operational',
      },
      {
        tenantId: tenant._id,
        name: 'Centro de Usinagem',
        code: 'CUS-001',
        location: 'Galpão A - Setor 3',
        manufacturer: 'Mazak',
        model: 'VCN-530C',
        serial: 'MAZ2021089',
        status: 'operational',
      },
      {
        tenantId: tenant._id,
        name: 'Compressor de Ar',
        code: 'CMP-001',
        location: 'Casa de Máquinas',
        manufacturer: 'Schulz',
        model: 'SRP 3020',
        serial: 'SCH2020112',
        status: 'maintenance',
      },
      {
        tenantId: tenant._id,
        name: 'Ponte Rolante 10T',
        code: 'PNT-001',
        location: 'Galpão B',
        manufacturer: 'ABUS',
        model: 'ZLK 10000',
        serial: 'ABU2019034',
        status: 'operational',
      },
      {
        tenantId: tenant._id,
        name: 'Prensa Hidráulica',
        code: 'PRS-001',
        location: 'Galpão B - Setor 1',
        manufacturer: 'Marcon',
        model: 'MPH-100',
        serial: 'MAR2020056',
        status: 'operational',
      },
      {
        tenantId: tenant._id,
        name: 'Retífica Cilíndrica',
        code: 'RET-001',
        location: 'Galpão A - Setor 4',
        manufacturer: 'Zema',
        model: 'Numerika G800',
        serial: 'ZEM2018023',
        status: 'stopped',
      },
    ]);

    // Create work orders
    console.log('📋 Creating work orders...');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await WorkOrder.insertMany([
      // Completed work order
      {
        tenantId: tenant._id,
        machineId: machines[0]._id,
        type: 'corrective',
        status: 'completed',
        priority: 'high',
        description: 'Substituição de rolamento do eixo principal. Máquina apresentando vibração excessiva.',
        assignedTo: maintainer1._id,
        dueDate: twoDaysAgo,
        startedAt: twoDaysAgo,
        finishedAt: yesterday,
        timeSpentMin: 180,
        partsUsed: [
          { name: 'Rolamento SKF 6205', qty: 2, unit: 'un' },
          { name: 'Graxa especial', qty: 1, unit: 'kg' },
        ],
        notes: 'Substituição realizada com sucesso. Máquina voltou a operar normalmente.',
        createdBy: supervisor._id,
      },
      // In progress work order
      {
        tenantId: tenant._id,
        machineId: machines[3]._id,
        type: 'corrective',
        status: 'in_progress',
        priority: 'critical',
        description: 'Compressor não está pressurizando corretamente. Verificar válvulas e pistões.',
        assignedTo: maintainer2._id,
        dueDate: today,
        startedAt: today,
        createdBy: supervisor._id,
      },
      // Assigned work order
      {
        tenantId: tenant._id,
        machineId: machines[1]._id,
        type: 'preventive',
        status: 'assigned',
        priority: 'medium',
        description: 'Manutenção preventiva mensal. Verificar níveis de óleo, lubrificação geral e limpeza.',
        assignedTo: maintainer1._id,
        dueDate: tomorrow,
        createdBy: supervisor._id,
      },
      // Open work orders
      {
        tenantId: tenant._id,
        machineId: machines[2]._id,
        type: 'corrective',
        status: 'open',
        priority: 'high',
        description: 'Erro no painel CNC. Código E-42. Máquina parou durante operação.',
        dueDate: today,
        createdBy: supervisor._id,
      },
      {
        tenantId: tenant._id,
        machineId: machines[5]._id,
        type: 'request',
        status: 'open',
        priority: 'low',
        description: 'Vazamento de óleo hidráulico detectado na base da prensa. Solicito verificação.',
        dueDate: nextWeek,
        createdBy: users[4]._id, // Operator
      },
      {
        tenantId: tenant._id,
        machineId: machines[4]._id,
        type: 'preventive',
        status: 'open',
        priority: 'medium',
        description: 'Inspeção trimestral de cabos e talha. Verificar desgaste e certificações.',
        dueDate: nextWeek,
        createdBy: supervisor._id,
      },
      // Overdue work order
      {
        tenantId: tenant._id,
        machineId: machines[6]._id,
        type: 'corrective',
        status: 'open',
        priority: 'high',
        description: 'Retífica não liga. Verificar sistema elétrico e motor principal.',
        dueDate: twoDaysAgo,
        createdBy: supervisor._id,
      },
    ]);

    // Create preventive plans
    console.log('📅 Creating preventive plans...');
    const in15Days = new Date(today);
    in15Days.setDate(in15Days.getDate() + 15);
    const in5Days = new Date(today);
    in5Days.setDate(in5Days.getDate() + 5);
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);
    const overdue = new Date(today);
    overdue.setDate(overdue.getDate() - 3);

    await PreventivePlan.insertMany([
      {
        tenantId: tenant._id,
        machineId: machines[0]._id,
        name: 'Lubrificação Quinzenal - Torno CNC',
        periodicityDays: 15,
        checklistItems: [
          { label: 'Verificar nível de óleo do cabeçote', required: true },
          { label: 'Lubrificar guias lineares', required: true },
          { label: 'Verificar pressão do sistema hidráulico', required: true },
          { label: 'Limpar filtros de ar', required: false },
          { label: 'Verificar tensão das correias', required: false },
        ],
        nextDueDate: in15Days,
        active: true,
      },
      {
        tenantId: tenant._id,
        machineId: machines[1]._id,
        name: 'Manutenção Mensal - Fresadora',
        periodicityDays: 30,
        checklistItems: [
          { label: 'Verificar e completar nível de óleo', required: true },
          { label: 'Inspecionar rolamentos do fuso', required: true },
          { label: 'Verificar alinhamento da mesa', required: true },
          { label: 'Testar sistema de refrigeração', required: true },
          { label: 'Limpar cavacos acumulados', required: false },
        ],
        nextDueDate: in5Days,
        active: true,
      },
      {
        tenantId: tenant._id,
        machineId: machines[2]._id,
        name: 'Verificação Semanal - Centro de Usinagem',
        periodicityDays: 7,
        checklistItems: [
          { label: 'Verificar níveis de fluido de corte', required: true },
          { label: 'Limpar magazine de ferramentas', required: true },
          { label: 'Testar troca automática de ferramentas', required: true },
          { label: 'Verificar pressão pneumática', required: true },
        ],
        nextDueDate: overdue,
        active: true,
      },
      {
        tenantId: tenant._id,
        machineId: machines[3]._id,
        name: 'Manutenção Trimestral - Compressor',
        periodicityDays: 90,
        checklistItems: [
          { label: 'Trocar óleo do compressor', required: true },
          { label: 'Substituir filtro de ar', required: true },
          { label: 'Verificar válvulas de segurança', required: true },
          { label: 'Drenar condensado do reservatório', required: true },
          { label: 'Verificar correias', required: true },
          { label: 'Testar pressostato', required: false },
        ],
        nextDueDate: in30Days,
        active: true,
      },
      {
        tenantId: tenant._id,
        machineId: machines[4]._id,
        name: 'Inspeção Trimestral - Ponte Rolante',
        periodicityDays: 90,
        checklistItems: [
          { label: 'Inspecionar cabos de aço', required: true },
          { label: 'Verificar ganchos e travas de segurança', required: true },
          { label: 'Testar freios', required: true },
          { label: 'Verificar fim de curso', required: true },
          { label: 'Lubrificar trilhos e rodas', required: true },
          { label: 'Testar botoeira de emergência', required: true },
        ],
        nextDueDate: in30Days,
        active: true,
      },
    ]);

    console.log('\n===========================================');
    console.log('✅ Seed completed successfully!');
    console.log('===========================================');
    console.log('\n📊 Data created:');
    console.log('  - 1 Tenant: Indústria Demo Ltda (slug: demo)');
    console.log('  - 6 Users (all roles)');
    console.log('  - 7 Machines');
    console.log('  - 7 Work Orders (various statuses)');
    console.log('  - 5 Preventive Plans');
    console.log('\n👤 Users (password: demo1234):');
    console.log('  - admin@demo.com (Supervisor Geral)');
    console.log('  - supervisor@demo.com (Supervisor Manutenção)');
    console.log('  - joao@demo.com (Manutentor)');
    console.log('  - pedro@demo.com (Manutentor)');
    console.log('  - maria@demo.com (Operador)');
    console.log('  - lucas@demo.com (Operador)');
    console.log('\n🚀 To start:');
    console.log('  1. npm run dev');
    console.log('  2. Open http://localhost:3000/login');
    console.log('  3. Tenant: demo');
    console.log('  4. Use any email above with password: demo1234');
    console.log('===========================================\n');

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

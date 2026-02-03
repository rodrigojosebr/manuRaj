// MongoDB initialization script
// Creates the manuraj database and user

db = db.getSiblingDB('manuraj');

// Create indexes for performance and tenant isolation

// Tenants
db.tenants.createIndex({ slug: 1 }, { unique: true });
db.tenants.createIndex({ active: 1 });

// Users
db.users.createIndex({ tenantId: 1, email: 1 }, { unique: true });
db.users.createIndex({ tenantId: 1, role: 1 });
db.users.createIndex({ tenantId: 1, active: 1 });

// Machines
db.machines.createIndex({ tenantId: 1, code: 1 }, { unique: true });
db.machines.createIndex({ tenantId: 1, status: 1 });
db.machines.createIndex({ tenantId: 1, location: 1 });

// Machine Documents
db.machine_documents.createIndex({ tenantId: 1, machineId: 1 });
db.machine_documents.createIndex({ tenantId: 1, type: 1 });

// Work Orders
db.work_orders.createIndex({ tenantId: 1, status: 1 });
db.work_orders.createIndex({ tenantId: 1, machineId: 1 });
db.work_orders.createIndex({ tenantId: 1, assignedTo: 1 });
db.work_orders.createIndex({ tenantId: 1, type: 1 });
db.work_orders.createIndex({ tenantId: 1, dueDate: 1 });
db.work_orders.createIndex({ tenantId: 1, createdAt: -1 });

// Preventive Plans
db.preventive_plans.createIndex({ tenantId: 1, machineId: 1 });
db.preventive_plans.createIndex({ tenantId: 1, active: 1 });
db.preventive_plans.createIndex({ tenantId: 1, nextDueDate: 1 });

print('manuRaj database initialized with indexes');

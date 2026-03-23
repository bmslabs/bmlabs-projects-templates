#!/usr/bin/env node

/**
 * Ejecutable de Prompts - App React Template
 * 
 * Este archivo permite ejecutar diferentes prompts de Copilot
 * y ver los resultados de forma interactiva.
 * 
 * Uso:
 *   node prompts.js
 *   npm run prompts
 * 
 * O seleccionar un prompt específico:
 *   node prompts.js --prompt component-button
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

// Prompts disponibles
const prompts = {
  // ============ COMPONENTES ============
  'component-button': {
    title: 'Crear Componente Button',
    skill: 'fe-create-component',
    prompt: '@copilot /fe-create-component Button type:ui props:"label, onClick, disabled, variant" styles:tailwind',
    description: 'Buttoncomponente reutilizable con variantes',
    category: 'Components',
  },
  'component-input': {
    title: 'Crear Componente Input',
    skill: 'fe-create-component',
    prompt: '@copilot /fe-create-component Input type:form props:"label, value, onChange, type, error, placeholder" styles:tailwind',
    description: 'Componente Input para formularios',
    category: 'Components',
  },
  'component-modal': {
    title: 'Crear Componente Modal',
    skill: 'fe-create-component',
    prompt: '@copilot /fe-create-component Modal type:ui props:"isOpen, onClose, title, children" styles:tailwind',
    description: 'Componente Modal reutilizable',
    category: 'Components',
  },
  'component-notification': {
    title: 'Crear Componente Toast Notification',
    skill: 'fe-create-component',
    prompt: '@copilot /fe-create-component Toast type:ui props:"message, type, duration, onClose" styles:tailwind',
    description: 'Componente para notificaciones toast',
    category: 'Components',
  },

  // ============ SERVICIOS API ============
  'service-product': {
    title: 'Crear API Service para Productos',
    skill: 'fe-create-api-service',
    prompt: '@copilot /fe-create-api-service productService entity:Product endpoints:"search, getByCategory, getOnSale"',
    description: 'Servicio completo para operaciones CRUD de productos',
    category: 'Services',
  },
  'service-user': {
    title: 'Crear API Service para Usuarios',
    skill: 'fe-create-api-service',
    prompt: '@copilot /fe-create-api-service userService entity:User endpoints:"getCurrentUser, updateProfile, changePassword, uploadAvatar"',
    description: 'Servicio para gestión de usuarios',
    category: 'Services',
  },
  'service-order': {
    title: 'Crear API Service para Órdenes',
    skill: 'fe-create-api-service',
    prompt: '@copilot /fe-create-api-service orderService entity:Order endpoints:"getMyOrders, cancelOrder, getOrderDetails, trackOrder"',
    description: 'Servicio para gestión de órdenes/pedidos',
    category: 'Services',
  },

  // ============ DATAGRID ============
  'datagrid-product': {
    title: 'Crear DataGrid para Productos',
    skill: 'fe-create-datagrid',
    prompt: '@copilot /fe-create-datagrid ProductDataGrid entity:Product columns:"name,price,category,stock" actions:"edit,delete,detail"',
    description: 'Tabla con búsqueda, filtrado y acciones',
    category: 'DataGrid',
  },
  'datagrid-user': {
    title: 'Crear DataGrid para Usuarios',
    skill: 'fe-create-datagrid',
    prompt: '@copilot /fe-create-datagrid UserDataGrid entity:User columns:"email,name,role,status" actions:"edit,delete,changeRole"',
    description: 'Tabla de usuarios con gestión de roles',
    category: 'DataGrid',
  },
  'datagrid-order': {
    title: 'Crear DataGrid para Órdenes',
    skill: 'fe-create-datagrid',
    prompt: '@copilot /fe-create-datagrid OrderDataGrid entity:Order columns:"id,customer,total,status,date" actions:"detail,cancel,refund"',
    description: 'Tabla de órdenes con historial',
    category: 'DataGrid',
  },

  // ============ HOOKS ============
  'hook-usecrud-product': {
    title: 'Crear Hook useCrud para Productos',
    skill: 'fe-create-hooks',
    prompt: '@copilot /fe-create-hooks useProduct type:crud entity:Product service:productService',
    description: 'Hook para lógica CRUD de productos',
    category: 'Hooks',
  },
  'hook-useform': {
    title: 'Crear Hook useForm',
    skill: 'fe-create-hooks',
    prompt: '@copilot /fe-create-hooks useForm type:form',
    description: 'Hook genérico para manejo de formularios',
    category: 'Hooks',
  },
  'hook-useapi': {
    title: 'Crear Hook useApi',
    skill: 'fe-create-hooks',
    prompt: '@copilot /fe-create-hooks useApi type:api',
    description: 'Hook genérico para peticiones HTTP',
    category: 'Hooks',
  },

  // ============ FLUJOS COMPLETOS ============
  'flow-crud-usuarios': {
    title: 'Flujo Completo: CRUD de Usuarios',
    description: 'Crear todos los componentes para un CRUD de usuarios',
    category: 'Complete Flows',
    steps: [
      '@copilot /fe-create-api-service userService entity:User',
      '@copilot /fe-create-hooks useUser type:crud entity:User service:userService',
      '@copilot /fe-create-component UserForm type:form props:"user, onSubmit"',
      '@copilot /fe-create-datagrid UserDataGrid entity:User columns:"email,name,role" actions:"edit,delete"',
      '@copilot /fe-create-page UserList',
    ],
  },
  'flow-crud-productos': {
    title: 'Flujo Completo: CRUD de Productos',
    description: 'Crear todos los componentes para un CRUD de productos',
    category: 'Complete Flows',
    steps: [
      '@copilot /fe-create-api-service productService entity:Product endpoints:"search,getByCategory"',
      '@copilot /fe-create-hooks useProduct type:crud entity:Product service:productService',
      '@copilot /fe-create-component ProductForm type:form props:"product, onSubmit"',
      '@copilot /fe-create-datagrid ProductDataGrid entity:Product columns:"name,price,stock" actions:"edit,delete,detail"',
      '@copilot /fe-create-page ProductList',
    ],
  },
};

// Agrupar por categoría
const promptsByCategory = {};
Object.entries(prompts).forEach(([key, data]) => {
  const category = data.category || 'Other';
  if (!promptsByCategory[category]) {
    promptsByCategory[category] = [];
  }
  promptsByCategory[category].push({ key, ...data });
});

// Crear interfaz readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para preguntar
const question = (q) => {
  return new Promise((resolve) => {
    rl.question(q, resolve);
  });
};

// Imprimir header
const printHeader = () => {
  console.clear();
  console.log(`
${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}
${colors.bright}${colors.cyan}║     GitHub Copilot Prompts - App React Template            ║${colors.reset}
${colors.bright}${colors.cyan}║     Ejecuta prompts para generar código                    ║${colors.reset}
${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);
};

// Imprimir menú principal
const printMainMenu = () => {
  printHeader();
  console.log(`${colors.bright}Selecciona una categoría:${colors.reset}\n`);

  const categories = Object.keys(promptsByCategory).sort();
  categories.forEach((cat, index) => {
    const count = promptsByCategory[cat].length;
    console.log(`${colors.blue}[${index + 1}]${colors.reset} ${cat} (${count} prompts)`);
  });

  console.log(`${colors.blue}[0]${colors.reset} Salir\n`);
};

// Imprimir prompts de una categoría
const printCategoryMenu = (category) => {
  printHeader();
  console.log(`${colors.bright}${category}${colors.reset}\n`);

  const items = promptsByCategory[category];
  items.forEach((item, index) => {
    console.log(`${colors.green}[${index + 1}]${colors.reset} ${item.title}`);
    console.log(`   ${colors.dim}${item.description}${colors.reset}`);
  });

  console.log(`\n${colors.blue}[0]${colors.reset} Volver al menú\n`);
};

// Imprimir detalles del prompt
const printPromptDetails = (promptData) => {
  printHeader();
  console.log(`${colors.bright}${promptData.title}${colors.reset}\n`);
  console.log(`${colors.dim}Descripción:${colors.reset}`);
  console.log(`  ${promptData.description}\n`);

  if (promptData.steps) {
    console.log(`${colors.dim}Pasos a ejecutar:${colors.reset}`);
    promptData.steps.forEach((step, i) => {
      console.log(`  ${colors.green}${i + 1}.${colors.reset} ${step}`);
    });
  } else {
    console.log(`${colors.dim}Skill:${colors.reset} ${promptData.skill}`);
    console.log(`${colors.dim}Prompt:${colors.reset}`);
    console.log(`  ${colors.cyan}${promptData.prompt}${colors.reset}`);
  }

  console.log(`\n${colors.dim}Para ejecutar este prompt:${colors.reset}`);
  if (promptData.steps) {
    console.log(`${colors.cyan}Copia y pega cada paso en la conversación de Copilot${colors.reset}`);
  } else {
    console.log(`${colors.cyan}1. Abre GitHub Copilot Chat${colors.reset}`);
    console.log(`${colors.cyan}2. Copia el prompt arriba${colors.reset}`);
    console.log(`${colors.cyan}3. Pégalo en la conversación${colors.reset}`);
  }

  console.log(`\n${colors.dim}Para entender el skill:${colors.reset}`);
  console.log(`${colors.cyan}Lee: .github/skills/${promptData.skill}.md${colors.reset}`);
};

// Ciclo principal
const main = async () => {
  let running = true;

  while (running) {
    printMainMenu();
    const categoryIndex = await question(
      `${colors.bright}Selecciona una opción:${colors.reset} `
    );

    if (categoryIndex === '0') {
      running = false;
      console.log(`\n${colors.green}¡Hasta luego!${colors.reset}\n`);
      break;
    }

    const categories = Object.keys(promptsByCategory).sort();
    const selectedCategory = categories[parseInt(categoryIndex) - 1];

    if (!selectedCategory) {
      console.log(`\n${colors.red}Opción inválida${colors.reset}\n`);
      await question('Presiona Enter para continuar...');
      continue;
    }

    let categoryRunning = true;
    while (categoryRunning) {
      printCategoryMenu(selectedCategory);
      const promptIndex = await question(
        `${colors.bright}Selecciona una opción:${colors.reset} `
      );

      if (promptIndex === '0') {
        categoryRunning = false;
        continue;
      }

      const items = promptsByCategory[selectedCategory];
      const selectedItem = items[parseInt(promptIndex) - 1];

      if (!selectedItem) {
        console.log(`\n${colors.red}Opción inválida${colors.reset}\n`);
        await question('Presiona Enter para continuar...');
        continue;
      }

      printPromptDetails(selectedItem);

      const action = await question(
        `\n${colors.bright}${colors.green}[1]${colors.reset} Copiar prompt  ${colors.green}[2]${colors.reset} Detalles  ${colors.green}[0]${colors.reset} Volver: `
      );

      if (action === '1') {
        if (selectedItem.prompt) {
          console.log(`\n${colors.green}✓ Prompt copiado al portapapeles:${colors.reset}`);
          console.log(`${colors.cyan}${selectedItem.prompt}${colors.reset}\n`);
        } else if (selectedItem.steps) {
          console.log(`\n${colors.green}✓ Pasos copiados:${colors.reset}`);
          selectedItem.steps.forEach((step) => {
            console.log(`${colors.cyan}${step}${colors.reset}`);
          });
        }
        await question(`\nPresiona Enter para continuar...`);
      } else if (action === '2') {
        console.log(`\n${colors.bright}Detalles ${selectedItem.title}:${colors.reset}`);
        console.log(`${colors.dim}Categoría:${colors.reset} ${selectedCategory}`);
        console.log(`${colors.dim}Skill:${colors.reset} ${selectedItem.skill || 'N/A'}`);

        if (selectedItem.steps) {
          console.log(`${colors.dim}Pasos totales:${colors.reset} ${selectedItem.steps.length}`);
        }

        console.log(`\n${colors.dim}Lee más en:${colors.reset}`);
        if (selectedItem.skill) {
          console.log(`${colors.cyan}.github/skills/${selectedItem.skill}.md${colors.reset}`);
        }
        console.log(`${colors.cyan}AGENTS.md${colors.reset}`);
        console.log(`${colors.cyan}.github/copilot-instructions.md${colors.reset}`);

        await question(`\nPresiona Enter para continuar...`);
      }
    }
  }

  rl.close();
};

// Ejecutar
main().catch(console.error);

# BMS Labs - AI Playbook

Colección de templates y playbooks de desarrollo asistido con **GitHub Copilot**, diseñados para acelerar la construcción de proyectos robustos, seguros y mantenibles en distintas tecnologías.

Cada template incluye configuración especializada de Copilot (instrucciones, skills y prompts) para que la IA genere código consistente y de calidad desde el primer día.

---

## Módulos

| Módulo | Tecnología | Descripción |
|--------|------------|-------------|
| [`api-dotnet/`](api-dotnet/README.md) | ASP.NET Core (.NET 8+) | Template para APIs backend RESTful con arquitectura por capas |
| [`app-react/`](app-react/README.md) | React | Template para aplicaciones móviles React |
| [`view-vuejs/`](view-vuejs/README.md) | Vue 3 + TypeScript | Template para frontends web con Vue 3, Pinia y Zod |

---

## Cómo usar un template

Cada módulo está diseñado para ser incluido como **submódulo Git** en tu proyecto:

```bash
# Ejemplo para la API .NET
git submodule add -b main https://github.com/bmslabs/bmlabs-ai-playbook-api-dotnet .github

# Ejemplo para el frontend Vue.js
git submodule add -b main https://github.com/bmslabs/bmlabs-ai-playbook-view-vuejs .github
```

Una vez integrado, el submódulo queda disponible en `.github/`, donde Copilot leerá automáticamente las instrucciones, skills y prompts del template.

---

## api-dotnet

Template para construir APIs backend con **ASP.NET Core**. Implementa arquitectura por capas con patrones consolidados y desarrollo guiado por Copilot.

**Tecnologías principales:** .NET 8+ · Entity Framework Core · AutoMapper · FluentValidation · Swagger

**Flujo de trabajo:**

```
Entity → DTOs → Validators → Mappings → Repository → Service → Controller
```

**Skills disponibles:**

| Skill | Descripción |
|-------|-------------|
| `be-create-entities` | Entidades EF Core con configuración |
| `be-create-dtos` | DTOs completos con validación |
| `be-create-validators` | FluentValidation rules |
| `be-create-mappings` | AutoMapper profiles |
| `be-create-repository` | Repositories con patrones estándar |
| `be-create-service` | Services con herencia de CrudService base |
| `be-create-controller` | Controllers siguiendo convenciones del proyecto |

**Primer paso:** ejecutar el prompt `Genesis` para inicializar el proyecto:

```bash
@copilot /Genesis projectName=mi-proyecto-api
```

---

## app-react

Template para construir **aplicaciones móviles con React**. Estructurado para ser robusto, seguro y mantenible.

---

## view-vuejs

Template para construir frontends web con **Vue 3 + TypeScript**. Incluye 16 prompts y 11 skills para generación de módulos completos desde cero o desde un Swagger.

**Tecnologías principales:** Vue 3 · TypeScript estricto · Pinia · Vue Router · Zod · Tailwind CSS

**Flujo recomendado desde Swagger:**

```
SetupProjectBase → GenerateFromSwagger → Módulos completos listos
```

**Prompts disponibles (selección):**

| Prompt | Descripción |
|--------|-------------|
| `M.-SetupProjectBase` | Bootstrap completo: Auth, Layout y Router |
| `Z.-GenerateFromSwagger` | Stack completo desde OpenAPI en una sola invocación |
| `L.-GenerateFullStackWorkflow` | Orquesta 6 prompts: Types → Validator → Service → Composable → Modal → DataGrid |
| `C.-CreateDataGrid` | Vista CRUD completa con patrón 12/3 |
| `H.-CreateForm` | Modal de formulario con validación Zod |
| `O.-ChangeProjectColors` | Actualizar tema de colores de forma consistente |

**Agentes disponibles:**

| Agente | Descripción |
|--------|-------------|
| `BM Builder` | Orquesta generación full-stack Vue 3 end-to-end |
| `Explore` | Exploración rápida del codebase |

---

## Contribución

Todas las contribuciones se realizan a través de **Pull Requests**. Consulta [CONTRIBUTIONS.md](CONTRIBUTIONS.md) para el proceso detallado.

```bash
# 1. Fork + clonar
git clone https://github.com/tu-usuario/bmlabs-ai-playbook.git

# 2. Crear branch
git checkout -b feature/nombre-de-tu-feature

# 3. Push + abrir PR
git push origin feature/nombre-de-tu-feature
```

# Platziflix — Guía de Desarrollo

Plataforma de cursos online estilo Netflix con arquitectura multi-plataforma. El **backend es la única fuente de verdad** — todos los clientes consumen la misma API REST.

---

## Estructura del Monorepo

```
claude-code/
├── Backend/                # API FastAPI + PostgreSQL (Docker)
├── Frontend/               # App web Next.js 15
└── Mobile/
    ├── PlatziFlixAndroid/  # App Kotlin + Jetpack Compose
    └── PlatziFlixiOS/      # App Swift + SwiftUI
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL 15, Docker, UV |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript strict, SCSS + CSS Modules, Vitest |
| **Android** | Kotlin, Jetpack Compose, Material3, Retrofit + OkHttp, Coroutines, Coil |
| **iOS** | Swift, SwiftUI, URLSession, Combine, async/await |

---

## URLs y Puertos

| Servicio | URL |
|---|---|
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Frontend Web | http://localhost:3000 |
| PostgreSQL | localhost:5432 |
| Android → API | http://10.0.2.2:8000 (emulador) |
| iOS → API | http://localhost:8000 |

---

## Comandos de Desarrollo

### Backend
```bash
cd Backend
make start            # Levanta Docker Compose (db + api)
make stop             # Detiene los containers
make restart          # Reinicia los containers
make logs             # Ver logs en tiempo real
make migrate          # Aplica migraciones Alembic
make create-migration # Genera nueva migración
make seed             # Carga datos de prueba
make seed-fresh       # Limpia DB y recarga datos de prueba
```

> Cualquier comando de backend se ejecuta **dentro del container Docker**.
> Antes de ejecutar, verificar que el container esté corriendo con `make logs`.

### Frontend
```bash
cd Frontend
yarn dev     # Dev server con Turbopack en :3000
yarn build   # Build de producción
yarn test    # Ejecutar tests con Vitest
yarn lint    # ESLint
```

---

## Base de Datos

### Credenciales Docker
```
Usuario:   platziflix_user
Password:  platziflix_password
Database:  platziflix_db
Puerto:    5432
```

### Modelos y Relaciones

```
Course (slug único, SEO-friendly)
├── name, description, thumbnail (URL), slug
├── M:M ──► Teacher  (via tabla course_teachers)
├── 1:M ──► Lesson   (cascade delete)
└── 1:M ──► CourseRating (cascade delete)

Teacher
└── name, email (único)

Lesson
└── course_id (FK), name, description, slug, video_url

CourseRating
└── course_id (FK), user_id, rating (1-5, check constraint)
    Unique: (course_id, user_id, deleted_at) — un rating activo por usuario por curso

BaseModel (todos los modelos heredan de aquí)
└── id, created_at, updated_at, deleted_at (soft delete)
```

### Migraciones Alembic
- Ubicación: `Backend/app/alembic/versions/`
- `d18a08253457` — Schema inicial: courses, teachers, lessons, course_teachers
- `0e3a8766f785` — Agrega tabla course_ratings con soft delete

---

## API Endpoints Completos

### Cursos
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Bienvenida |
| `GET` | `/health` | Health check + conectividad DB |
| `GET` | `/courses` | Lista todos los cursos con promedio de rating |
| `GET` | `/courses/{slug}` | Detalle de curso: profesores + lecciones + stats de rating |
| `GET` | `/classes/{class_id}` | Detalle de una lección/clase con video |

### Ratings (CRUD completo)
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/courses/{course_id}/ratings` | Crear o actualizar rating (upsert) |
| `GET` | `/courses/{course_id}/ratings` | Todos los ratings activos de un curso |
| `GET` | `/courses/{course_id}/ratings/stats` | Promedio, total y distribución 1-5 |
| `GET` | `/courses/{course_id}/ratings/user/{user_id}` | Rating de un usuario específico |
| `PUT` | `/courses/{course_id}/ratings/{user_id}` | Actualizar rating existente |
| `DELETE` | `/courses/{course_id}/ratings/{user_id}` | Soft delete del rating |

---

## Estructura del Backend

```
Backend/app/
├── main.py              # FastAPI app + todos los endpoints
├── core/config.py       # Settings con pydantic-settings (.env)
├── db/
│   ├── base.py          # Engine SQLAlchemy + SessionLocal + get_db()
│   └── seed.py          # Datos de prueba (3 cursos, 3 profesores, 6 lecciones)
├── models/
│   ├── base.py          # BaseModel con timestamps y soft delete
│   ├── course.py        # Modelo Course + propiedades average_rating, total_ratings
│   ├── teacher.py       # Modelo Teacher
│   ├── lesson.py        # Modelo Lesson
│   ├── course_rating.py # Modelo CourseRating con to_dict()
│   └── course_teacher.py# Tabla asociativa M:M
├── schemas/rating.py    # Pydantic schemas: RatingRequest, RatingResponse, RatingStatsResponse
├── services/
│   └── course_service.py# Lógica de negocio: CourseService (get, create, update, delete, stats)
├── alembic/versions/    # Migraciones de DB
└── tests/               # Tests con pytest + httpx
```

---

## Estructura del Frontend

```
Frontend/src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # / — Grid de cursos
│   ├── course/[slug]/
│   │   ├── page.tsx              # /course/:slug — Detalle del curso
│   │   ├── error.tsx             # Error boundary
│   │   ├── loading.tsx           # Skeleton loader
│   │   └── not-found.tsx         # 404
│   └── classes/[class_id]/
│       └── page.tsx              # /classes/:id — Video player
├── components/
│   ├── Course/Course.tsx         # Card del curso (thumbnail + rating)
│   ├── CourseDetail/             # Vista completa del curso con lecciones
│   ├── StarRating/               # Estrellas SVG (half-star, tamaños: sm/md/lg)
│   └── VideoPlayer/              # Wrapper del elemento <video>
├── services/ratingsApi.ts        # Cliente HTTP para ratings (timeout 10s, ApiError)
├── types/
│   ├── index.ts                  # Course, Class, CourseDetail, Progress, Quiz
│   └── rating.ts                 # CourseRating, RatingStats, RatingRequest, ApiError
└── styles/
    ├── vars.scss                 # Variables de color y funciones (color('primary'))
    └── reset.scss                # CSS reset
```

### Rutas del Frontend
| Ruta | Componente | Datos que pide |
|---|---|---|
| `/` | `page.tsx` | `GET /courses` |
| `/course/[slug]` | `CourseDetail` | `GET /courses/{slug}` |
| `/classes/[class_id]` | `VideoPlayer` | `GET /classes/{id}` |

### Colores principales (vars.scss)
```
primary:       #ff2d2d  (Platzi rojo)
text-primary:  #111
text-secondary:#222
white:         #fff
```

---

## Estructura Mobile

### Android (`PlatziFlixAndroid/`)
```
com.espaciotiago.platziflixandroid/
├── MainActivity.kt              # Entry point, inyecta ViewModel
├── data/
│   ├── entities/CourseDTO.kt    # DTO de la API (Gson @SerializedName)
│   ├── network/
│   │   ├── ApiService.kt        # Interface Retrofit: GET /courses
│   │   └── NetworkModule.kt     # Retrofit singleton, base URL 10.0.2.2:8000
│   ├── mappers/CourseMapper.kt  # CourseDTO → Course (dominio)
│   └── repositories/
│       ├── RemoteCourseRepository.kt
│       └── MockCourseRepository.kt  # 10% error rate, delay 1.5s
├── domain/
│   ├── models/Course.kt         # Entidad de dominio (inmutable)
│   └── repositories/CourseRepository.kt # Interface
├── presentation/courses/
│   ├── viewmodel/CourseListViewModel.kt # StateFlow<CourseListUiState>
│   ├── screen/CourseListScreen.kt       # Composable principal
│   ├── components/CourseCard.kt         # Card con Coil AsyncImage
│   └── state/CourseListUiState.kt       # UiState + UiEvent sealed classes
├── ui/theme/                    # Material3: Color, Type, Spacing, Theme
└── di/AppModule.kt              # Service locator (flag USE_MOCK_DATA)
```

### iOS (`PlatziFlixiOS/`)
```
PlatziFlixiOS/
├── PlatziFlixiOSApp.swift       # @main, WindowGroup → ContentView
├── ContentView.swift            # Root → CourseListView
├── Data/
│   ├── Entities/                # CourseDTO, ClassDTO, CourseDetailDTO, TeacherDTO (Codable)
│   ├── Mapper/                  # CourseMapper, ClassMapper, TeacherMapper
│   └── Repositories/
│       ├── RemoteCourseRepository.swift
│       └── CourseAPIEndpoints.swift  # GET /courses, GET /courses/{slug}
├── Domain/
│   ├── Models/                  # Course, Class, Teacher (structs, Identifiable)
│   └── Repositories/CourseRepositoryProtocol.swift
├── Presentation/
│   ├── ViewModels/CourseListViewModel.swift  # @MainActor, @Published, búsqueda
│   └── Views/
│       ├── CourseListView.swift   # NavigationView + LazyVStack + search + pull-to-refresh
│       ├── CourseCardView.swift   # AsyncImage 16:9 + cardStyle modifier
│       └── DesignSystem.swift     # Colores, spacing, tipografía, ViewModifiers
└── Services/
    ├── NetworkManager.swift       # URLSession wrapper, singleton
    ├── NetworkService.swift       # Protocol genérico para decodificación
    ├── NetworkError.swift         # Enum de errores con LocalizedError
    └── HTTPMethod.swift           # GET, POST, PUT, DELETE, PATCH
```

---

## Patrones de Arquitectura

| Patrón | Dónde se usa |
|---|---|
| **Service Layer** | Backend: `CourseService` centraliza la lógica de negocio |
| **Repository Pattern** | Android e iOS: separa la fuente de datos de la UI |
| **DTO → Domain Mapper** | Android (`CourseMapper.kt`) e iOS (`CourseMapper.swift`) |
| **Soft Delete** | Backend: campo `deleted_at` en todos los modelos |
| **MVVM** | Android (`ViewModel` + `StateFlow`) e iOS (`@ObservableObject` + `@Published`) |
| **Server Components** | Frontend: data fetching en servidor, sin JS en cliente para datos |
| **Dependency Injection** | Backend: `Depends()` de FastAPI / Android: `AppModule` / iOS: constructor |

---

## Convenciones de Código

| Ámbito | Convención |
|---|---|
| Python (Backend) | `snake_case` para variables, funciones y archivos |
| TypeScript (Frontend) | `camelCase` variables, `PascalCase` componentes |
| Kotlin (Android) | `camelCase` variables, `PascalCase` clases |
| Swift (iOS) | `camelCase` variables, `PascalCase` tipos |
| API responses | `snake_case` en JSON (`created_at`, `teacher_id`) |
| URL slugs | `kebab-case` (`react-avanzado`) |

---

## Testing

| Proyecto | Framework | Archivos de test |
|---|---|---|
| Backend | pytest + httpx | `Backend/app/tests/` + `test_main.py` |
| Frontend | Vitest + React Testing Library | `src/components/**/__tests__/` |
| Android | JUnit4 + Coroutines Test | `app/src/test/` y `androidTest/` |
| iOS | XCTest | `PlatziFlixiOSTests/` y `PlatziFlixiOSUITests/` |

---

## Reglas de Desarrollo

1. **Docker obligatorio** — El backend no corre fuera de Docker. Siempre `make start` primero.
2. **Verificar container antes de ejecutar comandos** — revisar Makefile para los comandos disponibles.
3. **Migraciones para todo cambio de DB** — nunca modificar tablas manualmente, siempre `make create-migration`.
4. **TypeScript strict** — no usar `any`, tipar todo explícitamente en el Frontend.
5. **Tests requeridos** para funcionalidades nuevas en todos los proyectos.
6. **API REST es la única fuente de datos** — ningún cliente guarda estado en local storage como fuente de verdad.
7. **No agregar columnas sin soft delete** — todos los modelos deben mantener `deleted_at`.
8. **Variables de entorno**: Frontend usa `NEXT_PUBLIC_API_URL` para la URL del backend.

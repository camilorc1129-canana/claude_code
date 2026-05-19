"""
Seed data script for Platziflix database.
This script creates sample data for testing and development.
"""

from datetime import datetime
from sqlalchemy.orm import Session
from app.db.base import SessionLocal
from app.models import Teacher, Course, Lesson, course_teachers
from app.models.course_rating import CourseRating
from app.core.config import settings


def create_sample_data():
    """Create sample data for testing."""
    db: Session = SessionLocal()

    try:
        # Create sample teachers
        teacher1 = Teacher(
            name="Juan Pérez",
            email="juan.perez@platziflix.com",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        teacher2 = Teacher(
            name="María García",
            email="maria.garcia@platziflix.com",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        teacher3 = Teacher(
            name="Carlos Rodríguez",
            email="carlos.rodriguez@platziflix.com",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        teacher4 = Teacher(
            name="Ana Martínez",
            email="ana.martinez@platziflix.com",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        teacher5 = Teacher(
            name="Luis Fernández",
            email="luis.fernandez@platziflix.com",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        db.add_all([teacher1, teacher2, teacher3, teacher4, teacher5])
        db.commit()

        # Create sample courses
        course1 = Course(
            name="Curso de React",
            description="Aprende React desde cero hasta convertirte en un desarrollador profesional",
            thumbnail="https://images.unsplash.com/photo-1653387141060-9a9834f47777?w=600&h=400&fit=crop",
            slug="curso-de-react",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        course2 = Course(
            name="Curso de Python",
            description="Domina Python y sus frameworks más populares",
            thumbnail="https://images.unsplash.com/photo-1660616246653-e2c57d1077b9?w=600&h=400&fit=crop",
            slug="curso-de-python",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        course3 = Course(
            name="Curso de JavaScript",
            description="JavaScript moderno y sus mejores prácticas",
            thumbnail="https://images.unsplash.com/photo-1653387137517-fbc54d488ed8?w=600&h=400&fit=crop",
            slug="curso-de-javascript",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        course4 = Course(
            name="Curso de TypeScript",
            description="Escala tus proyectos JavaScript con tipado estático y herramientas avanzadas",
            thumbnail="https://images.unsplash.com/photo-1699885960867-56d5f5262d38?w=600&h=400&fit=crop",
            slug="curso-de-typescript",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        course5 = Course(
            name="Curso de Docker",
            description="Conteneriza, despliega y escala aplicaciones con Docker y sus herramientas",
            thumbnail="https://images.unsplash.com/photo-1639066648921-82d4500abf1a?w=600&h=400&fit=crop",
            slug="curso-de-docker",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        course6 = Course(
            name="Curso de Git y GitHub",
            description="Controla el historial de tus proyectos y colabora con equipos usando Git y GitHub",
            thumbnail="https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=400&fit=crop",
            slug="curso-de-git-y-github",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        db.add_all([course1, course2, course3, course4, course5, course6])
        db.commit()

        # Assign teachers to courses (many-to-many)
        course1.teachers.append(teacher1)
        course1.teachers.append(teacher2)
        course2.teachers.append(teacher2)
        course2.teachers.append(teacher3)
        course3.teachers.append(teacher1)
        course3.teachers.append(teacher3)
        course4.teachers.append(teacher1)
        course4.teachers.append(teacher4)
        course5.teachers.append(teacher5)
        course5.teachers.append(teacher3)
        course6.teachers.append(teacher2)
        course6.teachers.append(teacher4)

        db.commit()

        # Create sample lessons
        lessons_data = [
            # React course lessons
            {
                "course": course1,
                "name": "Introducción a React",
                "description": "Conceptos básicos de React y JSX",
                "slug": "introduccion-a-react",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course1,
                "name": "Componentes y Props",
                "description": "Creación de componentes reutilizables",
                "slug": "componentes-y-props",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course1,
                "name": "Estado y Eventos",
                "description": "Manejo del estado y eventos en React",
                "slug": "estado-y-eventos",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            # Python course lessons
            {
                "course": course2,
                "name": "Introducción a Python",
                "description": "Sintaxis básica y tipos de datos",
                "slug": "introduccion-a-python",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course2,
                "name": "Funciones y Módulos",
                "description": "Organización del código con funciones",
                "slug": "funciones-y-modulos",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            # JavaScript course lessons
            {
                "course": course3,
                "name": "JavaScript Moderno",
                "description": "ES6+ y nuevas características",
                "slug": "javascript-moderno",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            # TypeScript course lessons
            {
                "course": course4,
                "name": "Introducción a TypeScript",
                "description": "Qué es TypeScript y cómo diferenciarlo de JavaScript",
                "slug": "introduccion-a-typescript",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course4,
                "name": "Tipos e Interfaces",
                "description": "Definición de tipos personalizados e interfaces",
                "slug": "tipos-e-interfaces",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course4,
                "name": "Clases y Genéricos",
                "description": "Programación orientada a objetos con TypeScript",
                "slug": "clases-y-genericos",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            # Docker course lessons
            {
                "course": course5,
                "name": "¿Qué es Docker?",
                "description": "Conceptos de contenedores e imagen de Docker",
                "slug": "que-es-docker",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course5,
                "name": "Imágenes y Contenedores",
                "description": "Crear y gestionar imágenes y contenedores",
                "slug": "imagenes-y-contenedores",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course5,
                "name": "Docker Compose",
                "description": "Orquestación de múltiples servicios con Docker Compose",
                "slug": "docker-compose",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            # Git y GitHub course lessons
            {
                "course": course6,
                "name": "Fundamentos de Git",
                "description": "Comandos esenciales: init, add, commit, log",
                "slug": "fundamentos-de-git",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course6,
                "name": "Ramas y Merges",
                "description": "Gestión de ramas, fusiones y resolución de conflictos",
                "slug": "ramas-y-merges",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "course": course6,
                "name": "Flujos de trabajo con GitHub",
                "description": "Pull requests, issues y colaboración en equipo",
                "slug": "flujos-de-trabajo-github",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
        ]

        for lesson_data in lessons_data:
            lesson = Lesson(
                course_id=lesson_data["course"].id,
                name=lesson_data["name"],
                description=lesson_data["description"],
                slug=lesson_data["slug"],
                video_url=lesson_data["video_url"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            db.add(lesson)

        db.commit()

        all_courses = [course1, course2, course3, course4, course5, course6]
        all_teachers = [teacher1, teacher2, teacher3, teacher4, teacher5]
        print("✅ Sample data created successfully!")
        print(f"   - Created {len(all_teachers)} teachers")
        print(f"   - Created {len(all_courses)} courses")
        print(f"   - Created {len(lessons_data)} lessons")

    except Exception as e:
        db.rollback()
        print(f"❌ Error creating sample data: {e}")
        raise
    finally:
        db.close()


def clear_all_data():
    """Clear all data from the database."""
    db: Session = SessionLocal()

    try:
        # Delete in reverse order to avoid foreign key constraints
        db.query(CourseRating).delete()
        db.query(Lesson).delete()
        db.execute(course_teachers.delete())
        db.query(Course).delete()
        db.query(Teacher).delete()
        db.commit()

        print("✅ All data cleared successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "clear":
        clear_all_data()
    else:
        create_sample_data()

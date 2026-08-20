# AzariaSW Database

Database:
PostgreSQL

ORM:
Prisma


## Models


### Profile

Stores personal information.

Fields:

- name
- title
- bio
- social links
- resume
- cv
- professional picture


### Skill

Stores technical skills.

Examples:

- JavaScript
- Node.js
- PostgreSQL


### Project

Stores portfolio projects.

Includes:

- title
- description
- GitHub link

### ProjectImage

contains the images of the projects 

Includes:

- url
- project(foreign key)
- order


### Experience

Stores professional experience.


### Education

Stores academic background.


### Certificate

Stores certifications.
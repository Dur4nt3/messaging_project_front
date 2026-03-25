# Vite Template Repository

### About "Vite Template Repository"

This a template repository for front-end development, specifically for React applications.

The aim of this template is to allow you to quick start your React applications without the need to configure many tools and technologies.

_Note: various configurations are opinionated and/or project-specific and may or may not need to be edited to fit your specific needs._

**Packages are periodically updated to the LATEST version.**

### Technologies

**This template uses the following technologies:**

[![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](#)
[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)](https://vitest.dev/)
[![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)](https://testing-library.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

### Template Information

**The following are included in the template:**

- A "README.md" file

- A ".gitignore" file with the default "Vite" preset for "React"

- ESLint with a configuration inspired by AirBnB's style guide

- Prettier configured to not conflict with ESLint

- Vite

- React

- Vitest

- Testing Library (along with additional miscellaneous testing utilities)

- React Router

### A Note About React Router

Depending on your project, you may not need React Router.
If that is the case, seek commit ["150357b"](https://github.com/Dur4nt3/vite_template/tree/150357b91ad75f2b154f66cda8fe6a8066e32886) of this template to get an idea of how this template should look without React Router.
The aforementioned commit does NOT include React Router.

**Specifically, update the following:**

1) Remove "router.jsx"

2) Update "main.jsx" to match the aforementioned commit

3) Update "./src/modules/routes/" to "./src/modules/components"

## Usage

### Copying the Template

This repository is a template repository, to use this template simply click the "Use this template" button and create a new repository via this template.

Upon creation of your new repository it should include all of the files (and their configurations) listed in this template.

### Installation

After utilizing this repository as the template for a selected repository all you need to do to ensure the template is working as intended is execute the following command in your terminal:

`npm install`

The above command will install all the npm packages used within the template.

From there, nothing else is needed as the configuration are already included within the template.

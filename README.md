# Setup Instructions

## Requirements

- Node.js 24
- Visual Studio Build Tools
- Python 3.14.3

## Clone the Project

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Run the Project

```bash
npm start
```

## Important

Electron projects can be sensitive to dependency and native module compatibility.  
It is recommended to use the versions mentioned above to avoid unexpected build or runtime issues.

---

# Project Status

The application is currently in a very early stage of development. A significant amount of time was spent setting up the development environment, resolving native dependency issues, and understanding how Electron and native modules work internally. Since this is my first native desktop project, a large part of the process also involved learning the ecosystem itself.

The goal of this project is to build a media management system similar to those used by production houses and news channels to organize and manage media assets such as images, videos, audio, and documents. During my time working with a news channel, I found such systems extremely interesting, which inspired me to build one from scratch.

At the moment, two core features are implemented:

- Store creation
- File ingestion pipeline

Currently, the ingestion system supports only image files. In the future, I plan to extend support to:

- Video files
- Audio files
- Documents
- External links and references

The project is still evolving and the architecture may continue to change as development progresses.
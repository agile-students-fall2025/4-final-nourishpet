![CI Status](https://github.com/agile-students-fall2025/4-final-nourishpet/actions/workflows/ci.yml/badge.svg)

# NourishPet

## Team Members

- [Kevin Yang](https://github.com/KevinYang-hi)
- [Keven Ni](https://github.com/BlackCloud-K)
- [Ellen Wong](https://github.com/ellen-wnl)
- [Sanna Moon](https://github.com/SannaMoon)
- [Tony Zhao](https://github.com/Tonyzsp)

---

### Product Vision Statement

Make healthy eating sticky and delightful by turning daily nutrition goals into the care and growth of a virtual companion.

---

## Deployment

The [application](https://nourishpet2025-dd9b5.ondigitalocean.app/) is deployed on DigitalOcean App Platform. The front-end (React) and back-end (Node/Express API) are both built and deployed through the platform.

---

## Running Locally

### Front-End Setup

> **Note:** NourishPet is currently designed for iPhone 14 Pro Max Screen fitting.

```bash
# Clone from Github Repo
git clone https://github.com/agile-students-fall2025/4-final-nourishpet

# Navigate to front-end folder
cd front-end

# Install dependencies
npm install

# Start front-end
npm start
```

### Back-End Setup

```bash
# Navigate to the back-end folder
cd back-end

# Install dependencies
npm install

# Run the server
npm run dev

# Run unit tests
npm test

# Check coverage
npx c8 npm test
```

### Environment Variables Setup

Create a `.env` file in the `/back-end` directory with the following variables:

```bash
MONGO_URI=<your mongodb atlas uri>
JWT_SECRET=<your jwt secret>
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
```

---

## Designs

- **Figma Prototype:** <https://www.figma.com/design/U0WY0qWMAR0VKkSKN4gRPR/NourishPet?node-id=0-1&p=f&t=jhqZDDOU0ArQTD3g-0>
- **App Map (Figma Board):** <https://www.figma.com/board/Ap3PkTRrukV8oVRh2tlZMD/App-Map?t=jhqZDDOU0ArQTD3g-0>

---

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.


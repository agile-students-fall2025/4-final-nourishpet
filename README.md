# NourishPet


## Team Members
- [Kevin Yang](https://github.com/KevinYang-hi)
- [Keven Ni](https://github.com/BlackCloud-K)
- [Ellen Wong](https://github.com/ellen-wnl)
- [Sanna Moon](https://github.com/SannaMoon)
- [Tony Zhao](https://github.com/Tonyzsp)

---

**Product Vision Statement**  
Make healthy eating sticky and delightful by turning daily nutrition goals into the care and growth of a virtual companion.

---
## Deployment: 
[Production URL](https://nourishpet2025-dd9b5.ondigitalocean.app/)
This application is deployed on DigitalOcean App Platform. The front-end (React) and back-end (Node/Express API) are both built and deployed through the platform.

---

# Running Locally

## Front-End Setup

Note: NourishPet is currently designed for iPhone 14 Pro Max Screen fitting. 

```bash
# clone from Github Repo
git clone https://github.com/agile-students-fall2025/4-final-nourishpet

# navigate to front-end folder
cd front-end

# download npm 
npm install

#start front-end
npm start
```
## Building and Testing of Project
 **Sprint 2 — Back-End Integration (Completed)**
Implementing Express.js routes and mock data.
Integrating API calls into React components.
Writing Mocha/Chai unit tests for route coverage.


## Back-End Setup
### Configuration
To run the back-end, you must create a `.env` file in the `back-end` directory. This file is git-ignored to protect sensitive credentials.

**Required Variables:**
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nourishpet
JWT_SECRET=your_super_secret_key
PORT=5000
```
*Ask the team for the shared development credentials.*

### Back-End Setup

```bash
# navigate to the back-end folder
cd back-end

# install dependencies
npm install

# run the server
npm run dev

# run unit tests
npm test

# check coverage
npx c8 npm test

## Check coverage
npx c8 npm test1. Build the Express.js back-end with dynamic and static routes.
```

## .env Setup (.env in /back-end)
```bash
MONGO_URI=<your mongodb atlas uri>
JWT_SECRET=<your jwt secret>
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
```

## Designs 

- **Figma Prototype:** <https://www.figma.com/design/U0WY0qWMAR0VKkSKN4gRPR/NourishPet?node-id=0-1&p=f&t=jhqZDDOU0ArQTD3g-0>  
- **App Map (Figma Board):** <https://www.figma.com/board/Ap3PkTRrukV8oVRh2tlZMD/App-Map?t=jhqZDDOU0ArQTD3g-0>

## Contributing
See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

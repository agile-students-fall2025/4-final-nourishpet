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

## Building and Testing of Project
 **Sprint 2 — Back-End Integration(Currently working)**
Implementing Express.js routes and mock data.
Integrating API calls into React components.
Writing Mocha/Chai unit tests for route coverage.

Note:
1. **Framework:** Express.js  
2. **Dynamic Routes:** Return mock JSON data (either hardcoded or proxied from [Mockaroo](https://mockaroo.com/))  
3. **Static Routes:** Serve static files as needed  
4. **Integration:** The front-end must now fetch data from the back-end via API requests  
5. **Forms:** POST data to server routes (mock storage acceptable)  
6. **Testing:** Unit tests with **Mocha**, **Chai**, and coverage verification via **c8** (≥10%)  
7.  **Security:** No credentials or URIs stored in version control — use `.env` for private settings

### Back-End Setup

```bash
# navigate to the back-end folder
cd back-end

# install dependencies
npm install

#Install testing libraries
npm install --save-dev mocha chai supertest c8

# install express 
npm install express

# run the server
npm run dev

# run unit tests
npm test

# check coverage
npx c8 npm test

## Check coverage
npx c8 npm test1. Build the Express.js back-end with dynamic and static routes.
2. Integrate front-end with back-end APIs.
3. Ensure all front-end requests pull live data from the back-end.
4. Add Mocha/Chai unit tests with at least 10% coverage verified using c8.



**Sprint 1: Front-end Design(Completed)**
Note:
1. Fake data fetching from [mockaroo](https://api.mockaroo.com/api/e721fed0?count=7&key=927ba720) is limited by 200 times per day, which might affect data visualization.
2. NourishPet is currently designed for iPhone 14 Pro Max Screen fitting. 

```bash
# clone from Github Repo
git clone https://github.com/agile-students-fall2025/4-final-nourishpet

# navigate to front-end folder
cd front-end

# download npm 
npm install

# make sure node.js is downloaded and ready
node -v

#start front-end
npm start
```

**Sprint 0: Completed**

- **Figma Prototype:** <https://www.figma.com/design/U0WY0qWMAR0VKkSKN4gRPR/NourishPet?node-id=0-1&p=f&t=jhqZDDOU0ArQTD3g-0>  
- **App Map (Figma Board):** <https://www.figma.com/board/Ap3PkTRrukV8oVRh2tlZMD/App-Map?t=jhqZDDOU0ArQTD3g-0>

## Contributing
See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

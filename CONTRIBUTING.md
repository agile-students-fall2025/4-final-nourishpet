# Contributing to NourishPet

This document explains how to contribute and the rules our team follows. Keep changes small and focused.

## Status
- [Figma Prototype](https://www.figma.com/design/U0WY0qWMAR0VKkSKN4gRPR/NourishPet?node-id=0-1&p=f&t=jhqZDDOU0ArQTD3g-0)
- [App Map (Figma Board)](https://www.figma.com/board/Ap3PkTRrukV8oVRh2tlZMD/App-Map?t=jhqZDDOU0ArQTD3g-0)

We have completed the [project](https://nourishpet2025-dd9b5.ondigitalocean.app/) and deployed it on DigitalOcean.


## Team Norms
- All team members must acknowledge Discord messages within 12 hours. Urgent issues tagged with @team require acknowledgment within 2 hours. Every meeting must have a rotating note-taker, and notes must be posted in the meetings channel within 1 hour. Updates follow the SCRUM pattern: yesterday I did X, today I will do Y, blockers are Z.
- Definition of Done: code compiles with no warnings, passes all unit tests with at least 80 percent coverage, has meaningful commit messages, includes comments for complex logic, and updates documentation. Pull requests require review by two team members before merging. No PR over 300 lines unless approved. PRs must include a test plan and screenshots for frontend changes. Frontend uses ESLint and Prettier; backend follows REST conventions and standard error handling.
- Weekly meeting times are set in advance. Last-minute cancellations are only allowed for emergencies. If unavailable for more than 24 hours, the member must notify the team and assign someone to handle urgent tasks.
- No code is merged if the GitHub Actions CI tests fail. Every deployment must be verified by at least one member who did not write the code being deployed.


## What We Accept (now)
- Back-end development with Express.js  
- API integration with front-end  
- Unit testing with Mocha, Chai, and c8  
- Documentation updates
- front-end design with React.js


## Git Workflow
Default branch: `master`

- Work on your own branch (branch naming details see below); do not commit directly to `master`.
- **NEVER commit `.env` files or secrets.**
- Commit messages: **one line**, meaningful and concise (what changed + why).
- Open a Pull Request to `master`; **at least 1 peer review is required** before merge.

**Steps**
```bash
# update local master
git checkout master
git pull origin master

# create your branch named after the User Story and Task/Spike which they are intended to implement
git checkout -b user-story/13/task/9/implement-user-login
git checkout -b spike/27/learn-react-js

# stage and commit (one-line message)
git add .
git commit -m "meaningful one-line message"

# push your branch and open a PR to master
git push origin <branchname>

# for peer review
git fetch origin pull/pull-id/head:pr-id-review
```




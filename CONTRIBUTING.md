# Contributing to NourishPet

This document explains how to contribute and the rules our team follows. Keep changes small and focused.

## Status
Currently in **Sprint 2 — Back-End Integration**
- [Figma Prototype](https://www.figma.com/design/U0WY0qWMAR0VKkSKN4gRPR/NourishPet?node-id=0-1&p=f&t=jhqZDDOU0ArQTD3g-0)
- [App Map (Figma Board)](https://www.figma.com/board/Ap3PkTRrukV8oVRh2tlZMD/App-Map?t=jhqZDDOU0ArQTD3g-0)


## Team Norms
- Communicate via GitHub Issues/PRs.
- 2-week sprint cadence: plan at start, 2-3 synchronous standups per week, quick demo/retro at end.
- Keep scope tight; prefer incremental changes.
- Be kind and direct: feedback is specific, actionable, and respectful.


## What We Accept (now)
- Back-end development with Express.js  
- API integration with front-end  
- Unit testing with Mocha, Chai, and c8  
- Documentation updates
- front-end design with React.js


## Git Workflow
Default branch: `master`

- Work on your own branch (branch naming details see below); do not commit directly to `master`.
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




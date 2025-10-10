# Contributing to NourishPet

This document explains how to contribute and the rules our team follows. Keep changes small and focused.

## Status
Wireframes/design-first phase.
- Figma Prototype: https://www.figma.com/design/U0WY0qWMAR0VKkSKN4gRPR/NourishPet?node-id=0-1&p=f&t=jhqZDDOU0ArQTD3g-0
- App Map (Figma Board): https://www.figma.com/board/Ap3PkTRrukV8oVRh2tlZMD/App-Map?t=jhqZDDOU0ArQTD3g-0

## Team Norms
- Communicate via GitHub Issues/PRs.
- 2-week sprint cadence: plan at start, quick demo/retro at end.
- Keep scope tight; prefer incremental changes.
- Be kind and direct: feedback is specific, actionable, and respectful.


## What We Accept (now)
- Wireframes and prototypes
- Design specs (layout, spacing, tokens, states, interactions)
- UX description change

## Git Workflow
Default branch: `main`

- Work on your own branch named **<yourname>**; do not commit directly to `main`.
- Commit messages: **one line**, meaningful and concise (what changed + why).
- Open a Pull Request to `main`; **at least 1 peer review is required** before merge.

**Steps**
```bash
# update local main
git checkout main
git pull origin main

# create your branch
git checkout -b <yourname>

# stage and commit (one-line message)
git add .
git commit -m "meaningful one-line message"

# push your branch and open a PR to main
git push origin <yourname>




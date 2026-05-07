# Reusable Data Grid - Next.js

A production-style reusable Data Grid module built with Next.js, React, and TypeScript.

## Features

- Server-side pagination
- Server-side sorting
- Server-side filtering
- Select/Dropdown filters
- Boolean filters
- Loading, Empty, Error states
- Export to CSV
- Export to Excel
- Column visibility toggle
- Action column
- Drag & Drop column reordering
- URL sync for pagination, sort, and filters
- Generic reusable architecture

## Tech Stack

- Next.js
- React
- TypeScript
- json-server
- react-dnd

## Run Project
```bash
npm install
npm run dev

App:
bash
http://localhost:3000

Mock API:
bash
http://localhost:3001/users

## Notes

- Mock API is powered by `json-server`
- Query params are synced with URL
- Grid is generic and reusable for different entities

## Folder Structure

- `components/DataGrid` → reusable grid UI
- `hooks` → grid state and column management
- `lib` → API and export helpers
- `types` → shared TypeScript types

## Future Improvements

- Debounced text filters
- Persist column visibility/order in localStorage
- Real Excel generation with `xlsx`
- Better outside-click handling for dropdowns
- Multi-column sorting
- Row selection


---

## نکات مهم برای اجرا

### 1) نصب
```bash
npm install

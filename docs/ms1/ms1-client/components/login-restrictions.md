---
title: Login Restrictions Component
sidebar_position: 1
---

# Login Restrictions Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Login Restrictions API](../../ms1-server/modules/login-restrictions).

The Login Restrictions component provides an interface for managing user login restrictions, including blocking users, setting session limits, and managing IP/device restrictions.

## Overview

Features:
- View all users with restrictions
- Block/unblock users
- Set concurrent session limits
- Manage IP restrictions
- Manage device restrictions
- Logout users from all devices
- Search and filter users

## Component Structure

- **Users List** – Table of users with restriction status
- **Restriction Form** – Edit restriction settings
- **Block/Unblock Toggle** – Quick block/unblock action
- **Session Limit Input** – Set max concurrent sessions
- **IP Management** – Add/remove IP restrictions
- **Device Management** – Add/remove device restrictions
- **Logout All Button** – Logout user from all devices

## API Integration

Uses login restrictions API services:
- `getAllRestrictions(params)` – Get all restrictions
- `getAllUsersWithRestrictions(params)` – Get users with restrictions
- `getUserRestriction(userId)` – Get user restriction
- `updateUserRestriction(userId, data)` – Update restriction
- `deleteUserRestriction(userId)` – Delete restriction
- `logoutAllDevices(userId)` – Logout all devices

## State Management

- Users list with restrictions
- Active session counts
- Form data for editing
- Search/filter state
- Loading/error states

## User Flows

### Blocking a User
1. Admin selects user from list
2. Admin clicks "Block User"
3. Admin enters block reason
4. Component sends update request
5. User is blocked and all sessions logged out
6. List refreshes with updated status

### Setting Session Limit
1. Admin selects user
2. Admin sets max concurrent sessions (1-10)
3. Component validates input
4. Component sends update request
5. Restriction is saved
6. On next login, limit is enforced

---

**Next Steps:**
- Read [MS1 Server - Login Restrictions API](../../ms1-server/modules/login-restrictions) for backend details
- See [Login Restrictions Overview](../modules/login-restrictions-overview) for complete system understanding


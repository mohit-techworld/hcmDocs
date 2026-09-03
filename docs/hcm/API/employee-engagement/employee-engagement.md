---
sidebar_position: 1
title: "Employee Engagement"
description: "The Employee Engagement API is a comprehensive platform designed to foster workplace communication, collaboration, and community building."
---

# Employee Engagement


{/* # Employee Engagement API Documentation */}

## Overview

The Employee Engagement API is a comprehensive platform designed to foster workplace communication, collaboration, and community building. This system enables employees to create posts, participate in polls, engage through comments, and manage organizational content with sophisticated permission controls and real-time interactions.

### Key Features

- **Content Management**: Create, schedule, and manage posts with rich media support
- **Interactive Polling**: Create and participate in organizational polls
- **Social Engagement**: Comment system with reactions and file attachments
- **Real-time Updates**: Live notifications via WebSocket connections
- **Role-based Access Control**: Granular permission system for content moderation
- **Content Scheduling**: Schedule posts for future publication with expiry dates
- **Unified Feed**: Combined timeline of posts and polls with intelligent filtering
- **Employee Celebrations**: Automated birthday and anniversary tracking
- **Moderation Tools**: Comprehensive content moderation and user management

## Base URL

```
https://your-api-domain.com/api
```

## Authentication & Authorization

### Authentication Flow

The API uses JSON Web Tokens (JWT) for authentication with a sophisticated permission-based authorization system.

#### Authentication Process

1. **Login**: Obtain JWT token from authentication endpoint
2. **Token Usage**: Include token in Authorization header for all requests
3. **Permission Validation**: Each endpoint checks specific permissions
4. **Real-time Authentication**: Socket.io connections validate tokens for live updates

#### Authorization Header Format

```http
Authorization: Bearer <your_jwt_token>
```

### Permission System

The API implements a comprehensive role-based permission system with the following permissions:

#### Content Permissions
- **createPost**: Create new posts
- **editOwnPost**: Edit user's own posts
- **editAnyPost**: Edit any post (moderator privilege)
- **deleteOwnPost**: Delete user's own posts
- **deleteAnyPost**: Delete any post (moderator privilege)
- **view**: Basic viewing permissions
- **viewFeed**: Access to the unified feed

#### Poll Permissions
- **createPoll**: Create new polls
- **viewPoll**: View existing polls
- **votePoll**: Participate in polls
- **deleteOwnPoll**: Delete user's own polls
- **deleteAnyPoll**: Delete any poll (moderator privilege)

#### Comment Permissions
- **addComment**: Create comments on posts
- **editOwnComment**: Edit user's own comments
- **editAnyComment**: Edit any comment (moderator privilege)
- **deleteOwnComment**: Delete user's own comments
- **deleteAnyComment**: Delete any comment (moderator privilege)

## System Architecture

### Request Flow

```
Client Request → JWT Validation → Permission Check → Controller → Database → Socket.io → Response
```

### Data Models

#### Post Model
```javascript
{
  _id: "ObjectId",
  author: "ObjectId (User reference)",
  title: "String",
  description: "String",
  department: ["String"], // Array of department names
  categories: ["String"],
  media: ["String"], // Array of Cloudinary URLs
  scheduleDate: "Date",
  expiryDate: "Date (optional)",
  likes: ["ObjectId"], // Array of User references
  reactions: [{
    user: "ObjectId",
    type: "String" // 'like', 'love', 'laugh', etc.
  }],
  comments: ["ObjectId"], // Array of Comment references
  isModerated: "Boolean",
  moderatedBy: "ObjectId (User reference)",
  moderationReason: "String",
  createdAt: "Date",
  updatedAt: "Date"
}
```

#### Poll Model
```javascript
{
  _id: "ObjectId",
  question: "String (required)",
  options: [{
    text: "String",
    votes: "Number (default: 0)"
  }],
  creator: "ObjectId (User reference)",
  department: ["String"],
  categories: ["String"],
  duration: "Number", // Hours
  endTime: "Date",
  isActive: "Boolean",
  votes: [{
    user: "ObjectId",
    option: "ObjectId"
  }],
  createdAt: "Date",
  updatedAt: "Date"
}
```

#### Comment Model
```javascript
{
  _id: "ObjectId",
  post: "ObjectId (Post reference)",
  commenter: "ObjectId (User reference)",
  comment: "String",
  attachments: ["String"], // Array of Cloudinary URLs
  reactions: [{
    user: "ObjectId",
    type: "String" // Currently supports 'like'
  }],
  isModerated: "Boolean",
  moderatedBy: "ObjectId (User reference)",
  moderationReason: "String",
  createdAt: "Date",
  updatedAt: "Date"
}
```

## Post Management API

### Create Post

Creates a new post with optional media attachments, scheduling, and expiry settings.

**Endpoint**: `POST /v1/posts`

**Authentication**: Required (JWT)

**Permissions**: `createPost`

**Content-Type**: `multipart/form-data` (for file uploads)

**Request Body**:
```json
{
  "title": "Team Building Event Announcement",
  "description": "Join us for an exciting team building event this Friday!",
  "department": ["Engineering", "Marketing"],
  "categories": ["Events", "Team Building"],
  "schedule": "2024-01-20T09:00:00.000Z",
  "expiry": "7 days"
}
```

**File Upload**: Up to 5 media files via `mediaFiles` form field

**Success Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "author": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "user_Avatar": "https://cloudinary.com/avatar.jpg"
  },
  "title": "Team Building Event Announcement",
  "description": "Join us for an exciting team building event this Friday!",
  "department": ["Engineering", "Marketing"],
  "categories": ["Events", "Team Building"],
  "media": [
    "https://cloudinary.com/media1.jpg",
    "https://cloudinary.com/media2.jpg"
  ],
  "scheduleDate": "2024-01-20T09:00:00.000Z",
  "expiryDate": "2024-01-27T09:00:00.000Z",
  "likes": [],
  "reactions": [],
  "comments": [],
  "isModerated": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:

*400 Bad Request - Invalid schedule date*:
```json
{
  "message": "Invalid schedule date format"
}
```

*400 Bad Request - Invalid expiry format*:
```json
{
  "message": "Invalid expiry format"
}
```

*403 Forbidden - Insufficient permissions*:
```json
{
  "message": "Forbidden: Insufficient permissions"
}
```

**Business Rules**:
- Media files limited to 5 per post
- Schedule date must be valid ISO date or parseable format
- Expiry can be ISO date or duration format ("7 days", "24 hours", "2 weeks")
- Department field automatically converts to array if single string provided
- Real-time broadcast via Socket.io to all connected clients

### Get Posts

Retrieves posts with pagination, filtering by schedule and expiry dates.

**Endpoint**: `GET /v1/posts`

**Authentication**: Required (JWT)

**Permissions**: `view`

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 10)

**Success Response** (200):
```json
{
  "docs": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "author": {
        "_id": "64a1b2c3d4e5f6789012340",
        "employee_Id": "EMP001",
        "first_Name": "John",
        "last_Name": "Doe",
        "user_Avatar": "https://cloudinary.com/avatar.jpg"
      },
      "title": "Team Building Event",
      "description": "Join us for team building!",
      "media": ["https://cloudinary.com/media1.jpg"],
      "likes": [
        {
          "_id": "64a1b2c3d4e5f6789012341",
          "employee_Id": "EMP002",
          "first_Name": "Jane",
          "last_Name": "Smith",
          "user_Avatar": "https://cloudinary.com/avatar2.jpg"
        }
      ],
      "reactions": [
        {
          "user": {
            "_id": "64a1b2c3d4e5f6789012342",
            "employee_Id": "EMP003",
            "first_Name": "Bob",
            "last_Name": "Johnson"
          },
          "type": "love"
        }
      ],
      "comments": [
        {
          "_id": "64a1b2c3d4e5f6789012350",
          "commenter": {
            "_id": "64a1b2c3d4e5f6789012341",
            "employee_Id": "EMP002",
            "first_Name": "Jane",
            "last_Name": "Smith"
          },
          "comment": "Looking forward to this!",
          "createdAt": "2024-01-15T11:00:00.000Z"
        }
      ],
      "scheduleDate": "2024-01-20T09:00:00.000Z",
      "expiryDate": "2024-01-27T09:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalDocs": 25,
  "limit": 10,
  "page": 1,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

**Business Rules**:
- Only shows posts where scheduleDate ≤ current time
- Excludes expired posts (where expiryDate < current time)
- Posts without expiry date are always visible
- Results sorted by creation date (newest first)
- Includes populated author, likes, reactions, and comments data

### Update Post

Updates an existing post with new content or moderation status.

**Endpoint**: `PUT /v1/posts/:id`

**Authentication**: Required (JWT)

**Permissions**: `editAnyPost` OR `editOwnPost` (for post author)

**Content-Type**: `multipart/form-data`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the post

**Request Body**:
```json
{
  "title": "Updated Team Building Event",
  "description": "Updated description with new details",
  "moderationReason": "Content updated for clarity"
}
```

**Success Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "author": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe"
  },
  "title": "Updated Team Building Event",
  "description": "Updated description with new details",
  "isModerated": true,
  "moderatedBy": "64a1b2c3d4e5f6789012399",
  "moderationReason": "Content updated for clarity",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Business Rules**:
- Post author can always edit their own posts (with `editOwnPost`)
- Users with `editAnyPost` can edit any post
- Adding `moderationReason` marks post as moderated
- Media files can be added but not removed via this endpoint
- Real-time update broadcast via Socket.io

### Delete Post

Removes a post and its associated media files from Cloudinary.

**Endpoint**: `DELETE /v1/posts/:id`

**Authentication**: Required (JWT)

**Permissions**: `deleteAnyPost` OR `deleteOwnPost` (for post author)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the post

**Success Response** (200):
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "message": "Post not found"
}
```

*403 Forbidden*:
```json
{
  "message": "Forbidden: Cannot delete this post"
}
```

**Business Rules**:
- Post author can delete their own posts (with `deleteOwnPost`)
- Users with `deleteAnyPost` can delete any post
- Automatically deletes associated media files from Cloudinary
- Real-time deletion broadcast via Socket.io

### Like/Unlike Post

Toggles like status for a post.

**Endpoint**: `POST /v1/posts/:id/like`

**Authentication**: Required (JWT)

**Permissions**: `view`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the post

**Success Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "type": "post",
  "likes": [
    {
      "_id": "64a1b2c3d4e5f6789012340",
      "employee_Id": "EMP001",
      "first_Name": "John",
      "last_Name": "Doe",
      "user_Avatar": "https://cloudinary.com/avatar.jpg",
      "designation": "Software Engineer"
    }
  ],
  "author": {
    "_id": "64a1b2c3d4e5f6789012341",
    "employee_Id": "EMP002",
    "first_Name": "Jane",
    "last_Name": "Smith"
  }
}
```

**Business Rules**:
- Clicking like when not liked: adds like
- Clicking like when already liked: removes like
- User can only like/unlike once per post
- Real-time update broadcast with `type: "post"`

### React to Post

Adds or updates emoji reactions on a post.

**Endpoint**: `POST /v1/posts/:id/react`

**Authentication**: Required (JWT)

**Permissions**: `view`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the post

**Request Body**:
```json
{
  "reactionType": "love"
}
```

**Available Reaction Types**:
- `like`
- `love`
- `laugh`
- `wow`
- `sad`
- `angry`

**Success Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "type": "post",
  "reactions": [
    {
      "user": {
        "_id": "64a1b2c3d4e5f6789012340",
        "employee_Id": "EMP001",
        "first_Name": "John",
        "last_Name": "Doe"
      },
      "type": "love"
    }
  ]
}
```

**Business Rules**:
- Same reaction type clicked again: removes reaction
- Different reaction type: updates to new type
- New reaction: adds to reactions array
- Real-time update broadcast via Socket.io

## Poll Management API

### Create Poll

Creates a new poll with multiple options and time duration.

**Endpoint**: `POST /v1/polls`

**Authentication**: Required (JWT)

**Permissions**: `createPoll`

**Request Body**:
```json
{
  "question": "What should be our next team outing activity?",
  "options": [
    "Bowling",
    "Mini Golf",
    "Escape Room",
    "Picnic"
  ],
  "duration": 72,
  "department": ["Engineering", "Marketing"],
  "categories": ["Team Building", "Events"]
}
```

**Validation Rules**:
- `question`: Required, non-empty string
- `options`: Array with 2-5 items, each non-empty
- `duration`: Integer, minimum 1 hour

**Success Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012355",
  "question": "What should be our next team outing activity?",
  "options": [
    {
      "_id": "64a1b2c3d4e5f6789012356",
      "text": "Bowling",
      "votes": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012357",
      "text": "Mini Golf", 
      "votes": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012358",
      "text": "Escape Room",
      "votes": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012359",
      "text": "Picnic",
      "votes": 0
    }
  ],
  "creator": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "user_Avatar": "https://cloudinary.com/avatar.jpg"
  },
  "department": ["Engineering", "Marketing"],
  "categories": ["Team Building", "Events"],
  "duration": 72,
  "endTime": "2024-01-18T10:30:00.000Z",
  "isActive": true,
  "votes": [],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:

*400 Bad Request - Validation errors*:
```json
{
  "errors": [
    {
      "msg": "Question is required",
      "param": "question",
      "location": "body"
    },
    {
      "msg": "Options must be an array with 2 to 5 items",
      "param": "options",
      "location": "body"
    }
  ]
}
```

*403 Forbidden*:
```json
{
  "message": "Forbidden: Insufficient permissions"
}
```

**Business Rules**:
- User must have `createPoll` permission
- Duration automatically calculates end time from creation
- Real-time broadcast to all connected clients
- Poll becomes inactive after end time

### Get All Polls

Retrieves all polls with creator and voting information.

**Endpoint**: `GET /v1/polls`

**Authentication**: Required (JWT)

**Permissions**: `viewPoll`

**Success Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012355",
    "question": "What should be our next team outing activity?",
    "options": [
      {
        "_id": "64a1b2c3d4e5f6789012356",
        "text": "Bowling",
        "votes": 3
      },
      {
        "_id": "64a1b2c3d4e5f6789012357",
        "text": "Mini Golf",
        "votes": 7
      },
      {
        "_id": "64a1b2c3d4e5f6789012358",
        "text": "Escape Room",
        "votes": 12
      },
      {
        "_id": "64a1b2c3d4e5f6789012359",
        "text": "Picnic",
        "votes": 4
      }
    ],
    "creator": {
      "_id": "64a1b2c3d4e5f6789012340",
      "employee_Id": "EMP001",
      "first_Name": "John",
      "last_Name": "Doe",
      "user_Avatar": "https://cloudinary.com/avatar.jpg"
    },
    "isActive": true,
    "endTime": "2024-01-18T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Business Rules**:
- Returns both active and closed polls
- Results sorted by creation date (newest first)
- Includes vote counts for each option

### Vote on Poll

Records a vote for a specific poll option.

**Endpoint**: `POST /v1/polls/:id/vote`

**Authentication**: Required (JWT)

**Permissions**: `votePoll`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the poll

**Request Body**:
```json
{
  "optionId": "64a1b2c3d4e5f6789012358"
}
```

**Success Response** (200):
```json
{
  "message": "Vote recorded successfully",
  "poll": {
    "_id": "64a1b2c3d4e5f6789012355",
    "question": "What should be our next team outing activity?",
    "options": [
      {
        "_id": "64a1b2c3d4e5f6789012358",
        "text": "Escape Room",
        "votes": 13
      }
    ],
    "votes": [
      {
        "user": {
          "_id": "64a1b2c3d4e5f6789012340",
          "employee_Id": "EMP001",
          "first_Name": "John",
          "last_Name": "Doe"
        },
        "option": "64a1b2c3d4e5f6789012358"
      }
    ]
  }
}
```

**Error Responses**:

*400 Bad Request - Already voted*:
```json
{
  "message": "You have already voted on this poll"
}
```

*400 Bad Request - Poll closed*:
```json
{
  "message": "Poll is closed"
}
```

*400 Bad Request - Invalid option*:
```json
{
  "message": "Invalid option selected"
}
```

**Business Rules**:
- Users can only vote once per poll
- Poll must be active (not past end time)
- Option must exist in the poll
- Increments vote count and records user vote
- Real-time update broadcast with `type: "poll"`

### Delete Poll

Removes a poll from the system.

**Endpoint**: `DELETE /v1/polls/:id`

**Authentication**: Required (JWT)

**Permissions**: `deleteAnyPoll` OR `deleteOwnPoll` (for poll creator)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the poll

**Success Response** (200):
```json
{
  "message": "Poll deleted successfully"
}
```

**Business Rules**:
- Poll creator can delete their own polls (with `deleteOwnPoll`)
- Users with `deleteAnyPoll` can delete any poll
- Real-time deletion broadcast with `type: "poll"`

## Comment Management API

### Create Comment

Adds a comment to a post with optional file attachments.

**Endpoint**: `POST /v1/comments/:postId`

**Authentication**: Required (JWT)

**Permissions**: `addComment`

**Content-Type**: `multipart/form-data`

**Path Parameters**:
- `postId` (string): MongoDB ObjectId of the post

**Request Body**:
```json
{
  "comment": "Great initiative! Looking forward to participating."
}
```

**File Upload**: Up to 3 attachment files via `attachments` form field

**Success Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012360",
  "post": "64a1b2c3d4e5f6789012345",
  "commenter": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "user_Avatar": "https://cloudinary.com/avatar.jpg"
  },
  "comment": "Great initiative! Looking forward to participating.",
  "attachments": [
    "https://cloudinary.com/attachment1.pdf"
  ],
  "reactions": [],
  "isModerated": false,
  "createdAt": "2024-01-15T11:30:00.000Z"
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "message": "Post not found"
}
```

**Business Rules**:
- Post must exist to add comments
- Attachments uploaded to Cloudinary with folder organization
- Comment reference automatically added to parent post
- Real-time broadcast with post ID and comment data

### Get Comments

Retrieves comments for a specific post with pagination.

**Endpoint**: `GET /v1/comments/:postId`

**Authentication**: Required (JWT)

**Permissions**: `view`

**Path Parameters**:
- `postId` (string): MongoDB ObjectId of the post

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 10)

**Success Response** (200):
```json
{
  "docs": [
    {
      "_id": "64a1b2c3d4e5f6789012360",
      "commenter": {
        "_id": "64a1b2c3d4e5f6789012340",
        "employee_Id": "EMP001",
        "first_Name": "John",
        "last_Name": "Doe",
        "user_Avatar": "https://cloudinary.com/avatar.jpg"
      },
      "comment": "Great initiative!",
      "attachments": ["https://cloudinary.com/file.pdf"],
      "reactions": [
        {
          "user": "64a1b2c3d4e5f6789012341",
          "type": "like"
        }
      ],
      "createdAt": "2024-01-15T11:30:00.000Z"
    }
  ],
  "totalDocs": 15,
  "limit": 10,
  "page": 1,
  "totalPages": 2
}
```

**Business Rules**:
- Results sorted by creation date (newest first)
- Includes populated commenter information
- Supports pagination for performance

### Update Comment

Modifies an existing comment with optional moderation.

**Endpoint**: `PUT /v1/comments/:id`

**Authentication**: Required (JWT)

**Permissions**: `editAnyComment` OR `editOwnComment` (for comment author)

**Content-Type**: `multipart/form-data`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the comment

**Request Body**:
```json
{
  "comment": "Updated comment text",
  "moderationReason": "Language correction"
}
```

**Success Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012360",
  "commenter": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe"
  },
  "comment": "Updated comment text",
  "isModerated": true,
  "moderatedBy": "64a1b2c3d4e5f6789012399",
  "moderationReason": "Language correction",
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

**Business Rules**:
- Comment author can edit their own comments
- Users with `editAnyComment` can edit any comment
- Additional attachments can be added (existing ones preserved)
- Moderation reason marks comment as moderated

### Delete Comment

Removes a comment and its attachments.

**Endpoint**: `DELETE /v1/comments/:id`

**Authentication**: Required (JWT)

**Permissions**: `deleteAnyComment` OR `deleteOwnComment` (for comment author)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the comment

**Success Response** (200):
```json
{
  "message": "Comment deleted successfully"
}
```

**Business Rules**:
- Comment author can delete their own comments
- Users with `deleteAnyComment` can delete any comment
- Attachments automatically deleted from Cloudinary
- Comment reference removed from parent post

### Like Comment

Toggles like reaction on a comment.

**Endpoint**: `POST /v1/comments/:id/like`

**Authentication**: Required (JWT)

**Permissions**: `view`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the comment

**Success Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012360",
  "commenter": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe"
  },
  "reactions": [
    {
      "user": {
        "_id": "64a1b2c3d4e5f6789012341",
        "employee_Id": "EMP002",
        "first_Name": "Jane",
        "last_Name": "Smith"
      },
      "type": "like"
    }
  ]
}
```

**Business Rules**:
- Clicking like when not liked: adds like reaction
- Clicking like when already liked: removes reaction
- Real-time update broadcast to all clients

## Feed Management API

### Get Unified Feed

Retrieves a combined timeline of posts and polls with intelligent filtering.

**Endpoint**: `GET /v1/feed`

**Authentication**: Required (JWT)

**Permissions**: `viewFeed`

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)

**Success Response** (200):
```json
{
  "feed": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "type": "post",
      "title": "Team Building Event",
      "description": "Join us for team building!",
      "author": {
        "_id": "64a1b2c3d4e5f6789012340",
        "first_Name": "John",
        "last_Name": "Doe",
        "employee_Id": "EMP001",
        "designation": "Software Engineer",
        "user_Avatar": "https://cloudinary.com/avatar.jpg"
      },
      "media": ["https://cloudinary.com/media1.jpg"],
      "likes": [
        {
          "_id": "64a1b2c3d4e5f6789012341",
          "first_Name": "Jane",
          "last_Name": "Smith",
          "designation": "Product Manager"
        }
      ],
      "reactions": [],
      "comments": [],
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789012355",
      "type": "poll",
      "question": "What should be our next team outing?",
      "options": [
        {
          "_id": "64a1b2c3d4e5f6789012356",
          "text": "Bowling",
          "votes": 3
        },
        {
          "_id": "64a1b2c3d4e5f6789012357",
          "text": "Mini Golf",
          "votes": 7
        }
      ],
      "creator": {
        "_id": "64a1b2c3d4e5f6789012340",
        "first_Name": "John",
        "last_Name": "Doe",
        "employee_Id": "EMP001",
        "designation": "Software Engineer"
      },
      "isActive": true,
      "endTime": "2024-01-18T10:30:00.000Z",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

**Business Rules**:
- Combines posts and polls in chronological order
- Filters out unscheduled and expired content
- Only shows content where scheduleDate ≤ current time
- Excludes content where expiryDate < current time
- Fully populates related data (authors, comments, likes, reactions)
- Uses MongoDB aggregation for optimal performance

### Get Today's Celebrations

Retrieves birthday and anniversary celebrations for the current date.

**Endpoint**: `GET /v1/feed/greeting`

**Authentication**: Required (JWT)

**Permissions**: None (authenticated users only)

**Success Response** (200):
```json
{
  "success": true,
  "birthdays": [
    {
      "_id": "64a1b2c3d4e5f6789012340",
      "employee_Id": "EMP001",
      "first_Name": "John",
      "last_Name": "Doe",
      "user_Avatar": "https://cloudinary.com/avatar.jpg",
      "department": "Engineering",
      "designation": "Software Engineer",
      "dob": "1990-01-15T00:00:00.000Z",
      "expire_date": "16 January"
    }
  ],
  "anniversaries": [
    {
      "_id": "64a1b2c3d4e5f6789012341",
      "employee_Id": "EMP002",
      "first_Name": "Jane",
      "last_Name": "Smith",
      "user_Avatar": "https://cloudinary.com/avatar2.jpg",
      "department": "Marketing",
      "designation": "Product Manager",
      "date_of_Joining": "2020-01-15T00:00:00.000Z",
      "years_with_us": 4,
      "expire_date": "16 January"
    }
  ],
  "holidays": [
    {
      "name": "Makar Sankranti",
      "date": "2024-01-15",
      "country": "IN",
      "type": "public_holiday"
    }
  ]
}
```

**Business Rules**:
- Matches birthdays and anniversaries by month and date
- Calculates years of service for anniversaries
- Fetches national holidays from external API (API Ninjas)
- Only includes active employees
- Expire date formatted for display purposes

## Role & Permission Management API

### Create Role

Creates a new role with specified permissions.

**Endpoint**: `POST /v1/roles-permissions/roles`

**Authentication**: Required (JWT)

**Permissions**: Admin-level access required

**Request Body**:
```json
{
  "name": "Content Moderator",
  "permissions": [
    "view",
    "createPost",
    "editAnyPost",
    "deleteAnyPost",
    "addComment",
    "editAnyComment",
    "viewFeed"
  ]
}
```

**Success Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012370",
  "name": "Content Moderator",
  "permissions": [
    "view",
    "createPost",
    "editAnyPost",
    "deleteAnyPost",
    "addComment",
    "editAnyComment",
    "viewFeed"
  ],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:

*400 Bad Request - Invalid permissions*:
```json
{
  "message": "Invalid permissions provided"
}
```

*400 Bad Request - Role exists*:
```json
{
  "message": "Role already exists"
}
```

### Get All Roles

Retrieves all roles with their permissions.

**Endpoint**: `GET /v1/roles-permissions/roles`

**Authentication**: Required (JWT)

**Success Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012370",
    "name": "Content Moderator",
    "permissions": [
      {
        "_id": "64a1b2c3d4e5f6789012380",
        "name": "view",
        "description": "Basic viewing permissions"
      },
      {
        "_id": "64a1b2c3d4e5f6789012381",
        "name": "createPost",
        "description": "Create new posts"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Update Role

Modifies an existing role's name or permissions.

**Endpoint**: `PUT /v1/roles-permissions/roles/:id`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the role

**Request Body**:
```json
{
  "name": "Senior Content Moderator",
  "permissions": [
    "view",
    "createPost",
    "editAnyPost",
    "deleteAnyPost",
    "addComment",
    "editAnyComment",
    "viewFeed",
    "createPoll",
    "deleteAnyPoll"
  ]
}
```

**Success Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012370",
  "name": "Senior Content Moderator",
  "permissions": [
    "view",
    "createPost",
    "editAnyPost",
    "deleteAnyPost",
    "addComment",
    "editAnyComment",
    "viewFeed",
    "createPoll",
    "deleteAnyPoll"
  ],
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

### Delete Role

Removes a role from the system.

**Endpoint**: `DELETE /v1/roles-permissions/roles/:id`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the role

**Success Response** (200):
```json
{
  "message": "Role deleted successfully"
}
```

### Assign Role to User

Assigns a role to a specific user, updating their permissions.

**Endpoint**: `PUT /v1/roles-permissions/users/:id/assign-role`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the user

**Request Body**:
```json
{
  "roleName": "Content Moderator"
}
```

**Success Response** (200):
```json
{
  "message": "Role Content Moderator assigned to user successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "roleId": "64a1b2c3d4e5f6789012370",
    "engagement_permission": {
      "permissions": [
        "view",
        "createPost",
        "editAnyPost",
        "deleteAnyPost",
        "addComment",
        "editAnyComment",
        "viewFeed"
      ]
    }
  }
}
```

### Bulk Assign Roles

Assigns a role to multiple users simultaneously.

**Endpoint**: `PUT /v1/roles-permissions/users/assign-role-bulk`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "roleName": "Content Moderator",
  "userIds": [
    "64a1b2c3d4e5f6789012340",
    "64a1b2c3d4e5f6789012341",
    "64a1b2c3d4e5f6789012342"
  ]
}
```

**Success Response** (200):
```json
{
  "message": "Role 'Content Moderator' assigned to 3 user(s) successfully.",
  "modifiedCount": 3
}
```

**Error Responses**:

*400 Bad Request - Invalid input*:
```json
{
  "message": "Invalid input. 'roleName' and 'userIds' are required."
}
```

*400 Bad Request - Invalid user IDs*:
```json
{
  "message": "Some user IDs are invalid."
}
```

### Update User Permissions

Directly updates a user's engagement permissions.

**Endpoint**: `PUT /v1/roles-permissions/users/:id/engagement-permissions`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the user

**Request Body**:
```json
{
  "permissions": [
    "view",
    "createPost",
    "addComment"
  ]
}
```

**Success Response** (200):
```json
{
  "message": "Engagement permissions updated successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6789012340",
    "engagement_permission": {
      "permissions": [
        "view",
        "createPost",
        "addComment"
      ]
    }
  }
}
```

### Ban User

Restricts a user to basic viewing and commenting permissions.

**Endpoint**: `PUT /v1/roles-permissions/users/:id/ban`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the user

**Success Response** (200):
```json
{
  "message": "User has been banned from engagement",
  "user": {
    "_id": "64a1b2c3d4e5f6789012340",
    "engagement_permission": {
      "permissions": [
        "view",
        "addComment"
      ]
    }
  }
}
```

### Unban User

Restores a user's original role permissions.

**Endpoint**: `PUT /v1/roles-permissions/users/:id/unban`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the user

**Success Response** (200):
```json
{
  "message": "User has been unbanned and engagement permissions restored",
  "user": {
    "_id": "64a1b2c3d4e5f6789012340",
    "engagement_permission": {
      "permissions": [
        "view",
        "createPost",
        "editOwnPost",
        "deleteOwnPost",
        "addComment",
        "editOwnComment",
        "deleteOwnComment",
        "viewFeed",
        "createPoll",
        "votePoll"
      ]
    }
  }
}
```

### Create Permission

Creates a new permission that can be assigned to roles.

**Endpoint**: `POST /v1/roles-permissions/permissions`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "name": "moderateContent",
  "description": "Ability to moderate and review content"
}
```

**Success Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012390",
  "name": "moderateContent",
  "description": "Ability to moderate and review content",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Get All Permissions

Retrieves all available permissions in the system.

**Endpoint**: `GET /v1/roles-permissions/permissions`

**Authentication**: Required (JWT)

**Success Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012380",
    "name": "view",
    "description": "Basic viewing permissions",
    "createdAt": "2024-01-10T10:30:00.000Z"
  },
  {
    "_id": "64a1b2c3d4e5f6789012381",
    "name": "createPost",
    "description": "Create new posts",
    "createdAt": "2024-01-10T10:31:00.000Z"
  },
  {
    "_id": "64a1b2c3d4e5f6789012382",
    "name": "editAnyPost",
    "description": "Edit any post regardless of author",
    "createdAt": "2024-01-10T10:32:00.000Z"
  }
]
```

## Real-time Features

### Socket.io Events

The API provides real-time updates via WebSocket connections using Socket.io.

#### Connection Setup

```javascript
const socket = io('https://your-api-domain.com', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

#### Event Types

**Post Events**:
- `newPost`: New post created
- `updatePost`: Post updated (likes, reactions, edits)
- `deletePost`: Post deleted

**Poll Events**:
- `newPoll`: New poll created
- `updatePoll`: Poll updated (votes, status changes)
- `deletePoll`: Poll deleted

**Comment Events**:
- `newComment`: New comment added
- `updateComment`: Comment updated (edits, likes)
- `deleteComment`: Comment deleted

**Role Events**:
- `newRole`: New role created
- `updateRole`: Role updated
- `deleteRole`: Role deleted
- `assignRole`: Role assigned to user
- `updateUserPermissions`: User permissions updated
- `banUser`: User banned
- `unbanUser`: User unbanned

## Frontend Integration

### JavaScript SDK

```javascript
class EngagementAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
    this.socket = null;
  }

  // Initialize Socket.io connection
  initializeSocket() {
    this.socket = io(this.baseURL.replace('/api', ''), {
      auth: { token: this.token }
    });

    // Event listeners
    this.socket.on('newPost', (post) => {
      console.log('New post received:', post);
      this.handleNewPost(post);
    });

    this.socket.on('updatePost', (post) => {
      console.log('Post updated:', post);
      this.handlePostUpdate(post);
    });

    this.socket.on('newPoll', (poll) => {
      console.log('New poll received:', poll);
      this.handleNewPoll(poll);
    });
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      },
      ...options
    };

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Post Management
  async createPost(postData, mediaFiles = []) {
    const formData = new FormData();
    
    Object.keys(postData).forEach(key => {
      if (Array.isArray(postData[key])) {
        formData.append(key, JSON.stringify(postData[key]));
      } else {
        formData.append(key, postData[key]);
      }
    });

    mediaFiles.forEach(file => {
      formData.append('mediaFiles', file);
    });

    return this.request('/v1/posts', {
      method: 'POST',
      body: formData
    });
  }

  async getPosts(page = 1, limit = 10) {
    return this.request(`/v1/posts?page=${page}&limit=${limit}`);
  }

  async likePost(postId) {
    return this.request(`/v1/posts/${postId}/like`, {
      method: 'POST'
    });
  }

  async reactToPost(postId, reactionType) {
    return this.request(`/v1/posts/${postId}/react`, {
      method: 'POST',
      body: JSON.stringify({ reactionType })
    });
  }

  async deletePost(postId) {
    return this.request(`/v1/posts/${postId}`, {
      method: 'DELETE'
    });
  }

  // Poll Management
  async createPoll(pollData) {
    return this.request('/v1/polls', {
      method: 'POST',
      body: JSON.stringify(pollData)
    });
  }

  async getPolls() {
    return this.request('/v1/polls');
  }

  async voteOnPoll(pollId, optionId) {
    return this.request(`/v1/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId })
    });
  }

  // Comment Management
  async createComment(postId, comment, attachments = []) {
    const formData = new FormData();
    formData.append('comment', comment);
    
    attachments.forEach(file => {
      formData.append('attachments', file);
    });

    return this.request(`/v1/comments/${postId}`, {
      method: 'POST',
      body: formData
    });
  }

  async getComments(postId, page = 1, limit = 10) {
    return this.request(`/v1/comments/${postId}?page=${page}&limit=${limit}`);
  }

  async likeComment(commentId) {
    return this.request(`/v1/comments/${commentId}/like`, {
      method: 'POST'
    });
  }

  // Feed Management
  async getFeed(page = 1, limit = 20) {
    return this.request(`/v1/feed?page=${page}&limit=${limit}`);
  }

  async getTodayCelebrations() {
    return this.request('/v1/feed/greeting');
  }

  // Role Management
  async createRole(roleData) {
    return this.request('/v1/roles-permissions/roles', {
      method: 'POST',
      body: JSON.stringify(roleData)
    });
  }

  async assignRoleToUser(userId, roleName) {
    return this.request(`/v1/roles-permissions/users/${userId}/assign-role`, {
      method: 'PUT',
      body: JSON.stringify({ roleName })
    });
  }

  async banUser(userId) {
    return this.request(`/v1/roles-permissions/users/${userId}/ban`, {
      method: 'PUT'
    });
  }

  // Event handlers (override these in your implementation)
  handleNewPost(post) {
    // Implement your post handling logic
  }

  handlePostUpdate(post) {
    // Implement your post update logic
  }

  handleNewPoll(poll) {
    // Implement your poll handling logic
  }
}

// Usage Example
const api = new EngagementAPI('https://your-api-domain.com/api', 'your-jwt-token');
api.initializeSocket();

// Create a post
const postData = {
  title: 'Team Announcement',
  description: 'Important team update',
  department: ['Engineering'],
  categories: ['Announcements']
};

const mediaFiles = [file1, file2]; // File objects from input

try {
  const newPost = await api.createPost(postData, mediaFiles);
  console.log('Post created:', newPost);
} catch (error) {
  console.error('Failed to create post:', error.message);
}
```

### React Component Examples

```javascript
import React, { useState, useEffect } from 'react';

const EngagementFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const api = new EngagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    api.initializeSocket();
    
    // Override event handlers
    api.handleNewPost = (post) => {
      setFeed(prevFeed => [post, ...prevFeed]);
    };

    api.handlePostUpdate = (updatedPost) => {
      setFeed(prevFeed => 
        prevFeed.map(item => 
          item._id === updatedPost._id ? updatedPost : item
        )
      );
    };

    fetchFeed();

    return () => {
      if (api.socket) {
        api.socket.disconnect();
      }
    };
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await api.getFeed(page, 20);
      setFeed(response.feed);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (itemId, itemType) => {
    try {
      if (itemType === 'post') {
        await api.likePost(itemId);
      } else if (itemType === 'comment') {
        await api.likeComment(itemId);
      }
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      await api.reactToPost(postId, reactionType);
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      await api.voteOnPoll(pollId, optionId);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  if (loading) return <div>Loading feed...</div>;

  return (
    <div className="engagement-feed">
      {feed.map((item) => (
        <div key={item._id} className="feed-item">
          {item.type === 'post' ? (
            <PostComponent 
              post={item} 
              onLike={handleLike}
              onReaction={handleReaction}
            />
          ) : (
            <PollComponent 
              poll={item} 
              onVote={handleVote}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const PostComponent = ({ post, onLike, onReaction }) => {
  return (
    <div className="post">
      <div className="post-header">
        <img src={post.author.user_Avatar} alt="Avatar" />
        <div>
          <h4>{post.author.first_Name} {post.author.last_Name}</h4>
          <span>{post.author.designation}</span>
        </div>
      </div>
      
      <div className="post-content">
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        
        {post.media && post.media.length > 0 && (
          <div className="post-media">
            {post.media.map((url, index) => (
              <img key={index} src={url} alt="Post media" />
            ))}
          </div>
        )}
      </div>
      
      <div className="post-actions">
        <button onClick={() => onLike(post._id, 'post')}>
          👍 {post.likes.length}
        </button>
        
        <div className="reactions">
          {['like', 'love', 'laugh', 'wow', 'sad', 'angry'].map(type => (
            <button 
              key={type}
              onClick={() => onReaction(post._id, type)}
            >
              {getReactionEmoji(type)}
            </button>
          ))}
        </div>
        
        <span>💬 {post.comments.length}</span>
      </div>
    </div>
  );
};

const PollComponent = ({ poll, onVote }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const hasUserVoted = poll.votes.some(vote => 
    vote.user._id === getCurrentUserId()
  );

  return (
    <div className="poll">
      <div className="poll-header">
        <img src={poll.creator.user_Avatar} alt="Avatar" />
        <div>
          <h4>{poll.creator.first_Name} {poll.creator.last_Name}</h4>
          <span>{poll.creator.designation}</span>
        </div>
      </div>
      
      <h3>{poll.question}</h3>
      
      <div className="poll-options">
        {poll.options.map((option) => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          
          return (
            <div key={option._id} className="poll-option">
              {!hasUserVoted && poll.isActive ? (
                <button 
                  onClick={() => onVote(poll._id, option._id)}
                  className="vote-button"
                >
                  {option.text}
                </button>
              ) : (
                <div className="poll-result">
                  <div className="option-text">{option.text}</div>
                  <div className="vote-bar">
                    <div 
                      className="vote-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span>{option.votes} votes ({percentage.toFixed(1)}%)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="poll-info">
        <span>Total votes: {poll.votes.length}</span>
        <span>Ends: {new Date(poll.endTime).toLocaleDateString()}</span>
        <span className={poll.isActive ? 'active' : 'closed'}>
          {poll.isActive ? 'Active' : 'Closed'}
        </span>
      </div>
    </div>
  );
};

function getReactionEmoji(type) {
  const emojis = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
  };
  return emojis[type] || '👍';
}

function getCurrentUserId() {
  // Implement your user ID retrieval logic
  return 'current-user-id';
}

export default EngagementFeed;
```

## Testing Guide

### Using cURL

#### Authentication Setup
```bash
# Get JWT token (replace with actual auth endpoint)
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Set token variable
export JWT_TOKEN="your-jwt-token-here"
```

#### Post Management Tests

**Create Post with Media**:
```bash
curl -X POST https://your-api-domain.com/api/v1/posts \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "title=Test Post" \
  -F "description=This is a test post" \
  -F "department=[\"Engineering\"]" \
  -F "categories=[\"Test\"]" \
  -F "mediaFiles=@image1.jpg" \
  -F "mediaFiles=@image2.jpg"
```

**Get Posts with Pagination**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/posts?page=1&limit=5" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Like a Post**:
```bash
curl -X POST https://your-api-domain.com/api/v1/posts/64a1b2c3d4e5f6789012345/like \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**React to Post**:
```bash
curl -X POST https://your-api-domain.com/api/v1/posts/64a1b2c3d4e5f6789012345/react \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reactionType": "love"}'
```

#### Poll Management Tests

**Create Poll**:
```bash
curl -X POST https://your-api-domain.com/api/v1/polls \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What should be our next team event?",
    "options": ["Bowling", "Mini Golf", "Escape Room"],
    "duration": 48,
    "department": ["Engineering"],
    "categories": ["Events"]
  }'
```

**Vote on Poll**:
```bash
curl -X POST https://your-api-domain.com/api/v1/polls/64a1b2c3d4e5f6789012355/vote \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"optionId": "64a1b2c3d4e5f6789012356"}'
```

#### Comment Management Tests

**Create Comment with Attachment**:
```bash
curl -X POST https://your-api-domain.com/api/v1/comments/64a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "comment=Great post! Attached some relevant documents." \
  -F "attachments=@document.pdf"
```

**Get Comments for Post**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/comments/64a1b2c3d4e5f6789012345?page=1&limit=10" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Feed Management Tests

**Get Unified Feed**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/feed?page=1&limit=20" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Today's Celebrations**:
```bash
curl -X GET https://your-api-domain.com/api/v1/feed/greeting \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Role Management Tests

**Create Role**:
```bash
curl -X POST https://your-api-domain.com/api/v1/roles-permissions/roles \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Content Moderator",
    "permissions": ["view", "createPost", "editAnyPost", "deleteAnyPost"]
  }'
```

**Assign Role to User**:
```bash
curl -X PUT https://your-api-domain.com/api/v1/roles-permissions/users/64a1b2c3d4e5f6789012340/assign-role \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleName": "Content Moderator"}'
```

**Bulk Assign Roles**:
```bash
curl -X PUT https://your-api-domain.com/api/v1/roles-permissions/users/assign-role-bulk \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "Content Moderator",
    "userIds": ["64a1b2c3d4e5f6789012340", "64a1b2c3d4e5f6789012341"]
  }'
```

### Testing Scenarios

#### Content Creation Workflow
1. **Create Role**: Set up moderator role with appropriate permissions
2. **Assign Role**: Give user moderator permissions
3. **Create Post**: Test post creation with media upload
4. **Create Poll**: Test poll creation with validation
5. **Engage**: Test likes, reactions, comments, and votes
6. **Moderate**: Test editing and deletion of content

#### Permission Testing
1. **Limited User**: Test with basic view permissions
2. **Content Creator**: Test with creation permissions
3. **Moderator**: Test with edit/delete any permissions
4. **Admin**: Test role and permission management

#### Real-time Testing
1. **Socket Connection**: Test WebSocket connection with JWT
2. **Live Updates**: Test real-time post/poll updates
3. **Multi-client**: Test updates across multiple clients
4. **Reconnection**: Test automatic reconnection handling

## Error Handling

### Standard Error Response Format

All API errors follow a consistent format:

```json
{
  "message": "Human-readable error message",
  "errors": [] // Optional validation errors array
}
```

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data, validation errors, or business rule violations
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions or authorization denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error, database issues, or external service failures

### Common Error Scenarios

#### Authentication Errors
```json
{
  "message": "Unauthorized access"
}
```

#### Permission Errors
```json
{
  "message": "Forbidden: Insufficient permissions"
}
```

#### Validation Errors
```json
{
  "errors": [
    {
      "msg": "Question is required",
      "param": "question",
      "location": "body"
    }
  ]
}
```

#### Business Rule Violations
```json
{
  "message": "You have already voted on this poll"
}
```

#### Resource Conflicts
```json
{
  "message": "Role already exists"
}
```

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication with expiration
- **Token Validation**: Middleware validates tokens on every request
- **Socket Authentication**: Real-time connections require valid tokens

### Authorization Security
- **Granular Permissions**: Fine-grained permission system for different actions
- **Role-based Access**: Role assignment with permission inheritance
- **Resource Ownership**: Users can edit/delete their own content
- **Admin Controls**: Special permissions for moderation and administration

### Data Security
- **Input Validation**: Comprehensive request validation using express-validator
- **File Upload Security**: Secure file handling with type and size restrictions
- **SQL Injection Prevention**: MongoDB with proper query sanitization
- **XSS Prevention**: Input sanitization and output encoding

### Content Security
- **Moderation System**: Built-in content moderation with audit trails
- **Expiry Management**: Automatic content expiration and cleanup
- **Media Management**: Secure cloud storage with proper access controls
- **Ban System**: User restriction capabilities for policy violations

## Performance Optimization

### Database Optimization
- **Indexing**: Proper database indexes for query performance
- **Pagination**: Consistent pagination across all list endpoints
- **Aggregation**: Efficient MongoDB aggregation for complex queries
- **Population**: Selective field population to minimize data transfer

### Caching Strategy
- **Result Caching**: Cache frequently accessed data (implementation ready)
- **Static Asset Caching**: Cloudinary CDN for media files
- **Real-time Optimization**: Efficient Socket.io event broadcasting

### API Performance
- **Rate Limiting**: Implement rate limiting for API protection
- **Compression**: Response compression for reduced bandwidth
- **Connection Pooling**: Database connection pooling for efficiency

## Troubleshooting

### Common Issues

#### 1. Authentication Failures

**Issue**: "Unauthorized access"

**Causes**:
- Missing or invalid JWT token
- Expired token
- Malformed Authorization header

**Solutions**:
- Verify Authorization header format: `Authorization: Bearer <token>`
- Check token expiration and refresh if needed
- Ensure token is properly generated and signed

#### 2. Permission Denied

**Issue**: "Forbidden: Insufficient permissions"

**Causes**:
- User lacks required permissions for the operation
- Role not properly assigned
- Permission system misconfiguration

**Solutions**:
- Check user's current permissions in database
- Verify role assignment and permission inheritance
- Contact administrator for permission updates

#### 3. File Upload Issues

**Issue**: File upload fails or returns errors

**Causes**:
- File size exceeds limits
- Unsupported file type
- Cloudinary configuration issues
- Network timeout during upload

**Solutions**:
- Check file size limits (varies by endpoint)
- Verify supported file types
- Test Cloudinary configuration
- Implement retry logic for large files

#### 4. Real-time Connection Issues

**Issue**: Socket.io events not received

**Causes**:
- WebSocket connection blocked by firewall
- Invalid token in socket authentication
- Client-side event listener not registered

**Solutions**:
- Verify WebSocket support and firewall rules
- Check socket authentication token
- Ensure event listeners are properly registered
- Test connection fallback options

#### 5. Poll Voting Issues

**Issue**: "You have already voted on this poll"

**Causes**:
- User attempting to vote multiple times
- Poll status not properly updated
- Vote tracking inconsistency

**Solutions**:
- Check poll.votes array for user's existing vote
- Verify poll.isActive status
- Implement proper vote validation logic

#### 6. Feed Loading Issues

**Issue**: Feed returns empty or incomplete results

**Causes**:
- Schedule/expiry date filtering issues
- Aggregation pipeline errors
- Timezone conflicts

**Solutions**:
- Check server timezone configuration
- Verify schedule and expiry date formats
- Test aggregation pipeline with sample data
- Debug time-based filtering logic

### Debugging Tips

#### API Request Debugging
1. **Headers**: Verify all required headers are present and correct
2. **Authentication**: Test token validity independently
3. **Request Format**: Ensure JSON/FormData format matches endpoint requirements
4. **Validation**: Check request body against validation rules

#### Real-time Debugging
1. **Connection**: Monitor socket connection status
2. **Events**: Log all incoming and outgoing socket events
3. **Authentication**: Verify socket authentication separately
4. **Room Management**: Check socket room assignments for targeted events

#### Permission Debugging
1. **User Roles**: Query user's current role and permissions
2. **Permission Check**: Test authorization middleware independently
3. **Role Inheritance**: Verify permission inheritance from roles
4. **Cache Issues**: Clear any permission caching if implemented

#### Performance Debugging
1. **Query Performance**: Monitor database query execution times
2. **Memory Usage**: Check for memory leaks in long-running processes
3. **Network Latency**: Test API response times under load
4. **File Upload**: Monitor upload progress and failure rates

### Monitoring and Alerting

#### Health Checks
- **API Endpoints**: Regular health check endpoint monitoring
- **Database**: Connection and query performance monitoring
- **External Services**: Cloudinary and holiday API availability
- **Real-time**: Socket.io connection and event delivery monitoring

#### Error Tracking
- **Application Errors**: Comprehensive error logging with context
- **Performance Metrics**: Response time and throughput monitoring
- **User Activity**: Engagement metrics and usage patterns
- **Security Events**: Authentication failures and permission violations

## Conclusion

The Employee Engagement API provides a comprehensive platform for organizational communication and collaboration. With its robust permission system, real-time capabilities, content scheduling, and moderation tools, it offers enterprise-grade functionality for modern workplace engagement.

The API is designed for scalability, security, and maintainability, making it suitable for organizations of all sizes. The comprehensive testing guide, frontend integration examples, and troubleshooting documentation ensure smooth implementation and operation.

For additional support, integration assistance, or feature requests, please contact the development team or refer to the internal documentation system.
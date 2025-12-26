---
title: Employee Engagement Module - Complete Documentation
sidebar_position: 6
---

# Employee Engagement Module - Complete Documentation

This document provides a comprehensive guide to the Employee Engagement module, covering frontend components, backend APIs, real-time socket communication, data flow, and implementation details.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Components](#frontend-components)
4. [Backend API Routes](#backend-api-routes)
5. [Socket.io Real-time Updates](#socketio-real-time-updates)
6. [Data Flow](#data-flow)
7. [Models & Schemas](#models--schemas)
8. [Permissions & Authorization](#permissions--authorization)
9. [Key Features](#key-features)
10. [API Endpoints Reference](#api-endpoints-reference)

## Overview

The Employee Engagement module enables employees to:

- Create and share posts with media attachments
- Create and participate in polls
- Comment on posts
- Like posts and comments
- React to posts with emojis (👍, ❤️, 😂, 😮, 😢, 😡)
- View a unified feed of posts and polls
- Filter content by category and department
- Schedule posts for future publication
- Set expiry dates for posts

## Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend API    │         │   Socket.io     │
│   (React)       │◄───────►│   (Express)      │◄───────►│   (Real-time)   │
└─────────────────┘         └──────────────────┘         └─────────────────┘
       │                              │                            │
       │                              │                            │
       ▼                              ▼                            ▼
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Zustand       │         │   Controllers    │         │   MongoDB       │
│   Stores        │         │   & Services     │         │   Database      │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### Component Hierarchy

```
Feed.jsx (Main Container)
├── CreateCard.jsx (Post/Poll Creation Trigger)
│   ├── PostCreateBox.jsx (Post Creation Modal)
│   └── PollCreateBox.jsx (Poll Creation Modal)
├── PostCard.jsx (Individual Post Display)
│   ├── MediaCarousel.jsx (Media Display)
│   └── Comment Drawer (Comments Modal)
└── PollCard.jsx (Individual Poll Display)
```

## Frontend Components

### 1. Feed Component (`Feed.jsx`)

**Location:** `hcmFrontend/src/components/engagement/Feed.jsx`

**Purpose:** Main container that displays the unified feed of posts and polls.

**Key Features:**

- Infinite scroll pagination
- Filtering by category and department
- Sorting (newest/oldest)
- Real-time updates via socket.io
- Loading states and error handling

**State Management:**

- Uses `useFeedStore` for feed data
- Uses `useSocketStore` for socket connection

**Key Functions:**

```javascript
fetchFeed(page) - Fetches feed data from API
fetchMoreData() - Loads next page for infinite scroll
filteredSortedFeed - Filters and sorts feed items
```

**Props:**

- `curCategory`: Current selected category filter
- `curDepartment`: Current selected department filter
- `curSort`: Sort order ("newest" or "oldest")
- `onRefresh`: Boolean to trigger refresh
- `refreshStatus`: Callback for refresh status

#### Detailed Implementation Example

**Component Structure:**

```javascript
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./Card/PostCard";
import PollCard from "./Card/PollCard";
import CreateCard from "./Card/CreateCard";
import useFeedStore from "../../store/feedStore";
import useSocketStore from "../../store/socketStore";

const Feed = ({
  curCategory = "All Announcement",
  curDepartment = "all",
  curSort = "newest",
  onRefresh = false,
  refreshStatus,
}) => {
  // Get store methods and state
  const { feed, isLoading, error, hasMore, fetchFeed, page, refreshFeed } =
    useFeedStore();
  const { connect } = useSocketStore();

  // Initialize feed and socket on mount
  useEffect(() => {
    fetchFeed(1); // Load first page
    connect(); // Establish socket connection
  }, [fetchFeed, connect]);

  // Handle manual refresh trigger
  useEffect(() => {
    if (onRefresh) {
      useFeedStore.getState().refreshFeed();
    }
  }, [onRefresh]);

  // Load more data for infinite scroll
  const fetchMoreData = () => {
    if (hasMore && !isLoading) {
      fetchFeed(page + 1);
    }
  };

  // Filter and sort feed items
  const filteredSortedFeed = feed
    .filter((item) => {
      // Category filter
      const matchesCategory =
        curCategory === "All Announcement" || item.categories === curCategory;

      // Department filter
      const matchesDepartment =
        curDepartment === "all" || item.department.includes(curDepartment);

      return matchesCategory && matchesDepartment;
    })
    .sort((a, b) => {
      // Sort by schedule date or creation date
      const dateA = new Date(a.scheduleDate || a.createdAt);
      const dateB = new Date(b.scheduleDate || b.createdAt);
      return curSort === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Error Display */}
      {error && (
        <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Create Post/Poll Card - Sticky at top */}
      <div className="sticky top-0 z-10 px-2 pt-2 pb-0.5">
        <CreateCard refreshStatus={refreshStatus} />
      </div>

      {/* Infinite Scroll Container */}
      <div id="scrollableDiv" className="flex-1 overflow-y-auto px-2">
        <InfiniteScroll
          dataLength={filteredSortedFeed.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingSkeleton />}
          endMessage={<EndOfFeedMessage />}
          scrollableTarget="scrollableDiv"
        >
          {/* Render Posts and Polls */}
          <div className="w-full space-y-3">
            {filteredSortedFeed.map((item) =>
              item.type === "post" ? (
                <PostCard key={item._id} post={item} />
              ) : item.type === "poll" ? (
                <PollCard key={item._id} poll={item} />
              ) : null
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};
```

**Example Usage:**

```javascript
// In parent component
<Feed
  curCategory="General"
  curDepartment="engineering"
  curSort="newest"
  onRefresh={shouldRefresh}
  refreshStatus={(status) => console.log("Refresh:", status)}
/>
```

**Data Flow Example:**

1. **Initial Load:**

   ```javascript
   // Component mounts
   useEffect(() => {
     fetchFeed(1); // Calls API: GET /api/v1/feed?page=1&limit=20
     connect(); // Establishes socket connection
   }, []);
   ```

2. **Socket Update:**

   ```javascript
   // When new post is created by another user
   socket.on("newPost", (post) => {
     // Automatically adds to feed without refresh
     useFeedStore.getState().addPost(post);
   });
   ```

3. **Infinite Scroll:**

   ```javascript
   // User scrolls to bottom
   fetchMoreData(); // Calls API: GET /api/v1/feed?page=2&limit=20
   // Appends new items to existing feed
   ```

4. **Filtering:**
   ```javascript
   // User selects "General" category
   filteredSortedFeed = feed.filter((item) => item.categories === "General");
   // UI updates immediately without API call
   ```

### 2. PostCard Component (`PostCard.jsx`)

**Location:** `hcmFrontend/src/components/engagement/Card/PostCard.jsx`

**Purpose:** Displays individual post with all interactions.

**Features:**

- Post display with author info
- Media carousel for images/videos
- Like functionality
- Emoji reactions (6 types)
- Comments section
- Edit/Delete (with permissions)
- Read more/less for long descriptions

**API Calls:**

- `POST /posts/:id/like` - Like/unlike post
- `POST /posts/:id/react` - Add/update reaction
- `POST /comments/:postId` - Add comment
- `POST /comments/:id/like` - Like comment
- `DELETE /posts/:id` - Delete post
- `DELETE /comments/:id` - Delete comment

**State:**

- `showComments`: Toggle comment drawer
- `showLike`: Toggle likes modal
- `showReact`: Toggle reactions modal
- `selectedReaction`: Current user's reaction
- `commentText`: Comment input text

#### Detailed Implementation Examples

**1. Like Post Functionality:**

```javascript
const handleLike = async () => {
  setIsLiking(true);
  try {
    // Optimistic update - update UI immediately
    let updatedLikes;
    if (liked) {
      // Remove like
      updatedLikes = post.likes.filter((likeObj) => likeObj._id !== userId);
    } else {
      // Add like
      updatedLikes = [...post.likes, { _id: userId }];
    }

    // Update local store immediately
    useFeedStore.getState().updatePost({
      ...post,
      likes: updatedLikes,
    });

    // Make API call
    const { data: updatedPost } = await axiosInstance.post(
      `/posts/${post._id}/like`
    );

    // Update with server response (authoritative)
    useFeedStore.getState().updatePost(updatedPost);
  } catch (error) {
    // Revert optimistic update on error
    toast.error(error.response?.data?.message || "Failed to like/unlike post.");
    // Revert to original state
    useFeedStore.getState().updatePost(post);
  } finally {
    setIsLiking(false);
  }
};
```

**Example Request/Response:**

```javascript
// Request
POST /api/v1/posts/507f1f77bcf86cd799439011/like
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response (200 OK)
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Team Meeting Tomorrow",
  "description": "Don't forget about the team meeting...",
  "likes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "first_Name": "John",
      "last_Name": "Doe",
      "employee_Id": "EMP001",
      "user_Avatar": "https://example.com/avatar.jpg"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "first_Name": "Jane",
      "last_Name": "Smith",
      "employee_Id": "EMP002",
      "user_Avatar": "https://example.com/avatar2.jpg"
    }
  ],
  "reactions": [...],
  "comments": [...],
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**2. Add Reaction Example:**

```javascript
const handleReact = async (reactionType) => {
  if (isLiking) return; // Prevent double-click
  setIsLiking(true);

  try {
    // Find existing reaction by current user
    const userReaction = post.reactions?.find((r) => {
      const reactionUserId = typeof r.user === "object" ? r.user._id : r.user;
      return reactionUserId === userId;
    });

    let updatedReactions;

    if (userReaction && userReaction.type === reactionType) {
      // Remove reaction if clicking same type
      updatedReactions = post.reactions.filter((r) => {
        const reactionUserId = typeof r.user === "object" ? r.user._id : r.user;
        return reactionUserId !== userId;
      });
      setSelectedReaction(null);
    } else if (userReaction) {
      // Change reaction type
      updatedReactions = post.reactions.map((r) => {
        const reactionUserId = typeof r.user === "object" ? r.user._id : r.user;
        return reactionUserId === userId ? { ...r, type: reactionType } : r;
      });
      setSelectedReaction(reactionType);
    } else {
      // Add new reaction
      updatedReactions = [
        ...(post.reactions || []),
        {
          user: userId,
          type: reactionType,
          _id: `temp-${Date.now()}`,
        },
      ];
      setSelectedReaction(reactionType);
    }

    // Optimistic update
    useFeedStore
      .getState()
      .updatePost({ ...post, reactions: updatedReactions });

    // API call
    const { data: updatedPost } = await axiosInstance.post(
      `/posts/${post._id}/react`,
      { reactionType }
    );

    // Update with server data
    useFeedStore.getState().updatePost(updatedPost);
  } catch (error) {
    toast.error("Failed to react to post.");
    // Revert on error
    useFeedStore.getState().updatePost(post);
  } finally {
    setIsLiking(false);
  }
};
```

**Example Request/Response:**

```javascript
// Request
POST /api/v1/posts/507f1f77bcf86cd799439011/react
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  Content-Type: "application/json"
}
Body: {
  "reactionType": "love"
}

// Response (200 OK)
{
  "_id": "507f1f77bcf86cd799439011",
  "reactions": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "first_Name": "John",
        "last_Name": "Doe",
        "employee_Id": "EMP001",
        "user_Avatar": "https://example.com/avatar.jpg"
      },
      "type": "love"
    }
  ],
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

**3. Add Comment Example:**

```javascript
const handleAddComment = async (e) => {
  e.preventDefault();
  if (!commentText.trim()) {
    toast.error("Comment cannot be empty.");
    return;
  }
  if (isAddingComment) return; // Prevent double submission

  setIsAddingComment(true);
  try {
    // API call to create comment
    const { data } = await axiosInstance.post(`/comments/${post._id}`, {
      comment: commentText,
    });

    const newComment = data.comment;

    // Add comment to local store
    if (newComment && newComment.commenter) {
      useFeedStore.getState().addComment(post._id, newComment);
      toast.success("Comment added successfully!");
    }

    // Clear input
    setCommentText("");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to add comment.");
  } finally {
    setIsAddingComment(false);
  }
};
```

**Example Request/Response:**

```javascript
// Request
POST /api/v1/comments/507f1f77bcf86cd799439011
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  Content-Type: "application/json"
}
Body: {
  "comment": "Great post! Looking forward to the meeting."
}

// Response (201 Created)
{
  "comment": {
    "_id": "507f1f77bcf86cd799439015",
    "post": "507f1f77bcf86cd799439011",
    "commenter": {
      "_id": "507f1f77bcf86cd799439012",
      "first_Name": "John",
      "last_Name": "Doe",
      "employee_Id": "EMP001",
      "user_Avatar": "https://example.com/avatar.jpg"
    },
    "comment": "Great post! Looking forward to the meeting.",
    "reactions": [],
    "createdAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**4. Permission Check Example:**

```javascript
// Get user permissions from store
const permissions = selectedEmployee?.engagement_permission?.permissions || [];

// Check if user can delete this post
const canDeletePost =
  permissions.includes("deleteAnyPost") || // Admin/HR can delete any
  userId === post.author?._id || // Author can delete own
  userId === post.author?.employee_Id; // Check by employee ID too

// Check if user can edit this post
const canEditPost =
  permissions.includes("editAnyPost") ||
  userId === post.author?._id ||
  userId === post.author?.employee_Id;

// Conditionally render edit/delete buttons
{
  canEditPost && (
    <button onClick={handleEditPost}>
      <MdEdit />
    </button>
  );
}
{
  canDeletePost && (
    <button onClick={handleDeletePost}>
      <MdDelete />
    </button>
  );
}
```

### 3. PollCard Component (`PollCard.jsx`)

**Location:** `hcmFrontend/src/components/engagement/Card/PollCard.jsx`

**Purpose:** Displays poll with voting functionality.

**Features:**

- Poll question display
- Multiple choice options (2-5)
- Vote submission
- Real-time vote count and percentages
- Countdown timer
- Delete functionality (with permissions)

**API Calls:**

- `POST /polls/:id/vote` - Submit vote
- `GET /polls/:id` - Fetch updated poll
- `DELETE /polls/:id` - Delete poll

**State:**

- `selectedOption`: Currently selected option
- `isVoting`: Voting in progress
- `timeRemaining`: Countdown timer string

### 4. PostCreateBox Component (`PostCreateBox.jsx`)

**Location:** `hcmFrontend/src/components/engagement/CreateBox/PostCreateBox.jsx`

**Purpose:** Modal for creating/editing posts.

**Features:**

- Rich text editor (ReactQuill) for title and description
- Media upload (images and videos)
- Department selection (multi-select)
- Category selection
- Schedule date/time
- Expiry settings (24h, 48h, 1 week, manual, no expiry)
- Media preview carousel

**Form Data:**

```javascript
{
  title: string (HTML),
  description: string (HTML),
  mediaFiles: File[],
  department: string[],
  categories: string,
  schedule: ISO string (optional),
  expiry: string or ISO string,
  remainingMediaUrls: string[] (for edit)
}
```

**API Calls:**

- `POST /posts` - Create post
- `PUT /posts/:id` - Update post

### 5. PollCreateBox Component (`PollCreateBox.jsx`)

**Location:** `hcmFrontend/src/components/engagement/CreateBox/PollCreateBox.jsx`

**Purpose:** Modal for creating polls.

**Features:**

- Question input
- Dynamic options (2-5 options)
- Duration selection (hours)
- Department selection
- Category selection

**Form Data:**

```javascript
{
  question: string,
  options: string[],
  duration: number (hours),
  department: string[],
  categories: string
}
```

**API Calls:**

- `POST /polls` - Create poll

### 6. Feed Store (`feedStore.js`)

**Location:** `hcmFrontend/src/store/feedStore.js`

**Purpose:** Zustand store managing feed state.

**State:**

```javascript
{
  feed: [],           // Array of posts and polls
  feedById: {},      // Single feed item by ID
  page: 1,           // Current page
  pages: 1,          // Total pages
  isLoading: false,  // Loading state
  hasMore: true,     // Has more pages
  error: null        // Error message
}
```

**Methods:**

- `fetchFeed(page)` - Fetch feed from API
- `fetchFeedById(id)` - Fetch single item
- `refreshFeed()` - Reset and refetch
- `addPost(post)` - Add post to feed
- `updatePost(post)` - Update post in feed
- `deletePost(postId)` - Remove post from feed
- `addPoll(poll)` - Add poll to feed
- `updatePoll(poll)` - Update poll in feed
- `deletePoll(pollId)` - Remove poll from feed
- `addComment(postId, comment)` - Add comment to post
- `updateComment(postId, comment)` - Update comment
- `deleteComment(postId, commentId)` - Remove comment

### 7. Socket Store (`socketStore.js`)

**Location:** `hcmFrontend/src/store/socketStore.js`

**Purpose:** Manages Socket.io connection and event listeners.

**Connection:**

```javascript
io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
  auth: { token: accessToken },
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

**Socket Events Listened:**

- `newPost` - New post created
- `updatePost` - Post updated (likes, reactions, edits)
- `deletePost` - Post deleted
- `newComment` - New comment added
- `updateComment` - Comment updated
- `deleteComment` - Comment deleted
- `newPoll` - New poll created
- `updatePoll` - Poll updated (votes)
- `deletePoll` - Poll deleted

## Backend API Routes

### Posts Routes (`posts.route.js`)

**Location:** `hcmBackendv2/src/routes/v1/Engagement/posts.route.js`

**Base Path:** `/api/v1/posts`

| Method | Endpoint     | Controller   | Auth | Permissions                        |
| ------ | ------------ | ------------ | ---- | ---------------------------------- |
| POST   | `/`          | `createPost` | JWT  | `createPost`                       |
| GET    | `/`          | `getPosts`   | JWT  | `view`                             |
| PUT    | `/:id`       | `updatePost` | JWT  | `editAnyPost` or `editOwnPost`     |
| DELETE | `/:id`       | `deletePost` | JWT  | `deleteAnyPost` or `deleteOwnPost` |
| POST   | `/:id/like`  | `likePost`   | JWT  | `view`                             |
| POST   | `/:id/react` | `reactPost`  | JWT  | `view`                             |

**File Upload:**

- Uses `multer` middleware
- Supports up to 5 media files
- Files stored in memory before upload to Cloudinary

### Polls Routes (`poll.route.js`)

**Location:** `hcmBackendv2/src/routes/v1/Engagement/poll.route.js`

**Base Path:** `/api/v1/polls`

| Method | Endpoint    | Controller   | Auth | Permissions                        |
| ------ | ----------- | ------------ | ---- | ---------------------------------- |
| POST   | `/`         | `createPoll` | JWT  | `createPoll`                       |
| GET    | `/`         | `getPolls`   | JWT  | `viewPoll`                         |
| POST   | `/:id/vote` | `votePoll`   | JWT  | `votePoll`                         |
| DELETE | `/:id`      | `deletePoll` | JWT  | `deleteAnyPoll` or `deleteOwnPoll` |

**Validation:**

- Question required
- Options: array of 2-5 items
- Each option text required
- Duration: minimum 1 hour

### Comments Routes (`comments.route.js`)

**Location:** `hcmBackendv2/src/routes/v1/Engagement/comments.route.js`

**Base Path:** `/api/v1/comments`

| Method | Endpoint    | Controller      | Auth | Permissions                              |
| ------ | ----------- | --------------- | ---- | ---------------------------------------- |
| POST   | `/:postId`  | `createComment` | JWT  | `addComment`                             |
| GET    | `/:postId`  | `getComments`   | JWT  | `view`                                   |
| PUT    | `/:id`      | `updateComment` | JWT  | `editAnyComment` or `editOwnComment`     |
| DELETE | `/:id`      | `deleteComment` | JWT  | `deleteAnyComment` or `deleteOwnComment` |
| POST   | `/:id/like` | `likeComment`   | JWT  | `view`                                   |

### Feed Routes (`feed.route.js`)

**Location:** `hcmBackendv2/src/routes/v1/Engagement/feed.route.js`

**Base Path:** `/api/v1/feed`

| Method | Endpoint            | Controller                | Auth | Permissions |
| ------ | ------------------- | ------------------------- | ---- | ----------- |
| GET    | `/`                 | `getFeed`                 | JWT  | `viewFeed`  |
| GET    | `/:id`              | `getFeedById`             | JWT  | `viewFeed`  |
| GET    | `/greeting`         | `getTodayCelebration`     | JWT  | -           |
| GET    | `/upComingGreeting` | `getUpcomingCelebrations` | JWT  | -           |

## Socket.io Real-time Updates

### Server-Side Socket Events

**Location:** Controllers emit events via `req.app.get("socketio")`

**Events Emitted:**

1. **Post Events:**

   - `newPost` - When a post is created
   - `updatePost` - When a post is updated (likes, reactions, edits)
   - `deletePost` - When a post is deleted

2. **Comment Events:**

   - `newComment` - When a comment is added
   - `updateComment` - When a comment is updated
   - `deleteComment` - When a comment is deleted

3. **Poll Events:**
   - `newPoll` - When a poll is created
   - `updatePoll` - When a poll is updated (votes)
   - `deletePoll` - When a poll is deleted

**Example from Controller:**

```javascript
const io = req.app.get("socketio");
io.emit("newPost", populatedPost);
io.emit("updatePost", updatedPost);
io.emit("deletePost", { postId: req.params.id });
```

### Client-Side Socket Handling

**Connection Setup:**

```javascript
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
  auth: { token: accessToken },
});
```

**Event Listeners:**

```javascript
socket.on("newPost", (post) => {
  useFeedStore.getState().addPost(post);
  toast.info("A new post has been added.");
});

socket.on("updatePost", (updatedPost) => {
  useFeedStore.getState().updatePost(updatedPost);
  toast.info("A post has been updated.");
});

socket.on("deletePost", ({ postId }) => {
  useFeedStore.getState().deletePost(postId);
  toast.info("A post has been deleted.");
});
```

## Data Flow

### Creating a Post

```mermaid
sequenceDiagram
    participant User
    participant PostCreateBox
    participant API
    participant Controller
    participant Database
    participant Socket
    participant OtherClients

    User->>PostCreateBox: Fill form & submit
    PostCreateBox->>API: POST /posts (FormData)
    API->>Controller: createPost(req)
    Controller->>Database: Save post
    Controller->>Cloudinary: Upload media
    Controller->>Database: Update post with media URLs
    Controller->>Socket: emit("newPost", post)
    Controller->>API: Return created post
    API->>PostCreateBox: Success response
    PostCreateBox->>User: Show success toast
    Socket->>OtherClients: Broadcast newPost event
    OtherClients->>OtherClients: Update feed store
```

### Liking a Post

```mermaid
sequenceDiagram
    participant User
    participant PostCard
    participant API
    participant Controller
    participant Database
    participant Socket
    participant OtherClients

    User->>PostCard: Click like button
    PostCard->>PostCard: Optimistic update (UI)
    PostCard->>API: POST /posts/:id/like
    API->>Controller: likePost(req)
    Controller->>Database: Toggle like in post
    Controller->>Database: Populate post with user data
    Controller->>Socket: emit("updatePost", post)
    Controller->>API: Return updated post
    API->>PostCard: Success response
    PostCard->>PostCard: Update store with server data
    Socket->>OtherClients: Broadcast updatePost event
    OtherClients->>OtherClients: Update feed store
```

### Voting on a Poll

```mermaid
sequenceDiagram
    participant User
    participant PollCard
    participant API
    participant Controller
    participant Database
    participant Socket
    participant OtherClients

    User->>PollCard: Select option & vote
    PollCard->>API: POST /polls/:id/vote
    API->>Controller: votePoll(req)
    Controller->>Database: Record vote
    Controller->>Database: Update option vote count
    Controller->>Database: Check if poll expired
    Controller->>Socket: emit("updatePoll", poll)
    Controller->>API: Return updated poll
    API->>PollCard: Success response
    PollCard->>PollCard: Update store
    Socket->>OtherClients: Broadcast updatePoll event
    OtherClients->>OtherClients: Update feed store
```

## Models & Schemas

### Post Model

**Location:** `hcmBackendv2/src/models/Engagement/post.model.js`

```javascript
{
  author: ObjectId (ref: User),
  title: String (required),
  description: String (required),
  department: [String] (required),
  categories: String (required),
  scheduleDate: Date (required),
  expiryDate: Date (optional),
  media: [String], // URLs
  likes: [ObjectId] (ref: User),
  reactions: [{
    user: ObjectId (ref: User),
    type: String // "good", "love", "laugh", "surprised", "sad", "angry"
  }],
  comments: [ObjectId] (ref: CommentEng),
  isModerated: Boolean (default: false),
  moderatedBy: ObjectId (ref: User),
  moderationReason: String,
  attachments: [{
    type: String,
    url: String,
    name: String,
    meta: Mixed
  }],
  visibility: String (default: "company"),
  createdAt: Date,
  updatedAt: Date
}
```

### Poll Model

**Location:** `hcmBackendv2/src/models/Engagement/poll.model.js`

```javascript
{
  question: String (required),
  options: [{
    text: String (required),
    votes: Number (default: 0)
  }], // Max 5 options
  department: [ObjectId] (ref: Department),
  categories: String (required),
  creator: ObjectId (ref: User, required),
  votes: [{
    user: ObjectId (ref: User, required),
    option: ObjectId (required)
  }],
  isActive: Boolean (default: true),
  duration: Number (required), // hours
  endTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

**Location:** `hcmBackendv2/src/models/Engagement/comment.model.js`

```javascript
{
  post: ObjectId (ref: Post, required),
  commenter: ObjectId (ref: User, required),
  comment: String (required),
  attachments: [String], // URLs
  reactions: [{
    user: ObjectId (ref: User),
    type: String (default: "like")
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Permissions & Authorization

### Authorization Middleware

**Location:** `hcmBackendv2/src/controllers/Engagement/authorize.js`

**Function:**

```javascript
authorize(requiredPermissions) => middleware
```

**How it works:**

1. Extracts `engagement_permission.permissions` from `req.user`
2. Checks if user has all required permissions
3. Returns 403 if permissions are missing

**Usage:**

```javascript
router.post("/", verifyJWT, authorize(["createPost"]), createPost);
```

### Common Permissions

| Permission         | Description              |
| ------------------ | ------------------------ |
| `view`             | View posts and feed      |
| `viewFeed`         | Access feed endpoint     |
| `viewPoll`         | View polls               |
| `createPost`       | Create new posts         |
| `createPoll`       | Create new polls         |
| `editAnyPost`      | Edit any post            |
| `editOwnPost`      | Edit own posts only      |
| `deleteAnyPost`    | Delete any post          |
| `deleteOwnPost`    | Delete own posts only    |
| `addComment`       | Add comments             |
| `editAnyComment`   | Edit any comment         |
| `editOwnComment`   | Edit own comments only   |
| `deleteAnyComment` | Delete any comment       |
| `deleteOwnComment` | Delete own comments only |
| `votePoll`         | Vote on polls            |
| `deleteAnyPoll`    | Delete any poll          |
| `deleteOwnPoll`    | Delete own polls only    |

### Permission Checks in Frontend

**Location:** `PostCard.jsx` and `PollCard.jsx`

```javascript
const permissions = selectedEmployee?.engagement_permission?.permissions || [];

const canDeletePost =
  permissions.includes("deleteAnyPost") ||
  userId === post.author?._id ||
  userId === post.author?.employee_Id;

const canEditPost =
  permissions.includes("editAnyPost") ||
  userId === post.author?._id ||
  userId === post.author?.employee_Id;
```

## Key Features

### 1. Media Handling

- **Upload:** Files uploaded to Cloudinary via multer
- **Storage:** Media stored in `employee_engagement` folder
- **URLs:** Presigned URLs generated (7 days expiry, AWS maximum)
- **Types:** Images (jpg, png, gif, etc.) and Videos (mp4, webm, mov, etc.)
- **Limit:** Maximum 5 files per post

### 2. Scheduling

- Posts can be scheduled for future publication
- `scheduleDate` determines when post appears in feed
- Feed query filters: `scheduleDate <= now`

### 3. Expiry

- Posts can have expiry dates
- Options: 24h, 48h, 1 week, manual date/time, or no expiry
- Feed query filters: `expiryDate > now OR expiryDate === null`

### 4. Categories

Available categories:

- All Announcement
- Job Openings
- General
- New Hire
- SOP Updates
- Policy Updates
- Promotion
- Transfer
- Training
- Special

### 5. Department Targeting

- Posts and polls can target specific departments
- "All Departments" option available
- Multi-select department picker
- Feed filtering by department

### 6. Reactions

Six emoji reaction types:

- 👍 Good
- ❤️ Love
- 😂 Laugh
- 😮 Surprised
- 😢 Sad
- 😡 Angry

Users can:

- Add reaction
- Change reaction
- Remove reaction

### 7. Infinite Scroll

- Pagination: 20 items per page
- Load more on scroll
- Loading states
- End of feed indicator

### 8. Real-time Updates

- Socket.io for instant updates
- No page refresh needed
- Toast notifications for events
- Optimistic UI updates

## API Endpoints Reference

### Posts

#### Create Post

**Endpoint:** `POST /api/v1/posts`

**Headers:**

```http
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**FormData Fields:**

- `title`: string (HTML) - Required
- `description`: string (HTML) - Required
- `mediaFiles`: File[] (max 5) - Optional
- `department`: string[] (department IDs) - Required
- `categories`: string - Required
- `schedule`: string (ISO date) - Optional
- `expiry`: string - Required (options: "24 hour", "48 hour", "1 week", "Manual", "no expiry" or ISO date string)
- `remainingMediaUrls`: string[] (for edit, JSON stringified) - Optional

**Example Request (JavaScript):**

```javascript
const formData = new FormData();

// Required fields
formData.append("title", "<strong>Team Meeting Tomorrow</strong>");
formData.append(
  "description",
  "<p>Don't forget about the team meeting at 2 PM. We'll discuss Q1 goals.</p>"
);
formData.append("categories", "General");

// Department selection (can be multiple)
formData.append("department", "507f1f77bcf86cd799439011"); // Engineering
formData.append("department", "507f1f77bcf86cd799439012"); // Marketing

// Optional: Schedule for future
const scheduleDate = new Date("2024-01-20T14:00:00Z");
formData.append("schedule", scheduleDate.toISOString());

// Expiry options
formData.append("expiry", "48 hour"); // or "24 hour", "1 week", "no expiry"

// For manual expiry
// formData.append("expiry", "2024-01-22T14:00:00Z");

// Media files (optional, max 5)
const imageFile = document.querySelector('input[type="file"]').files[0];
formData.append("mediaFiles", imageFile);

// Make request
const response = await axiosInstance.post("/posts", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "title=<strong>Team Meeting</strong>" \
  -F "description=<p>Meeting at 2 PM</p>" \
  -F "categories=General" \
  -F "department=507f1f77bcf86cd799439011" \
  -F "expiry=48 hour" \
  -F "mediaFiles=@/path/to/image.jpg"
```

**Example Response (201 Created):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "author": {
    "_id": "507f1f77bcf86cd799439020",
    "first_Name": "John",
    "last_Name": "Doe",
    "employee_Id": "EMP001",
    "user_Avatar": "https://example.com/avatar.jpg",
    "designation": "Senior Developer"
  },
  "title": "<strong>Team Meeting Tomorrow</strong>",
  "description": "<p>Don't forget about the team meeting at 2 PM. We'll discuss Q1 goals.</p>",
  "department": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "categories": "General",
  "scheduleDate": "2024-01-20T14:00:00.000Z",
  "expiryDate": "2024-01-22T14:00:00.000Z",
  "media": [
    "https://s3.amazonaws.com/bucket/employee_engagement/image123.jpg?X-Amz-Algorithm=..."
  ],
  "likes": [],
  "reactions": [],
  "comments": [],
  "isModerated": false,
  "visibility": "company",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Error Responses:**

```json
// 400 Bad Request - Missing required field
{
  "message": "Title and Description are required."
}

// 403 Forbidden - Missing permission
{
  "message": "Forbidden: Insufficient permissions"
}

// 401 Unauthorized - Invalid token
{
  "message": "Unauthorized"
}
```

#### Get Posts

```http
GET /api/v1/posts?page=1&limit=20
Authorization: Bearer <token>
```

#### Update Post

```http
PUT /api/v1/posts/:id
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData: (same as create)
```

#### Delete Post

```http
DELETE /api/v1/posts/:id
Authorization: Bearer <token>
```

#### Like Post

```http
POST /api/v1/posts/:id/like
Authorization: Bearer <token>
```

#### React to Post

```http
POST /api/v1/posts/:id/react
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "reactionType": "good" | "love" | "laugh" | "surprised" | "sad" | "angry"
}
```

### Polls

#### Create Poll

```http
POST /api/v1/polls
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "question": "string",
  "options": ["string", "string"], // 2-5 items
  "duration": number, // hours
  "department": ["string"], // department IDs
  "categories": "string"
}
```

#### Get Polls

```http
GET /api/v1/polls?page=1&limit=20
Authorization: Bearer <token>
```

#### Vote on Poll

```http
POST /api/v1/polls/:id/vote
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "optionId": "string"
}
```

#### Delete Poll

```http
DELETE /api/v1/polls/:id
Authorization: Bearer <token>
```

### Comments

#### Create Comment

```http
POST /api/v1/comments/:postId
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- comment: string
- attachments: File[] (optional, max 3)
```

#### Get Comments

```http
GET /api/v1/comments/:postId
Authorization: Bearer <token>
```

#### Update Comment

```http
PUT /api/v1/comments/:id
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData: (same as create)
```

#### Delete Comment

```http
DELETE /api/v1/comments/:id
Authorization: Bearer <token>
```

#### Like Comment

```http
POST /api/v1/comments/:id/like
Authorization: Bearer <token>
```

### Feed

#### Get Feed

```http
GET /api/v1/feed?page=1&limit=20
Authorization: Bearer <token>
```

**Response:**

```json
{
  "feed": [
    {
      "_id": "string",
      "type": "post" | "poll",
      "title": "string", // post only
      "description": "string", // post only
      "question": "string", // poll only
      "options": [...], // poll only
      "author": {...}, // post only
      "creator": {...}, // poll only
      "media": ["string"], // post only
      "likes": [...],
      "reactions": [...],
      "comments": [...],
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

#### Get Feed Item by ID

```http
GET /api/v1/feed/:id
Authorization: Bearer <token>
```

## Error Handling

### Common Error Responses

**401 Unauthorized:**

```json
{
  "message": "Unauthorized"
}
```

**403 Forbidden:**

```json
{
  "message": "Forbidden: Insufficient permissions"
}
```

**404 Not Found:**

```json
{
  "message": "Post not found"
}
```

**400 Bad Request:**

```json
{
  "message": "Validation error",
  "errors": [...]
}
```

**500 Server Error:**

```json
{
  "message": "Server error"
}
```

## Step-by-Step Implementation Guide

### Scenario 1: Creating a Post with Media

**Step 1: User Opens Create Post Modal**

```javascript
// User clicks "Create Post" button
<CreateCard refreshStatus={refreshStatus} />
// Opens PostCreateBox modal
```

**Step 2: User Fills Form**

```javascript
// User enters:
title: "New Product Launch"
description: "We're excited to announce our new product..."
category: "General"
departments: ["Engineering", "Marketing"]
schedule: "2024-01-20T10:00:00Z" (optional)
expiry: "1 week"
mediaFiles: [image1.jpg, image2.png] (max 5 files)
```

**Step 3: Form Submission**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. Validate inputs
  const plainTitle = DOMPurify.sanitize(title)
    .replace(/<[^>]+>/g, "")
    .trim();
  const plainDescription = DOMPurify.sanitize(description)
    .replace(/<[^>]+>/g, "")
    .trim();

  if (!plainTitle || !plainDescription) {
    toast.error("Title and Description are required.");
    return;
  }

  // 2. Prepare FormData
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("categories", category);

  // Handle departments
  let selectedDepartments = department;
  if (department.length === 1 && department[0]._id === "all-department") {
    selectedDepartments = departments; // All departments
  }
  selectedDepartments.forEach((d) => formData.append("department", d._id));

  // Handle schedule
  if (date && time) {
    const scheduleDateISO = toUTCISOStringLocal(date, time);
    formData.append("schedule", scheduleDateISO);
  }

  // Handle expiry
  let expiryValue = expiry;
  if (expiry === "Manual") {
    expiryValue = toUTCISOStringLocal(manualExpiryDate, manualExpiryTime);
  } else if (expiry === "no expiry") {
    expiryValue = "";
  }
  formData.append("expiry", expiryValue);

  // Add media files
  mediaFiles.forEach((file) => formData.append("mediaFiles", file));

  // 3. Submit to API
  try {
    setIsLoading(true);
    await axiosInstance.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Post created successfully!");
    resetForm();
    if (onSuccess) onSuccess();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create post.");
  } finally {
    setIsLoading(false);
  }
};
```

**Step 4: Backend Processing**

```javascript
// Backend receives request
export const createPost = async (req, res) => {
  try {
    // 1. Extract form data
    const { title, description, department, categories, schedule, expiry } =
      req.body;

    // 2. Validate required fields
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required." });
    }

    // 3. Process schedule date
    let scheduleDate = new Date();
    if (schedule) {
      const parsed = new Date(schedule);
      if (!isNaN(parsed)) {
        scheduleDate = parsed;
      }
    }

    // 4. Process expiry date
    let expiryDate = null;
    if (expiry && expiry.trim() !== "") {
      // Handle different expiry formats
      if (expiry.includes("T")) {
        // ISO date format
        expiryDate = new Date(expiry);
      } else {
        // Relative format (24 hour, 48 hour, 1 week)
        const parts = expiry.trim().split(" ");
        const [amount, unit] = parts;
        const duration = parseInt(amount);
        const msPerUnit = {
          hour: 60 * 60 * 1000,
          hours: 60 * 60 * 1000,
          day: 24 * 60 * 60 * 1000,
          days: 24 * 60 * 60 * 1000,
          week: 7 * 24 * 60 * 60 * 1000,
          weeks: 7 * 24 * 60 * 60 * 1000,
        };
        expiryDate = new Date(
          scheduleDate.getTime() + duration * msPerUnit[unit.toLowerCase()]
        );
      }
    }

    // 5. Upload media files to Cloudinary
    let media = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(
          file.buffer,
          "employee_engagement",
          file.originalname,
          false
        )
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Generate presigned URLs (7 days expiry)
      media = await Promise.all(
        uploadResults.map(async (result) => {
          const key = result.key || result.public_id;
          if (key) {
            return await presignedGetUrl(key, 7 * 24 * 3600);
          }
          return result.secure_url;
        })
      );
    }

    // 6. Create post in database
    const post = new Post({
      author: req.user._id,
      title,
      description,
      department: Array.isArray(department) ? department : [department],
      categories,
      scheduleDate,
      expiryDate,
      media,
    });

    await post.save();

    // 7. Populate author information
    const populatedPost = await Post.findById(post._id)
      .populate(
        "author",
        "first_Name last_Name employee_Id user_Avatar designation"
      )
      .exec();

    // 8. Emit socket event for real-time update
    const io = req.app.get("socketio");
    io.emit("newPost", populatedPost);

    // 9. Send response
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};
```

**Step 5: Real-time Update**

```javascript
// All connected clients receive the new post
socket.on("newPost", (post) => {
  // Add to feed store
  useFeedStore.getState().addPost(post);
  // Show notification
  toast.info("A new post has been added.");
});
```

### Scenario 2: Voting on a Poll

**Step 1: User Views Poll**

```javascript
// PollCard displays poll
<PollCard poll={poll} />
// Shows question, options, and vote button
```

**Step 2: User Selects Option**

```javascript
// User clicks on an option
const handleOptionChange = (optionId) => {
  setSelectedOption(optionId);
  // UI updates to show selected state
};
```

**Step 3: User Submits Vote**

```javascript
const handleVote = async () => {
  if (selectedOption === null) {
    toast.error("Please select an option to vote.");
    return;
  }

  setIsVoting(true);
  try {
    // API call to submit vote
    await axiosInstance.post(`/polls/${poll._id}/vote`, {
      optionId: selectedOption,
    });

    toast.success("Your vote has been recorded!");

    // Fetch updated poll data
    const { data: updatedPoll } = await axiosInstance.get(`/polls/${poll._id}`);

    // Update store
    useFeedStore.getState().updatePoll(updatedPoll);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to vote.");
  } finally {
    setIsVoting(false);
  }
};
```

**Step 4: Backend Processes Vote**

```javascript
export const votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if poll is still active
    if (!poll.isActive || new Date() > poll.endTime) {
      poll.isActive = false;
      await poll.save();
      return res.status(400).json({ message: "This poll has ended" });
    }

    // Check if user already voted
    const existingVote = poll.votes.find(
      (vote) => vote.user.toString() === req.user._id.toString()
    );

    if (existingVote) {
      // Update existing vote
      const previousOption = poll.options.id(existingVote.option);
      if (previousOption) {
        previousOption.votes -= 1;
      }

      existingVote.option = optionId;

      const newOption = poll.options.id(optionId);
      if (newOption) {
        newOption.votes += 1;
      }
    } else {
      // Add new vote
      poll.votes.push({
        user: req.user._id,
        option: optionId,
      });

      const selectedOption = poll.options.id(optionId);
      if (selectedOption) {
        selectedOption.votes += 1;
      }
    }

    await poll.save();

    // Populate and emit update
    const populatedPoll = await Poll.findById(poll._id)
      .populate("creator", "first_Name last_Name employee_Id user_Avatar")
      .populate("votes.user", "first_Name last_Name employee_Id user_Avatar")
      .exec();

    const io = req.app.get("socketio");
    io.emit("updatePoll", { ...populatedPoll.toObject(), type: "poll" });

    res.json(populatedPoll);
  } catch (error) {
    console.error("Error voting on poll:", error);
    res.status(500).json({ message: "Server error" });
  }
};
```

## Best Practices

### Frontend

1. **Optimistic Updates:** Update UI immediately, then sync with server

   ```javascript
   // Example: Like button
   // 1. Update UI immediately
   setLiked(!liked);
   setLikeCount(liked ? likeCount - 1 : likeCount + 1);

   // 2. Make API call
   try {
     await axiosInstance.post(`/posts/${id}/like`);
   } catch (error) {
     // 3. Revert on error
     setLiked(liked);
     setLikeCount(likeCount);
     toast.error("Failed to like post");
   }
   ```

2. **Error Handling:** Show user-friendly error messages

   ```javascript
   try {
     await apiCall();
   } catch (error) {
     const message =
       error.response?.data?.message ||
       error.message ||
       "An unexpected error occurred";
     toast.error(message);
     console.error("Error details:", error);
   }
   ```

3. **Loading States:** Display loading indicators during API calls

   ```javascript
   const [isLoading, setIsLoading] = useState(false);

   const handleAction = async () => {
     setIsLoading(true);
     try {
       await apiCall();
     } finally {
       setIsLoading(false);
     }
   };

   return (
     <button disabled={isLoading}>{isLoading ? <Spinner /> : "Submit"}</button>
   );
   ```

4. **Socket Cleanup:** Remove event listeners on component unmount

   ```javascript
   useEffect(() => {
     socket.on("newPost", handleNewPost);

     return () => {
       socket.off("newPost", handleNewPost);
     };
   }, []);
   ```

5. **Form Validation:** Validate inputs before submission
   ```javascript
   const validateForm = () => {
     if (!title.trim()) {
       toast.error("Title is required");
       return false;
     }
     if (!description.trim()) {
       toast.error("Description is required");
       return false;
     }
     if (mediaFiles.length > 5) {
       toast.error("Maximum 5 files allowed");
       return false;
     }
     return true;
   };
   ```

### Backend

1. **Authorization:** Always check permissions before operations

   ```javascript
   // Use middleware
   router.post("/", verifyJWT, authorize(["createPost"]), createPost);

   // Or check manually in controller
   if (!hasEngagementPermission(req.user, "createPost")) {
     return res.status(403).json({ message: "Forbidden" });
   }
   ```

2. **Validation:** Validate all inputs using express-validator

   ```javascript
   import { body, validationResult } from "express-validator";

   router.post(
     "/",
     [
       body("question").notEmpty().withMessage("Question is required"),
       body("options").isArray({ min: 2, max: 5 }),
       body("options.*").notEmpty(),
     ],
     (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
       // Process request
     }
   );
   ```

3. **Error Handling:** Return consistent error responses

   ```javascript
   try {
     // Operation
   } catch (error) {
     console.error("Error:", error);
     res.status(500).json({
       message: "Server error",
       error:
         process.env.NODE_ENV === "development" ? error.message : undefined,
     });
   }
   ```

4. **Socket Events:** Emit events after successful database operations

   ```javascript
   // Save to database first
   await post.save();

   // Then emit event
   const io = req.app.get("socketio");
   io.emit("newPost", populatedPost);
   ```

5. **Media Cleanup:** Delete media from Cloudinary when post is deleted
   ```javascript
   if (post.media && post.media.length > 0) {
     const deletePromises = post.media.map((mediaUrl) =>
       deleteFromCloudinaryByUrl(mediaUrl)
     );
     await Promise.all(deletePromises);
   }
   await post.deleteOne();
   ```

## Troubleshooting

### Common Issues

#### 1. Socket Not Connecting

**Symptoms:**

- No real-time updates
- Console shows connection errors
- Toast shows "Failed to connect to the server"

**Diagnosis Steps:**

```javascript
// Check socket connection status
const socket = useSocketStore.getState().socket;
console.log("Socket connected:", socket?.connected);
console.log("Socket ID:", socket?.id);

// Check environment variable
console.log("Socket URL:", import.meta.env.VITE_API_BASE_URL);

// Check token
const token = localStorage.getItem("accessToken");
console.log("Token exists:", !!token);
console.log("Token valid:", token ? token.split(".").length === 3 : false);
```

**Solutions:**

```javascript
// Solution 1: Verify environment variable
// .env file should have:
VITE_API_BASE_URL=http://localhost:3000

// Solution 2: Check token validity
const token = localStorage.getItem("accessToken");
if (!token) {
  // Redirect to login
  window.location.href = "/login";
}

// Solution 3: Manual reconnection
const { connect, disconnect } = useSocketStore.getState();
disconnect(); // Disconnect first
setTimeout(() => {
  connect(); // Reconnect
}, 1000);
```

**Example Error Log:**

```
Connection error: Authentication error
// Solution: Token expired, need to refresh or re-login
```

#### 2. Media Not Displaying

**Symptoms:**

- Images/videos show broken image icon
- Console shows 403 or 404 errors for media URLs
- Media URLs are expired

**Diagnosis:**

```javascript
// Check media URL format
const mediaUrl = post.media[0];
console.log("Media URL:", mediaUrl);

// Check if URL is expired (presigned URLs expire after 7 days)
const urlParams = new URLSearchParams(mediaUrl.split("?")[1]);
const expiry = urlParams.get("X-Amz-Date");
console.log("URL expiry:", expiry);
```

**Solutions:**

```javascript
// Solution 1: Backend regenerates presigned URLs on fetch
// Feed controller automatically regenerates expired URLs:
if (mediaUrl.includes("amazonaws.com")) {
  const key = extractPublicId(mediaUrl);
  const newUrl = await presignedGetUrl(key, 7 * 24 * 3600);
  // Use newUrl
}

// Solution 2: Frontend fallback
<img
  src={mediaUrl}
  onError={(e) => {
    // Try to fetch fresh URL from backend
    fetch(`/api/v1/feed/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        e.target.src = data.media[0];
      });
  }}
  alt="Post media"
/>;
```

#### 3. Real-time Updates Not Working

**Symptoms:**

- Changes by other users don't appear
- Need to refresh page to see updates
- Socket events not received

**Diagnosis:**

```javascript
// Check if socket is listening
socket.on("newPost", (post) => {
  console.log("Received newPost event:", post);
  // This should log when event is received
});
```

**Solutions:**

```javascript
// Solution 1: Verify event names match
// Server emits:
io.emit("newPost", post);

// Client listens:
socket.on("newPost", (post) => {
  // Handler
});

// Solution 2: Check socket store initialization
useEffect(() => {
  const { connect } = useSocketStore.getState();
  connect();

  return () => {
    const { disconnect } = useSocketStore.getState();
    disconnect();
  };
}, []);
```

#### 4. Permissions Not Working

**Symptoms:**

- User can't create/edit/delete posts
- 403 Forbidden errors
- Edit/Delete buttons not showing

**Diagnosis:**

```javascript
// Check user permissions
const user = useAuthStore.getState();
console.log("User permissions:", user.engagement_permission?.permissions);

// Check permission check logic
const permissions = selectedEmployee?.engagement_permission?.permissions || [];
console.log("Available permissions:", permissions);
console.log("Has createPost:", permissions.includes("createPost"));
```

**Solutions:**

```javascript
// Solution 1: Verify permission structure in database
// User document should have:
{
  engagement_permission: {
    permissions: ["view", "createPost", "addComment"];
  }
}

// Solution 2: Check authorization middleware
// Route should have:
router.post("/", verifyJWT, authorize(["createPost"]), createPost);

// Solution 3: Frontend permission check
const canCreatePost = permissions.includes("createPost");
if (!canCreatePost) {
  return <div>You don't have permission to create posts</div>;
}
```

**Example Error Response:**

```json
{
  "message": "Forbidden: Insufficient permissions"
}
// Solution: User needs "createPost" permission assigned
```

## Future Enhancements

Potential improvements:

- Poll analytics dashboard
- Post templates
- Rich media editor enhancements
- Notification preferences
- Engagement analytics
- Content moderation tools
- Scheduled polls
- Poll results export

---

**Last Updated:** 2024
**Maintained By:** Development Team

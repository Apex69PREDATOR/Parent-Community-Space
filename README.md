# Parent Community Space

A simple full‑stack project that creates a real‑time community wall
where users can post, like, and comment.\
This README explains how to set up the **frontend**, **backend**, and
**database**, and includes full API documentation.

------------------------------------------------------------------------

## 🚀 Features

-   Real‑time posts, comments, and likes (Socket.io)
-   Image upload support with Cloudinary
-   MongoDB Atlas database
-   Simple authentication using JWT‑based username token
-   Sorting posts by date or likes

------------------------------------------------------------------------

# 📦 Project Setup Guide

## **Step 1 -- Clone the Repository**

Make sure you have **Git**, **Node.js**, and **GitHub** installed.

Open your terminal in any directory and run:

    git clone https://github.com/Apex69PREDATOR/Parent-Community-Space.git

A folder named **Parent-Community-Space** will be created.

------------------------------------------------------------------------

# 🎨 Step 2 -- Frontend Setup

Navigate to the frontend folder:

    cd Parent-Community-Space/Frontend/Parent-Community-Hall

Install dependencies:

    npm install

Create a `.env` file inside this folder:

    VITE_SERVER_URL=http://localhost:3000
    VITE_WS_SERVER_URL=http://localhost:3000

Start the frontend:

    npm run dev

------------------------------------------------------------------------

# ⚙️ Step 3 -- Backend Setup

Move to the backend folder:

    cd ../../Backend

Install backend dependencies:

    npm install

Create a `.env` file inside the backend folder:

    PORT=3000
    ATLAS_PASSWORD=<your_mongodb_atlas_password>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_CLOUDNAME=<your_cloudinary_cloud_name>
    PRIVATE_KEY=<jwt_private_key>

🔹 Replace all `<placeholders>` with actual values.\
🔹 Edit `DBconnectivity.js` and update the MongoDB URI with your Atlas
connection string.

Start the backend server:

    node index.js

Your full project is now ready to run locally.

------------------------------------------------------------------------

# 📡 API Documentation

Backend uses **REST API**.

------------------------------------------------------------------------

## **1. GET /api/post/posts/:filterBy**

Fetch all posts.

### Accepted `filterBy` values:

-   `DateAsc` → newest → oldest\
-   `DateDsc` → oldest → newest\
-   `Likes` → most liked → least liked

------------------------------------------------------------------------

## **2. POST /api/post/posts**

Create a new post.

-   Accepts text + optional image.
-   Uploads images to Cloudinary.
-   Broadcasts the new post in real-time to all connected clients.
-   Performs cleanup if upload fails.

------------------------------------------------------------------------

## **3. POST /api/post/comments/:id**

Add a new comment.

-   Adds comment to a specific post.
-   Increments comment count atomically.
-   Broadcasts comment in real-time.
-   Returns updated post.

------------------------------------------------------------------------

## **4. GET /api/post/comments/:id**

Retrieve comments for a post.

-   Fetches **only the comments array** for efficiency.

------------------------------------------------------------------------

## **5. POST /api/post/like/:id**

Like a post.

-   Increments like count.
-   Tracks users via token in `likedBy`.
-   Prevents duplicate likes.
-   Broadcasts live like updates.

------------------------------------------------------------------------

## **6. POST /api/post/setName**

Assign username.

-   Accepts `name` from client.
-   Generates a JWT token containing the name.
-   Returns `{ name, token }`.

------------------------------------------------------------------------

# ✔️ Project Ready

After completing all steps, both the backend and frontend will run
successfully on your machine.

------------------------------------------------------------------------

# 📄 License

You are free to modify and use this project as needed.

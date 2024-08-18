# DayzOutStable

**DayzOut** is a social media platform built using React for the frontend and Django for the backend. This project allows users to sign up, log in, create and interact with posts, follow other users, and more.

## Features

- User authentication (Sign up, Log in, Forgot password)
- View friends' feeds
- Create and interact with posts (upvote/downvote)
- Edit profile and view other users' profiles
- Follow/unfollow users, accept/decline friend requests
- Search for users and see suggested friends

## Installation

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/DayzOut.git
   ```

2. **Navigate to the backend directory:**

   ```bash
   cd DayzOut/DayzOutBackend
   ```

3. **Create a virtual environment:**

   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**

   ```bash
   .\venv\Scripts\activate
   ```

5. **Install the required dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

6. **Enter SendGrid API key and email in below given file (for forgot password functionality optional)**

```bash
DayzOutbackend\theapp\theapp\settings.py
```

7. **Run the Django development server:**

   ```bash
   python .\DayzOutBackend\theapp\manage.py runserver
   ```

### Frontend Setup

1. **Ensure Node.js and npm are installed.**
2. **Install the required dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

```
You can copy and paste this directly into your `README.md` file. Let me know if you need any more adjustments!
```

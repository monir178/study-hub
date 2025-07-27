# Study Rooms API Testing Commands

## Prerequisites

- Server running on `http://localhost:3000`
- You must be signed in to get session cookies

## 1. List All Rooms

```bash
curl -X GET "http://localhost:3000/api/rooms" \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

## 2. Search Rooms

```bash
curl -X GET "http://localhost:3000/api/rooms?search=math&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

## 3. Get My Rooms

```bash
curl -X GET "http://localhost:3000/api/rooms?myRooms=true" \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

## 4. Create Room

```bash
curl -X POST "http://localhost:3000/api/rooms" \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{
    "name": "API Test Room",
    "description": "Created via API",
    "isPublic": true,
    "maxMembers": 15
  }'
```

## 5. Get Room Details

```bash
curl -X GET "http://localhost:3000/api/rooms/ROOM_ID" \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

## 6. Join Room

```bash
curl -X POST "http://localhost:3000/api/rooms/ROOM_ID/join" \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{}'
```

## 7. Join Private Room (with password)

```bash
curl -X POST "http://localhost:3000/api/rooms/ROOM_ID/join" \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{"password": "your-password"}'
```

## 8. Leave Room

```bash
curl -X DELETE "http://localhost:3000/api/rooms/ROOM_ID/join" \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

## 9. Update Room (Admin/Moderator only)

```bash
curl -X PUT "http://localhost:3000/api/rooms/ROOM_ID" \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{
    "name": "Updated Room Name",
    "description": "Updated description"
  }'
```

## 10. Delete Room (Creator only)

```bash
curl -X DELETE "http://localhost:3000/api/rooms/ROOM_ID" \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

## Getting Session Cookies

First, sign in through the browser, then extract cookies:

```bash
# In browser dev tools, copy cookies and save to cookies.txt
# Or use browser extension to export cookies
```

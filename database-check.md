# Database Verification Commands

## Check if data is being stored correctly

### 1. Check Study Rooms

```bash
# In your database client or Prisma Studio
npx prisma studio
```

### 2. Verify Room Data

Look for these tables:

- `StudyRoom` - Room details
- `RoomMember` - Room memberships
- `Message` - System messages for join/leave
- `User` - User accounts

### 3. Check Relationships

- Rooms should have creators
- Members should be linked to users
- Messages should be linked to rooms and authors

### 4. Verify Constraints

- Room member count should not exceed maxMembers
- Private rooms should have passwords
- System messages should be created for join/leave events

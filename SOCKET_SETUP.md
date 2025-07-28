# Socket.IO Real-time Pomodoro Timer Setup Guide

## 📋 **Overview**

This implementation provides a real-time Pomodoro timer that synchronizes across all room participants using Socket.IO. Here's how it works and how to set it up.

## 🔧 **Installation**

First, install the required Socket.IO client dependency:

```bash
pnpm add socket.io-client
```

## 🏗️ **Architecture**

### **Server-Side Components:**

1. **`app/api/socket/io/route.ts`** - Socket.IO server endpoint
2. **`lib/timer-manager.ts`** - Server-side timer state management
3. **Timer state stored in memory** (can be extended to Redis later)

### **Client-Side Components:**

1. **`lib/socket-client.ts`** - Socket connection manager
2. **`hooks/useSocket.ts`** - Socket connection hook
3. **`hooks/useTimer.ts`** - Timer state and actions hook
4. **`features/rooms/components/PomodoroTimer.tsx`** - UI component

## 🚀 **How It Works**

### **Connection Flow:**

1. User joins room → Socket connects → Joins room channel
2. Server sends current timer state to new user
3. All timer actions broadcast to room members
4. Real-time sync keeps everyone in sync

### **Timer States:**

- **Focus**: 25 minutes (red theme)
- **Short Break**: 5 minutes (green theme)
- **Long Break**: 15 minutes (blue theme)
- **Sessions**: 4 focus sessions before long break

### **Permissions:**

- **Moderators/Admins**: Can start, pause, stop, reset timer
- **Regular Users**: View-only, see real-time updates

## 🧪 **Testing the Implementation**

### **1. Start the Development Server**

```bash
pnpm dev
```

### **2. Test Socket Connection**

1. Open browser dev tools → Network tab
2. Navigate to a room page
3. Look for WebSocket connection to `/api/socket/io`
4. Should see "Socket.IO server initialized" in server logs

### **3. Test Timer Functionality**

#### **Single User Testing:**

1. Join a room as Moderator/Admin
2. Click "Start" → Timer should begin countdown
3. Click "Pause" → Timer should pause
4. Click "Resume" → Timer should continue
5. Click "Reset" → Timer should reset to 25:00

#### **Multi-User Testing:**

1. Open room in multiple browser tabs/windows
2. Login as different users (one Moderator, one User)
3. Start timer from Moderator tab
4. Verify User tab shows same countdown in real-time
5. Pause from Moderator → Both tabs should show paused state

### **4. Test Reconnection**

1. Start timer
2. Refresh page or close/reopen tab
3. Should automatically reconnect and sync to current timer state

## 🔍 **Debugging**

### **Server Logs to Watch:**

```bash
# Connection events
User connected: <socket-id>
User <userId> joined room <roomId>

# Timer events
Timer started in room <roomId> by user <userId>
Timer paused in room <roomId> by user <userId>
```

### **Client Console Logs:**

```javascript
// Connection
Connected to socket server: <socket-id>

// Timer events
Timer phase completed: { completedPhase: "focus", nextPhase: "shortBreak" }
```

### **Common Issues:**

#### **Socket Not Connecting:**

- Check if server is running on correct port
- Verify NEXT_PUBLIC_SITE_URL environment variable
- Check browser console for connection errors

#### **Timer Not Syncing:**

- Verify user has joined room properly
- Check if timer events are being emitted/received
- Ensure user has proper permissions

#### **Timer State Lost:**

- Server restart clears memory-based timer state
- Users need to refresh to reconnect
- Consider Redis for persistent state in production

## 🎵 **Sound Setup (Optional)**

Add a tick sound file:

1. Create `public/sounds/` directory
2. Add `tick.mp3` file (short, quiet tick sound)
3. Users can toggle sound on/off in UI

## 🔐 **Security Considerations**

- Timer actions validate user permissions server-side
- Room membership verified before allowing timer control
- Socket events include user authentication

## 📱 **Mobile Responsiveness**

- Timer display scales appropriately
- Touch-friendly buttons
- Responsive layout for small screens
- Sound toggle works on mobile devices

## 🚀 **Production Deployment**

### **Environment Variables:**

```env
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### **Scaling Considerations:**

- Use Redis for timer state persistence
- Consider Socket.IO Redis adapter for multiple server instances
- Monitor memory usage for timer state storage

## 🧪 **Testing Checklist**

- [ ] Socket connects successfully
- [ ] Timer starts and counts down
- [ ] Timer syncs across multiple users
- [ ] Only Moderators/Admins can control timer
- [ ] Timer state persists on reconnection
- [ ] Phase transitions work correctly
- [ ] Sound toggle functions properly
- [ ] Mobile interface is responsive
- [ ] Error handling works for failed actions
- [ ] Notifications appear on timer completion

## 🔄 **Next Steps**

After confirming the timer works:

1. Add Redis for persistent state
2. Implement timer history/statistics
3. Add custom timer durations
4. Integrate with study session tracking
5. Add voice notifications
6. Implement timer themes/customization

The real-time Pomodoro timer is now ready for testing and use!

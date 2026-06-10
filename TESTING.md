# 🔍 Testing Guide

## Manual Testing Checklist

### 1. Basic Functionality

- [ ] App loads without errors
- [ ] Landing page displays correctly
- [ ] "Start Video" button is clickable
- [ ] Browser requests camera/microphone permissions
- [ ] Waiting screen shows after permissions granted

### 2. Matchmaking

- [ ] Open two browser windows (or private windows)
- [ ] Start video in both
- [ ] Both are added to queue
- [ ] After 2+ users, matching occurs
- [ ] "user_matched" event fires
- [ ] Room ID is generated

### 3. Video Streaming

- [ ] Local video appears in PiP
- [ ] Remote video appears after match
- [ ] Both videos are mirrored correctly
- [ ] Quality is acceptable
- [ ] No lag or freezing

### 4. Chat

- [ ] Can type messages
- [ ] Messages send on Enter key
- [ ] Messages appear with sender info
- [ ] Timestamps are correct
- [ ] Chat persists during call

### 5. Controls

- [ ] Mute button works
- [ ] Camera toggle works
- [ ] Next button disconnects properly
- [ ] Next button finds new match
- [ ] States display correctly

### 6. Reporting

- [ ] Report modal opens
- [ ] Can select reason
- [ ] Can add details
- [ ] Submit button works
- [ ] Confirmation message appears
- [ ] Reported user is blocked

### 7. Edge Cases

- [ ] Close browser window gracefully
- [ ] Poor connection handling
- [ ] Multiple browsers/tabs
- [ ] Rapid next button clicks
- [ ] Permission denial
- [ ] No camera available
- [ ] Network interruption

## Browser Testing Matrix

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✓ |
| Firefox | Latest | ✓ |
| Safari | Latest | ✓ |
| Edge | Latest | ✓ |
| Mobile Chrome | Latest | ? |
| Mobile Safari | Latest | ? |

## Performance Testing

### Metrics to Monitor

```
- Page load time: < 3s
- Time to match: < 10s
- Video latency: < 500ms
- CPU usage: < 50%
- Memory usage: < 200MB
- Message latency: < 100ms
```

### Load Testing

Use tools like:
- Apache JMeter
- Locust
- Artillery

Example:
```bash
artillery quick -d 300 -r 10 http://localhost:5000/health
```

## Unit Test Example

```javascript
// tests/server.test.js
import { describe, it, expect } from 'vitest';

describe('Matchmaking', () => {
  it('should match two users', () => {
    const queue = [
      { userId: 'user1', peerId: 'peer1' },
      { userId: 'user2', peerId: 'peer2' }
    ];
    
    expect(queue.length).toBe(2);
    // Additional tests
  });
});
```

## Integration Testing

```javascript
// tests/integration.test.js
import { io } from 'socket.io-client';

describe('Socket.io Integration', () => {
  it('should connect and join queue', (done) => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      socket.emit('join_queue', {
        userId: 'test-user',
        peerId: 'test-peer'
      });
      
      socket.on('waiting', (data) => {
        expect(data.message).toBeDefined();
        socket.close();
        done();
      });
    });
  });
});
```

## Security Testing

### XSS Prevention
- [ ] Test message injection: `<img src=x onerror=alert('xss')>`
- [ ] Verify messages are escaped

### CSRF Protection
- [ ] Verify tokens are required
- [ ] Test invalid token rejection

### SQL Injection (if using DB)
- [ ] Test malicious input: `'; DROP TABLE users; --`

### Rate Limiting
- [ ] Send 100 messages in 1 second
- [ ] Verify throttling works

## Stress Testing

### Memory Leaks
```bash
node --inspect server.js
# Open chrome://inspect in browser
# Check for growing memory
```

### Connection Limits
- [ ] Open 1000 concurrent connections
- [ ] Verify server handles gracefully

### Long Sessions
- [ ] Keep connection open for 24 hours
- [ ] Check for degradation

## Cross-Browser Testing

Use BrowserStack or Sauce Labs:
- Test on multiple browsers
- Test on mobile devices
- Test on different networks

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Screen reader compatible
- [ ] Focus indicators visible

## Responsive Testing

- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Ultra-wide (3440x1440)

---

**Run tests regularly and automate where possible!**

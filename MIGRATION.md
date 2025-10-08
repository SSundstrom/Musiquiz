# Backend Dependencies Migration Guide

This document outlines the changes made during the backend dependency upgrade.

## Updated Dependencies

### Production Dependencies

| Package | Old Version | New Version | Breaking Changes |
|---------|-------------|-------------|------------------|
| dotenv | 6.2.0 | 17.2.3 | ✅ Yes - `.load()` deprecated |
| express | 4.16.2 | 4.21.2 | ❌ No - same major version |
| socket.io | 2.2.0 | 4.8.1 | ✅ Yes - major version change |
| spotify-web-api-node | 4.0.0 | 5.0.2 | ⚠️ Minor - check API changes |
| datastructures-js | 3.0.7 | 13.0.0 | ✅ Yes - major version change (not used in code) |

### Development Dependencies

| Package | Old Version | New Version |
|---------|-------------|-------------|
| eslint-config-airbnb | 17.1.0 | 19.0.4 |
| eslint-config-airbnb-base | 13.1.0 | 15.0.0 |
| eslint-config-prettier | - | 10.1.8 (new) |
| @emotion/eslint-plugin | - | 11.12.0 (new) |
| eslint-plugin-import | 2.16.0 | 2.32.0 |
| eslint-plugin-jsx-a11y | 6.2.1 | 6.10.2 |
| eslint-plugin-prettier | 3.0.1 | 5.5.4 |
| eslint-plugin-react | 7.12.4 | 7.37.5 |
| prettier-eslint | 8.8.2 | 16.4.2 |

## Code Changes Required

### 1. dotenv - Changed `.load()` to `.config()`

**Old code:**
```javascript
require('dotenv').load();
```

**New code:**
```javascript
require('dotenv').config();
```

**Reason:** The `.load()` method was deprecated in dotenv v5 and removed in later versions. The `.config()` method is the recommended approach.

### 2. socket.io - Added CORS Configuration

**Old code:**
```javascript
const io = require('socket.io')(http);
```

**New code:**
```javascript
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
```

**Reason:** Socket.io v4 requires explicit CORS configuration. The frontend makes cross-origin WebSocket connections, so CORS must be configured.

### 3. ESLint Configuration - Updated emotion plugin

**Old code (.eslintrc.js):**
```javascript
plugins: ['emotion', 'prettier'],
```

**New code (.eslintrc.js):**
```javascript
plugins: ['@emotion', 'prettier'],
```

**Reason:** The `eslint-plugin-emotion` package was renamed to `@emotion/eslint-plugin`.

## Testing

The backend was tested to ensure:
- ✅ Server starts successfully
- ✅ dotenv loads environment variables correctly
- ✅ Express server listens on configured port
- ✅ Socket.io initializes without errors
- ✅ No npm security vulnerabilities (0 vulnerabilities)
- ✅ ESLint runs successfully

## Important Notes

### Socket.io Client Compatibility

⚠️ **Important:** Socket.io v4 is not compatible with socket.io-client v2. The frontend currently uses socket.io-client v2.2.0 and will need to be updated to v4.x to work with the upgraded backend.

**Frontend package.json update required:**
```json
"socket.io-client": "^4.8.1"
```

Until the frontend is updated, the backend and frontend must be upgraded together, or you can temporarily downgrade the backend to socket.io v2.x if needed.

### datastructures-js

The `datastructures-js` package was upgraded from v3.0.7 to v13.0.0. However, this package is not actually used anywhere in the codebase, so no code changes were required. Consider removing it from dependencies if it's not needed.

## Benefits of Upgrade

1. **Security:** Eliminated all 39 npm security vulnerabilities
2. **Modern Features:** Access to latest features in all libraries
3. **Performance:** Bug fixes and performance improvements
4. **Compatibility:** Better compatibility with Node.js 20.x
5. **Support:** Using supported versions of all dependencies

## Rollback Procedure

If you need to rollback to the previous versions:

```bash
git checkout HEAD~1 package.json package-lock.json index.js .eslintrc.js
npm install
```

## References

- [dotenv Changelog](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md)
- [Express 4.x Migration Guide](https://expressjs.com/en/guide/migrating-4.html)
- [Socket.io v4 Migration Guide](https://socket.io/docs/v4/migrating-from-2-x-to-3-0/)
- [Socket.io v4 Documentation](https://socket.io/docs/v4/)

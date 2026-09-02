---
sidebar_position: 1
title: "Holiday Management"
description: "The Holiday Management API provides access to public holidays in India for the current year, specifically filtered for the current month."
---

# Holiday Management

{/* # Holiday Management API Documentation */}

## Overview

The Holiday Management API provides access to public holidays in India for the current year, specifically filtered for the current month. This system integrates with the external API Ninjas service to fetch real-time holiday data and serves it to applications for calendar integration, leave planning, and workforce management.

### Key Features

- **Real-time Holiday Data**: Fetches current public holidays from external API
- **Monthly Filtering**: Returns only holidays for the current month
- **Indian Holidays**: Specifically configured for Indian public holidays
- **JWT Authentication**: Secure access with token-based authentication
- **Error Handling**: Comprehensive error handling for external API failures

## Base URL

```
https://your-api-domain.com/api
```

## Authentication

### Authentication Flow

The API uses JSON Web Tokens (JWT) for authentication. All endpoints require a valid JWT token.

#### Authorization Header Format

```http
Authorization: Bearer <your_jwt_token>
```

## System Architecture

### Request Flow

```
Client Request → JWT Validation → Controller → External API (API Ninjas) → Response Processing → Client Response
```

### External API Integration

The system integrates with **API Ninjas Holidays API** to fetch holiday data:

- **API Endpoint**: `https://api.api-ninjas.com/v1/holidays`
- **Authentication**: API Key via `X-Api-Key` header
- **Country**: India (`IN`)
- **Type**: Public holidays only
- **Year**: Current year

### Data Model

#### Holiday Object Structure
```javascript
{
  "name": "String", // Holiday name
  "date": "String", // ISO date format (YYYY-MM-DD)
  "country": "String", // Country code (IN)
  "type": "String", // Holiday type (public_holiday)
  "locations": "String", // Specific locations (optional)
  "states": "String" // Applicable states (optional)
}
```

## Holiday API Endpoints

### Get Current Month Holidays

Retrieves all public holidays for the current month in India.

**Endpoint**: `GET /v1/holiday/hoidays`

> **Note**: There appears to be a typo in the route URL (`hoidays` instead of `holidays`). This should be corrected in the route definition.

**Authentication**: Required (JWT)

**Query Parameters**: None

**Success Response** (200):
```json
{
  "success": true,
  "holidays": [
    {
      "name": "Republic Day",
      "date": "2024-01-26",
      "country": "IN",
      "type": "public_holiday",
      "locations": "All",
      "states": "All"
    },
    {
      "name": "Makar Sankranti",
      "date": "2024-01-14",
      "country": "IN",
      "type": "public_holiday",
      "locations": "All",
      "states": "All"
    }
  ]
}
```

**Error Response** (500):
```json
{
  "success": false,
  "message": "Failed to fetch holidays",
  "error": "API request failed: Invalid API key"
}
```

**Business Rules**:
- Only returns holidays for the current month
- Filters by current year automatically
- Only includes public holidays (excludes regional/religious holidays)
- Returns empty array if no holidays found for current month
- Handles external API failures gracefully

**Response Fields**:
- `success` (boolean): Indicates if the request was successful
- `holidays` (array): Array of holiday objects for the current month
- `message` (string): Error message (only present in error responses)
- `error` (string): Technical error details (only present in error responses)

**External API Parameters**:
- `country`: Set to 'IN' for India
- `year`: Current year (dynamically calculated)
- `type`: Set to 'public_holiday' to filter public holidays only

## Frontend Integration

### JavaScript SDK

```javascript
class HolidayAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('Holiday API Error:', error);
      throw error;
    }
  }

  // Holiday Management
  async getCurrentMonthHolidays() {
    return this.request('/v1/holiday/hoidays'); // Note: typo in actual endpoint
  }

  // Helper method for formatted holiday display
  formatHoliday(holiday) {
    const date = new Date(holiday.date);
    return {
      ...holiday,
      formattedDate: date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      dayOfWeek: date.toLocaleDateString('en-IN', { weekday: 'long' }),
      isToday: date.toDateString() === new Date().toDateString(),
      isUpcoming: date > new Date()
    };
  }

  // Helper method to check if a date is a holiday
  async isHoliday(checkDate) {
    try {
      const holidays = await this.getCurrentMonthHolidays();
      const dateStr = checkDate.toISOString().split('T')[0];
      return holidays.holidays.some(holiday => holiday.date === dateStr);
    } catch (error) {
      console.error('Error checking holiday:', error);
      return false;
    }
  }
}

// Usage Example
const api = new HolidayAPI('https://your-api-domain.com/api', 'your-jwt-token');

// Get current month holidays
try {
  const response = await api.getCurrentMonthHolidays();
  console.log('Current month holidays:', response.holidays);
  
  // Format holidays for display
  const formattedHolidays = response.holidays.map(holiday => 
    api.formatHoliday(holiday)
  );
  console.log('Formatted holidays:', formattedHolidays);
  
} catch (error) {
  console.error('Failed to fetch holidays:', error.message);
}

// Check if a specific date is a holiday
try {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const isHoliday = await api.isHoliday(tomorrow);
  console.log(`Tomorrow is ${isHoliday ? 'a holiday' : 'not a holiday'}`);
  
} catch (error) {
  console.error('Error checking holiday status:', error.message);
}
```

### React Component Examples

```javascript
import React, { useState, useEffect } from 'react';

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = new HolidayAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCurrentMonthHolidays();
      
      // Format holidays for display
      const formattedHolidays = response.holidays.map(holiday => 
        api.formatHoliday(holiday)
      );
      
      // Sort by date
      formattedHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setHolidays(formattedHolidays);
    } catch (err) {
      setError('Failed to fetch holidays: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) return <div className="loading">Loading holidays...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="holiday-calendar">
      <h2>Public Holidays - {getCurrentMonth()}</h2>
      
      {holidays.length === 0 ? (
        <div className="no-holidays">
          <p>No public holidays this month</p>
        </div>
      ) : (
        <div className="holidays-list">
          {holidays.map((holiday, index) => (
            <div 
              key={index} 
              className={`holiday-card ${holiday.isToday ? 'today' : ''} ${holiday.isUpcoming ? 'upcoming' : 'past'}`}
            >
              <div className="holiday-header">
                <h3>{holiday.name}</h3>
                <div className="holiday-badges">
                  {holiday.isToday && <span className="badge today">Today</span>}
                  {holiday.isUpcoming && <span className="badge upcoming">Upcoming</span>}
                </div>
              </div>
              
              <div className="holiday-details">
                <div className="holiday-date">
                  <span className="date-text">{holiday.formattedDate}</span>
                  <span className="day-of-week">{holiday.dayOfWeek}</span>
                </div>
                
                <div className="holiday-meta">
                  <span className="holiday-type">{holiday.type.replace('_', ' ')}</span>
                  <span className="holiday-country">{holiday.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="calendar-actions">
        <button onClick={fetchHolidays} className="refresh-btn">
          Refresh Holidays
        </button>
      </div>
    </div>
  );
};

const HolidayChecker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHoliday, setIsHoliday] = useState(null);
  const [checking, setChecking] = useState(false);

  const api = new HolidayAPI('https://your-api-domain.com/api', 'your-jwt-token');

  const checkHoliday = async () => {
    try {
      setChecking(true);
      const dateToCheck = new Date(selectedDate);
      const result = await api.isHoliday(dateToCheck);
      setIsHoliday(result);
    } catch (error) {
      console.error('Error checking holiday:', error);
      setIsHoliday(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      checkHoliday();
    }
  }, [selectedDate]);

  return (
    <div className="holiday-checker">
      <h3>Holiday Checker</h3>
      
      <div className="date-input">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <div className="result">
        {checking ? (
          <div className="checking">Checking...</div>
        ) : isHoliday !== null ? (
          <div className={`holiday-result ${isHoliday ? 'is-holiday' : 'not-holiday'}`}>
            <span className="result-icon">
              {isHoliday ? '🎉' : '📅'}
            </span>
            <span className="result-text">
              {isHoliday ? 'This is a public holiday!' : 'This is not a public holiday'}
            </span>
          </div>
        ) : (
          <div className="no-result">Select a date to check</div>
        )}
      </div>
    </div>
  );
};

const HolidayWidget = () => {
  const [nextHoliday, setNextHoliday] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = new HolidayAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchNextHoliday();
  }, []);

  const fetchNextHoliday = async () => {
    try {
      setLoading(true);
      const response = await api.getCurrentMonthHolidays();
      
      const today = new Date();
      const upcomingHolidays = response.holidays
        .filter(holiday => new Date(holiday.date) > today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (upcomingHolidays.length > 0) {
        setNextHoliday(api.formatHoliday(upcomingHolidays[0]));
      } else {
        setNextHoliday(null);
      }
    } catch (error) {
      console.error('Error fetching next holiday:', error);
      setNextHoliday(null);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilHoliday = (holidayDate) => {
    const today = new Date();
    const holiday = new Date(holidayDate);
    const diffTime = holiday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <div className="widget-loading">Loading...</div>;

  return (
    <div className="holiday-widget">
      <h4>Next Holiday</h4>
      
      {nextHoliday ? (
        <div className="next-holiday">
          <div className="holiday-name">{nextHoliday.name}</div>
          <div className="holiday-date">{nextHoliday.formattedDate}</div>
          <div className="days-until">
            {getDaysUntilHoliday(nextHoliday.date)} days to go
          </div>
        </div>
      ) : (
        <div className="no-holidays">
          <p>No upcoming holidays this month</p>
        </div>
      )}
    </div>
  );
};

export { HolidayCalendar, HolidayChecker, HolidayWidget };
```

### CSS Styling Example

```css
/* Holiday Calendar Styles */
.holiday-calendar {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.holiday-calendar h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.holidays-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.holiday-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.holiday-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.holiday-card.today {
  border-color: #4CAF50;
  background: #f8fff8;
}

.holiday-card.upcoming {
  border-color: #2196F3;
  background: #f8f9ff;
}

.holiday-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.holiday-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3em;
}

.holiday-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}

.badge.today {
  background: #4CAF50;
  color: white;
}

.badge.upcoming {
  background: #2196F3;
  color: white;
}

.holiday-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.holiday-date {
  display: flex;
  flex-direction: column;
}

.date-text {
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
}

.day-of-week {
  font-size: 0.9em;
  color: #666;
}

.holiday-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.holiday-type {
  font-size: 0.9em;
  color: #666;
  text-transform: capitalize;
}

.holiday-country {
  font-size: 0.8em;
  color: #999;
}

.calendar-actions {
  text-align: center;
  margin-top: 30px;
}

.refresh-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: #1976D2;
}

.no-holidays {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Holiday Checker Styles */
.holiday-checker {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.date-input {
  margin-bottom: 20px;
}

.date-input label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.date-input input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.result {
  text-align: center;
  padding: 20px;
}

.holiday-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border-radius: 4px;
}

.holiday-result.is-holiday {
  background: #e8f5e8;
  color: #2e7d32;
}

.holiday-result.not-holiday {
  background: #f5f5f5;
  color: #666;
}

.result-icon {
  font-size: 1.5em;
}

.result-text {
  font-weight: bold;
}

/* Holiday Widget Styles */
.holiday-widget {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  max-width: 250px;
}

.holiday-widget h4 {
  margin: 0 0 15px 0;
  color: #333;
  text-align: center;
}

.next-holiday {
  text-align: center;
}

.holiday-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.holiday-date {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 8px;
}

.days-until {
  background: #2196F3;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

/* Loading and Error States */
.loading, .error, .widget-loading, .checking {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #f44336;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 600px) {
  .holiday-calendar {
    padding: 15px;
  }
  
  .holiday-card {
    padding: 15px;
  }
  
  .holiday-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .holiday-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .holiday-meta {
    align-items: flex-start;
  }
}
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

#### Holiday API Tests

**Get Current Month Holidays**:
```bash
curl -X GET https://your-api-domain.com/api/v1/holiday/hoidays \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Test Authentication Failure**:
```bash
curl -X GET https://your-api-domain.com/api/v1/holiday/hoidays \
  -H "Authorization: Bearer invalid-token"
```

**Test Without Authentication**:
```bash
curl -X GET https://your-api-domain.com/api/v1/holiday/hoidays
```

### Testing Scenarios

#### Happy Path Testing
1. **Valid Request**: Test with valid JWT token
2. **Holiday Response**: Verify holiday data structure
3. **Month Filtering**: Confirm only current month holidays are returned
4. **Date Formatting**: Verify proper date format in response

#### Edge Case Testing
1. **No Holidays**: Test during months with no public holidays
2. **External API Failure**: Test behavior when API Ninjas is down
3. **Invalid API Key**: Test with invalid NINJA_API_KEY
4. **Network Timeout**: Test with slow network conditions

#### Error Handling Testing
1. **Authentication Errors**: Test with invalid/expired tokens
2. **External API Errors**: Test external API failure scenarios
3. **Rate Limiting**: Test API rate limit handling
4. **Malformed Responses**: Test with unexpected external API responses

### Performance Testing

#### Load Testing
```bash
# Test concurrent requests
for i in {1..10}; do
  curl -X GET https://your-api-domain.com/api/v1/holiday/hoidays \
    -H "Authorization: Bearer $JWT_TOKEN" &
done
wait
```

#### Response Time Testing
```bash
# Test response time
curl -X GET https://your-api-domain.com/api/v1/holiday/hoidays \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "Response time: %{time_total}s\n"
```

## Environment Configuration

### Required Environment Variables

```bash
# API Ninjas Configuration
NINJA_API_KEY=your-api-ninjas-key-here

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=production
```

### API Key Setup

1. **Register at API Ninjas**: Visit [https://api.api-ninjas.com/](https://api.api-ninjas.com/)
2. **Get API Key**: Create account and generate API key
3. **Set Environment Variable**: Add `NINJA_API_KEY` to your environment
4. **Verify Access**: Test API key with direct API call

### Rate Limiting Considerations

The API Ninjas service has rate limits:
- **Free Tier**: 1,000 requests per month
- **Paid Tiers**: Higher limits available

Consider implementing caching to reduce external API calls:

```javascript
// Example caching implementation
const NodeCache = require('node-cache');
const holidayCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export const getHolidays = async (req, res) => {
  const cacheKey = `holidays_${new Date().getMonth() + 1}_${new Date().getFullYear()}`;
  
  // Check cache first
  const cachedHolidays = holidayCache.get(cacheKey);
  if (cachedHolidays) {
    return res.status(200).json({
      success: true,
      holidays: cachedHolidays,
      cached: true
    });
  }

  // Fetch from external API if not cached
  // ... rest of the implementation
};
```

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)"
}
```

### HTTP Status Codes

- **200 OK**: Request successful
- **401 Unauthorized**: Authentication required or invalid token
- **500 Internal Server Error**: External API failure or server error

### Common Error Scenarios

#### Authentication Errors
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

#### External API Errors
```json
{
  "success": false,
  "message": "Failed to fetch holidays",
  "error": "API request failed: Invalid API key"
}
```

#### Network Errors
```json
{
  "success": false,
  "message": "Failed to fetch holidays",
  "error": "Network timeout"
}
```

## Security Considerations

### API Key Security
- Store API keys in environment variables
- Never commit API keys to version control
- Use different API keys for different environments
- Monitor API key usage and rotate regularly

### Rate Limiting
- Implement request rate limiting to prevent abuse
- Cache responses to reduce external API calls
- Monitor API usage patterns

### Error Information
- Don't expose sensitive information in error messages
- Log detailed errors server-side for debugging
- Return generic error messages to clients

## Troubleshooting

### Common Issues

#### 1. External API Failures

**Issue**: "Failed to fetch holidays"

**Causes**:
- Invalid API key
- API Ninjas service downtime
- Network connectivity issues
- Rate limit exceeded

**Solutions**:
- Verify API key validity
- Check API Ninjas status page
- Implement retry logic with exponential backoff
- Monitor API usage

#### 2. Empty Holiday Response

**Issue**: No holidays returned for current month

**Causes**:
- No public holidays in current month
- Incorrect date filtering
- API response format changes

**Solutions**:
- Verify current month has public holidays
- Check date filtering logic
- Validate external API response format

#### 3. Authentication Issues

**Issue**: Unauthorized access errors

**Causes**:
- Invalid JWT token
- Expired token
- Missing Authorization header

**Solutions**:
- Verify JWT token validity
- Implement token refresh mechanism
- Check request headers

## Performance Optimization

### Caching Strategy
- Cache holiday data for 1 hour to reduce API calls
- Use in-memory cache for single server deployment
- Use Redis for distributed caching

### Response Optimization
- Minimize response payload size
- Implement response compression
- Use efficient date processing

### Error Handling
- Implement circuit breaker pattern for external API calls
- Add retry logic with exponential backoff
- Monitor external API performance

## Conclusion

The Holiday Management API provides a simple yet effective way to access current month's public holidays for India. The system integrates with external APIs while maintaining security and proper error handling.

The API is designed to be lightweight and efficient, with proper caching strategies to minimize external API calls and costs. The comprehensive frontend integration examples make it easy to incorporate holiday information into various applications.

For production deployment, ensure proper API key management, implement caching, and monitor external API usage to maintain optimal performance and cost efficiency.

**Note**: Remember to fix the typo in the route URL from `/hoidays` to `/holidays` for better API consistency.
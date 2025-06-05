
# Google API Integration Setup Guide

## Overview
The Zettelkasten AI Consciousness Explorer includes Google API integration for enhanced functionality including YouTube search, Google Search, Google Sheets, and Google Drive features.

## Current Status
✅ **API Key Configured**: `AIzaSyCrLfjc8upAktZMmUyNrNTB73gKrs1tLWM`
✅ **Environment Variables**: Properly configured in `.env` file
✅ **Application Integration**: Fully implemented with error handling

## Required Setup Steps

### 1. Enable Google APIs in Cloud Console

The following APIs need to be enabled in your Google Cloud Console:

#### YouTube Data API v3
- **Purpose**: Search and retrieve YouTube videos for consciousness exploration content
- **Enable at**: https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=869888628175
- **Status**: ⚠️ **Needs to be enabled**

#### Custom Search API
- **Purpose**: Perform Google searches for consciousness-related content
- **Enable at**: https://console.developers.google.com/apis/api/customsearch.googleapis.com/overview?project=869888628175
- **Status**: ⚠️ **Needs to be enabled**

### 2. Create Custom Search Engine (for Google Search functionality)

1. Visit: https://cse.google.com/cse/
2. Click "Add" to create a new search engine
3. Configure search settings:
   - **Sites to search**: You can specify particular sites or search the entire web
   - **Name**: "Consciousness Explorer Search"
   - **Language**: English
4. After creation, note the **Search Engine ID** (cx parameter)
5. Update the search engine ID in the application if needed

### 3. Optional: OAuth Setup for Sheets and Drive

For Google Sheets and Google Drive functionality:

1. **Enable APIs**:
   - Google Sheets API
   - Google Drive API

2. **Configure OAuth 2.0**:
   - Create OAuth 2.0 credentials in Google Cloud Console
   - Configure authorized redirect URIs
   - Implement OAuth flow in the application

## Current Integration Features

### ✅ Implemented and Ready
- **API Key Management**: Environment variable configuration
- **Error Handling**: Comprehensive error messages and setup guidance
- **YouTube Integration**: Search functionality (pending API enablement)
- **Google Search Integration**: Custom search functionality (pending API enablement)
- **UI Components**: Complete interface with status indicators

### 🔄 Pending API Enablement
- **YouTube Data API v3**: Enable in Google Cloud Console
- **Custom Search API**: Enable in Google Cloud Console + create search engine

### 📋 Future Enhancements
- **Google Sheets Integration**: OAuth implementation for oracle tracking
- **Google Drive Integration**: OAuth implementation for knowledge base backup

## Testing the Integration

1. **Navigate to Google Integration**: Visit `/google` in the application
2. **Check API Status**: View the API status panel showing key validation
3. **Test Connectivity**: Click "Test Connectivity" to verify setup
4. **Review Setup Instructions**: Follow any displayed setup requirements

## Error Messages and Solutions

### "YouTube Data API v3 has not been used in project"
**Solution**: Enable YouTube Data API v3 in Google Cloud Console

### "Custom Search API has not been used in project"
**Solution**: Enable Custom Search API in Google Cloud Console

### "Invalid API key"
**Solution**: Verify the API key is correctly set in the `.env` file

## Environment Configuration

The application uses the following environment variables:

```env
# Google API Key for YouTube, Search, Sheets, and Drive
VITE_GOOGLE_API_KEY=AIzaSyCrLfjc8upAktZMmUyNrNTB73gKrs1tLWM
```

## Security Considerations

- ✅ API key is stored in environment variables
- ✅ `.env` file is included in `.gitignore`
- ✅ Client-side API calls are properly secured
- ⚠️ Consider implementing rate limiting for production use
- ⚠️ Monitor API usage and quotas

## Troubleshooting

### Common Issues

1. **403 Forbidden Errors**
   - Check if APIs are enabled in Google Cloud Console
   - Verify API key permissions and quotas

2. **Invalid Search Engine ID**
   - Ensure Custom Search Engine is created and configured
   - Update search engine ID in the application

3. **CORS Issues**
   - Google APIs should work from localhost and deployed domains
   - Ensure proper referrer restrictions if configured

### Debug Information

The application provides detailed debug information:
- API key status and validation
- Connectivity test results
- Service-specific status indicators
- Setup guidance with direct links

## Next Steps

1. **Immediate**: Enable YouTube Data API v3 and Custom Search API
2. **Short-term**: Create and configure Custom Search Engine
3. **Long-term**: Implement OAuth for Sheets and Drive integration

## Support Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Custom Search API Documentation](https://developers.google.com/custom-search/v1/introduction)
- [Custom Search Engine Setup](https://cse.google.com/cse/)

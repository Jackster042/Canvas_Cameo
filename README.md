# Canvas Cameo

A service-oriented application that handles media uploads and subscription management.

## Project Structure

The project is organized into separate services:

- `subscription-service`: Handles user subscription management
- `upload-service`: Manages media file uploads using Cloudinary

## Services

### Subscription Service

Manages user subscription states and premium features using MongoDB as the database.

Features:

- User subscription tracking
- Premium status management
- Payment integration
- Automatic timestamp updates for creation and modifications

### Upload Service

Handles media file uploads to Cloudinary cloud storage.

Features:

- Supports image uploads
- Uses Cloudinary for cloud storage
- Handles both stream-based and direct uploads
- Automatic file type detection

## Technical Stack

- **Database**: MongoDB with Mongoose ODM
- **Cloud Storage**: Cloudinary
- **Environment Variables Required**:
  - `cloud_name`: Cloudinary cloud name
  - `api_key`: Cloudinary API key
  - `api_secret`: Cloudinary API secret

## Getting Started

1. Clone the repository
2. Install dependencies for each service:

   ```bash
   cd server/subscription-service
   npm install

   cd ../upload-service
   npm install
   ```

3. Set up environment variables
4. Start the services

## Environment Variables

Create a `.env` file in each service directory with the following variables:

### Upload Service

```env
cloud_name=your_cloudinary_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret
```

### Subscription Service

```env
MONGODB_URI=your_mongodb_connection_string
```

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]

# Bus Arrival Frontend App
A progressive web app (PWA) that shows bus arrival information. Built using React and deployed to AWS S3 bucket + Cloudfront.

[![YourActionName Actions Status](https://github.com/RTJL/bus-frontend-app/workflows/Integrate/badge.svg)](https://github.com/RTJL/bus-frontend-app/actions)

## Getting started
- Setup local dev env
- Run local dev server
- Deployment

### Setup local dev env

1. Create your own `.env.local` config file

    `cp .env.local.template .env.local`

2. Replace the your local backend API endpoint (`http://YOUR_LOCAL_HOST:BACKEND_PORT_NO/local/api`) and preferred port number for the frontend server(`FRONT_END_PORT`)

    Example

    `REACT_APP_API_ENDPOINT=http://192.168.1.29:3000/local/api`

    `PORT=3001`

3. Install dependency packages

    `npm install`

### Run local dev server

  Start local dev server
    
    `npm start`

### Deployment

  Create and push tags (vX.X.X)

  Example

  `git tag v0.1.0`

  `git push origin --tags`

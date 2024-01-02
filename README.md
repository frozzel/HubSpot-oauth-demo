# HubSpot OAuth Demo Server Readme

This repository contains a simple HubSpot OAuth demo server with Pug for easy viewing. Follow the steps below to set up and run the demo server.

## Prerequisites
Before you begin, ensure that you have the following installed on your system:

- Node.js
- npm (Node Package Manager)

## Installation
1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/hubspot-oauth-demo.git
    ```

2. Navigate to the project directory:

    ```bash
    cd hubspot-oauth-demo
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

## Configuration
1. Create a HubSpot App:
    - Go to the [HubSpot Developer Console](https://developers.hubspot.com/apps).
    - Create a new app.
    - Note down your `Client ID` and `Client Secret`.

2. Set Environment Variables:
    - Create a `.env` file in the project root.
    - Add the following variables to the `.env` file:

        ```env
        CLIENT_ID=your_hubspot_client_id
        CLIENT_SECRET=your_hubspot_client_secret
        PORT=3000  # Choose any available port
        ```

        Replace `your_hubspot_client_id` and `your_hubspot_client_secret` with the values from your HubSpot app.

## Usage
1. Start the demo server:

    ```bash
    npm dev
    ```

2. Open your web browser and go to [http://localhost:3000](http://localhost:3000).

3. Follow the on-screen instructions to initiate the OAuth flow and view the HubSpot OAuth demo in action.

## Notes
- This demo server uses Pug for rendering views.
- Make sure to keep your HubSpot app's callback URL updated based on your local development environment.

Feel free to customize the code to fit your specific needs. Happy coding!
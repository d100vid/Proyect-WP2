
  # Design Recipe Haven Home Screen

  This is a code bundle for Design Recipe Haven Home Screen. The original project is available at https://www.figma.com/design/HHpnOHqn5bNaSXd3wUTFUA/Design-Recipe-Haven-Home-Screen.

  ## Running the frontend

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Running the backend and database

  The backend uses Spring Boot with Maven and PostgreSQL in Docker.

  1. Install Maven and Docker.
  2. Run `docker compose up --build` from the project root.
  3. The backend will be available at `http://localhost:8080`.
  4. The PostgreSQL database will run on `localhost:5432` with credentials `projectapp/projectapp`.

  Example API endpoints:

  - `GET http://localhost:8080/api/users`
  - `POST http://localhost:8080/api/users`
  
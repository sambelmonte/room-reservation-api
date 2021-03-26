# room-reservation-api

A simple room reservation api

# Documentation
```
openapi: 3.0.0
info:
  version: 1.0.0
  title: Room Reservation API
  description: A simple room reservation API designed for small offices and schools.

components:
  securitySchemes:
    RegularUserApiKeyAuth:
      type: apiKey
      in: header
      name: auth
    AdminUserApiKeyAuth:
      type: apiKey
      in: header
      name: adminAuth

paths:
  /user/new:
    post:
      description: Creates a new user and returns the id of the created user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
               properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Succesfully created a new user
          content:
            application/json:
              schema:
                type: object
                properties:
                  userId:
                    type: integer
        '400':
          description: Missing or wrong type of data provided
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        '500':
          description: Internal Server Error
  /user/login:
    post:
      description: Login endpoint that returns a key/token if successful
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
               properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Successfully logged in a user
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  key:
                    type: string
        '400':
          description: Missing credentials or wrong password
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
        '404':
          description: Username does not exist
        '500':
          description: Internal server error
  /admin/login:
    post:
      description: Login endpoint for admin that returns a key/token if successful
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
               properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Successfully logged in an admin
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  key:
                    type: string
        '400':
          description: Missing credentials or wrong password
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
        '404':
          description: Username does not exist
        '500':
          description: Internal server error
  /room:
    get:
      description: Returns list of rooms
      security:
        - RegularUserApiKeyAuth []
      responses:
        '200':
          description: Successfully returned a list of rooms
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    rooms:
                      type: array
                      items:
                        type: object
                        properties:
                          id:
                            type: integer
                          name:
                            type: string
        '500':
          description: Internal Server Error
  /reserve:
    get:
      description: Return list of reservations of the user
      security:
        - RegularUserApiKeyAuth []
      responses:
        '200':
          description: Successfully returned a list of reservations
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    rooms:
                      type: array
                      items:
                        type: object
                        properties:
                          id:
                            type: integer
                          name:
                            type: string
                          startTime:
                            type: integer
                          endTime:
                            type: integer
                          cancelled:
                            type: boolean
                          peopleCount:
                            type: integer
        '500':
          description: Internal Server Error
    post:
      description: Creates a new reservation and returns the id of the created reservation
      security:
        - RegularUserApiKeyAuth []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
               properties:
                roomId:
                  type: integer
                startTime:
                  type: integer
                endTime:
                  type: integer
                peopleCount:
                  type: integer
      responses:
        '200':
          description: Succesfully created a new reservation
          content:
            application/json:
              schema:
                type: object
                properties:
                  reservationId:
                    type: integer
        '400':
          description: Missing or wrong type of data provided, or the room has been reserved at the given time
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        '500':
          description: Internal Server Error
  /reserve/{id}:
    get:
      description: Returns the details of the specified reservation
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successfully returned the details of the reservation
          content:
            application/json:
              schema:
                type: object
                 properties:
                  name:
                    type: string
                  startTime:
                    type: integer
                  endTime:
                    type: integer
                  cancelled:
                    type: boolean
                  peopleCount:
                    type: integer
        '500':
          description: Internal Server Error
    delete:
      description: Cancels the specified reservation
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successfully cancelled the reservation
          content:
            application/json:
              schema:
                type: object
                  properties:
                    message:
                      type: string
        '404':
          description: Reservation with the given id does not exist in the system
        '500':
          description: Internal Server Error
  /admin/room:
    get:
      description: Returns list of rooms
      security:
        - AdminUserApiKeyAuth []
      responses:
        '200':
          description: Successfully returned a list of rooms
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    rooms:
                      type: array
                      items:
                        type: object
                        properties:
                          id:
                            type: integer
                          name:
                            type: string
        '500':
          description: Internal Server Error
    post:
      description: Creates a new room and returns the id of the created room
      security:
        - AdminUserApiKeyAuth []
      responses:
        '200':
          description: Successfully created the room
          content:
            application/json:
              schema:
                type: object
                  properties:
                    roomId:
                      type: string
        '400':
          description: Missing or wrong type of data provided
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        '500':
          description: Internal Server Error
  /admin/room/{id}:
      description: Deletes the specified room
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successfully deleted the room
          content:
            application/json:
              schema:
                type: object
                  properties:
                    message:
                      type: string
        '404':
          description: Room with the given id does not exist in the system
        '500':
          description: Internal Server Error
```

## [0.0.2] - 2022-04-10
### Added
- Add helper text to campaign `name` and `description` fields to show required error message when creating a campaign

### Changed

- Restrict `PATCH` `/campaigns/:id` to only the `creator` of that campaign
- Restrict `POST` `/campaigns/:id/invite` to only the `creator` of that campaign
- Prevent `POST` `/campaigns/:id/invite` from adding a user that already exists in that campaign
- Restrict `DELETE` `/characters/:id` to only the `creator` of the campaign to which that character relates
- Restrict `PATCH` `/characters/:id` to only the `user` to whom that character belongs.
- Restrict `PATCH` `/characters/:id` to only set `status` from `invited` to `active`
- Restrict `POST` `/characters/:id/kill` to only the `creator` of that campaign to which that character relates
- Restrict `POST` `/characters/:id/revive` to only the `creator` of that campaign to which that character relates
- Return `404` responses to any endpoints that receive an `:id` with a corrupt object ID format
- Made `email` field case-insensitive when adding a player to a campaign
- No longer reset campaign `name` or `description` fields to server values when editing an existing campaign fails.
- Add character limits to campaign `name`, `description`, and character `name`, `description`, `race`, `class`, and `external link` properties
- Display API error message data in snackbar notifications, so the user gets the relevant and informative reason for an API failure

### Fixed


## [0.0.1] - 2022-04-10
### Initial deployment

Deployment of MVP implementation thus far:
- Back end server providing authentication and endpoints:

### Auth routes

#### GET /auth/google
Authenticate user via Google's OAuth 2.0 API

#### GET /auth/google/callback
Handle Google OAuth 2.0 redirect

#### GET /auth/logout
Handle logging out the logged in user

### API routes

#### POST /campaigns
Create a campaign

#### GET /campaigns/created
Get campaigns created by logged in user

#### GET /campaigns/player
Get campaigns that the logged in user is related to as a player

#### GET /campaigns/:id
Get campaign information and related characters for a specific id

#### PATCH /campaigns/:id
Update a campaign name or description for a specific campaign id

#### POST /campaigns/:id/invite
Invite a user to an existing campaign

#### DELETE /characters/:id
Delete a character with a specific id

#### PATCH /characters/:id
Update the name, description, race, class, externalLink, and/or set status to 'active' for a character with a specific id

#### POST /characters/:id/kill
Set a character with an 'active' status to 'dead' for a specific id

#### POST /characters/:id/revive
Set a character with a 'dead' status to 'active' for a specific id

#### GET /characters/:id
Get character information for a specific id

#### GET /user
Get information about the logged in user


- Front end client providing pages:

1. Login
2. Campaigns
3. Create a campaign
4. View & edit campaign as a DM
5. View campaign as a player
6. View campaign as an invited player to create a character



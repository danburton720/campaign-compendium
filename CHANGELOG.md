## [1.1.2] - 2022-06-09
### Added

### Changed

### Fixed

- Fixed issue with delete note modal not closing on confirmation
- Fixed issue with removing a player from a campaign
- Ensure session update modal state is reset when adding a new session update

## [1.1.1] - 2022-06-05
### Added

### Changed

### Fixed

- Fixed issue with list of characters on notes filter persisting from a previously-viewed campaign

## [1.1.0] - 2022-06-05
### Added

- Added new `GET` `/campaigns/:id/characters` endpoint so all characters (including deleted ones) on a campaign can be fetched
- Added new `POST` `/campaigns/:id/notes` endpoint for users to create notes on campaigns
- Added new `GET` `/campaigns/:id/notes` endpoint for DMs to fetch all notes on a campaign
- Added new `GET` `/campaigns/:id/notes/created-by-me` endpoint for players to fetch their notes on a campaign
- Added new `PATCH` `/notes/:id` endpoint for users to update the notes they've created
- Added new `DELETE` `/notes/:id` endpoint for users to delete their notes
- Added new `POST` `/campaigns/:id/session-updates` endpoint for DMs to create new session updates
- Added new `PATCH` `/session-updates/:id` endpoint for DMs to update their session updates
- Added new `GET` `/campaigns/:id/session-updates` endpoint for users to get all session updates on a campaign
- Added new `DELETE` `/session-updates/:id` endpoint so a DM can delete a session update
- Added new menu to UI to allow users to navigate between campaign overview, session updates, and notes
- Added new campaign page for users to interact with session updates
- Added new campaign page for users to interact with notes

### Changed

- Changed character card to display a tombstone next to the character name if the character is dead

### Fixed


## [1.0.0] - 2022-04-15
### Added

- Added `SVG` icons for character cards
- Added an image picker to allow users to set and change their character image
- Added colour picker to allow users to set and change their character colour
- Added privacy policy and links to privacy policy from login page and user menu

### Changed

### Fixed

## [0.0.3] - 2022-04-14
### Added

- Added `deletedAt` property to `characters` so they can be soft-deleted
- Added new `POST` `/campaigns/:id/user/:id` endpoint which will soft-deleted all characters associated with that user and campaign
- Added DM option on player kebab menu to allow a DM to delete a single character
- Added DM option on player kebab menu to allow a DM to remove a player (deletes all characters belonging to that player in that campaign)
- Added DM option on player kebab menu to re-invite a player to join the campaign again with a new character
- Added prompt at the top of the player campaign view that displays when a DM has reinvited them to join the campaign
- Added player graveyard to display dead characters

### Changed

- Changed `DELETE` `/characters/:id` to perform an update on a character - setting the `deletedAt` property instead of deleting the document
- Changed `DELETE` `/characters/:id` to return a `404` if character for given ID exists but has a populated `deletedAt` property
- Changed `POST` `/characters/:id/kill` to return a `404` if character for given ID exists but has a populated `deletedAt` property
- Changed `POST` `/characters/:id/revive` to return a `404` if character for given ID exists but has a populated `deletedAt` property
- Changed `POST` `/characters/:id/revive` to return a `400` if player already has an `active` or `invited` character in this campaign already
- Changed `POST` `/campaigns/:id/invite` to return a `400` if a character with the same user ID already exists on the campaign at status `active` or `invited`
- Changed `GET` `/campaigns/:id` to not return characters with a populated `deletedAt` property
- Changed `GET` `/campaigns/:id/player` to not return characters with a populated `deletedAt` property
- Only display a campaign in a player's `invited` list if they only have a single character in that campaign at status `invited`
- Display all other campaigns a player is in, in the `active` list if they have any other configuration of characters (1 `active` 0-* `dead` characters or 1 `invited` and 1-* `dead` characters )

### Fixed

## [0.0.2] - 2022-04-10
### Added
- Add helper text to campaign `name` and `description` fields to show required error message when creating a campaign
- Added ability to invite a player to join an existing campaign

### Changed

- Restrict `PATCH` `/campaigns/:id` to only the `creator` of that campaign
- Restrict `POST` `/campaigns/:id/invite` to only the `creator` of that campaign
- Prevent `POST` `/campaigns/:id/invite` from adding a user that already exists in that campaign
- Restrict `DELETE` `/characters/:id` to only the `creator` of the campaign to which that character relates
- Restrict `PATCH` `/characters/:id` to only the `user` to whom that character belongs.
- Restrict `PATCH` `/characters/:id` to only set `status` from `invited` to `active`
- Restrict `POST` `/characters/:id/kill` to only the `creator` of that campaign to which that character relates
- Restrict `POST` `/characters/:id/revive` to only the `creator` of that campaign to which that character relates
- Prevent the DM from inviting themselves to join the campaign as a player
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



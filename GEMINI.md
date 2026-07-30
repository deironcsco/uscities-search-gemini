# uscities-search-gemini

This project aims to recreate a US cities search application using Gemini. 
The purpose of the site is to query https://slutskcp-uscities-microservices-ddgpeagnc6czh6dd.canadacentral-01.azurewebsites.net/ with user input and to display the results. 

## Project Overview

- **Purpose:** Create a search tool where users can search for uscities by city name or zip code and receive all matching entries in retrun.
- **Technology:** HTML, CSS, Vanilla JavaScript, Gemini.
- **Deployment:** GitHub Pages via GitHub Actions.

## Expanded Use Case

### Brief User Description
User has the ability to search for US cities by zip code or name, and retrieve a list of all cities that match the inputted zip code or name. 

#### Backend Routes
 - `GET uscities-search/<zip-code>` - returns json array of cities that contain that zip code
 - `GET uscities-search/<city-name>` - returns json array of cities that partially match that name

#### Example JSON Response
```json
{
  "city":"Cincinnati",
  "state_id":"OH",
  "state_name":"Ohio",
  "county_name":"Hamilton",
  "timezone":"America/New_York",
  "zips":"45267 45203 45207 45211 45219 45230 45223 45227 45204 45205 45206 45208 45209 45213 45202 45216 45217 45220 45224 45232 45233 45237 45238 45239 45225 45214 45226 45212 45229 45201 45250 45254 45262 45275 45221 45263 45264 45268 45269 45270 45271 45273 45274 45296 45298 45299 45999"
}
```

### User Stories
 - [x] US-01: As a user, I want to be able to input a zip code and retrieve a list of US cities that contain that zip code, or to input a city name and retrieve a list of US cities that (partially) contain that name
 - [x] US-02: As a user, I want the results to update dynamically as I type so that I can see matching cities immediately without needing to click a search button or select from a dropdown.
 - [x] US-03: As a user, I want this application to have basic security in terms of injection attacks. 

### Acceptance Criteria
 - [x] AC-01: Properly inputted zip code returns JSON array of cities that match the input
 - [x] AC-02: Properly inputted city name (full or partial) returns list of cities who's names contain that input
 - [x] AC-03: Improperly formatted inputs display an error
 - [x] AC-04: Proper inputs that return no results displays "No cities found"
 - [x] AC-05: Network error does not cause page to crash, fails safely
 - [x] AC-06: Inputs from user are sanitized / validated before being sent to backend service
 - [x] AC-07: Inputs from backend service are sanitized / validated before being displayed to user
 - [x] AC-08: When the user types a keystroke, the results grid is dynamically updated with cities that match the current input.
 - [x] AC-09: When the user enters keystrokes rapidly, the results are updated after a brief delay (debounced) to ensure performance and reduce API load.
 - [x] AC-10: Inputs from frontend service are sanitized / validated by backend service before being used to query database

### Sequence Diagram
![](https://www.plantuml.com/plantuml/png/XLD1Rjj03Bph5Vn0Fj134UXWe4MH7WhVSc4anbvanTsIb0trzQMjnSeBj_4UoU7CS4Gzgw7OFCKE1qi2UoK1LDXtsUjX21dPO2U9ZNYyT7PDfyVXepJwhjl3qzDNsC4NUAD3O0YSP-jsr-hUgrdIAOm4Gvfo92FG-N0WjP1ONzcEQ32X3SSokD7fHKFezqpgV5iPELZuGojUEum6vsCmqem3GUAuT02R_ak2mGT8uJtDpaWYIJgAIeK1mkGUCqbS729kncXiABxn2MCOL_mj0PETatoifMQawJHgdsZrFbWMXXZK8BqNxmxf2-G-0G2CLhSeEOA_leOMoWQ5lHg-jHpOI1WZACc9f6Akvk-vgnrdb0L6D7n3Hvw37JTdnLkHho0XpOcL7D4QVOHyRBSOVY3ONjdtNpzV04LmsIA_lqrjFFZmAe9sHzzyZxRdhpsj_stH1j-I50cQiYshxrf_VFe0D_JEEqShW7-I_6WE4IwXlFAQogmazGzz9XxdAVu5)

### Plantuml code
```plantuml
@startuml
actor User as U
participant Frontend as F
participant Backend as B

U --> F : begin input
F --> U : update dynamic results\nthat match input
U --> F : send request via search button or Enter
F --> F : sanitize inputs
alt whitespace only
  F --> U : No cities found error
else inputs improperly formatted
  F --> U : Invalid input error
else network error
  F --> U : network error
else inputs properly formatted
  F --> B : request list of cities
  B --> B : sanitize inputs
  alt improper input
    B --> F : invalid request error
    F --> U : internal server error
  else proper input
    B --> B : query database with inputs
    alt invalid database response
      B --> F : invalid database response
      F --> U : internal server error
    else valid database response
      B --> F : send JSON array of cities\nthat match inputs
      F --> F : validate response
      alt improper response
          F --> U : Internal server error
      else proper response
        alt empty array
          F --> U : No cities found error
        else results found
          F --> U : List of cities that\nmatch user request
@enduml
```


## Building and Running

- **Local Development:**
  - Run the application with
    ```bash
    # Using Python
    python -m http.server 8080
    ```
    to be displayed in the google cloud shell
- **Build:** Currently, there is no build process as it is a pure static site.
- **Testing:** No formal testing suite is currently implemented.

## Deployment

The project is configured for automated deployment to GitHub Pages.
- **Workflow:** `.github/workflows/static.yml`
- **Trigger:** Pushes to the `main` branch.

## Development Conventions

- **Simplicity:** Maintain a clean and minimal structure as the project evolves. Prefer simple solutions to more complicated ones.
- **Documentation:** Keep this `GEMINI.md` file updated as new technologies or architectures are introduced.
- **Gemini Integration:** Future development should leverage Gemini for enhancing search capabilities or recreating features.
- **Vanilla JavaScript** Avoid using external dependencies and library as much as possible, and stick to vanilla JavaScript, HTML, and CSS.
- **Humans Manage Git and Deployment** Avoid automatic git commits and pushes, as well as deployments. For now, let humans do that.

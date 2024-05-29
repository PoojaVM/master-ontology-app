# Candidate name: Pooja Mule (poojamules95@gmail.com)

## Table of Contents
- [Task 1: Application for Master Ontology Concepts Maintenance](#task-1-application-for-master-ontology-concepts-maintenance)
- [Task 2: Target Application Architecture](#task-2-target-application-architecture)
- [Task 3: Meet with Ontology Team](#task-3-meet-with-ontology-team)

## TASK 1: Application for Master Ontology Concepts Maintenance
### Application URL
https://master.d2aukg2a51vgnk.amplifyapp.com

### Github Repository
https://github.com/PoojaVM/master-ontology-app

### Lambda functions:
1. Path
    - https://github.com/PoojaVM/master-ontology-app/tree/master/src/lambdas
2. Functions
    - `getConcepts`: Get all concepts from the database.
    - `addConcept`: Add a new concept to the database.
    - `updateConcept`: Update an existing concept in the database.
    - `deleteConcept`: Delete a concept from the database.
    - `listUsers`: Get all users from the database.
    - `updateUserPermission`: Update user role in the database.

### Usage Instructions:
1. The application can be accessed using [this link](https://master.d2aukg2a51vgnk.amplifyapp.com).
2. Permissions:
    - Application has 4 types of users: Super Admin, Admin, Editor, and Viewer.
    - Super Admin: Can assign roles to any users. Can also add, edit and delete concepts. There is only one super admin.
    - Admin: Can assign only Editor and Viewer roles. Can also add, edit and delete concepts.
    - Editor: Can add, edit and delete concepts.
    - Viewer: Can only view the concepts.
3. Login:
    - Use the following credentials to login:
        - Super Admin:
            - Username: ontologysuperuser
            - Password: Test@123
        - Admin: 
            - Username: ontologyadmin
            - Password: Test@123
        - Editor: Ontology team members should be assigned this role.
            - Username: pmule
            - Password: Test@123
        - Viewer:
            - Username: poojamules95
            - Password: Test@123
4. Features:
    1. SAML Authentication
        - User can signup and signin using SAML authentication.
        - AWS Cognito is used for user authentication using Federated Identities.
    2. Concepts
        - View, sort, and search concepts with pagination.
        - Add, edit and delete concepts (Only for Super Admin, Admin, and Editor)
    3. Users (Only for Super Admin and Admin)
        - View users with pagination.
        - Change user roles
            - Admin can only assign Editor and Viewer roles
            - Super Admin can assign Admin, Editor, and Viewer roles
    4. Validations and Error Handling:
        - Frontend:
            - Form validations are done as per the DB schema available in the README.
            - Error messages are displayed for invalid inputs.
            - Users are shown only the routes they have access to and are redirected to the home page if they try to access unauthorized routes.
            - UI is role based and only the allowed actions are displayed.
        - Backend:
            - Error messages are displayed for failed operations.
            - Permission based access is implemented.
    5. Notifications:
        - Notifications are displayed for successful and failed operations.
### Assumptions:
1. Concepts
    - Concepts can have multiple parents and children.
    - Users can add any concept without any parent or child.
    - Users can add multiple parents and children to a concept.
    - Parent-child relationship is strictly enforced. A parent cannot be added as both parent and child for the same concept and vice-versa.
2. Users
    - By default, users are added as Viewers on Signup.
    - Super Admin can change roles (Except Super Admin) of any user.
    - Admin can assign only Editor and Viewer roles.
    - Editor can add, edit and delete concepts.
    - Viewer can only view the concepts.

### UI Design:
1. The UI is available in both light and dark mode.
2. Material-UI is used for designing the application.
3. Loaders are displayed for API calls.
4. Acknowledgement messages are displayed for successful operations.
5. The UI is built with a Desktop client in mind. Mobile responsiveness is not explicitly handled but can be managed using Material-UI.

### Database Schema

The database consists of two tables:
##### `ontology_clinical_concepts`

This table stores the main clinical concepts.

```sql
CREATE TABLE ontology_clinical_concepts (
    id BIGSERIAL PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    alternate_names VARCHAR(255)[]
);
```
##### `ontology_clinical_relationships`

This table stores the relationships between clinical concepts, defining parent-child hierarchies.

```sql
CREATE TABLE ontology_clinical_relationships (
    parent_id BIGINT,
    child_id BIGINT,
    PRIMARY KEY (parent_id, child_id),
    FOREIGN KEY (parent_id) REFERENCES ontology_clinical_concepts(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES ontology_clinical_concepts(id) ON DELETE CASCADE
);
```
### Technology Stack:
- Frontend: ReactJS, Material-UI
- Backend: AWS Amplify, AWS RDS (Postgres), AWS Cognito, AWS Lambda, AWS API Gateway
- Deployment: AWS Amplify (Frontend), AWS Lambda (Backend)

### Primary Dependencies:
1. Material-UI: For designing the application.
2. AWS Amplify: For hosting the application and providing react sign-in and sign-up components.
3. Axios: For making API calls to the backend.
4. React Router: For routing in the application.

### Local Setup Instructions:
1. Pre-requisites: NodeJS, NPM, GIT
2. Clone the GIT repository.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the application.
5. Use same credentials as mentioned above to login.

## TASK 2: Target Application Architecture
- This is the Master Ontology Application Architecture: ![Master Ontology App Architecture)](./docs/architecture-diagram.png)
- Links:
    - Image is stored in the GIT repo at [this](https://github.com/PoojaVM/master-ontology-app/blob/master/docs/architecture-diagram.png) location.
    - Diagram is drawn using LucidChart and can be viewed using this [link](https://lucid.app/lucidchart/430c5fc9-247f-4dc9-b240-0740f2c93f75/edit?viewport_loc=-479%2C24%2C2219%2C1095%2C0_0&invitationId=inv_8e39fa37-768e-4407-855e-7f6b36ecdb8a).
- Deployment Proposal:
    - The application can be deployed using AWS Amplify.
    - The frontend can be hosted on S3.
    - The backend can be hosted on AWS Lambda.
    - The database can be hosted on RDS.
    - The application can be accessed using the API Gateway.
    - Deployment can be automated using AWS CodePipeline.
- CSV Data Transformation Proposal:
    - Backend:
        - Utilize AWS Glue to transform the CSV data into a format suitable for storage in the RDS database.
        - Employ AWS Lambda functions to handle the storage of transformed data into the RDS database.
    - Frontend:
        - Allow users to upload the CSV file directly through the application interface.
        - The application will use AWS Lambda to connect to the AWS Glue setup described in the backend proposal, completing the data transformation process.
        - Users can be notified on completion of the data transformation process using AWS SNS.
- Security Proposal:
    - User Authentication:
        - Use AWS Cognito for user authentication.
        - Use SAML for single sign-on.
    - Access Management:
        - Use AWS IAM for managing access to AWS resources.
        - Use AWS Cognito for managing user roles.
    - Data Encryption:
        - Use AWS KMS for encrypting the data.
        - Use SSL for encrypting the data in transit.
    - Network Security:
        - Use VPC for isolating the application.
        - Use Security Groups for controlling inbound and outbound traffic.
    - Compliance:
        - Ensure that the application is HIPAA compliant.
        - Ensure that the data is stored securely.
    - Web Application Firewall:
        - Use AWS WAF for protecting the application from common web exploits.
    - DDoS Protection:
        - Use AWS Shield for protecting the application from DDoS attacks ensuring high availability.

## TASK 3: Meet with Ontology Team
- Proposals:
    1. Using AWS Glue for CSV data transformation.
    2. Adding frontend functionality for CSV data upload.
- Concerns:
    1. As an app with potentially sensitive clinical data, how should the app compliance be ensured?
- Questions:
    1. What is the performance expectation for the application?
    2. How many concepts can a concept have as parents and children?
    3. To what level should the parent-child hierarchy be strictly enforced?
    4. How often do the permissions change for the users?
    5. What are the most common operations performed on the concepts to ensure performance?
    6. How many users are expected to use the application?
    7. What additional features are expected in the application?
    8. What is the user feedback on the current application?
    9. Are they looking for accessibility features in the application?

### Thank you for the opportunity!



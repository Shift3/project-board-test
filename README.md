# Shift3 NodeJs Boilerplate Server

[![CircleCI](https://circleci.com/gh/Shift3/boilerplate-server-node.svg?style=svg&circle-token=7f194099af758d7db29fee056afd5859543e50d4)](https://circleci.com/gh/Shift3/boilerplate-server-node)

NodeJs server written in Typescript. This will serve as a base point for any new Shift3 NodeJs projects.

## Staging URLs

Sandbox Server: https://boilerplate-server-node.shift3sandbox.com/health-check  
Sandbox Server Swagger: https://boilerplate-server-node.shift3sandbox.com/swagger/#/

## Project Requirements

**Docker**, **Docker Compose**

**Elastic Beanstalk CLI**

The EB CLI is required for the deployment of the web server. EB gives us a ton of great features such as:

- Horizontal Scaling
- Load Balancing
- EC2 Management/Reporting

Read more about [Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html)

AWS provides documentation for the install on different systems. Click the corresponding link below to install the CLI:

- Installation: [Linux](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-advanced.html)
- Installation: [macOS](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-osx.html)
- Installation: [Windows](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-windows.html)

**Node**, **nvm**

Node versions can be a pain to keep up with. To solve this we use Node Version Manager (nvm):

- Installation (Mac and Linux): [nvm](https://github.com/nvm-sh/nvm)
- Installation (Windows): [WSL 2](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2)

**Terraform**

Terraform is our IaC (Infrastructure as Code) tool of choice. It allows us to easily provision our AWS infrastructure, in a version controlled environment!

- Installation: [Terraform](https://www.terraform.io/downloads.html)

### Using The Docker Cli

Docker for the most part is run from the terminal, the docker cli is fairly straight forward.

Docker cli documentation:
- [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/)

Windows 10 Home specific: Please be sure to install [PowerShell 7.0 or higher](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7.1) to use Docker Desktop.

## Repository Setup

The repository is setup with a few hard coded templates and files. Currently we have a few templates and a **CODEOWNERS** file that we need to update.

##### Updating Code Owners

In the repository there should be a `.github` folder with a `CODEOWNERS` file inside. This file represents who the owners of the repository code are. When you clone this repo, or use it as a template for a new project, you need to update this file to represent the new owners (you and whomever may be on your project). Simply remove the current owners in the file, and replace them with you and your teamates! The syntax is simply:

```
@<github username>
```

Be sure to add the github usernames of all developers on your project. Now anytime a pull request is created, all codeowners are added as reviews automatically! It also becomes a reference point when the project is picked back up in the future. We can easily see who has the best context for the code even years down the line. For more information you can click this link:

[Github Codeowners](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/about-code-owners)

##### Updating Issue Templates

Currently the issue templates may have some things you don't want or need in your new project. This can be anything from the tags being set, to the person assigned for each issue. Be sure to go to the settings for the repository, and click `Set up templates` to configure them in a way that suits your needs. For more information you can click this link:

[Setting up issue templates](https://docs.github.com/en/free-pro-team@latest/github/building-a-strong-community/configuring-issue-templates-for-your-repository)


## Project Setup

The first steps are to install all of the project requirements above, skipping any you may already have installed.

1. Run `npm install`
2. Copy the .env.example file into .env at the root
    - Grab the environment variables from a developer on the project of Zoho Vault.
3. Run `docker-compose up`
    - This will startup both the server and the postgres database.

The postgres database will have the name and user credentials that are specified in the .env file. If you need to change them and don't mind resetting the database, you will have to use the command `docker-compose down -v` to remove both the containers and the volumes.

Be sure to fill out your `.env` file and the `USER_SEED_EMAIL` variable. Filling out this variable will create a user for you on startup. You should receive a welcome email to activate your account, simply pull the token from the email and use either Postman or Swagger to activate your user account.

Once the server is up and running simply navigate to [localhost:3000/swagger](http://localhost:3000/swagger)! The database should be connectable via a database client such as [PGAdmin](https://www.pgadmin.org/) or [DBeaver](https://dbeaver.io/) by using the credentials in your .env to connect to [localhost:5435].

## Development Process

The application is built on [NestJs](https://github.com/nestjs/nest) and [Typescript](https://www.typescriptlang.org/) which gives us structure and typing, with [TypeORM](https://typeorm.io/#/) for communication with the database. This gives us a base structure we can follow and rely on.

##### Running The Application

```bash
# Starts the application up in development mode
$ docker-compose up || npm run start:dev

# Starts the application up in production mode
$ npm run start:prod
```

##### CircleCi

The Boilerplate comes with CircleCi integration built in. Every pull request will run the suite of Unit and E2E tests. Be sure to configure your project once you setup your repository. Here are the steps for setting up a new project:

[Setting Up Projects](https://circleci.com/docs/enterprise/quick-start/)

Here are a list of the environment variables required:

```
DB_HOST
DB_NAME
DB_PASSWORD
DB_USER
JWT_SECRET
NODE_ENV
PORT
```

The database variables can be found in the `.circleci/config.yml` file in the project base. The `NODE_ENV` should be set to `test` and the `PORT` set to `3000`. For the `JWT_SECRET` you can set the value to any random string.

Once your project is setup, CircleCi will run the first test automatically. Be sure to look at for any errors, the first setup will fail if the environment variables are missing!

##### Running Tests Locally

```bash
# Running all unit tests
$ npm run test

# Running unit tests in watch mode
$ npm run test:watch

# Running e2e tests
$ npm run test:e2e

# Checking test coverage
$ npm run test:cov
```

##### Models, Database and DTOs

NestJs and TypeORM give us some standards that promote good separation of concerns and code quality. This gives us the following model to abide by:

1. Controllers handle route logic using DTOs and communicate with services
2. Services handle business logic and communicate with repositories
3. Repositories handle communication with the database

This allows us to keep each piece clean, concise and easy to understand. We now know, where to look for certain issues, and where our code should live, depending on what it is doing.

Controllers should use the DTO to transfer only the data known by the app to services. Services then talk to the data layer (repositories) to make changes/retrieve data, and pass data back to the controller.

##### Utilities

The utilities folder represents global utilities used in the application. This ranges from JWT methods, email, logging and the database connection. Whenever you want to introduce new logic to the application, and it may be used in more than one place, consider making it into a utility that can be imported as required.

##### Interceptors

NestJs gives us some neat tools we can use to handle certain aspects of routes. Interceptors can be implemented if you need certain actions to happen either before the request hits any controllers, after or both. An example might be that you need to inspect a request before it hits your controller to log the information coming in (see [event-logger-interceptor](./src/interceptors/event-logger.interceptor.ts)). For more information checkout the documentation nest provides [NestJs Interceptors](https://docs.nestjs.com/interceptors)

##### Guards

Guards are basically middleware that allow us to take action before allowing the request to go through. The most simple use case is the JWT Guard, which will check for the JWT Token in the request and validate it. If the guard check fails, the request is rejected automatically. Nest gives us the ability to implement guards at the route level, controller level, or globally. You can find more information here [NestJs Guards](https://docs.nestjs.com/guards)

##### Swagger Documentation

NestJs gives us some nice [Swagger](https://docs.nestjs.com/openapi/introduction) integration that allows us to document the API naturally as we add endpoints. You can view the current documentation here:

- [Local Swagger Endpoint](http://localhost:3000/swagger)
- [Staging Swagger Endpoint](https://boilerplate-server-node.shift3sandbox.com/swagger/)

## Deployment Process

##### Setting Up Your Remote State

Terraform will keep a copy of the infrastructure it creates in a state file. This file is basically a snapshot of what has been generated by your `.tf` files. In order to keep everyone on the project in sync, this boilerplate comes with remote state built in. The state file itself will be stored in an S3 bucket, so that any changes made can be referenced by everyone on the project. Before doing **ANYTHING** else with Terraform you will need to setup the folder your state will be stored in.

In the `terraform/staging` directory, look for the `main.tf` file. Near the top, there should be a block that looks something like this:

```
terraform {
  backend "s3" {
    bucket  = "shift3-terraform-state"
    key     = "boilerplate-server-node/terraform.tfstate"
    region  = "us-west-2"
    profile = "shift3"
  }
}
```

This block sets up the remote state for your project! The import line, is this one:

```
key = "boilerplate-server-node/terraform.tfstate"
```

This line sets up where in the S3 bucket your state file is stored for your project. Change this line to read something like the following:

```
key = "<project-name>/<environment>/terraform.tfstate"
```

Replace `<project-name>` with the name of your project, and `<environment>` with the environment for your deployment (staging | production). Once this is done, you can then move forward with setting up your projects variables to begin deployment!

##### Setting Up Your Infrastructure With Terraform

In order to deploy the application you will first need to change and run the Terraform scripts setup for you. If you have not already done so, download and install [Terraform](https://www.terraform.io/downloads.html).

Once this is done be sure to setup your staging environment files in the following folder `terraform/staging`. There you should find an `example.secrets-staging.tfvars` file, copy this file into the same folder renaming it to `secrets-staging.auto.tfvars` and fill in the variables for your project.

Be sure to check with your team before any changes are made via Terraform, and that everything being created is required by the project.

Once this is completed, navigate to the staging folder in your terminal and run the following commands:

1. `terraform plan`
    - The plan command will give you information on what will be built through Terraform, as well as any feedback if there will be forseen issues (missing variables etc.)
    - This also gives you the chance to make adjustments if need be to ensure the output is correct for what you need. (domain name, environment variables for EB etc.)
2. `terraform apply`
    - The apply command will actually setup all of the required AWS services to deploy this project. Terraform will save a state file for you, and can continue from where it left off if something goes wrong.
3. Once everything is done building, you need to set the environment variables for the database now that we have a live RDS instance. Near the top of our `secrets-staging.auto.tfvars` file you should have something similar to the following:

```
eb_env_variables = {
  APPLICATION_NAME = ""
  AWS_REGION       = "us-west-2"
  CLIENT_URL       = ""
  DB_HOST          = ""
  DB_NAME          = ""
  DB_PASSWORD      = ""
  DB_USER          = ""
  EMAIL_DOMAIN     = ""
  ERROR_LOGS       = "/opt/node/app/server-logs"
  JWT_SECRET       = ""
  NODE_ENV         = "production"
  SENTRY_DSN       = ""
  SERVER_PORT      = "3000"
  USER_SEED_EMAIL  = ""
}
```

The `DB_HOST` will represent the url to your RDS instance, which is not available until after we run `terraform apply` the first time. You can get this url from the aws console [Connecting to a DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html). Be sure to fill in the rest of the variables related to the database (`DB_NAME` | `DB_PASSWORD` etc.) and run `terraform apply` again to update elastic beanstalk.

If all goes well, you can then begin the actual deployment of your code!

##### Setting Up Elastic Beanstalk Locally

Before running the deployment script, we need to make sure that EB is configured for our project locally. If you do not have the [EB CLI](#elastic-beanstalk-cli) installed already, please do so before continuing.

In order to use the EB CLI to deploy our application, we first need to run `eb init --profile shift3-super`. This will start the setup process for your project. The first step is to pick the region you created the EB environment in (defaulted to `us-west-2`), pick the project you created (it should match the `application_name` variable in your Terraform secrets file) and if you want to use code commit (**No since we use Github**).

After you go through the cli steps, it should generate a `.elasticbeanstalk` folder at the root of the project. The next step is modifying the `config.yml` so that the Docker deployment works as expected. Above the key `global:` in the config file, add the following lines:

```
deploy:
  artifact: Dockerrun.aws.json
```

Your config should now look something like this:

```
environment-defaults:
  boilerplate-server-node-api-webserver:
    branch: null
    repository: null
deploy:
  artifact: Dockerrun.aws.json
global:
```

Spacing is important so ensure your deploy and artifact key are spaced properly!

The deploy and artifact keys are very important for the deployment, as they tell the eb cli to only deploy the file mentioned in artifact. Since we are using Docker in this project, we only need to deploy our `Dockerrun.aws.json` file to the server. EB will then read this file and pull down the correct Docker image we pushed to ECR. This ensures that our project ran locally, matches what we use in Staging/Production!

Once this is done you can continue with the next step to deploy your code! For more information about the EB config and the artifact key click the link below:

[EB Config Artifact Configuration](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html#eb-cli3-artifact)

##### Deploying your application

Deployments are all done using the deployment script included in the project. Simply copy the `deploy.example.sh` file to `deploy.sh` in the root of the project. Fill in the variables at the top of the script, or get the script from Zoho Vault/Project lead. Get the image name from your project lead or from the ecr repository directions. [Setting up ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-console.html)

Before every deployment, make sure to update your project version in the `package.json`. The version in this file is what the script reads and builds to send to ecr for automated deployments.

Once you've done all required checks, and are ready to proceed, run the following commands to deploy your code.

1. Ensure you are deploying to the correct environment (Sandbox vs Production)
2. Run `bash docker-deploy.sh`
3. The script will ask you to confirm your build version before proceeding

The script will take care of building your project with Docker, deploying the latest build to ECR and finally running `eb deploy` to push your build to elastic beanstalk!

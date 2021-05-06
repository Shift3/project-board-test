#!/bin/bash

AppVersion=$(sed -n 's/"version": "\(.*\)".*/\1/p' package.json | xargs echo -n);
EBEnvironment=""
DockerRepository="";
Profile="shift3-super";
ProjectName="";
Region="";

ECRDeploymentOutput=$DockerRepository/$ProjectName:v$AppVersion;
RecentAWSVersion="2"
InstalledAWSVersion="$(aws --version | head -n1 | cut -d" " -f1 | cut -d"/" -f2)"

$(sed "s|<ecr-repository-link>/<ecr-repository-name>:v<project-version-number>|$ECRDeploymentOutput|g" Dockerrun.example.aws.json > Dockerrun.aws.json);

echo Press enter to confirm build version: $AppVersion or Ctrl-C to cancel the build.

read DeploymentConfirm;

echo Building and pushing version $ProjectName:v$AppVersion to ECR using profile $Profile ...;

npm run build;

if [ "$(printf '%s\n' "$RecentAWSVersion" "$InstalledAWSVersion" | sort -V | head -n1)" = "$RecentAWSVersion" ]; then
	  aws ecr get-login-password --region $Region --profile $Profile;
else
	  aws ecr get-login -region $Region --profile $Profile;
fi


docker build -t $ProjectName . -f ./Dockerfile.prod;

docker tag $ProjectName:latest $ECRDeploymentOutput;

docker push $ECRDeploymentOutput;

eb deploy $EBEnvironment --profile $Profile;

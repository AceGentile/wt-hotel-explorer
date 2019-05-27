#!/bin/bash

ENVIRONMENT=$1

# AWS command opts
TASK_FAMILY="$ENVIRONMENT-wt-hotel-explorer"
SERVICE_NAME="$ENVIRONMENT-wt-hotel-explorer"
AWS_REGION="eu-west-1"


# container setup options
LATEST_TAG=`git describe --abbrev=0 --tags`

TASK_DEF="[{\"portMappings\": [{\"hostPort\": 0,\"protocol\": \"tcp\",\"containerPort\": 8080}],
   \"logConfiguration\": {
        \"logDriver\": \"awslogs\",
        \"options\": {
          \"awslogs-group\": \"shared-docker-cluster-t3\",
          \"awslogs-region\": \"$AWS_REGION\",
          \"awslogs-stream-prefix\": \"$ENVIRONMENT-wt-hotel-explorer\"
        }
      },
    \"environment\": [
      {
        \"name\": \"WT_READ_API\",
        \"value\": \"https://$ENVIRONMENT-api.windingtree.com\"
      },
      {
        \"name\": \"WT_SEARCH_API\",
        \"value\": \"https://$ENVIRONMENT-search-api.windingtree.com\"
      },
      {
        \"name\": \"WT_SIGN_BOOKING_REQUESTS\",
        \"value\": \"false\"
      }
    ],
    \"image\": \"docker.io/windingtree/wt-hotel-explorer:$LATEST_TAG\",
    \"name\": \"wt-hotel-explorer\",
    \"memoryReservation\": 64,
    \"cpu\": 0
  }]"

echo "Updating task definition"
aws ecs register-task-definition --region "$AWS_REGION" --family "$TASK_FAMILY" --container-definitions "$TASK_DEF" > /dev/null
echo "Updating service"
aws ecs update-service --region "$AWS_REGION" --cluster shared-docker-cluster-t3 --service "$SERVICE_NAME" --task-definition "$TASK_FAMILY" > /dev/null

echo "Waiting for the service to come to life"
EXPECTED_REVISION=`aws ecs describe-task-definition --region "$AWS_REGION" --task-definition "$TASK_FAMILY" |
  python -c 'import json,sys;obj=json.load(sys.stdin);print obj["taskDefinition"]["revision"];'`

DEPLOYED_REVISION=-1
IS_STEADY='NO'

echo "Expecting task revision $EXPECTED_REVISION"

# Wait for the old version to be ditched
while [ "$DEPLOYED_REVISION" -lt "$EXPECTED_REVISION" ] || [ "$IS_STEADY" != 'OK' ]; do
  # This is kind of sketchy
  sleep 5
  SERVICE_STATUS=`aws ecs describe-services --region "$AWS_REGION" --cluster shared-docker-cluster-t3 --service "$SERVICE_NAME"`
  DEPLOYED_REVISION=`echo "$SERVICE_STATUS" |
    python -c 'import json,sys,re;s=re.compile("([0-9]+)$");obj=json.load(sys.stdin);print s.findall(obj["services"][0]["taskDefinition"])[0];'`
  IS_STEADY=`echo "$SERVICE_STATUS" |
    python -c 'import json,sys,re;s=re.compile("(steady|draining|deregistered)");obj=json.load(sys.stdin);print "OK" if (s.findall(obj["services"][0]["events"][0]["message"])) else 0;'`
  echo "Getting revision $DEPLOYED_REVISION, $IS_STEADY"
done

# Purge cloudflare cache
echo "Purging cloudflare cache for $CF_ROOT"
./management/cloudflare-cache-purge.sh

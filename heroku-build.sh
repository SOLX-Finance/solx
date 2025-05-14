#!/bin/sh

echo "BUILD_APP environment variable is set to: ${BUILD_APP:-not set}"

if [ -z "$BUILD_APP" ]; then
    echo "Error: BUILD_APP environment variable is not set"
    exit 1
fi

case "$BUILD_APP" in
    "api")
        yarn db:generate && yarn db:migrate:deploy && yarn build:api
        ;;
    "indexer")
        yarn db:generate && yarn db:migrate:deploy && yarn build:indexer
        ;;
    *)
        echo "Error: Invalid BUILD_APP value. Allowed values: 'api' or 'indexer'"
        exit 1
        ;;
esac
#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: test.sh [run,open]"
    echo "Run runs the tests, open opens the cypress app"
    exit 1
fi

echo "Starting parcel.."
parcel serve -p 4444 src/index.html &
PARCEL="$!"
echo "Opening cypress.."
npx cypress $1
echo "killing parcel.."
kill $PARCEL

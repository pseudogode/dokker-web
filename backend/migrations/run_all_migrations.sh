#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

dropDatabaseFile="dropDatabase.php"
echo "Executing: $dropDatabaseFile"
/opt/lampp/bin/php "$dropDatabaseFile"

for file in "$DIR"/*.php; do
    case $file in 
      *$dropDatabaseFile) continue;;
    esac

    if [ -f "$file" ]; then
        echo "Executing: $file"
        /opt/lampp/bin/php "$file"
    fi
done

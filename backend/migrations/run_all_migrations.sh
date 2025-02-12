#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for file in "$DIR"/*.php; do
    case $file in 
      *dropDatabase.php) continue;;
    esac

    if [ -f "$file" ]; then
        echo "Executing: $file"
        /opt/lampp/bin/php "$file"
    fi
done

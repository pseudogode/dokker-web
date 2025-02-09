#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for file in "$DIR"/*.php; do
    if [ -f "$file" ]; then
        echo "Executing: $file"
        /opt/lampp/bin/php "$file"
    fi
done

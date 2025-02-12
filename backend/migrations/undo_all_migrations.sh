#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
file="dropDatabase.php"
echo "Executing: $file"
/opt/lampp/bin/php "$file"


#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PHP=php

dropDatabaseFile="dropDatabase.php"

echo "Executing: $dropDatabaseFile"
$PHP "$DIR/$dropDatabaseFile"

for file in "$DIR"/*.php; do
  case "$file" in
    *"$dropDatabaseFile") continue ;;
  esac

  echo "Executing: $file"
  $PHP "$file"
done
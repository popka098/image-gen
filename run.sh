#!/bin/bash

# Переход в директорию скрипта
cd "$(dirname "$0")"

# Поиск и запуск всех script.js
find ./templates -type f -name "generator.js" | while read -r jsfile; do
    echo "Running $jsfile..."
    node "$jsfile"
done

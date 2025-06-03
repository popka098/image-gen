import os
import subprocess

# Переход в директорию, где находится этот скрипт
base_dir = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(base_dir, "templates")

# Рекурсивный поиск generator.js и запуск их через node
for root, dirs, files in os.walk(templates_dir):
    if "generator.js" in files:
        js_path = os.path.join(root, "generator.js")
        print(f"Running {js_path}...")
        subprocess.run(["node", js_path])

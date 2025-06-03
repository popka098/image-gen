import os
import json
import shutil
import subprocess
import tkinter as tk
from tkinter import simpledialog, messagebox

TEMPLATES_DIR = "templates"
RUN_SCRIPT = "run.py"

def create_template():
    dirname = simpledialog.askstring("Folder Name", "Enter folder name:")
    name = simpledialog.askstring("Template Name", "Enter prefix to output files:")
    width = simpledialog.askinteger("Image Width", "Enter width of output files:")
    height = simpledialog.askinteger("Image Haight", "Enter height of output files:")

    if not name or not dirname or not width or not height:
        messagebox.showerror("Error", "All fields are required!")
        return

    path = os.path.join(TEMPLATES_DIR, dirname)
    if os.path.exists(path):
        messagebox.showerror("Error", "Folder already exists!")
        return

    os.makedirs(path)

    settings = {
        "name": name,
        "dirname": dirname,
        "width": width,
        "haight": height
    }
    with open(f"{path}/settings.json", 'w', encoding='utf-8') as f:
        json.dump(settings, f, ensure_ascii=False, indent=4)

    shutil.copytree("gui", path, dirs_exist_ok=True)

    messagebox.showinfo("Success", f"Template '{name}' created.")

def delete_template():
    folders = folders = [name for name in os.listdir(TEMPLATES_DIR) if os.path.isdir(os.path.join(TEMPLATES_DIR, name))]
    if not folders:
        messagebox.showinfo("No Templates", "No templates to delete.")
        return

    folder = simpledialog.askstring("Delete Template", f"Enter template to delete (without quotes and brackets):\n{folders}")
    if folder not in folders:
        messagebox.showerror("Error", "Invalid folder name!")
        return

    path = os.path.join(TEMPLATES_DIR, folder)
    if os.path.exists(path):
        shutil.rmtree(path)

    messagebox.showinfo("Success", f"Template '{folder}' deleted.")

def run_script():
    try:
        subprocess.run(["python", RUN_SCRIPT], check=True)
        messagebox.showinfo("Script", "run.py executed successfully.")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to run script:\n{e}")

root = tk.Tk()
root.title("Template Manager")

tk.Button(root, text="Create Template", command=create_template).pack(pady=10)
tk.Button(root, text="Delete Template", command=delete_template).pack(pady=10)
tk.Button(root, text="Run Script", command=run_script).pack(pady=10)

root.mainloop()
